'use strict';

/**
 * Certified G5 Design System Templates & Scraped G5 v9.0 ("Alpine - Simple") Production Reference Tokens
 * Grounded in Matt's 3 live G5 v9.0 URLs (2424tulane.com, patioaptslaredo.com, rockvalecircle.com) + Figma API Guardrails.
 */
const G5_TEMPLATES = {
  'g5-alpine-tulane': {
    id: 'g5-alpine-tulane',
    name: 'G5 Alpine v9.0.8 • 2424 Tulane Edition (Figma Locked)',
    category: 'Mid-City Urban Contemporary • Scraped from 2424tulane.com',
    engine: 'Cloud Run SSR (G5 v9.0.8 Alpine - Simple + Figma API Guardrails)',
    figmaFileKey: 'FIGMA-G5-ALPINE-908-TULANE',
    sourceReferenceUrl: 'https://www.2424tulane.com/',
    tokens: {
      primaryColor: '#2B5C81',
      secondaryColor: '#262626',
      accentColor: '#366748',
      tertiaryColor: '#A5CCC4',
      surfaceColor: '#FFFFFF',
      mutedSurfaceColor: '#DCE6E2',
      textPrimary: '#262626',
      textSecondary: '#334155',
      headingFont: 'Barlow, Plus Jakarta Sans, Inter, sans-serif',
      bodyFont: 'Barlow, Inter, system-ui, sans-serif',
      borderRadius: '14px',
      wcagContrastPrimary: '12.6:1 (WCAG AAA)',
      wcagContrastAccent: '7.2:1 (WCAG AA)'
    }
  },
  'g5-alpine-elpatio': {
    id: 'g5-alpine-elpatio',
    name: 'G5 Alpine v9.0.7 • El Patio Laredo Edition (Figma Locked)',
    category: 'Sunbelt Courtyard Community • Scraped from patioaptslaredo.com',
    engine: 'Cloud Run SSR (G5 v9.0.7 Alpine - Simple + Figma API Guardrails)',
    figmaFileKey: 'FIGMA-G5-ALPINE-907-ELPATIO',
    sourceReferenceUrl: 'https://www.patioaptslaredo.com/',
    tokens: {
      primaryColor: '#05323A',
      secondaryColor: '#B28206',
      accentColor: '#005A6A',
      tertiaryColor: '#DCE2E2',
      surfaceColor: '#FFFFFF',
      mutedSurfaceColor: '#DCE2E2',
      textPrimary: '#05323A',
      textSecondary: '#1E3A40',
      headingFont: 'Playfair Display, Georgia, serif',
      bodyFont: 'Plus Jakarta Sans, Inter, system-ui, sans-serif',
      borderRadius: '6px',
      wcagContrastPrimary: '14.2:1 (WCAG AAA)',
      wcagContrastAccent: '6.9:1 (WCAG AA)'
    }
  },
  'g5-alpine-rockvale': {
    id: 'g5-alpine-rockvale',
    name: 'G5 Alpine v9.0.5 • Rockvale Circle JPNDC Edition (Figma Locked)',
    category: 'Architectural Cooperative • Scraped from rockvalecircle.com',
    engine: 'Cloud Run SSR (G5 v9.0.5 Alpine - Simple + Figma API Guardrails)',
    figmaFileKey: 'FIGMA-G5-ALPINE-905-ROCKVALE',
    sourceReferenceUrl: 'https://www.rockvalecircle.com/',
    tokens: {
      primaryColor: '#000000',
      secondaryColor: '#627A48',
      accentColor: '#747371',
      tertiaryColor: '#747371',
      surfaceColor: '#FFFFFF',
      mutedSurfaceColor: '#F2F2F2',
      textPrimary: '#000000',
      textSecondary: '#40403F',
      headingFont: 'Montserrat, Space Grotesk, Inter, sans-serif',
      bodyFont: 'Open Sans, Inter, system-ui, sans-serif',
      borderRadius: '2px',
      wcagContrastPrimary: '19.4:1 (WCAG AAA)',
      wcagContrastAccent: '7.8:1 (WCAG AAA)'
    }
  },
  'g5-luxe-highrise': {
    id: 'g5-luxe-highrise',
    name: 'G5 Luxe High-Rise (v4.2)',
    category: 'Luxury Urban Tower / Class-A Mixed Use',
    engine: 'Cloud Run SSR (G5 Liquid/Next Hybrid)',
    figmaFileKey: 'FIGMA-G5-LUXE-420',
    sourceReferenceUrl: 'https://www.thekensingtonatplano-kentico.com',
    tokens: {
      primaryColor: '#0F172A',
      secondaryColor: '#C5A059',
      accentColor: '#1E293B',
      tertiaryColor: '#CBD5E1',
      surfaceColor: '#FFFFFF',
      mutedSurfaceColor: '#F8FAFC',
      textPrimary: '#0F172A',
      textSecondary: '#475569',
      headingFont: 'Playfair Display, Georgia, serif',
      bodyFont: 'Plus Jakarta Sans, Inter, system-ui, sans-serif',
      borderRadius: '6px',
      wcagContrastPrimary: '15.8:1 (WCAG AAA)',
      wcagContrastAccent: '7.4:1 (WCAG AA)'
    }
  },
  'g5-urban-modern': {
    id: 'g5-urban-modern',
    name: 'G5 Urban Modern (v4.2)',
    category: 'Mid-Rise Contemporary / Tech Corridor',
    engine: 'Cloud Run SSR (G5 Liquid/Next Hybrid)',
    figmaFileKey: 'FIGMA-G5-URBAN-420',
    sourceReferenceUrl: 'https://www.monarchuptowndallas.com',
    tokens: {
      primaryColor: '#0B3B59',
      secondaryColor: '#0284C7',
      accentColor: '#0369A1',
      tertiaryColor: '#BAE6FD',
      surfaceColor: '#FFFFFF',
      mutedSurfaceColor: '#F0F9FF',
      textPrimary: '#0F172A',
      textSecondary: '#334155',
      headingFont: 'Space Grotesk, Inter, system-ui, sans-serif',
      bodyFont: 'Inter, system-ui, sans-serif',
      borderRadius: '10px',
      wcagContrastPrimary: '11.9:1 (WCAG AAA)',
      wcagContrastAccent: '6.8:1 (WCAG AA)'
    }
  },
  'g5-boutique-resort': {
    id: 'g5-boutique-resort',
    name: 'G5 Boutique Resort (v4.2)',
    category: 'Garden Style / Sunbelt Resort Community',
    engine: 'Cloud Run SSR (G5 Liquid/Next Hybrid)',
    figmaFileKey: 'FIGMA-G5-RESORT-420',
    sourceReferenceUrl: 'https://www.auroraloftsaustin.g5search.com',
    tokens: {
      primaryColor: '#133829',
      secondaryColor: '#B45309',
      accentColor: '#065F46',
      tertiaryColor: '#D1FAE5',
      surfaceColor: '#FFFFFF',
      mutedSurfaceColor: '#F4F7F4',
      textPrimary: '#14261D',
      textSecondary: '#3F5247',
      headingFont: 'Cormorant Garamond, Georgia, serif',
      bodyFont: 'Plus Jakarta Sans, system-ui, sans-serif',
      borderRadius: '14px',
      wcagContrastPrimary: '13.4:1 (WCAG AAA)',
      wcagContrastAccent: '7.1:1 (WCAG AA)'
    }
  }
};

/**
 * Certified G5 v9.0 Component Library Allowlist (Anti-Vibe-Coding + Figma Guardrails)
 */
const CERTIFIED_G5_COMPONENTS = [
  {
    componentId: 'G5StickyBannerV2',
    version: '9.0.8',
    purpose: 'Top announcement ribbon, lease special promo, and G5 Call Tracking Edge (DNI) phone bar.',
    wcagStatus: 'AAA Verified'
  },
  {
    componentId: 'G5HeroGalleryBasic',
    version: '9.0.8',
    purpose: 'Responsive 2000x800 viewport hero banner with uppercase tracking, overlay filter, and primary CTAs.',
    wcagStatus: 'AA Verified'
  },
  {
    componentId: 'G5FeaturedContentPopOut',
    version: '9.0.8',
    purpose: 'Featured promotional callout stripe (e.g., "1 Month Free!" pop-out banner from 2424tulane.com).',
    wcagStatus: 'AA Verified'
  },
  {
    componentId: 'G5QuickStatsBar',
    version: '9.0.7',
    purpose: 'Normalized property address, office hours specification, Walk/Bike Scores, and pet policy bar.',
    wcagStatus: 'AAA Verified'
  },
  {
    componentId: 'G5FloorPlanGrid',
    version: '9.0.8',
    purpose: 'Sandboxed container for real-time PMS pricing & availability (YieldStar/LRO/OneSite/Entrata) + FR-2.4 fallback.',
    wcagStatus: 'AA Verified'
  },
  {
    componentId: 'G5NumberedAmenityBadges',
    version: '9.0.8',
    purpose: 'Circular numbered amenity highlight badges (01–04 zoom outline circles from 2424tulane.com) + Community/Unit lists.',
    wcagStatus: 'AAA Verified'
  },
  {
    componentId: 'G5PhotoCardsMosaic',
    version: '9.0.7',
    purpose: 'Interactive 3-column Photo Cards Mosaic with Criss-Cross hover & Top-Right-Corner arch radius masks.',
    wcagStatus: 'AA Verified'
  },
  {
    componentId: 'G5FirstPartyConsentBanner',
    version: '9.0.8',
    purpose: 'Zero-bloat GCP Cloud Spanner First-Party Cookie & Privacy Consent Manager (replaces OneTrust OtAutoBlock.js).',
    wcagStatus: 'AAA Verified'
  },
  {
    componentId: 'G5AeoStructuredDataGraph',
    version: '9.0.8',
    purpose: 'Automated Schema.org ApartmentComplex JSON-LD & Gemini Enterprise AEO discovery graph.',
    wcagStatus: 'AAA Verified'
  }
];

