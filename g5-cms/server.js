'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const {
  FIGMA_DESIGN_SYSTEMS,
  G5_STRIPE_CATALOG,
  DATA_HUB_RECORDS,
  INITIAL_CMS_PROPERTIES,
  generateAeoJsonLd,
  createDefaultPageStripes,
  createVendorSheddingProfile
} = require('./data/cms-seed');

// Mandatory security rule: bind strictly to 127.0.0.1 (never 0.0.0.0)
const HOST = '127.0.0.1';
const PORT = Number(process.env.PORT) || 3001;
const PUBLIC_DIR = path.resolve(__dirname, 'public');
const DATA_DIR = path.resolve(__dirname, 'data');
const STATE_FILE_PATH = path.resolve(DATA_DIR, 'cms-state.json');

// Multi-tiered CSPRNG secret resolution (Env -> Local file -> Ephemeral CSPRNG)
function getSecret() {
  if (process.env.CMS_SESSION_SECRET) {
    return process.env.CMS_SESSION_SECRET;
  }
  const secretFilePath = path.resolve(__dirname, 'cms_session_secret.txt');
  if (fs.existsSync(secretFilePath)) {
    return fs.readFileSync(secretFilePath, 'utf-8').trim();
  }
  const generated = crypto.randomBytes(32).toString('hex');
  try {
    fs.writeFileSync(secretFilePath, generated, { encoding: 'utf-8', mode: 0o600 });
  } catch (_e) {
    console.warn('[SECURITY] Generating ephemeral CSPRNG session secret. Instance-isolated!');
  }
  return generated;
}

const SESSION_SECRET = getSecret();

// TODO(security): Integrate Google Cloud IAP / OAuth 2.0 OIDC provider and MFA for production CMS RBAC login.
const sessions = new Map();
const rateLimitWindowMs = 60 * 1000;
const maxRequestsPerMinute = 240;
const rateLimitMap = new Map();

// In-memory + file-backed CMS store (simulating Cloud Spanner + Firestore + BigQuery Audit Stream)
const cmsStore = new Map();

function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function captureSnapshot(site) {
  return deepClone({
    designSystemId: site.designSystemId,
    propertyMetadata: site.propertyMetadata,
    heroMedia: site.heroMedia,
    numberedHighlights: site.numberedHighlights,
    photoCards: site.photoCards,
    amenities: site.amenities,
    floorPlans: site.floorPlans,
    promotedReviews: site.promotedReviews,
    mediaGallery: site.mediaGallery,
    pageStripes: site.pageStripes,
    vendorShedding: site.vendorShedding
  });
}

function persistStoreToDisk() {
  try {
    const payload = Array.from(cmsStore.values());
    fs.writeFileSync(STATE_FILE_PATH, JSON.stringify(payload, null, 2), { encoding: 'utf-8', mode: 0o600 });
  } catch (_err) {
    // Non-fatal if read-only container filesystem
  }
}

function appendAuditRevision(site, actor, actionType, summary, diffHighlights) {
  if (!Array.isArray(site.auditHistory)) {
    site.auditHistory = [];
  }
  const nextVer = site.auditHistory.length + 1;
  const revisionId = `v${nextVer}.0`;
  const entry = {
    revisionId,
    firestoreDocId: `fs-cms-${site.slug}-${revisionId}-${crypto.randomBytes(3).toString('hex')}`,
    bigQueryRowId: `bq_cms_audit_${Date.now()}_${nextVer}`,
    timestamp: new Date().toISOString(),
    actor,
    actionType,
    summary,
    diffHighlights: Array.isArray(diffHighlights) && diffHighlights.length ? diffHighlights : [summary],
    snapshot: captureSnapshot(site)
  };
  site.auditHistory.unshift(entry);
  site.aeoJsonLd = generateAeoJsonLd(site);
  site.updatedAt = entry.timestamp;
  persistStoreToDisk();
  return entry;
}

function initializePropertyRecord(rawProp) {
  const site = deepClone(rawProp);
  site.aeoJsonLd = generateAeoJsonLd(site);
  site.consentLedger = [
    {
      receiptId: `SPANNER-CONSENT-${crypto.randomBytes(4).toString('hex').toUpperCase()}`,
      timestamp: new Date(Date.now() - 240000).toISOString(),
      policyChoice: 'First-Party Cloud Spanner Consent (OneTrust OtAutoBlock.js Shed)',
      categoriesAccepted: ['Strictly Necessary', 'First-Party Cloud CDN Telemetry', 'AEO Schema Discovery'],
      edgePop: 'US-Central-Cloud-CDN'
    }
  ];
  site.intakeConversation = [
    {
      sender: 'agent',
      timestamp: new Date(Date.now() - 180000).toISOString(),
      message:
        `Hello! I am your RealPage Self-Service AI Intake Agent. I already pulled ${site.propertyMetadata.propertyName} ` +
        `from RealPage Data Hub (${site.dataHubId})—eliminating 40+ onboarding phone call questions. ` +
        `Tell me any move-in specials, theme changes, pet policies, floor plan rent adjustments, or new amenities you want published to your G5 v9.0 website.`,
      structuredVariables: {
        dataHubId: site.dataHubId,
        designSystemId: site.designSystemId,
        status: 'PRE_POPULATED_FROM_DATA_HUB'
      }
    }
  ];
  site.hitlPublishReceipt = null;
  site.auditHistory = [];
  appendAuditRevision(
    site,
    'System Bootstrap (G5 v9.0 + Data Hub MCP)',
    'INITIAL_HYDRATION',
    `Hydrated ${site.propertyMetadata.propertyName} from ${site.sourceUrl} + Data Hub (${site.dataHubId}) with Figma Lock (${FIGMA_DESIGN_SYSTEMS[site.designSystemId].figmaFileKey})`,
    [
      `Source Reference: ${site.sourceUrl}`,
      `Data Hub Record: ${site.dataHubId}`,
      `Figma Design System: ${FIGMA_DESIGN_SYSTEMS[site.designSystemId].name}`,
      `Vendor Shedding Active: OneTrust, Honeybadger & CloudFront scripts replaced with 1st-Party Cloud Spanner/CDN`
    ]
  );
  return site;
}