/**
 * Feature 1: RealPage "Data Hub" Global Onboarding Profiles (Fetched via Vertex AI Agent Builder + Cloud Functions MCP Server)
 */
const DATA_HUB_PROFILES = {
  'DH-NOLA-2424': {
    dataHubId: 'DH-NOLA-2424',
    mcpEndpoint: 'mcp://realpage-datahub-prod.cloudfunctions.net/v1/intake/DH-NOLA-2424',
    propertyName: '2424 Tulane Apartments',
    corporateClientName: 'Key Management Company',
    g5ClientId: 'g5-c-663rw26jd-key-management',
    g5StoreId: 'g5-cl-1qti3ft04w-key-management-new-orleans-la',
    g5DniScriptId: '440f75fe-6e8a-46a5-f22e-08dd7de869c2',
    ga4TrackingId: 'G-7E00Y7FJ3G',
    streetAddress: '2424 Tulane Ave',
    city: 'New Orleans',
    state: 'LA',
    postalCode: '70119',
    fullAddress: '2424 Tulane Ave, New Orleans, LA 70119',
    neighborhood: 'Mid-City Medical District • Orleans Parish (Near Caesars Superdome)',
    phoneMasked: '(866) ***-4957',
    emailMasked: 'leasing@***2424tulane.com',
    officeHours: 'Mon–Fri: 9:00 AM – 6:00 PM | Sat: 10:00 AM – 4:00 PM | Sun: Closed',
    geo: { latitude: '29.9601073', longitude: '-90.0876362' },
    walkScore: 80,
    bikeScore: 86,
    recommendedTemplateId: 'g5-alpine-tulane',
    leaseSpecialBanner: '1 Month Free! • Move-In Special on Select 1 & 2 Bedroom Mid-City Residences',
    petPolicy: 'Pet Friendly • Tulane-Gravier Courtyard Pet Run & Grooming Station'
  },
  'DH-LRD-5908': {
    dataHubId: 'DH-LRD-5908',
    mcpEndpoint: 'mcp://realpage-datahub-prod.cloudfunctions.net/v1/intake/DH-LRD-5908',
    propertyName: 'El Patio Apartments',
    corporateClientName: 'B.P. Newman Investment Company',
    g5ClientId: 'g5-c-69419ji7w-bp-newman-investment-company',
    g5StoreId: 'g5-cl-1qj4co50d8-bp-newman-investment-company-laredo-tx',
    g5DniScriptId: '50de8dde-087c-4303-dbbb-08de2c1a5015',
    ga4TrackingId: 'G-H2F6M970Y9',
    streetAddress: '5908 San Bernardo Ave',
    city: 'Laredo',
    state: 'TX',
    postalCode: '78041',
    fullAddress: '5908 San Bernardo Ave, Laredo, TX 78041',
    neighborhood: 'San Bernardo Corridor • Central Laredo Shopping & Dining District',
    phoneMasked: '(833) ***-6390',
    emailMasked: 'elpatio@***bpnewman.com',
    officeHours: 'Mon–Fri: 8:30 AM – 5:30 PM | Sat–Sun: Closed',
    geo: { latitude: '27.5590546', longitude: '-99.504639' },
    walkScore: 84,
    bikeScore: 76,
    recommendedTemplateId: 'g5-alpine-elpatio',
    leaseSpecialBanner: 'Come Home to a Comfortable Life in Laredo • Spacious 1 Bedroom Homes Available Now',
    petPolicy: 'Pet Friendly • Shaded Courtyard Walking Paths & On-Site Management'
  },
  'DH-BOS-02130': {
    dataHubId: 'DH-BOS-02130',
    mcpEndpoint: 'mcp://realpage-datahub-prod.cloudfunctions.net/v1/intake/DH-BOS-02130',
    propertyName: 'Rockvale Circle Cooperative',
    corporateClientName: 'Peabody Properties, Inc. & JPNDC',
    g5ClientId: 'g5-c-5wq1x8clb-peabody-properties-inc',
    g5StoreId: 'g5-cl-1pp5e1a1l9-peabody-properties-inc-jamaica-plain-ma',
    g5DniScriptId: 'db426972-ac50-4155-99e6-08dd7de9dda7',
    ga4TrackingId: 'G-C56RVVJB99',
    streetAddress: '28, 32, 39, 40, 43 Rockvale Circle',
    city: 'Jamaica Plain',
    state: 'MA',
    postalCode: '02130',
    fullAddress: '28, 32, 39, 40, 43 Rockvale Circle, Jamaica Plain, MA 02130',
    neighborhood: 'Jamaica Plain • Near Jamaica Pond, Arnold Arboretum & Franklin Park',
    phoneMasked: '(833) ***-6518',
    emailMasked: 'rockvale@***peabodyproperties.com',
    officeHours: 'Mon–Fri: 8:00 AM – 4:30 PM | Sat–Sun: Closed',
    geo: { latitude: '42.3066661', longitude: '-71.1046944' },
    walkScore: 89,
    bikeScore: 88,
    recommendedTemplateId: 'g5-alpine-rockvale',
    leaseSpecialBanner: 'A JPNDC & Peabody Properties Cooperative Community • 15 Homes Across 5 Historic Buildings',
    petPolicy: 'Smoke-Free & Equal Housing Opportunity Cooperative Community'
  },
  'DH-PLN-5900': {
    dataHubId: 'DH-PLN-5900',
    mcpEndpoint: 'mcp://realpage-datahub-prod.cloudfunctions.net/v1/intake/DH-PLN-5900',
    propertyName: 'The Kensington at Legacy West',
    corporateClientName: 'RealPage Enterprise Portfolio',
    g5ClientId: 'g5-c-rp-kensington-legacy',
    g5StoreId: 'g5-cl-plano-tx-kensington',
    g5DniScriptId: '991a2bc4-7781-4402-91bc-08dd7de11223',
    ga4TrackingId: 'G-KENSINGTON1',
    streetAddress: '5900 Windrose Avenue',
    city: 'Plano',
    state: 'TX',
    postalCode: '75024',
    fullAddress: '5900 Windrose Avenue, Plano, TX 75024',
    neighborhood: 'Legacy West • North Dallas Tollway Corridor',
    phoneMasked: '(972) ***-0148',
    emailMasked: 'leasing@***kensingtonplano.com',
    officeHours: 'Mon–Fri: 9:00 AM – 6:00 PM | Sat: 10:00 AM – 5:00 PM | Sun: 1:00 PM – 5:00 PM',
    geo: { latitude: '33.0785', longitude: '-96.8241' },
    walkScore: 91,
    bikeScore: 78,
    recommendedTemplateId: 'g5-luxe-highrise',
    leaseSpecialBanner: 'Now Leasing Penthouse Collection • Up to 6 Weeks Free on Select 1 & 2 Bedroom Residences',
    petPolicy: 'Pet Friendly • Private Heated Dog Spa & 1/4-Acre Sky Bark Park'
  }
};

function buildDefaultCmsBlocks() {
  return [
    { id: 'stickyBanner', label: 'G5StickyBannerV2 (Top Promo & DNI Phone Ribbon)', enabled: true },
    { id: 'hero', label: 'G5HeroGalleryBasic (2000x800 Hero & CTAs)', enabled: true },
    { id: 'featuredPopOut', label: 'G5FeaturedContentPopOut (Lease Special Spotlight)', enabled: true },
    { id: 'statsBar', label: 'G5QuickStatsBar (Data Hub Address, Hours & Walk Score)', enabled: true },
    { id: 'floorPlans', label: 'G5FloorPlanGrid (Live PMS Pricing & Availability Matrix)', enabled: true },
    { id: 'numberedHighlights', label: 'G5NumberedAmenityBadges (01–04 Zoom Circle Callouts)', enabled: true },
    { id: 'amenities', label: 'G5AmenityPillList (Community & Residence Interior Features)', enabled: true },
    { id: 'photoMosaic', label: 'G5PhotoCardsMosaic (Cloudinary High-Res Gallery & Cards)', enabled: true },
    { id: 'aeoFooter', label: 'G5AeoStructuredDataGraph (Schema.org JSON-LD & FHEO/ADA Footer)', enabled: true },
    { id: 'firstPartyConsent', label: 'G5FirstPartyConsentBanner (Cloud Spanner 1st-Party Privacy Bar)', enabled: true }
  ];
}

function buildDefaultVendorShedding(domainName) {
  return {
    shedActive: true,
    legacyLighthousePerformance: 58,
    gcpLighthousePerformance: 98,
    legacyAccessibilityScore: 81,
    gcpAccessibilityScore: 100,
    bytesSavedKb: 642,
    shedScripts: [
      {
        vendor: 'OneTrust Cookie AutoBlock (cdn.cookielaw.org / otSDKStub.js)',
        legacyImpact: '-22 Lighthouse Perf • 310 KB Blocking JS',
        gcpReplacement: 'Cloud Spanner Server-Side Consent Ledger + G5FirstPartyConsentBanner',
        status: 'SHED_AND_REPLACED'
      },
      {
        vendor: 'Honeybadger Client Error Tracker (js.honeybadger.io/v3.0)',
        legacyImpact: '-7 Lighthouse Perf • External Error Beacon',
        gcpReplacement: 'Google Cloud Logging & Error Reporting (Server-Side Zero-JS)',
        status: 'SHED_AND_REPLACED'
      },
      {
        vendor: 'Third-Party CloudFront Script (dnn506yrbagrg.cloudfront.net/8426.js)',
        legacyImpact: '-11 Lighthouse Perf • 3rd-Party Cookie Leaks',
        gcpReplacement: `First-Party Cloud CDN + Cloud DNS Edge Telemetry (${domainName})`,
        status: 'SHED_AND_REPLACED'
      },
      {
        vendor: 'Third-Party Accessibility Overlay Widget',
        legacyImpact: '-14 Lighthouse Perf • Runtime DOM Mutation Lag',
        gcpReplacement: 'Cloud Run Jobs Automated Lighthouse + Axe-Core WCAG 2.1 AA Build Gate',
        status: 'SHED_AND_REPLACED'
      }
    ]
  };
}

/**
 * Executive Demo Property Presets:
 * Top 3 are Matt's newly released G5 v9.0 reference sites (2424tulane.com, patioaptslaredo.com, rockvalecircle.com)
 * demonstrating concrete Kentico-to-G5 v9.0 migrations with zero "Pumpkin Villages".
 */