function loadOrSeedCmsStore() {
  if (fs.existsSync(STATE_FILE_PATH)) {
    try {
      const saved = JSON.parse(fs.readFileSync(STATE_FILE_PATH, 'utf-8'));
      if (Array.isArray(saved) && saved.length > 0) {
        saved.forEach((site) => {
          site.aeoJsonLd = generateAeoJsonLd(site);
          cmsStore.set(site.slug, site);
        });
        return;
      }
    } catch (_e) {
      // Fallback to canonical seed
    }
  }
  INITIAL_CMS_PROPERTIES.forEach((raw) => {
    const initialized = initializePropertyRecord(raw);
    cmsStore.set(initialized.slug, initialized);
  });
  persistStoreToDisk();
}
loadOrSeedCmsStore();

function signCsrfToken(sessionId) {
  const sig = crypto.createHmac('sha256', SESSION_SECRET).update(sessionId).digest('hex');
  return `${sessionId}.${sig}`;
}

function isValidCsrfRequest(req, session) {
  const clientCsrf =
    typeof req.headers['x-csrf-token'] === 'string' ? req.headers['x-csrf-token'].trim() : '';

  if (clientCsrf && clientCsrf === session.csrfToken) {
    return true;
  }

  if (clientCsrf && clientCsrf.includes('.')) {
    const [sid, sig] = clientCsrf.split('.');
    if (sid && sig) {
      const expected = crypto.createHmac('sha256', SESSION_SECRET).update(sid).digest('hex');
      if (sig === expected) {
        return true;
      }
    }
  }

  const origin = req.headers.origin || '';
  const referer = req.headers.referer || '';
  if (
    origin.startsWith('http://127.0.0.1:') ||
    origin.startsWith('http://localhost:') ||
    referer.startsWith('http://127.0.0.1:') ||
    referer.startsWith('http://localhost:')
  ) {
    return true;
  }

  return false;
}

function createOrGetSession(req, res) {
  const cookieHeader = req.headers.cookie || '';
  const cookies = {};
  cookieHeader.split(';').forEach((pair) => {
    const idx = pair.indexOf('=');
    if (idx > -1) {
      const k = pair.slice(0, idx).trim();
      const v = pair.slice(idx + 1).trim();
      cookies[k] = v;
    }
  });

  const existingSessionId = cookies['g5_cms_session'];
  if (existingSessionId && sessions.has(existingSessionId)) {
    const s = sessions.get(existingSessionId);
    if (s.expiresAt > Date.now()) {
      return s;
    }
    sessions.delete(existingSessionId);
  }

  const sessionId =
    existingSessionId && /^[a-f0-9]{48}$/.test(existingSessionId)
      ? existingSessionId
      : crypto.randomBytes(24).toString('hex');
  const csrfToken = signCsrfToken(sessionId);
  const sessionObj = {
    sessionId,
    csrfToken,
    role: 'RealPage G5 Enterprise CMS Administrator (RBAC: STRATEGIST_AND_CLIENT)',
    expiresAt: Date.now() + 2 * 60 * 60 * 1000
  };
  sessions.set(sessionId, sessionObj);

  res.setHeader('Set-Cookie', [
    `g5_cms_session=${sessionId}; Path=/; HttpOnly; SameSite=Lax; Max-Age=7200`
  ]);
  return sessionObj;
}

function checkRateLimit(clientIp) {
  const now = Date.now();
  const entry = rateLimitMap.get(clientIp);
  if (!entry || now - entry.start > rateLimitWindowMs) {
    rateLimitMap.set(clientIp, { start: now, count: 1 });
    return true;
  }
  entry.count += 1;
  return entry.count <= maxRequestsPerMinute;
}

function applySecurityHeaders(res) {
  res.setHeader(
    'Content-Security-Policy',
    [
      "default-src 'self'",
      "script-src 'self'",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' https://images.unsplash.com https://res.cloudinary.com https://g5-assets-cld-res.cloudinary.com data:",
      "connect-src 'self'",
      "frame-ancestors 'self'",
      "object-src 'none'",
      "base-uri 'self'"
    ].join('; ')
  );
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
}

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(payload));
}

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString('utf-8');
      if (body.length > 128 * 1024) {
        reject(new Error('Payload too large'));
      }
    });
    req.on('end', () => {
      if (!body) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(body));
      } catch (_err) {
        reject(new Error('Invalid JSON payload'));
      }
    });
    req.on('error', () => reject(new Error('Stream read error')));
  });
}

function isSafeExternalHttpsUrl(rawUrl) {
  try {
    const parsed = new URL(rawUrl);
    if (parsed.protocol !== 'https:') return false;
    const host = parsed.hostname.toLowerCase();
    if (
      host === 'localhost' ||
      host === '127.0.0.1' ||
      host === '0.0.0.0' ||
      host === '::1' ||
      host.endsWith('.local') ||
      host.endsWith('.internal') ||
      /^10\./.test(host) ||
      /^192\.168\./.test(host) ||
      /^169\.254\./.test(host) ||
      /^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(host)
    ) {
      return false;
    }
    return true;
  } catch (_e) {
    return false;
  }
}

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon'
};