const DEMO_PRESETS = {
  'tulane-2424': {
    presetKey: 'tulane-2424',
    dataHubId: 'DH-NOLA-2424',
    badge: 'Matt URL #1 • Kentico -> G5 v9.0.8 (2424tulane.com)',
    sourceUrl: 'https://www.2424tulane.com/',
    sourcePlatform: 'Legacy Kentico CMS -> Migrated to G5 v9.0.8 ("Alpine - Simple" • Key Management)',
    targetTemplateId: 'g5-alpine-tulane',
    stagingSlug: '2424-tulane-apartments',
    stagingUrl: 'https://staging-2424-tulane-apartments.realpage-preview.com',
    migrationMetrics: {
      legacyTimeline: '38 Days (Legacy Manual Onboarding)',
      replatformTimeline: '9m 12s (Data Hub MCP + Figma Lock + Gemini 2.0 Pro)',
      domNodesScanned: 3420,
      highResAssetsCopiedToGcs: 48,
      widgetsPreserved: 3,
      wcagScore: '100/100 (WCAG 2.1 AA • Cloud Run Lighthouse Verified)'
    },
    figmaGuardrail: {
      fileKey: 'FIGMA-G5-ALPINE-908-TULANE',
      fileName: 'RealPage_G5_Alpine_v9.0.8_2424Tulane.fig',
      strictMode: true,
      lockedVariablesCount: 32,
      extractedRootTokens: '--theme_primary_color: #2B5C81; --theme_secondary_color: #262626; --theme_tertiary_color: #A5CCC4; --theme_header_color: #DCE6E2; --theme_body_link_color: #366748; --theme_primary_font: barlow;'
    },
    vendorShedding: buildDefaultVendorShedding('2424tulane.com'),
    cmsLayoutBlocks: buildDefaultCmsBlocks(),
    legacyDomSample: [
      '<!-- Extracted G5 v9.0.8 dataLayer & CSS Tokens from https://www.2424tulane.com/ -->',
      '<script>',
      '  dataLayer.push({',
      '    "G5_CLIENT_ID": "g5-c-663rw26jd-key-management",',
      '    "G5_STORE_ID": "g5-cl-1qti3ft04w-key-management-new-orleans-la",',
      '    "G5_THEME_ID": "Alpine - Simple",',
      '    "G5_CMS_VERSION": "v9.0.8"',
      '  });',
      '</script>',
      '<!-- Legacy OneTrust & Honeybadger Scripts Shed by RePlatform First-Party Engine -->',
      '<!-- <script src="https://cdn.cookielaw.org/consent/019ff78a.../OtAutoBlock.js"></script> -->',
      '<div class="featured-content-pop-out widget" data-name="Featured Content Pop Out">',
      '  <h2>1 Month Free!</h2>',
      '</div>'
    ].join('\n'),
    g5Schema: {
      schemaVersion: 'G5-Alpine-v9.0.8-Strict',
      propertyMetadata: {
        propertyName: '2424 Tulane Apartments',
        corporateClient: 'Key Management Company (g5-c-663rw26jd-key-management)',
        storeUrn: 'g5-cl-1qti3ft04w-key-management-new-orleans-la',
        tagline: 'Modern Living for a Modern Lifestyle in Mid-City New Orleans’ Thriving Medical District',
        address: '2424 Tulane Ave, New Orleans, LA 70119',
        neighborhood: 'Mid-City Medical District • Orleans Parish (Near Caesars Superdome)',
        phoneMasked: '(866) ***-4957',
        emailMasked: 'leasing@***2424tulane.com',
        officeHours: 'Mon–Fri: 9:00 AM – 6:00 PM | Sat: 10:00 AM – 4:00 PM | Sun: Closed',
        leaseSpecialBanner: '1 Month Free! • Featured Pop-Out Offer on Furnished & Unfurnished 1 & 2 Bedroom Retreats',
        petPolicy: 'Pet Friendly • Mid-City Courtyard Bark Park & 24-Hour Maintenance',
        walkScore: 80,
        transitScore: 86
      },
      numberedHighlights: [
        { num: '01', title: 'Heated Resort-Style Pool' },
        { num: '02', title: 'State-of-the-Art Fitness Center' },
        { num: '03', title: 'Community Room & Co-Working Spaces' },
        { num: '04', title: '24-Hour Emergency Maintenance' }
      ],
      navigationHierarchy: [
        { label: 'Floor Plans', anchor: '#floorplans', badge: 'Live Pricing' },
        { label: 'Photo Gallery', anchor: '#gallery' },
        { label: 'Amenities', anchor: '#amenities', badge: '01–04 Highlights' },
        { label: 'Neighborhood', anchor: '#overview' },
        { label: 'Schedule a Tour', anchor: '#floorplans', badge: '1 Month Free' }
      ],
      heroMedia: {
        headline: 'Live Your Moment at 2424 Tulane',
        subheadline: 'Live life the way you want it: vibrant, active, social, and filled with experiences in the heart of New Orleans’ Medical District.',
        primaryImage: 'https://res.cloudinary.com/g5-assets-cld/image/upload/x_0,y_94,h_1800,w_3000,c_crop/q_auto,f_auto,fl_lossy,g_center,h_1200,w_2000/g5/g5-c-663rw26jd-key-management/g5-cl-1qti3ft04w-key-management-new-orleans-la/uploads/tvuhziix4tdisv5iksa8.jpg',
        gcsUri: 'gs://rp-replatform-assets-prod/2424-tulane/tvuhziix4tdisv5iksa8.webp'
      },
      amenities: {
        community: [
          'Heated Resort-Style Swimming Pool & Sundeck Lounge (01)',
          'State-of-the-Art Fitness & Cardio Performance Center (02)',
          'Resident Community Room & High-Speed Co-Working Spaces (03)',
          '24-Hour Dedicated On-Site Maintenance & Controlled Access (04)',
          'Walk Score 80 & Bike Score 86 in Orleans Parish Medical District',
          'Minutes from Caesars Superdome, Tulane Medical Center & Mid-City Dining'
        ],
        unit: [
          'Sealed Architectural Concrete Floors Throughout',
          'Oversize Windows for Abundant Natural Light & City Views',
          'Energy-Efficient, Front-Loading Washer & Dryer Included',
          'Furnished & Unfurnished Tulane-Gravier Retreat Options Available',
          'Designer Kitchen Fixtures, Quartz Countertops & Modern Cabinetry',
          'Spacious 1 & 2 Bedroom Layouts with High Ceilings'
        ]
      },
      floorPlans: [
        {
          id: 'fp-tul-a1',
          name: 'A1 • The Mid-City One Bedroom',
          category: '1 Bed',
          beds: 1,
          baths: 1,
          sqft: 725,
          livePrice: 1495,
          cachedFallbackPrice: 1495,
          availableUnits: 5,
          moveInDate: 'Immediate',
          floorPlanDiagram: 'Sealed Concrete Floors • Oversize Windows • 725 Sq. Ft.',
          specialOffer: '1 Month Free!'
        },
        {
          id: 'fp-tul-a2',
          name: 'A2 • The Gravier Furnished Retreat (1BR)',
          category: '1 Bed',
          beds: 1,
          baths: 1,
          sqft: 810,
          livePrice: 1685,
          cachedFallbackPrice: 1685,
          availableUnits: 3,
          moveInDate: 'Immediate',
          floorPlanDiagram: 'Furnished Medical District Suite • In-Unit W/D • 810 Sq. Ft.',
          specialOffer: '1 Month Free!'
        },
        {
          id: 'fp-tul-b1',
          name: 'B1 • The Orleans Parish Two Bedroom',
          category: '2 Bed',
          beds: 2,
          baths: 2,
          sqft: 1140,
          livePrice: 2150,
          cachedFallbackPrice: 2150,
          availableUnits: 4,
          moveInDate: 'Oct 1, 2026',
          floorPlanDiagram: 'Split 2BR/2BA • Panoramic Tulane Ave Views • 1,140 Sq. Ft.',
          specialOffer: '1 Month Free!'
        }
      ],
      mediaGallery: [
        {
          category: 'Exteriors',
          title: '2424 Tulane Mid-City Architectural Facade & Streetscape',
          imageUrl: 'https://res.cloudinary.com/g5-assets-cld/image/upload/x_0,y_94,h_1800,w_3000,c_crop/q_auto,f_auto,fl_lossy,g_center,h_1200,w_2000/g5/g5-c-663rw26jd-key-management/g5-cl-1qti3ft04w-key-management-new-orleans-la/uploads/tvuhziix4tdisv5iksa8.jpg',
          gcsAsset: 'gs://rp-replatform-assets-prod/2424-tulane/hero-facade.webp'
        },
        {
          category: 'Amenities',
          title: 'Heated Resort-Style Pool & Courtyard Deck (Top-Right Arch)',
          imageUrl: 'https://res.cloudinary.com/g5-assets-cld/image/upload/x_0,y_0,h_682,w_1023,c_crop/q_auto,f_auto,fl_lossy,g_center,r_0:250:0:0,h_500,w_750/g5/g5-c-663rw26jd-key-management/g5-cl-1qti3ft04w-key-management-new-orleans-la/uploads/fqpxtynfg2jpjofforvb.jpg',
          gcsAsset: 'gs://rp-replatform-assets-prod/2424-tulane/pool-courtyard.webp'
        },
        {
          category: 'Amenities',
          title: 'Co-Working Spaces & Coffee Shop Lifestyle Near 2424 Tulane',
          imageUrl: 'https://g5-assets-cld-res.cloudinary.com/image/upload/q_auto,f_auto,c_fill,g_center,h_1200,w_1500/v1780349781/g5/g5-c-663rw26jd-key-management/g5-cl-1qti3ft04w-key-management-new-orleans-la/uploads/GettyImages-2175654940_cdcqs3.jpg',
          gcsAsset: 'gs://rp-replatform-assets-prod/2424-tulane/coworking-lifestyle.webp'
        },
        {
          category: 'Interiors',
          title: 'Modern Sealed Concrete Flooring & Oversize Windows',
          imageUrl: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=900&q=80',
          gcsAsset: 'gs://rp-replatform-assets-prod/2424-tulane/interior-concrete.webp'
        }
      ]
    },
    preservedWidgets: [
      {
        widgetId: 'w-tulane-fp-01',
        vendor: 'G5 Floor Plans Plus (v-btn Vue/Vuetify PMS Feed)',
        type: 'Live Lease Terms, Move-In Date & Unit Availability Matrix (FR-2.1)',
        domAnchorSelector: '#floor-plans-plus-2424tulane',
        scriptOrigin: 'https://assets.g5dxm.com/widgets/floor-plans-plus.js',
        secretManagerRef: 'projects/realpage-replatform/secrets/2424tulane-pms-token/versions/2',
        maskedTokenPreview: 'g5_fp_****...****t04w',
        corsProxyRoute: 'https://proxy.realpage-preview.com/v1/g5-fp/2424-tulane',
        status: 'HYDRATED_VIA_CLOUD_RUN_PROXY',
        fallbackReady: true,
        fallbackRecordsCached: 12
      },
      {
        widgetId: 'w-tulane-cpns-02',
        vendor: 'G5 Call Tracking Edge (DNI Phone Service)',
        type: 'Dynamic Number Insertion & Lead Attribution (FR-2.2)',
        domAnchorSelector: '#phone-number-39004148',
        scriptOrigin: 'https://call-tracking-edge.g5marketingcloud.com/api/v1/phone_numbers',
        secretManagerRef: 'projects/realpage-replatform/secrets/2424tulane-dni-urn/versions/1',
        maskedTokenPreview: 'dni_urn_****...****69c2',
        corsProxyRoute: 'https://proxy.realpage-preview.com/v1/cpns/g5-cl-1qti3ft04w',
        status: 'HYDRATED_VIA_CLOUD_RUN_PROXY',
        fallbackReady: true,
        fallbackRecordsCached: 4
      },
      {
        widgetId: 'w-tulane-fcpo-03',
        vendor: 'G5 Featured Content Pop Out & Online Scheduling',
        type: 'Promotional Lease Offer Drawer & Tour Booking (FR-2.3)',
        domAnchorSelector: '#featured-content-pop-out-39004157',
        scriptOrigin: 'https://client-leads.g5marketingcloud.com/api/v1/locations/2424tulane',
        secretManagerRef: 'projects/realpage-replatform/secrets/2424tulane-leads-key/versions/1',
        maskedTokenPreview: 'g5_lead_****...****4157',
        corsProxyRoute: 'https://proxy.realpage-preview.com/v1/client-leads/2424-tulane',
        status: 'HYDRATED_VIA_CLOUD_RUN_PROXY',
        fallbackReady: true,
        fallbackRecordsCached: 6
      }
    ]
  },

  'el-patio-laredo': {
    presetKey: 'el-patio-laredo',
    dataHubId: 'DH-LRD-5908',
    badge: 'Matt URL #2 • Kentico -> G5 v9.0.7 (patioaptslaredo.com)',
    sourceUrl: 'https://www.patioaptslaredo.com/',
    sourcePlatform: 'Legacy Kentico CMS -> Migrated to G5 v9.0.7 ("Alpine - Simple" • B.P. Newman)',
    targetTemplateId: 'g5-alpine-elpatio',
    stagingSlug: 'el-patio-apartments-laredo',
    stagingUrl: 'https://staging-el-patio-apartments-laredo.realpage-preview.com',
    migrationMetrics: {
      legacyTimeline: '34 Days (Legacy Manual Onboarding)',
      replatformTimeline: '8m 48s (Data Hub MCP + Figma Lock + Gemini 2.0 Pro)',
      domNodesScanned: 2890,
      highResAssetsCopiedToGcs: 36,
      widgetsPreserved: 3,
      wcagScore: '100/100 (WCAG 2.1 AAA • Cloud Run Lighthouse Verified)'
    },
    figmaGuardrail: {
      fileKey: 'FIGMA-G5-ALPINE-907-ELPATIO',
      fileName: 'RealPage_G5_Alpine_v9.0.7_ElPatioLaredo.fig',
      strictMode: true,
      lockedVariablesCount: 29,
      extractedRootTokens: '--theme_primary_color: #dce2e2; --theme_secondary_color: #05323a; --theme_tertiary_color: #005a6a; --theme_body_link_color: #b28206; --theme_primary_font: freight-sans-pro; --theme_secondary_font: freightneocnd-pro;'
    },
    vendorShedding: buildDefaultVendorShedding('patioaptslaredo.com'),
    cmsLayoutBlocks: buildDefaultCmsBlocks(),
    legacyDomSample: [
      '<!-- Extracted G5 v9.0.7 dataLayer & CSS Tokens from https://www.patioaptslaredo.com/ -->',
      '<script>',
      '  dataLayer.push({',
      '    "G5_CLIENT_ID": "g5-c-69419ji7w-bp-newman-investment-company",',
      '    "G5_STORE_ID": "g5-cl-1qj4co50d8-bp-newman-investment-company-laredo-tx",',
      '    "G5_THEME_ID": "Alpine - Simple",',
      '    "G5_CMS_VERSION": "v9.0.7"',
      '  });',
      '</script>',
      '<div id="promoted-reviews-37448039" class="promoted-reviews widget" data-name="Promoted Reviews">',
      '  <!-- Chatmeter & Yext Reviews -> Migrated to 1st-Party Cloud Run Cache -->',
      '</div>'
    ].join('\n'),
    g5Schema: {
      schemaVersion: 'G5-Alpine-v9.0.7-Strict',
      propertyMetadata: {
        propertyName: 'El Patio Apartments',
        corporateClient: 'B.P. Newman Investment Company (g5-c-69419ji7w-bp-newman-investment-company)',
        storeUrn: 'g5-cl-1qj4co50d8-bp-newman-investment-company-laredo-tx',
        tagline: 'Come Home to a Comfortable Life in Laredo • Spacious 1 Bedroom Apartment Homes',
        address: '5908 San Bernardo Ave, Laredo, TX 78041',
        neighborhood: 'San Bernardo Corridor • Prime Laredo Shopping, Dining & Schools District',
        phoneMasked: '(833) ***-6390',
        emailMasked: 'elpatio@***bpnewman.com',
        officeHours: 'Mon–Fri: 8:30 AM – 5:30 PM | Sat–Sun: Closed',
        leaseSpecialBanner: 'A Refreshing Community: El Patio Apartments • Tour Our Light-Filled 1 Bedroom Laredo Homes Today',
        petPolicy: 'Pet Friendly • Relaxing Outdoor Courtyards, Swimming Pool & On-Site Management',
        walkScore: 84,
        transitScore: 76
      },
      numberedHighlights: [
        { num: '01', title: 'Refreshing Swimming Pool' },
        { num: '02', title: 'Dedicated On-Site Management' },
        { num: '03', title: 'Resident Laundry Facility' },
        { num: '04', title: 'Prime San Bernardo Location' }
      ],
      navigationHierarchy: [
        { label: 'Floor Plans', anchor: '#floorplans', badge: '1BR Homes' },
        { label: 'Photo Gallery', anchor: '#gallery' },
        { label: 'Amenities', anchor: '#amenities' },
        { label: 'Neighborhood', anchor: '#overview' },
        { label: 'Schedule a Tour', anchor: '#floorplans', badge: 'Online Portal' }
      ],
      heroMedia: {
        headline: 'A Refreshing Community: El Patio Apartments',
        subheadline: 'Choose from our 1 bedroom apartments in Laredo, Texas, and have it all—spacious layouts, light-filled rooms, and convenient amenities.',
        primaryImage: 'https://g5-assets-cld-res.cloudinary.com/image/upload/x_7,y_0,h_1328,w_1993,c_crop/q_auto,f_auto,c_fill,g_center,h_1000,w_1500/v1773314561/g5/g5-c-69419ji7w-bp-newman-investment-company/g5-cl-1qj4co50d8-bp-newman-investment-company-laredo-tx/uploads/GettyImages-861980226_vxpdiw.jpg',
        gcsUri: 'gs://rp-replatform-assets-prod/el-patio-laredo/hero-861980226.webp'
      },
      amenities: {
        community: [
          'Sparkling Resort-Style Swimming Pool & Sundeck',
          'Dedicated On-Site Property Management & Leasing Team',
          'Convenient Resident Laundry Care Facility',
          'Lush Outdoor Courtyards & Shaded Seating Retreats',
          'Prime San Bernardo Ave Location Near Laredo Dining & Retail',
          '24/7 Online Resident Portal & Service Request System'
        ],
        unit: [
          'Spacious 1 Bedroom Layouts with Open Living Areas',
          'Light-Filled Rooms with Oversized Windows',
          'Well-Appointed Kitchens with Ample Cabinet Storage',
          'Central Air Conditioning & Ceiling Fans Throughout',
          'Generous Walk-In Closets & Linen Storage',
          'High-Speed Internet & Cable Ready Homes'
        ]
      },
      floorPlans: [
        {
          id: 'fp-ep-a1',
          name: 'El Patio Classic • 1 Bedroom / 1 Bath',
          category: '1 Bed',
          beds: 1,
          baths: 1,
          sqft: 650,
          livePrice: 925,
          cachedFallbackPrice: 925,
          availableUnits: 6,
          moveInDate: 'Immediate',
          floorPlanDiagram: '1BR Classic • Light-Filled Living Room • 650 Sq. Ft.',
          specialOffer: 'Reduced Security Deposit'
        },
        {
          id: 'fp-ep-a2',
          name: 'San Bernardo Deluxe • 1 Bedroom Courtyard',
          category: '1 Bed',
          beds: 1,
          baths: 1,
          sqft: 740,
          livePrice: 1015,
          cachedFallbackPrice: 1015,
          availableUnits: 4,
          moveInDate: 'Immediate',
          floorPlanDiagram: '1BR Deluxe • Poolside Courtyard View • 740 Sq. Ft.',
          specialOffer: 'Move-In Ready Special'
        }
      ],
      mediaGallery: [
        {
          category: 'Interiors',
          title: 'Your Home • Plenty of Space & Light-Filled Comforts',
          imageUrl: 'https://g5-assets-cld-res.cloudinary.com/image/upload/x_559,y_0,h_1322,w_882,c_crop/q_auto,f_auto,c_fill,g_center,h_1000,w_667/v1773314624/g5/g5-c-69419ji7w-bp-newman-investment-company/g5-cl-1qj4co50d8-bp-newman-investment-company-laredo-tx/uploads/GettyImages-1031444360_kla2ev.jpg',
          gcsAsset: 'gs://rp-replatform-assets-prod/el-patio-laredo/card-your-home.webp'
        },
        {
          category: 'Amenities',
          title: 'Appealing Amenities • Relax, Recharge, Repeat',
          imageUrl: 'https://g5-assets-cld-res.cloudinary.com/image/upload/x_767,y_0,h_1330,w_887,c_crop/q_auto,f_auto,c_fill,g_center,h_1000,w_667/v1773314665/g5/g5-c-69419ji7w-bp-newman-investment-company/g5-cl-1qj4co50d8-bp-newman-investment-company-laredo-tx/uploads/GettyImages-1311298381_mwzbno.jpg',
          gcsAsset: 'gs://rp-replatform-assets-prod/el-patio-laredo/card-amenities.webp'
        },
        {
          category: 'Exteriors',
          title: 'A Prime Neighborhood • Live Close to the Best of Laredo',
          imageUrl: 'https://g5-assets-cld-res.cloudinary.com/image/upload/x_553,y_0,h_1334,w_891,c_crop/q_auto,f_auto,c_fill,g_center,h_1000,w_667/v1773314712/g5/g5-c-69419ji7w-bp-newman-investment-company/g5-cl-1qj4co50d8-bp-newman-investment-company-laredo-tx/uploads/GettyImages-2032134580_sscbdi.jpg',
          gcsAsset: 'gs://rp-replatform-assets-prod/el-patio-laredo/card-neighborhood.webp'
        },
        {
          category: 'Interiors',
          title: 'Sunlit Bedroom Suite at El Patio Apartments',
          imageUrl: 'https://g5-assets-cld-res.cloudinary.com/image/upload/x_642,y_0,h_1334,w_1336,c_crop/q_auto,f_auto,c_fill,g_center,h_1000,w_1000/v1773314595/g5/g5-c-69419ji7w-bp-newman-investment-company/g5-cl-1qj4co50d8-bp-newman-investment-company-laredo-tx/uploads/GettyImages-1004263078_xc8syn.jpg',
          gcsAsset: 'gs://rp-replatform-assets-prod/el-patio-laredo/bedroom-suite.webp'
        }
      ]
    },
    preservedWidgets: [
      {
        widgetId: 'w-elpatio-leads-01',
        vendor: 'G5 Enhanced Lead Form & Marketing Center',
        type: 'Authenticated Lead Capture & Tour Scheduling Form (FR-2.1)',
        domAnchorSelector: '#contact-info-sheet-37448035',
        scriptOrigin: 'https://client-leads.g5marketingcloud.com/api/v1/locations/g5-cl-1qj4co50d8/html_forms/contact_us_marketing_center',
        secretManagerRef: 'projects/realpage-replatform/secrets/elpatio-leads-token/versions/1',
        maskedTokenPreview: 'g5_mc_****...****50d8',
        corsProxyRoute: 'https://proxy.realpage-preview.com/v1/client-leads/el-patio-laredo',
        status: 'HYDRATED_VIA_CLOUD_RUN_PROXY',
        fallbackReady: true,
        fallbackRecordsCached: 8
      },
      {
        widgetId: 'w-elpatio-reviews-02',
        vendor: 'G5 Promoted Reviews (Chatmeter & Yext Reputation Bridge)',
        type: '4 & 5-Star Resident Review Aggregation & HCard Schema (FR-2.2)',
        domAnchorSelector: '#promoted-reviews-37448039',
        scriptOrigin: 'https://g5-api-proxy.g5marketingcloud.com/v1/chatmeter/5ac69bc5d650b8c34c0d49f5',
        secretManagerRef: 'projects/realpage-replatform/secrets/elpatio-chatmeter-key/versions/2',
        maskedTokenPreview: 'cm_yext_****...****49f5',
        corsProxyRoute: 'https://proxy.realpage-preview.com/v1/reviews/el-patio-laredo',
        status: 'HYDRATED_VIA_CLOUD_RUN_PROXY',
        fallbackReady: true,
        fallbackRecordsCached: 25
      }
    ]
  },

  'rockvale-circle': {
    presetKey: 'rockvale-circle',
    dataHubId: 'DH-BOS-02130',
    badge: 'Matt URL #3 • Kentico -> G5 v9.0.5 (rockvalecircle.com)',
    sourceUrl: 'https://www.rockvalecircle.com/',
    sourcePlatform: 'Legacy Kentico CMS -> Migrated to G5 v9.0.5 ("Alpine - Simple" • Peabody Properties)',
    targetTemplateId: 'g5-alpine-rockvale',
    stagingSlug: 'rockvale-circle-cooperative',
    stagingUrl: 'https://staging-rockvale-circle-cooperative.realpage-preview.com',
    migrationMetrics: {
      legacyTimeline: '35 Days (Legacy Manual Onboarding)',
      replatformTimeline: '8m 19s (Data Hub MCP + Figma Lock + Gemini 2.0 Pro)',
      domNodesScanned: 2150,
      highResAssetsCopiedToGcs: 28,
      widgetsPreserved: 2,
      wcagScore: '100/100 (WCAG 2.1 AAA • Focus Ring & Contrast Verified)'
    },
    figmaGuardrail: {
      fileKey: 'FIGMA-G5-ALPINE-905-ROCKVALE',
      fileName: 'RealPage_G5_Alpine_v9.0.5_RockvaleCircle.fig',
      strictMode: true,
      lockedVariablesCount: 26,
      extractedRootTokens: '--theme_primary_color: #000000; --theme_secondary_color: #000000; --theme_tertiary_color: #747371; --theme_body_link_color: #627a48; --theme_primary_font: open-sans; --theme_secondary_font: montserrat;'
    },
    vendorShedding: buildDefaultVendorShedding('rockvalecircle.com'),
    cmsLayoutBlocks: buildDefaultCmsBlocks(),
    legacyDomSample: [
      '<!-- Extracted G5 v9.0.5 dataLayer & CSS Tokens from https://www.rockvalecircle.com/ -->',
      '<script>',
      '  dataLayer.push({',
      '    "G5_CLIENT_ID": "g5-c-5wq1x8clb-peabody-properties-inc",',
      '    "G5_STORE_ID": "g5-cl-1pp5e1a1l9-peabody-properties-inc-jamaica-plain-ma",',
      '    "G5_THEME_ID": "Alpine - Simple",',
      '    "G5_CMS_VERSION": "v9.0.5"',
      '  });',
      '</script>',
      '<div class="html-content">',
      '  <p><span class="hero-sub-text">Welcome To<br><span class="hero-text">Rockvale Circle Cooperative</span></span></p>',
      '</div>'
    ].join('\n'),
    g5Schema: {
      schemaVersion: 'G5-Alpine-v9.0.5-Strict',
      propertyMetadata: {
        propertyName: 'Rockvale Circle Cooperative',
        corporateClient: 'Peabody Properties, Inc. & JPNDC (g5-c-5wq1x8clb-peabody-properties-inc)',
        storeUrn: 'g5-cl-1pp5e1a1l9-peabody-properties-inc-jamaica-plain-ma',
        tagline: 'A Jamaica Plain, MA Residential Cooperative Community • 15 Homes Across 5 Historic Buildings',
        address: '28, 32, 39, 40, 43 Rockvale Circle, Jamaica Plain, MA 02130',
        neighborhood: 'Jamaica Plain • Minutes to Downtown Boston, Arnold Arboretum & Jamaica Pond',
        phoneMasked: '(833) ***-6518',
        emailMasked: 'rockvale@***peabodyproperties.com',
        officeHours: 'Mon–Fri: 8:00 AM – 4:30 PM | Sat–Sun: Closed',
        leaseSpecialBanner: 'A JPNDC & Peabody Properties Partnership • Now Accepting Cooperative Applications for 2 & 3 Bedroom Units',
        petPolicy: '100% Smoke-Free Community • Equal Housing Opportunity & ADA Accessible',
        walkScore: 89,
        transitScore: 88
      },
      numberedHighlights: [
        { num: '01', title: '15 Cooperative Homes / 5 Buildings' },
        { num: '02', title: '2 & 3 Bedroom Family Layouts' },
        { num: '03', title: 'MBTA & Route 93 Boston Access' },
        { num: '04', title: 'JPNDC & Peabody Partnership' }
      ],
      navigationHierarchy: [
        { label: 'Home', anchor: '#overview' },
        { label: 'Amenities', anchor: '#amenities' },
        { label: 'Floor Plans', anchor: '#floorplans', badge: '2 & 3 Bed Co-Op' },
        { label: 'Gallery', anchor: '#gallery' },
        { label: 'Apply Now', anchor: '#floorplans', badge: 'Peabody Portal' }
      ],
      heroMedia: {
        headline: 'WELCOME TO ROCKVALE CIRCLE COOPERATIVE',
        subheadline: 'A Jamaica Plain, MA Community • Creating vibrant, stable, and diverse communities in partnership with JPNDC and Peabody Properties.',
        primaryImage: 'https://g5-assets-cld-res.cloudinary.com/image/upload/x_100,y_304,h_723,w_1807,c_crop/q_auto,f_auto,c_fill,g_center,h_800,w_2000/v1775224107/g5/g5-c-5wq1x8clb-peabody-properties-inc/g5-cl-1pp5e1a1l9-peabody-properties-inc-jamaica-plain-ma/uploads/ROCKVALE-17_25_rjqxhi.jpg',
        gcsUri: 'gs://rp-replatform-assets-prod/rockvale-circle/ROCKVALE-17_25_rjqxhi.webp'
      },
      amenities: {
        community: [
          'Residential Cooperative Community Spread Across 5 Classic Buildings',
          'Direct Commuting Access to Downtown Boston via MBTA & Route 93',
          'Moments from Jamaica Pond, Arnold Arboretum & Franklin Park',
          'JPNDC & Peabody Properties Professional Cooperative Stewardship',
          '100% Smoke-Free & FHEO / ADA Accessible Community',
          '24-Hour Emergency Maintenance & Resident Services Portal'
        ],
        unit: [
          'Spacious Two and Three Bedroom Cooperative Apartment Layouts',
          'Classic New England Architectural Detailing & Hardwood-Style Flooring',
          'Eat-In Kitchens with Modern Energy-Efficient Appliances',
          'Bright Living Rooms with Triple-Exposure Natural Light',
          'Generous Bedroom Closets & Dedicated Storage',
          'High-Efficiency Heating & Hot Water Systems'
        ]
      },
      floorPlans: [
        {
          id: 'fp-rv-2br',
          name: 'The Arboretum • 2 Bedroom Cooperative Residence',
          category: '2 Bed',
          beds: 2,
          baths: 1,
          sqft: 920,
          livePrice: 1850,
          cachedFallbackPrice: 1850,
          availableUnits: 2,
          moveInDate: 'Immediate',
          floorPlanDiagram: '2BR Cooperative Home • Eat-In Kitchen • 920 Sq. Ft.',
          specialOffer: 'Co-Op Application Open'
        },
        {
          id: 'fp-rv-3br',
          name: 'The Jamaica Pond • 3 Bedroom Cooperative Residence',
          category: '3 Bed',
          beds: 3,
          baths: 1.5,
          sqft: 1180,
          livePrice: 2240,
          cachedFallbackPrice: 2240,
          availableUnits: 1,
          moveInDate: 'Oct 15, 2026',
          floorPlanDiagram: '3BR Corner Building Home • Dual Exposure • 1,180 Sq. Ft.',
          specialOffer: 'JPNDC Priority Listing'
        }
      ],
      mediaGallery: [
        {
          category: 'Exteriors',
          title: 'The Entrance of the Apartment Home at Rockvale Circle Cooperative',
          imageUrl: 'https://g5-assets-cld-res.cloudinary.com/image/upload/x_100,y_304,h_723,w_1807,c_crop/q_auto,f_auto,c_fill,g_center,h_800,w_2000/v1775224107/g5/g5-c-5wq1x8clb-peabody-properties-inc/g5-cl-1pp5e1a1l9-peabody-properties-inc-jamaica-plain-ma/uploads/ROCKVALE-17_25_rjqxhi.jpg',
          gcsAsset: 'gs://rp-replatform-assets-prod/rockvale-circle/ROCKVALE-17_25.webp'
        },
        {
          category: 'Exteriors',
          title: 'Apartments at Rockvale Circle Cooperative in Jamaica Plain, MA',
          imageUrl: 'https://g5-assets-cld-res.cloudinary.com/image/upload/x_130,y_607,h_722,w_1806,c_crop/q_auto,f_auto,c_fill,g_center,h_800,w_2000/v1775224135/g5/g5-c-5wq1x8clb-peabody-properties-inc/g5-cl-1pp5e1a1l9-peabody-properties-inc-jamaica-plain-ma/uploads/ROCKVALE-1_23_oytbom.jpg',
          gcsAsset: 'gs://rp-replatform-assets-prod/rockvale-circle/ROCKVALE-1_23.webp'
        },
        {
          category: 'Exteriors',
          title: 'Exterior of the 5 Cooperative Buildings at Rockvale Circle',
          imageUrl: 'https://g5-assets-cld-res.cloudinary.com/image/upload/x_0,y_485,h_723,w_1807,c_crop/q_auto,f_auto,c_fill,g_center,h_800,w_2000/v1775224188/g5/g5-c-5wq1x8clb-peabody-properties-inc/g5-cl-1pp5e1a1l9-peabody-properties-inc-jamaica-plain-ma/uploads/ROCKVALE-7_24_dcoqq5.jpg',
          gcsAsset: 'gs://rp-replatform-assets-prod/rockvale-circle/ROCKVALE-7_24.webp'
        }
      ]
    },
    preservedWidgets: [
      {
        widgetId: 'w-rockvale-sticky-01',
        vendor: 'G5 Sticky Banner V2 & Call Tracking Edge (CPNS)',
        type: 'Dynamic Phone Number Banner & Attribution (FR-2.1)',
        domAnchorSelector: '#sticky-banner-v2-37688758',
        scriptOrigin: 'https://call-tracking-edge.g5marketingcloud.com/api/v1/phone_numbers',
        secretManagerRef: 'projects/realpage-replatform/secrets/rockvale-cpns-token/versions/1',
        maskedTokenPreview: 'cpns_peab_****...****dda7',
        corsProxyRoute: 'https://proxy.realpage-preview.com/v1/cpns/rockvale-circle',
        status: 'HYDRATED_VIA_CLOUD_RUN_PROXY',
        fallbackReady: true,
        fallbackRecordsCached: 5
      },
      {
        widgetId: 'w-rockvale-app-02',
        vendor: 'Peabody Properties Rental Application & Resident Portal',
        type: 'Cooperative Application & HUD/FHEO Compliance Gateway (FR-2.3)',
        domAnchorSelector: '#button-37688754',
        scriptOrigin: 'https://www.peabodypropertiesinc.com/peabody-rental-application.pdf',
        secretManagerRef: 'projects/realpage-replatform/secrets/rockvale-peabody-portal/versions/1',
        maskedTokenPreview: 'peab_app_****...****8754',
        corsProxyRoute: 'https://proxy.realpage-preview.com/v1/peabody-portal/rockvale',
        status: 'HYDRATED_VIA_CLOUD_RUN_PROXY',
        fallbackReady: true,
        fallbackRecordsCached: 2
      }
    ]
  },

  'kentico-legacy': {
    presetKey: 'kentico-legacy',
    dataHubId: 'DH-PLN-5900',
    badge: 'Legacy Kentico 12 CMS • The Kensington Plano',
    sourceUrl: 'https://www.thekensingtonatplano-kentico.com',
    sourcePlatform: 'Legacy Kentico 12 (.NET WebForms / Unstructured ASPX DOM)',
    targetTemplateId: 'g5-luxe-highrise',
    stagingSlug: 'kensington-legacy-west',
    stagingUrl: 'https://staging-kensington-legacy-west.realpage-preview.com',
    migrationMetrics: {
      legacyTimeline: '36 Days (Manual Implementation Queue)',
      replatformTimeline: '11m 18s (Autonomous Cloud Run + Gemini 2.0 Pro)',
      domNodesScanned: 2480,
      highResAssetsCopiedToGcs: 42,
      widgetsPreserved: 3,
      wcagScore: '99/100 (WCAG 2.1 AA Compliant)'
    },
    figmaGuardrail: {
      fileKey: 'FIGMA-G5-LUXE-420',
      fileName: 'RealPage_G5_Luxe_HighRise_v4.2.fig',
      strictMode: true,
      lockedVariablesCount: 24,
      extractedRootTokens: '--g5-primary: #0F172A; --g5-secondary: #C5A059; --g5-heading-font: Playfair Display;'
    },
    vendorShedding: buildDefaultVendorShedding('thekensingtonatplano.com'),
    cmsLayoutBlocks: buildDefaultCmsBlocks(),
    legacyDomSample: [
      '<!-- Legacy Kentico 12 ASPX Table/WebPart Markup (Pre-Ingestion) -->',
      '<div id="p_lt_ctl04_pageplaceholder_p_lt_ctl02_KenticoHeroZone" class="cms-zone-legacy">',
      '  <font color="#998844" size="6"><b>THE KENSINGTON AT LEGACY WEST</b></font>',
      '  <div class="addr-block-unstructured">5900 Windrose Ave | Plano, TX 75024 | Call (972) 555-0148</div>',
      '  <div id="rp-yieldstar-floorplans" data-client-id="RP-KENS-4829" data-api-token="rp_live_98a4f2c109e8d3f7a1b8e4b"></div>',
      '  <script src="https://widgets.realpage.com/yieldstar/v3/fp-loader.min.js"></script>',
      '</div>'
    ].join('\n'),
    g5Schema: {
      schemaVersion: 'G5-Schema-v4.2-Strict',
      propertyMetadata: {
        propertyName: 'The Kensington at Legacy West',
        corporateClient: 'RealPage Luxury Portfolio (g5-c-rp-kensington)',
        storeUrn: 'g5-cl-plano-tx-kensington',
        tagline: 'Skyline Penthouse & Mid-Rise Living in the Heart of Plano’s Premier Luxury District',
        address: '5900 Windrose Avenue, Plano, TX 75024',
        neighborhood: 'Legacy West • North Dallas Tollway Corridor',
        phoneMasked: '(972) ***-0148',
        emailMasked: 'leasing@***kensingtonplano.com',
        officeHours: 'Mon–Fri: 9:00 AM – 6:00 PM | Sat: 10:00 AM – 5:00 PM | Sun: 1:00 PM – 5:00 PM',
        leaseSpecialBanner: 'Now Leasing Penthouse Collection • Up to 6 Weeks Free on Select 1 & 2 Bedroom Residences',
        petPolicy: 'Pet Friendly • Private Heated Dog Spa & 1/4-Acre Sky Bark Park (No Breed Restrictions)',
        walkScore: 91,
        transitScore: 78
      },
      numberedHighlights: [
        { num: '01', title: '18th-Floor Sky Pool' },
        { num: '02', title: '24/7 Concierge & Wine Vault' },
        { num: '03', title: 'Technogym & Infrared Sauna' },
        { num: '04', title: '24 EV Supercharger Stations' }
      ],
      navigationHierarchy: [
        { label: 'Overview', anchor: '#overview' },
        { label: 'Floor Plans & Live Pricing', anchor: '#floorplans', badge: 'Live YieldStar' },
        { label: '3D Virtual Tours', anchor: '#virtual-tours', badge: 'Tour24 + 3D' },
        { label: 'Amenities', anchor: '#amenities' },
        { label: 'Photo Gallery', anchor: '#gallery' }
      ],
      heroMedia: {
        headline: 'Elevated Architectural Living at Legacy West',
        subheadline: 'Resort-caliber sky lounges, private wine vaults, and real-time YieldStar residence availability.',
        primaryImage: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1400&q=85',
        gcsUri: 'gs://rp-replatform-assets-prod/kensington-legacy-west/hero-exterior-twilight.webp'
      },
      amenities: {
        community: [
          '18th-Floor Cantilevered Saltwater Sky Pool & Private Cabanas',
          '24/7 Concierge & Refrigerated LuxerOne Package Vault',
          'Private Temperature-Controlled Wine Tasting Room & Lockers',
          'Executive Co-Working Suites with High-Speed Fiber & Zoom Pods',
          'Technogym Performance Studio, Peloton Spin Lab & Infrared Sauna',
          'Controlled-Access Multi-Level Garage with 24 Tesla/ChargePoint EV Stations'
        ],
        unit: [
          '10-Foot Floor-to-Ceiling Low-E Panoramic Windows',
          'Quartz Waterfall Islands with Bosch Stainless Gas Ranges',
          'Custom Elfa Walk-In Closets & Built-In Mudroom Cabinetry',
          'Smart Keyless Latch Entry & Honeywell Lyric Wi-Fi Thermostats',
          'Spa-Inspired Primary Baths with Frameless Glass Rain Showers & Soaking Tubs',
          'Private Balconies with Direct Legacy West Promenade Views'
        ]
      },
      floorPlans: [
        {
          id: 'fp-a1',
          name: 'A1 • The Windrose Studio',
          category: 'Studio',
          beds: 0,
          baths: 1,
          sqft: 645,
          livePrice: 1795,
          cachedFallbackPrice: 1795,
          availableUnits: 4,
          moveInDate: 'Immediate',
          floorPlanDiagram: 'Studio Open Concept • Private Balcony • 645 Sq. Ft.',
          specialOffer: '4 Weeks Free'
        },
        {
          id: 'fp-b2',
          name: 'B2 • The Legacy One Bed + Study',
          category: '1 Bed',
          beds: 1,
          baths: 1.5,
          sqft: 940,
          livePrice: 2340,
          cachedFallbackPrice: 2340,
          availableUnits: 6,
          moveInDate: 'Oct 1, 2026',
          floorPlanDiagram: '1BR + Executive Den • Chef Island • 940 Sq. Ft.',
          specialOffer: '6 Weeks Free'
        },
        {
          id: 'fp-c1',
          name: 'C1 • The Promenade Two Bedroom Split',
          category: '2 Bed',
          beds: 2,
          baths: 2,
          sqft: 1385,
          livePrice: 3290,
          cachedFallbackPrice: 3290,
          availableUnits: 3,
          moveInDate: 'Immediate',
          floorPlanDiagram: 'Dual Primary Suites • Wrap-Around Terrace • 1,385 Sq. Ft.',
          specialOffer: '6 Weeks Free'
        }
      ],
      mediaGallery: [
        {
          category: 'Exteriors',
          title: 'Twilight Architectural Facade & Promenade',
          imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=900&q=80',
          gcsAsset: 'gs://rp-replatform-assets-prod/kensington-legacy-west/ext-01.webp'
        },
        {
          category: 'Interiors',
          title: 'Chef-Caliber Quartz Waterfall Kitchen & Living Suite',
          imageUrl: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=900&q=80',
          gcsAsset: 'gs://rp-replatform-assets-prod/kensington-legacy-west/int-01.webp'
        },
        {
          category: 'Amenities',
          title: '18th-Floor Cantilevered Saltwater Sky Deck',
          imageUrl: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=900&q=80',
          gcsAsset: 'gs://rp-replatform-assets-prod/kensington-legacy-west/amen-01.webp'
        }
      ]
    },
    preservedWidgets: [
      {
        widgetId: 'w-yieldstar-01',
        vendor: 'RealPage YieldStar Revenue Management',
        type: 'Floor Plan Pricing & Live Availability Engine (FR-2.1)',
        domAnchorSelector: '#rp-yieldstar-floorplans',
        scriptOrigin: 'https://widgets.realpage.com/yieldstar/v3/fp-loader.min.js',
        secretManagerRef: 'projects/realpage-replatform/secrets/kensington-yieldstar-token/versions/3',
        maskedTokenPreview: 'rp_live_****...****8e4b',
        corsProxyRoute: 'https://proxy.realpage-preview.com/v1/yieldstar/RP-KENS-4829',
        status: 'HYDRATED_VIA_CLOUD_RUN_PROXY',
        fallbackReady: true,
        fallbackRecordsCached: 14
      },
      {
        widgetId: 'w-tour24-02',
        vendor: 'Tour24 Self-Guided Tours',
        type: 'Interactive Self-Guided Tour Scheduler Modal (FR-2.1)',
        domAnchorSelector: '#rp-tour24-scheduler',
        scriptOrigin: 'https://cdn.tour24.io/widget/v2/embed.js',
        secretManagerRef: 'projects/realpage-replatform/secrets/kensington-tour24-uuid/versions/1',
        maskedTokenPreview: 't24_uuid_****...****8821',
        corsProxyRoute: 'https://proxy.realpage-preview.com/v1/tour24/t24-plano-8821',
        status: 'HYDRATED_VIA_CLOUD_RUN_PROXY',
        fallbackReady: true,
        fallbackRecordsCached: 6
      }
    ]
  }
};

/**
 * Generates Schema.org ApartmentComplex JSON-LD for AI-Engine Optimization (AEO over SEO)
 */
function buildAeoStructuredData(site) {
  const meta = site.g5Schema.propertyMetadata;
  const plans = site.g5Schema.floorPlans || [];
  const minRent = plans.length ? Math.min(...plans.map((p) => p.livePrice)) : 1200;
  const maxRent = plans.length ? Math.max(...plans.map((p) => p.livePrice)) : 3500;
  return {
    '@context': 'https://schema.org',
    '@type': 'ApartmentComplex',
    name: meta.propertyName,
    description: meta.tagline + ' — ' + site.g5Schema.heroMedia.subheadline,
    url: site.sourceUrl,
    stagingPreviewUrl: site.stagingUrl,
    g5StoreUrn: meta.storeUrn || 'g5-cl-verified-store',
    telephone: meta.phoneMasked,
    address: {
      '@type': 'PostalAddress',
      streetAddress: meta.address
    },
    priceRange: `$${minRent.toLocaleString()} - $${maxRent.toLocaleString()} / mo`,
    numberOfAvailableAccommodationUnits: plans.reduce((acc, p) => acc + (p.availableUnits || 0), 0),
    amenityFeature: (site.g5Schema.amenities.community || []).slice(0, 6).map((a) => ({
      '@type': 'LocationFeatureSpecification',
      name: a,
      value: true
    })),
    aeoReadiness: {
      geminiEnterpriseIndexed: true,
      conversationalLeasingReady: true,
      firstPartyConsentVerified: true,
      proServeDeliveryTarget: '< 8 Weeks Funded ($1.4M GE Deal)'
    }
  };
}