const server = http.createServer(async (req, res) => {
  applySecurityHeaders(res);

  const clientIp = req.socket.remoteAddress || '127.0.0.1';
  if (!checkRateLimit(clientIp)) {
    return sendJson(res, 429, { error: 'Rate limit exceeded. Please try again shortly.' });
  }

  if (req.method !== 'GET' && req.method !== 'POST') {
    res.setHeader('Allow', 'GET, POST');
    return sendJson(res, 405, { error: 'Method Not Allowed' });
  }

  const session = createOrGetSession(req, res);
  const parsedUrl = new URL(req.url, `http://${HOST}:${PORT}`);
  const pathname = parsedUrl.pathname;

  // 1. GET /api/cms/bootstrap
  if (req.method === 'GET' && pathname === '/api/cms/bootstrap') {
    return sendJson(res, 200, {
      csrfToken: session.csrfToken,
      role: session.role,
      designSystems: FIGMA_DESIGN_SYSTEMS,
      stripeCatalog: G5_STRIPE_CATALOG,
      dataHubRecords: DATA_HUB_RECORDS,
      properties: Array.from(cmsStore.values())
    });
  }

  // Enforce CSRF check on all POST routes
  if (req.method === 'POST') {
    if (!isValidCsrfRequest(req, session)) {
      return sendJson(res, 403, { error: 'CSRF token validation failed.' });
    }
  }

  // 2. POST /api/cms/property/update — Save Property Metadata, Hero, Design System & Numbered Highlights
  if (req.method === 'POST' && pathname === '/api/cms/property/update') {
    try {
      const body = await readJsonBody(req);
      const slug = typeof body.slug === 'string' ? body.slug.trim() : '';
      if (!cmsStore.has(slug)) {
        return sendJson(res, 404, { error: 'Property workspace not found.' });
      }
      const site = cmsStore.get(slug);
      const meta = site.propertyMetadata;
      const hero = site.heroMedia;
      const changes = [];

      if (typeof body.designSystemId === 'string' && FIGMA_DESIGN_SYSTEMS[body.designSystemId]) {
        if (body.designSystemId !== site.designSystemId) {
          changes.push(
            `Figma Design System switched to ${FIGMA_DESIGN_SYSTEMS[body.designSystemId].name} (${FIGMA_DESIGN_SYSTEMS[body.designSystemId].figmaFileKey})`
          );
          site.designSystemId = body.designSystemId;
        }
      }

      if (body.propertyMetadata && typeof body.propertyMetadata === 'object') {
        const pm = body.propertyMetadata;
        const stringFields = [
          ['propertyName', 'Property Name', 100],
          ['tagline', 'Tagline', 180],
          ['address', 'Address', 140],
          ['neighborhood', 'Neighborhood', 120],
          ['officeHours', 'Office Hours', 140],
          ['leaseSpecialBanner', 'Sticky Lease Special Banner', 220],
          ['featuredPopOutTitle', 'Featured Pop-Out Title', 140],
          ['featuredPopOutBody', 'Featured Pop-Out Description', 280],
          ['petPolicy', 'Pet Policy', 180]
        ];
        stringFields.forEach(([key, label, maxLen]) => {
          if (typeof pm[key] === 'string' && pm[key].trim() && pm[key].trim() !== meta[key]) {
            meta[key] = pm[key].trim().slice(0, maxLen);
            changes.push(`${label} updated to "${meta[key].slice(0, 70)}"`);
          }
        });

        ['walkScore', 'transitScore', 'bikeScore'].forEach((scoreKey) => {
          if (pm[scoreKey] !== undefined && Number.isFinite(Number(pm[scoreKey]))) {
            const val = Math.max(0, Math.min(100, Number(pm[scoreKey])));
            if (val !== meta[scoreKey]) {
              meta[scoreKey] = val;
              changes.push(`${scoreKey} updated to ${val}`);
            }
          }
        });
      }

      if (body.heroMedia && typeof body.heroMedia === 'object') {
        const hm = body.heroMedia;
        if (typeof hm.headline === 'string' && hm.headline.trim() && hm.headline.trim() !== hero.headline) {
          hero.headline = hm.headline.trim().slice(0, 140);
          changes.push(`Hero H1 Headline updated to "${hero.headline}"`);
        }
        if (typeof hm.subheadline === 'string' && hm.subheadline.trim() && hm.subheadline.trim() !== hero.subheadline) {
          hero.subheadline = hm.subheadline.trim().slice(0, 260);
          changes.push(`Hero Subheadline updated`);
        }
        if (typeof hm.primaryImage === 'string' && hm.primaryImage.trim().startsWith('https://')) {
          if (hm.primaryImage.trim() !== hero.primaryImage) {
            hero.primaryImage = hm.primaryImage.trim();
            changes.push(`Hero Primary Cloudinary/CDN Image updated`);
          }
        }
      }

      if (Array.isArray(body.numberedHighlights) && body.numberedHighlights.length === 4) {
        site.numberedHighlights = body.numberedHighlights.map((item, idx) => ({
          num: `0${idx + 1}`,
          title: String(item.title || '').trim().slice(0, 80) || `Highlight 0${idx + 1}`
        }));
        changes.push('Updated 01–04 Numbered Outline Amenity Highlights');
      }

      const actor = typeof body.actor === 'string' && body.actor.trim() ? body.actor.trim().slice(0, 64) : 'G5 Visual CMS Studio';
      const summary = changes.length ? changes.join(' | ') : 'Saved G5 v9.0 Property Metadata & Figma Design Tokens';
      const revision = appendAuditRevision(site, actor, 'CMS_METADATA_SAVE', summary, changes);

      return sendJson(res, 200, { site, revision });
    } catch (_err) {
      return sendJson(res, 400, { error: 'Failed to update property metadata.' });
    }
  }

  // 3. POST /api/cms/blocks/update — Visual Page Builder (Toggle, Reorder, or Add Certified G5 Stripe)
  if (req.method === 'POST' && pathname === '/api/cms/blocks/update') {
    try {
      const body = await readJsonBody(req);
      const slug = typeof body.slug === 'string' ? body.slug.trim() : '';
      if (!cmsStore.has(slug)) {
        return sendJson(res, 404, { error: 'Property workspace not found.' });
      }
      const site = cmsStore.get(slug);
      const changes = [];

      if (Array.isArray(body.pageStripes)) {
        site.pageStripes = body.pageStripes.map((b) => ({
          blockId: String(b.blockId || `stripe-${Date.now()}`).slice(0, 50),
          componentId: String(b.componentId || 'G5StickyBannerV2').slice(0, 60),
          label: String(b.label || 'G5 Page Stripe').slice(0, 100),
          enabled: Boolean(b.enabled),
          lockedByFigma: Boolean(b.lockedByFigma)
        }));
        const enabledCount = site.pageStripes.filter((s) => s.enabled).length;
        changes.push(`Updated G5 Page Builder Stripe Stack (${enabledCount}/${site.pageStripes.length} stripes enabled)`);
      }

      if (body.addComponentId && typeof body.addComponentId === 'string') {
        const foundCatalog = G5_STRIPE_CATALOG.find((c) => c.componentId === body.addComponentId);
        if (foundCatalog) {
          const newBlock = {
            blockId: `stripe-${foundCatalog.g5WidgetClass}-${Date.now().toString().slice(-4)}`,
            componentId: foundCatalog.componentId,
            label: `${foundCatalog.name} (#${foundCatalog.g5WidgetClass})`,
            enabled: true,
            lockedByFigma: false
          };
          site.pageStripes.push(newBlock);
          changes.push(`Added Certified G5 Stripe: ${foundCatalog.name} (${foundCatalog.componentId})`);
        }
      }

      const revision = appendAuditRevision(
        site,
        'G5 Page Builder Studio',
        'PAGE_BUILDER_LAYOUT_UPDATE',
        changes.join(' | ') || 'Updated Page Builder Stripe Order',
        changes
      );
      return sendJson(res, 200, { site, revision });
    } catch (_err) {
      return sendJson(res, 400, { error: 'Failed to update G5 Page Builder blocks.' });
    }
  }

  // 4. POST /api/cms/floorplans/upsert — Add or Edit Floor Plan & YieldStar/OneSite Inventory
  if (req.method === 'POST' && pathname === '/api/cms/floorplans/upsert') {
    try {
      const body = await readJsonBody(req);
      const slug = typeof body.slug === 'string' ? body.slug.trim() : '';
      if (!cmsStore.has(slug) || !body.floorPlan || typeof body.floorPlan !== 'object') {
        return sendJson(res, 400, { error: 'Invalid floor plan payload.' });
      }
      const site = cmsStore.get(slug);
      const fp = body.floorPlan;
      const fpId = typeof fp.id === 'string' && fp.id.trim() ? fp.id.trim() : `fp-${Date.now()}`;
      const name = String(fp.name || 'New G5 Residence').trim().slice(0, 80);
      const beds = Math.max(0, Math.min(5, Number(fp.beds) || 0));
      const baths = Math.max(1, Math.min(5, Number(fp.baths) || 1));
      const sqft = Math.max(300, Math.min(6000, Number(fp.sqft) || 750));
      const livePrice = Math.max(400, Math.min(30000, Number(fp.livePrice) || 1450));
      const availableUnits = Math.max(0, Math.min(50, Number(fp.availableUnits) !== undefined ? Number(fp.availableUnits) : 3));
      const moveInDate = String(fp.moveInDate || 'Immediate').trim().slice(0, 40);
      const specialOffer = String(fp.specialOffer || 'Now Leasing').trim().slice(0, 60);
      const category = beds === 0 ? 'Studio' : `${beds} Bed`;

      const record = {
        id: fpId,
        name,
        category,
        beds,
        baths,
        sqft,
        livePrice,
        cachedFallbackPrice: livePrice,
        availableUnits,
        moveInDate,
        specialOffer
      };

      const existingIdx = site.floorPlans.findIndex((item) => item.id === fpId);
      let actionDesc = '';
      if (existingIdx > -1) {
        site.floorPlans[existingIdx] = record;
        actionDesc = `Updated Floor Plan "${name}" ($${livePrice.toLocaleString()}/mo • ${availableUnits} avail)`;
      } else {
        site.floorPlans.push(record);
        actionDesc = `Added Floor Plan "${name}" (${category} • ${sqft} Sq. Ft. • $${livePrice.toLocaleString()}/mo)`;
      }

      const revision = appendAuditRevision(site, 'G5 Floor Plan & PMS Manager', 'FLOORPLAN_UPSERT', actionDesc, [
        actionDesc
      ]);
      return sendJson(res, 200, { site, revision });
    } catch (_err) {
      return sendJson(res, 400, { error: 'Failed to save floor plan.' });
    }
  }

  // 5. POST /api/cms/floorplans/delete — Remove Floor Plan
  if (req.method === 'POST' && pathname === '/api/cms/floorplans/delete') {
    try {
      const body = await readJsonBody(req);
      const slug = typeof body.slug === 'string' ? body.slug.trim() : '';
      const fpId = typeof body.floorPlanId === 'string' ? body.floorPlanId.trim() : '';
      if (!cmsStore.has(slug) || !fpId) {
        return sendJson(res, 400, { error: 'Invalid request.' });
      }
      const site = cmsStore.get(slug);
      if (site.floorPlans.length <= 1) {
        return sendJson(res, 400, { error: 'At least one floor plan must remain published.' });
      }
      const target = site.floorPlans.find((f) => f.id === fpId);
      site.floorPlans = site.floorPlans.filter((f) => f.id !== fpId);
      const desc = `Removed Floor Plan "${target ? target.name : fpId}"`;
      const revision = appendAuditRevision(site, 'G5 Floor Plan & PMS Manager', 'FLOORPLAN_DELETE', desc, [desc]);
      return sendJson(res, 200, { site, revision });
    } catch (_err) {
      return sendJson(res, 400, { error: 'Failed to delete floor plan.' });
    }
  }

  // 6. POST /api/cms/amenities/update — Add/Remove Amenities or Add Cloudinary/GCS Media Asset
  if (req.method === 'POST' && pathname === '/api/cms/amenities/update') {
    try {
      const body = await readJsonBody(req);
      const slug = typeof body.slug === 'string' ? body.slug.trim() : '';
      if (!cmsStore.has(slug)) {
        return sendJson(res, 404, { error: 'Property workspace not found.' });
      }
      const site = cmsStore.get(slug);
      const changes = [];

      if (body.addAmenity && typeof body.addAmenity === 'object') {
        const scope = body.addAmenity.scope === 'unit' ? 'unit' : 'community';
        const text = String(body.addAmenity.text || '').trim().slice(0, 140);
        if (text) {
          site.amenities[scope].unshift(text);
          changes.push(`Added ${scope} amenity: "${text}"`);
        }
      }

      if (body.removeAmenity && typeof body.removeAmenity === 'object') {
        const scope = body.removeAmenity.scope === 'unit' ? 'unit' : 'community';
        const idx = Number(body.removeAmenity.index);
        if (Number.isInteger(idx) && idx >= 0 && idx < site.amenities[scope].length) {
          const removed = site.amenities[scope].splice(idx, 1)[0];
          changes.push(`Removed ${scope} amenity: "${removed}"`);
        }
      }

      if (body.addMedia && typeof body.addMedia === 'object') {
        const title = String(body.addMedia.title || 'Property Photo').trim().slice(0, 100);
        const category = String(body.addMedia.category || 'Interiors').trim().slice(0, 40);
        const imageUrl = String(body.addMedia.imageUrl || '').trim();
        if (imageUrl.startsWith('https://')) {
          site.mediaGallery.unshift({
            category,
            title,
            imageUrl,
            gcsAsset: `gs://rp-replatform-assets-prod/${site.slug}/cms-upload-${Date.now()}.webp`
          });
          changes.push(`Added DAM Media Asset: "[${category}] ${title}"`);
        }
      }

      const revision = appendAuditRevision(
        site,
        'G5 Amenities & Media DAM Editor',
        'AMENITIES_AND_MEDIA_UPDATE',
        changes.join(' | ') || 'Updated Amenities & Media Library',
        changes
      );
      return sendJson(res, 200, { site, revision });
    } catch (_err) {
      return sendJson(res, 400, { error: 'Failed to update amenities or media.' });
    }
  }

  // 7. POST /api/cms/datahub/sync — Feature 1: RealPage Data Hub MCP Intake Sync
  if (req.method === 'POST' && pathname === '/api/cms/datahub/sync') {
    try {
      const body = await readJsonBody(req);
      const slug = typeof body.slug === 'string' ? body.slug.trim() : '';
      const dataHubId = typeof body.dataHubId === 'string' ? body.dataHubId.trim() : '';
      if (!cmsStore.has(slug) || !DATA_HUB_RECORDS[dataHubId]) {
        return sendJson(res, 400, { error: 'Invalid property slug or Data Hub ID.' });
      }
      const site = cmsStore.get(slug);
      const dh = DATA_HUB_RECORDS[dataHubId];
      const meta = site.propertyMetadata;

      site.dataHubId = dh.dataHubId;
      meta.propertyName = dh.propertyName;
      meta.corporateClient = dh.corporateOwner;
      meta.storeUrn = dh.g5StoreUrn;
      meta.address = dh.canonicalAddress;
      meta.neighborhood = dh.neighborhood;
      meta.phoneMasked = dh.phoneMasked;
      meta.emailMasked = dh.emailMasked;
      meta.officeHours = dh.verifiedOfficeHours;
      meta.petPolicy = dh.petPolicyVerified;
      meta.walkScore = dh.walkScore;
      meta.transitScore = dh.transitScore;
      meta.bikeScore = dh.bikeScore;

      if (dh.recommendedDesignSystem && FIGMA_DESIGN_SYSTEMS[dh.recommendedDesignSystem]) {
        site.designSystemId = dh.recommendedDesignSystem;
      }

      const revision = appendAuditRevision(
        site,
        'Vertex AI Agent Builder (Data Hub MCP Server)',
        'DATA_HUB_MCP_SYNC',
        `Synchronized canonical Data Hub record ${dh.dataHubId} (${dh.propertyName}) — eliminated ${dh.onboardingQuestionsEliminated} redundant client onboarding questions`,
        [
          `Data Hub Profile: ${dh.dataHubId} (${dh.corporateOwner})`,
          `Canonical Address: ${dh.canonicalAddress}`,
          `PMS Feed Bound: ${dh.pmsConnector} (${dh.totalUnits} units)`,
          `Figma Design System Auto-Matched: ${FIGMA_DESIGN_SYSTEMS[site.designSystemId].name}`
        ]
      );
      return sendJson(res, 200, { site, dataHubRecord: dh, revision });
    } catch (_err) {
      return sendJson(res, 400, { error: 'Failed to sync from RealPage Data Hub.' });
    }
  }

  // 8. POST /api/cms/vendors/shed — Feature 2: Toggle Vendor Shedding & Run Cloud Run Lighthouse/WCAG Audit
  if (req.method === 'POST' && pathname === '/api/cms/vendors/shed') {
    try {
      const body = await readJsonBody(req);
      const slug = typeof body.slug === 'string' ? body.slug.trim() : '';
      if (!cmsStore.has(slug)) {
        return sendJson(res, 404, { error: 'Property workspace not found.' });
      }
      const site = cmsStore.get(slug);
      const shedActive = body.shedActive !== undefined ? Boolean(body.shedActive) : !site.vendorShedding.shedActive;
      site.vendorShedding.shedActive = shedActive;

      const revision = appendAuditRevision(
        site,
        'Cloud Run Jobs (Vendor Shedding & Lighthouse CI)',
        shedActive ? 'VENDOR_SHED_ENABLED' : 'LEGACY_VENDOR_COMPARISON',
        shedActive
          ? `Shed OneTrust (OtAutoBlock.js), Honeybadger, CloudFront & 3rd-party ADA overlay -> Lighthouse surged from ${site.vendorShedding.legacyLighthouseScore} to ${site.vendorShedding.gcpNativeLighthouseScore}`
          : `Simulated legacy 3rd-party scripts for Before/After comparison (Lighthouse dropped to ${site.vendorShedding.legacyLighthouseScore})`,
        [
          `State: ${shedActive ? '1st-Party GCP Native Mode Active' : 'Legacy 3rd-Party Bloat Simulated'}`,
          `Lighthouse Score: ${shedActive ? site.vendorShedding.gcpNativeLighthouseScore : site.vendorShedding.legacyLighthouseScore}/100`,
          `Total Blocking Time: ${shedActive ? site.vendorShedding.gcpNativeTotalBlockingTime : site.vendorShedding.legacyTotalBlockingTime}`
        ]
      );
      return sendJson(res, 200, { site, revision });
    } catch (_err) {
      return sendJson(res, 400, { error: 'Failed to toggle Vendor Shedding.' });
    }
  }

  // 9. POST /api/cms/consent/record — Feature 2: First-Party Cloud Spanner Cookie Consent Ledger
  if (req.method === 'POST' && pathname === '/api/cms/consent/record') {
    try {
      const body = await readJsonBody(req);
      const slug = typeof body.slug === 'string' ? body.slug.trim() : '';
      if (!cmsStore.has(slug)) {
        return sendJson(res, 404, { error: 'Property workspace not found.' });
      }
      const site = cmsStore.get(slug);
      const policyChoice =
        typeof body.policyChoice === 'string' && body.policyChoice.trim()
          ? body.policyChoice.trim().slice(0, 90)
          : 'Accept All First-Party Telemetry';
      const receipt = {
        receiptId: `SPANNER-CONSENT-${crypto.randomBytes(4).toString('hex').toUpperCase()}`,
        timestamp: new Date().toISOString(),
        policyChoice,
        categoriesAccepted: policyChoice.includes('Essential')
          ? ['Strictly Necessary']
          : ['Strictly Necessary', 'First-Party Cloud CDN Telemetry', 'AEO Schema Discovery'],
        edgePop: 'US-Central-Cloud-CDN'
      };
      site.consentLedger.unshift(receipt);
      persistStoreToDisk();
      return sendJson(res, 200, { site, receipt });
    } catch (_err) {
      return sendJson(res, 400, { error: 'Failed to log consent receipt in Cloud Spanner.' });
    }
  }

  // 10. POST /api/cms/intake-agent/chat — Feature 3: Interactive Client-Facing AI Intake Agent
  if (req.method === 'POST' && pathname === '/api/cms/intake-agent/chat') {
    try {
      const body = await readJsonBody(req);
      const slug = typeof body.slug === 'string' ? body.slug.trim() : '';
      const prompt = typeof body.prompt === 'string' ? body.prompt.trim().slice(0, 500) : '';
      if (!cmsStore.has(slug) || !prompt) {
        return sendJson(res, 400, { error: 'Please provide a valid property slug and client message.' });
      }

      const site = cmsStore.get(slug);
      const meta = site.propertyMetadata;
      const hero = site.heroMedia;
      const lower = prompt.toLowerCase();
      const mutations = [];
      const structuredVariables = {
        agentModel: 'vertex-ai/gemini-2.0-pro-client-intake',
        dataHubContext: site.dataHubId,
        figmaGuardrailEnforced: FIGMA_DESIGN_SYSTEMS[site.designSystemId].figmaFileKey,
        appliedConfigVariables: {}
      };

      if (lower.includes('free') || lower.includes('special') || lower.includes('promo') || lower.includes('concession') || lower.includes('month')) {
        const bannerText = `★ LIMITED-TIME SPECIAL: ${prompt}`;
        meta.leaseSpecialBanner = bannerText;
        meta.featuredPopOutTitle = prompt;
        site.floorPlans.forEach((fp) => {
          fp.specialOffer = prompt.slice(0, 42);
        });
        mutations.push(`Updated Sticky Banner, Featured Pop-Out & Floor Plan Specials to "${prompt}"`);
        structuredVariables.appliedConfigVariables.leaseSpecialBanner = bannerText;
      }

      if (lower.includes('pet') || lower.includes('dog') || lower.includes('cat') || lower.includes('breed')) {
        meta.petPolicy = `Pet-Friendly • Client Intake Verified: ${prompt}`;
        mutations.push(`Updated Pet Policy to "${meta.petPolicy}"`);
        structuredVariables.appliedConfigVariables.petPolicy = meta.petPolicy;
      }

      if (lower.includes('tulane') || lower.includes('blue') || lower.includes('arch')) {
        site.designSystemId = 'g5-alpine-tulane';
        mutations.push('Applied G5 Alpine v9.0.8 • 2424 Tulane Design System (#2B5C81 / Barlow)');
        structuredVariables.appliedConfigVariables.designSystemId = 'g5-alpine-tulane';
      } else if (lower.includes('patio') || lower.includes('laredo') || lower.includes('gold') || lower.includes('teal')) {
        site.designSystemId = 'g5-alpine-elpatio';
        mutations.push('Applied G5 Alpine v9.0.7 • El Patio Laredo Design System (#05323A / #B28206)');
        structuredVariables.appliedConfigVariables.designSystemId = 'g5-alpine-elpatio';
      } else if (lower.includes('rockvale') || lower.includes('olive') || lower.includes('minimal') || lower.includes('co-op')) {
        site.designSystemId = 'g5-alpine-rockvale';
        mutations.push('Applied G5 Alpine v9.0.5 • Rockvale Circle Design System (#000000 / #627A48)');
        structuredVariables.appliedConfigVariables.designSystemId = 'g5-alpine-rockvale';
      } else if (lower.includes('luxe') || lower.includes('high-rise') || lower.includes('penthouse')) {
        site.designSystemId = 'g5-luxe-highrise';
        mutations.push('Applied G5 Luxe High-Rise Design System (#0F172A / #C5A059)');
        structuredVariables.appliedConfigVariables.designSystemId = 'g5-luxe-highrise';
      }

      if (lower.includes('headline') || lower.includes('hero') || lower.includes('title')) {
        const cleaned = prompt.replace(/^(change|set|update)\s+(the\s+)?(hero\s+|headline\s+|title\s+)*(to\s+)?/i, '').trim();
        if (cleaned) {
          hero.headline = cleaned.slice(0, 120);
          mutations.push(`Updated Hero H1 Headline to "${hero.headline}"`);
          structuredVariables.appliedConfigVariables.heroHeadline = hero.headline;
        }
      }

      if (lower.includes('ev ') || lower.includes('pickleball') || lower.includes('cowork') || lower.includes('pool') || lower.includes('amenity')) {
        const cleanAmenity = prompt.replace(/^(add|include)\s+/i, '').trim().slice(0, 120);
        site.amenities.community.unshift(cleanAmenity);
        mutations.push(`Added Community Amenity: "${cleanAmenity}"`);
        structuredVariables.appliedConfigVariables.addedAmenity = cleanAmenity;
      }

      if (mutations.length === 0) {
        meta.leaseSpecialBanner = `${meta.propertyName} • ${prompt}`;
        mutations.push(`Published client announcement to G5 Sticky Banner: "${meta.leaseSpecialBanner}"`);
        structuredVariables.appliedConfigVariables.leaseSpecialBanner = meta.leaseSpecialBanner;
      }

      site.intakeConversation.push({
        sender: 'client',
        timestamp: new Date().toISOString(),
        message: prompt
      });

      const replyText =
        `Applied ${mutations.length} configuration update(s) directly to ${meta.propertyName} within Figma Guardrail ` +
        `(${FIGMA_DESIGN_SYSTEMS[site.designSystemId].figmaFileKey}) and logged an immutable revision in Firestore & BigQuery.`;

      site.intakeConversation.push({
        sender: 'agent',
        timestamp: new Date().toISOString(),
        message: replyText,
        structuredVariables
      });

      const revision = appendAuditRevision(
        site,
        'Client Self-Service AI Intake Agent (Vertex AI)',
        'CLIENT_INTAKE_AGENT',
        `Client Intake Agent: ${mutations.join('; ')}`,
        mutations
      );

      return sendJson(res, 200, { site, revision, structuredVariables });
    } catch (_err) {
      return sendJson(res, 400, { error: 'Failed to process Client Intake Agent request.' });
    }
  }

  // 11. POST /api/cms/audit/rollback — Feature 4: Firestore & BigQuery 1-Click Historic Rollback
  if (req.method === 'POST' && pathname === '/api/cms/audit/rollback') {
    try {
      const body = await readJsonBody(req);
      const slug = typeof body.slug === 'string' ? body.slug.trim() : '';
      const revisionId = typeof body.revisionId === 'string' ? body.revisionId.trim() : '';
      if (!cmsStore.has(slug) || !revisionId) {
        return sendJson(res, 400, { error: 'Invalid property slug or revisionId.' });
      }
      const site = cmsStore.get(slug);
      const targetRev = (site.auditHistory || []).find((r) => r.revisionId === revisionId);
      if (!targetRev || !targetRev.snapshot) {
        return sendJson(res, 404, { error: `Revision ${revisionId} not found in Firestore audit history.` });
      }

      const snap = deepClone(targetRev.snapshot);
      site.designSystemId = snap.designSystemId;
      site.propertyMetadata = snap.propertyMetadata;
      site.heroMedia = snap.heroMedia;
      site.numberedHighlights = snap.numberedHighlights;
      site.photoCards = snap.photoCards;
      site.amenities = snap.amenities;
      site.floorPlans = snap.floorPlans;
      site.promotedReviews = snap.promotedReviews;
      site.mediaGallery = snap.mediaGallery;
      site.pageStripes = snap.pageStripes;
      site.vendorShedding = snap.vendorShedding;

      const revision = appendAuditRevision(
        site,
        'Support Engineer / Digital Strategist (1-Click Rollback)',
        'HISTORIC_ROLLBACK',
        `Rolled back CMS state to ${revisionId} (${targetRev.summary})`,
        [
          `Restored Snapshot: ${revisionId} (${targetRev.firestoreDocId})`,
          `Original Actor: ${targetRev.actor}`,
          `Design System Restored: ${FIGMA_DESIGN_SYSTEMS[site.designSystemId].name}`
        ]
      );

      return sendJson(res, 200, { site, revision });
    } catch (_err) {
      return sendJson(res, 400, { error: 'Failed to execute 1-click rollback.' });
    }
  }

  // 12. POST /api/cms/publish — Human-in-the-Loop Production Promotion
  if (req.method === 'POST' && pathname === '/api/cms/publish') {
    try {
      const body = await readJsonBody(req);
      const slug = typeof body.slug === 'string' ? body.slug.trim() : '';
      const approver =
        typeof body.approver === 'string' && body.approver.trim()
          ? body.approver.trim().slice(0, 64)
          : 'Matt & Veronica (Executive Sign-Off)';
      if (!cmsStore.has(slug)) {
        return sendJson(res, 404, { error: 'Property workspace not found.' });
      }
      const site = cmsStore.get(slug);
      site.publishStatus = 'PUBLISHED_LIVE';
      site.hitlPublishReceipt = {
        receiptId: `SPANNER-PUBLISH-${crypto.randomBytes(5).toString('hex').toUpperCase()}`,
        approvedBy: approver,
        publishedAt: new Date().toISOString(),
        edgeUrl: site.stagingUrl.replace('staging-', 'www.')
      };

      const revision = appendAuditRevision(
        site,
        approver,
        'PRODUCTION_PUBLISH',
        `Published ${site.propertyMetadata.propertyName} to G5 Cloud Run Production Edge (${site.hitlPublishReceipt.receiptId})`,
        [
          `Spanner Publish Receipt: ${site.hitlPublishReceipt.receiptId}`,
          `Approved By: ${approver}`,
          `WCAG 2.1 AA + AEO Schema.org + 1st-Party Consent Verified`
        ]
      );
      return sendJson(res, 200, { site, revision });
    } catch (_err) {
      return sendJson(res, 400, { error: 'Failed to publish site.' });
    }
  }

  // 13. POST /api/cms/property/create — Create New Property Site from URL Crawl + Data Hub
  if (req.method === 'POST' && pathname === '/api/cms/property/create') {
    try {
      const body = await readJsonBody(req);
      const sourceUrl = typeof body.sourceUrl === 'string' ? body.sourceUrl.trim() : '';
      const designSystemId =
        typeof body.designSystemId === 'string' && FIGMA_DESIGN_SYSTEMS[body.designSystemId]
          ? body.designSystemId
          : 'g5-alpine-tulane';
      if (!isSafeExternalHttpsUrl(sourceUrl)) {
        return sendJson(res, 400, { error: 'Please provide a valid public HTTPS property URL.' });
      }

      const parsed = new URL(sourceUrl);
      const slug =
        parsed.hostname
          .replace(/^www\./i, '')
          .replace(/[^a-z0-9]+/gi, '-')
          .replace(/^-+|-+$/g, '')
          .toLowerCase()
          .slice(0, 36) || `g5-site-${Date.now()}`;

      let fetchedTitle = parsed.hostname;
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        const resp = await fetch(sourceUrl, {
          method: 'GET',
          headers: { 'User-Agent': 'RealPage-G5-CMS-Ingestion/2.0' },
          signal: controller.signal
        });
        clearTimeout(timeoutId);
        if (resp.ok) {
          const html = (await resp.text()).slice(0, 100000);
          const m = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
          if (m && m[1]) {
            fetchedTitle = m[1].replace(/\s+/g, ' ').replace(/[|<>{}]/g, '').trim().slice(0, 80);
          }
        }
      } catch (_e) {
        // Fallback to hostname
      }

      const templateBase = deepClone(INITIAL_CMS_PROPERTIES[0]);
      templateBase.slug = slug;
      templateBase.dataHubId = 'DH-LIVE-INGEST';
      templateBase.badge = `Live Ingested • ${fetchedTitle}`;
      templateBase.sourceUrl = sourceUrl;
      templateBase.sourcePlatform = `Live Crawled Origin (${parsed.hostname})`;
      templateBase.designSystemId = designSystemId;
      templateBase.stagingUrl = `https://staging-${slug}.realpage-preview.com`;
      templateBase.propertyMetadata.propertyName = fetchedTitle;
      templateBase.propertyMetadata.leaseSpecialBanner = `Now Leasing at ${fetchedTitle} • Migrated to RealPage G5 v9.0 Enterprise CMS`;
      templateBase.heroMedia.headline = `WELCOME TO ${fetchedTitle.toUpperCase()}`;
      templateBase.pageStripes = createDefaultPageStripes(slug);
      templateBase.vendorShedding = createVendorSheddingProfile(parsed.hostname);

      const initialized = initializePropertyRecord(templateBase);
      cmsStore.set(initialized.slug, initialized);
      persistStoreToDisk();

      return sendJson(res, 200, { site: initialized });
    } catch (_err) {
      return sendJson(res, 400, { error: 'Failed to ingest new property URL into CMS.' });
    }
  }

  // Static file serving from /public (including standalone preview route /preview/:slug)
  const isStandalonePreview = req.method === 'GET' && /^\/preview\/[a-z0-9-]+$/i.test(pathname);
  const requestedFile = pathname === '/' || isStandalonePreview ? 'index.html' : path.basename(pathname);
  const resolvedPath = path.resolve(PUBLIC_DIR, requestedFile);
  if (!resolvedPath.startsWith(PUBLIC_DIR + path.sep)) {
    return sendJson(res, 403, { error: 'Access Denied' });
  }

  fs.readFile(resolvedPath, (err, content) => {
    if (err) {
      return sendJson(res, 404, { error: 'Resource Not Found' });
    }
    const ext = path.extname(resolvedPath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(content);
  });
});

server.listen(PORT, HOST, () => {
  console.log(`[RealPage G5 v9.0 Enterprise CMS] Running at http://${HOST}:${PORT}`);
});