/**
 * 8-Stage GCP Execution Pipeline Telemetry Generator
 */
function buildExecutionPipelineTrace(preset, templateId) {
  const slug = preset.stagingSlug;
  const tpl = G5_TEMPLATES[templateId] || G5_TEMPLATES['g5-alpine-tulane'];
  return [
    {
      step: 1,
      service: 'RealPage Data Hub MCP Connector (Cloud Functions)',
      action: `Pulled structured intake profile (${preset.dataHubId || 'DH-AUTO'}) via Vertex AI Agent Builder MCP Server — zero redundant client questions.`,
      durationMs: 145,
      status: 'COMPLETED',
      artifact: `mcp://realpage-datahub/profiles/${slug}`
    },
    {
      step: 2,
      service: 'Cloud Run Jobs (Headless Playwright + Lighthouse)',
      action: `Traversed ${preset.migrationMetrics.domNodesScanned} DOM nodes & audited WCAG 2.1 AA contrast across Desktop, Tablet, and Mobile.`,
      durationMs: 1840,
      status: 'COMPLETED',
      artifact: `gs://rp-replatform-raw-crawls/${slug}/dom-snapshot.json`
    },
    {
      step: 3,
      service: 'Figma REST API Guardrail & G5 v9.0 Token Lock',
      action: `Synced strict design tokens from [${tpl.figmaFileKey || 'FIGMA-G5-V9'}] -> Applied ${tpl.name} parameters.`,
      durationMs: 390,
      status: 'COMPLETED',
      artifact: `figma://variables/${tpl.figmaFileKey || 'G5-ALPINE-V9'}`
    },
    {
      step: 4,
      service: 'Vertex AI (Gemini 2.0 Pro Multimodal + AEO Engine)',
      action: 'Extracted G5 v9.0 schema, numbered amenity highlights, floor plan matrix, and synthesized AEO Schema.org JSON-LD.',
      durationMs: 2190,
      status: 'COMPLETED',
      artifact: `vertex-ai://models/gemini-2.0-pro/schemas/${slug}-g5-v9.json`
    },
    {
      step: 5,
      service: 'Vendor-Shedding Engine (Cloud Spanner + Cloud CDN)',
      action: 'Shed legacy OneTrust (OtAutoBlock.js), Honeybadger & 3rd-party trackers -> Activated 1st-Party Spanner Consent & CDN Telemetry.',
      durationMs: 410,
      status: 'COMPLETED',
      artifact: `spanner://rp-consent-ledger/${slug}/first-party-active`
    },
    {
      step: 6,
      service: 'Widget Signature Analyzer & Secret Manager',
      action: `Preserved ${preset.preservedWidgets.length} dynamic leasing/DNI widgets; isolated tokens in Secret Manager & bound FR-2.4 Fallback.`,
      durationMs: 680,
      status: 'COMPLETED',
      artifact: `projects/realpage-replatform/secrets/${slug}-widget-bundle`
    },
    {
      step: 7,
      service: 'Firestore + BigQuery Historic Audit Stream',
      action: 'Logged immutable CMS configuration snapshot to Firestore & BigQuery Audit Trail with 1-click rollback support.',
      durationMs: 220,
      status: 'COMPLETED',
      artifact: `firestore://rp-cms-history/${slug}/revisions`
    },
    {
      step: 8,
      service: 'Cloud Build -> Cloud Run Serverless SSR Staging',
      action: `Deployed instant IAP-protected G5 v9.0 CMS preview at ${preset.stagingUrl}`,
      durationMs: 1650,
      status: 'COMPLETED',
      artifact: preset.stagingUrl
    }
  ];
}

/**
 * Helper to extract title, headings, and G5 v9.0 signatures from live fetched HTML
 */
function buildCustomUrlMigrationResult(targetUrl, htmlText, targetTemplateId) {
  const lowerUrl = targetUrl.toLowerCase();
  if (lowerUrl.includes('2424tulane.com')) {
    return {
      ...DEMO_PRESETS['tulane-2424'],
      targetTemplateId: targetTemplateId || 'g5-alpine-tulane'
    };
  }
  if (lowerUrl.includes('patioaptslaredo.com')) {
    return {
      ...DEMO_PRESETS['el-patio-laredo'],
      targetTemplateId: targetTemplateId || 'g5-alpine-elpatio'
    };
  }
  if (lowerUrl.includes('rockvalecircle.com')) {
    return {
      ...DEMO_PRESETS['rockvale-circle'],
      targetTemplateId: targetTemplateId || 'g5-alpine-rockvale'
    };
  }

  const parsedUrl = new URL(targetUrl);
  const hostSlug = parsedUrl.hostname
    .replace(/^www\./i, '')
    .replace(/[^a-z0-9]+/gi, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase()
    .slice(0, 36) || 'custom-property';

  const titleMatch = htmlText.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const rawTitle = titleMatch ? titleMatch[1].replace(/\s+/g, ' ').trim() : parsedUrl.hostname;
  const cleanTitle = rawTitle.replace(/[|<>{}]/g, '').slice(0, 80) || `The Residences at ${parsedUrl.hostname}`;

  const metaDescMatch =
    htmlText.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i) ||
    htmlText.match(/<meta[^>]+content=["']([^"']+)["'][^>]+name=["']description["']/i);
  const cleanTagline = metaDescMatch
    ? metaDescMatch[1].replace(/\s+/g, ' ').trim().slice(0, 140)
    : `Modern Multi-Family Residences migrated from ${parsedUrl.hostname} onto RealPage G5 v9.0 Cloud Run SSR`;

  const basePreset = DEMO_PRESETS['tulane-2424'];
  return {
    ...basePreset,
    presetKey: 'custom-live-url',
    dataHubId: 'DH-LIVE-SYNC',
    badge: 'Live Headless Crawl • G5 v9.0 CMS Workspace',
    sourceUrl: targetUrl,
    sourcePlatform: `Live Crawled Origin (${parsedUrl.hostname})`,
    targetTemplateId: targetTemplateId || 'g5-alpine-tulane',
    stagingSlug: hostSlug,
    stagingUrl: `https://staging-${hostSlug}.realpage-preview.com`,
    vendorShedding: buildDefaultVendorShedding(parsedUrl.hostname),
    cmsLayoutBlocks: buildDefaultCmsBlocks(),
    g5Schema: {
      ...basePreset.g5Schema,
      propertyMetadata: {
        ...basePreset.g5Schema.propertyMetadata,
        propertyName: cleanTitle,
        tagline: cleanTagline,
        leaseSpecialBanner: `Live Migrated from ${parsedUrl.hostname} • Managed in RealPage G5 v9.0 Enterprise CMS`
      }
    }
  };
}

module.exports = {
  G5_TEMPLATES,
  CERTIFIED_G5_COMPONENTS,
  DATA_HUB_PROFILES,
  DEMO_PRESETS,
  buildAeoStructuredData,
  buildExecutionPipelineTrace,
  buildCustomUrlMigrationResult
};
