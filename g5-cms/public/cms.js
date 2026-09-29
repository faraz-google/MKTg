'use strict';

(function () {
  const state = {
    csrfToken: '',
    role: '',
    designSystems: {},
    stripeCatalog: [],
    dataHubRecords: {},
    properties: [],
    activeSite: null,
    activeBedroomFilter: 'All',
    activeModule: 'mod-split-studio'
  };

  /**
   * Safe DOM element constructor using strictly createElement, setAttribute, textContent, and appendChild.
   * Zero usage of innerHTML, outerHTML, insertAdjacentHTML, or document.write.
   */
  function el(tag, attrs, children) {
    const node = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach((k) => {
        const val = attrs[k];
        if (val === undefined || val === null) return;
        if (k === 'className') {
          node.className = String(val);
        } else if (k === 'text') {
          node.textContent = String(val);
        } else if (k === 'styleObj' && typeof val === 'object') {
          Object.keys(val).forEach((prop) => {
            node.style[prop] = String(val[prop]);
          });
        } else if (k.startsWith('on') && typeof val === 'function') {
          node.addEventListener(k.slice(2).toLowerCase(), val);
        } else if (k === 'checked') {
          node.checked = Boolean(val);
        } else if (k === 'value') {
          node.value = String(val);
        } else {
          node.setAttribute(k, String(val));
        }
      });
    }
    if (Array.isArray(children)) {
      children.forEach((child) => {
        if (!child) return;
        if (typeof child === 'string' || typeof child === 'number') {
          node.appendChild(document.createTextNode(String(child)));
        } else {
          node.appendChild(child);
        }
      });
    }
    return node;
  }

  function showToast(msg) {
    const container = document.getElementById('cms-toast-container');
    if (!container) return;
    const toast = el('div', { className: 'cms-toast', text: msg });
    container.appendChild(toast);
    setTimeout(() => {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 3800);
  }

  function openModal(title, bodyNode) {
    const backdrop = document.getElementById('cms-modal-backdrop');
    const titleEl = document.getElementById('cms-modal-title');
    const bodyEl = document.getElementById('cms-modal-body');
    if (!backdrop || !titleEl || !bodyEl) return;
    titleEl.textContent = title;
    bodyEl.replaceChildren(bodyNode);
    backdrop.classList.remove('hidden');
  }

  function closeModal() {
    const backdrop = document.getElementById('cms-modal-backdrop');
    if (backdrop) backdrop.classList.add('hidden');
  }

  async function refreshSession() {
    const resp = await fetch('/api/cms/bootstrap', { credentials: 'same-origin' });
    if (resp.ok) {
      const data = await resp.json();
      if (data && data.csrfToken) state.csrfToken = data.csrfToken;
    }
  }

  async function apiPost(endpoint, payload) {
    if (!state.csrfToken) {
      await refreshSession();
    }
    let resp = await fetch(endpoint, {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': state.csrfToken
      },
      body: JSON.stringify(payload)
    });
    if (resp.status === 403) {
      await refreshSession();
      resp = await fetch(endpoint, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': state.csrfToken
        },
        body: JSON.stringify(payload)
      });
    }
    const data = await resp.json();
    if (!resp.ok) {
      throw new Error(data.error || 'CMS API request failed');
    }
    return data;
  }

  function updateSiteInState(updatedSite) {
    state.activeSite = updatedSite;
    const idx = state.properties.findIndex((p) => p.slug === updatedSite.slug);
    if (idx > -1) {
      state.properties[idx] = updatedSite;
    } else {
      state.properties.unshift(updatedSite);
    }
    renderAll();
  }

  function applyFigmaTokensToRoot(designSystemId) {
    const ds = state.designSystems[designSystemId] || Object.values(state.designSystems)[0];
    if (!ds || !ds.tokens) return;
    const root = document.documentElement;
    root.style.setProperty('--g5-primary', ds.tokens.primaryColor);
    root.style.setProperty('--g5-secondary', ds.tokens.secondaryColor);
    root.style.setProperty('--g5-accent', ds.tokens.accentColor);
    root.style.setProperty('--g5-tertiary', ds.tokens.tertiaryColor);
    root.style.setProperty('--g5-surface', ds.tokens.surfaceColor);
    root.style.setProperty('--g5-muted-surface', ds.tokens.mutedSurfaceColor);
    root.style.setProperty('--g5-text-primary', ds.tokens.textPrimary);
    root.style.setProperty('--g5-text-secondary', ds.tokens.textSecondary);
    root.style.setProperty('--g5-heading-font', ds.tokens.headingFont);
    root.style.setProperty('--g5-body-font', ds.tokens.bodyFont);
    root.style.setProperty('--g5-radius', ds.tokens.borderRadius);
    root.style.setProperty('--g5-arch-radius', ds.tokens.archCardRadius || '14px');
  }

  function renderHeaderStats() {
    if (!state.activeSite) return;
    const revEl = document.getElementById('header-active-revision');
    const lhEl = document.getElementById('header-lighthouse-score');
    const latestRev =
      state.activeSite.auditHistory && state.activeSite.auditHistory[0]
        ? state.activeSite.auditHistory[0].revisionId
        : 'v1.0';
    if (revEl) revEl.textContent = latestRev + ' (' + state.activeSite.auditHistory.length + ' snaps)';
    if (lhEl) {
      const vs = state.activeSite.vendorShedding;
      const score = vs.shedActive ? vs.gcpNativeLighthouseScore : vs.legacyLighthouseScore;
      lhEl.textContent = score + ' / 100 AA';
      lhEl.style.color = vs.shedActive ? '#34d399' : '#fbbf24';
    }
  }

  function renderSidebarProperties() {
    const listEl = document.getElementById('cms-property-list');
    if (!listEl) return;
    const buttons = state.properties.map((prop) => {
      const isActive = state.activeSite && state.activeSite.slug === prop.slug;
      return el(
        'button',
        {
          type: 'button',
          className: isActive ? 'cms-prop-btn active' : 'cms-prop-btn',
          onClick: () => {
            state.activeSite = prop;
            state.activeBedroomFilter = 'All';
            renderAll();
            showToast('Switched CMS workspace to ' + prop.propertyMetadata.propertyName);
          }
        },
        [
          el('div', { className: 'cms-prop-badge', text: prop.badge }),
          el('div', { className: 'cms-prop-name', text: prop.propertyMetadata.propertyName }),
          el('div', { className: 'cms-prop-url', text: prop.sourceUrl + ' • ' + prop.dataHubId })
        ]
      );
    });
    listEl.replaceChildren(...buttons);
  }

  function renderSidebarFigmaPanel() {
    const selectEl = document.getElementById('sidebar-design-system-select');
    const swatchEl = document.getElementById('figma-token-swatches');
    if (!selectEl || !swatchEl || !state.activeSite) return;

    const options = Object.values(state.designSystems).map((ds) =>
      el('option', { value: ds.id, text: ds.name + ' (' + ds.figmaFileKey + ')' })
    );
    selectEl.replaceChildren(...options);
    selectEl.value = state.activeSite.designSystemId;

    const activeDs = state.designSystems[state.activeSite.designSystemId];
    if (!activeDs) return;
    const swatches = [
      ['Primary', activeDs.tokens.primaryColor],
      ['Secondary', activeDs.tokens.secondaryColor],
      ['Accent', activeDs.tokens.accentColor],
      ['Surface', activeDs.tokens.mutedSurfaceColor]
    ].map(([label, hex]) =>
      el('div', { className: 'cms-swatch-item' }, [
        el('span', { className: 'cms-swatch-dot', styleObj: { backgroundColor: hex } }),
        el('div', {}, [
          el('div', { styleObj: { fontWeight: '700', color: '#fff' }, text: label }),
          el('div', { styleObj: { color: '#94a3b8' }, text: hex })
        ])
      ])
    );
    swatchEl.replaceChildren(...swatches);
  }

  /**
   * MODULE 1 LEFT PANE: Visual Page Builder Stripe Stack & Property Metadata Form
   */
  function renderVisualPageBuilder() {
    const stripeListEl = document.getElementById('stripe-stack-list');
    const addStripeSelect = document.getElementById('add-stripe-select');
    const formContainer = document.getElementById('metadata-editor-form');
    if (!stripeListEl || !formContainer || !state.activeSite) return;

    const site = state.activeSite;
    const stripes = site.pageStripes || [];

    const stripeNodes = stripes.map((stripe, idx) =>
      el(
        'div',
        { className: stripe.enabled ? 'cms-stripe-item' : 'cms-stripe-item disabled' },
        [
          el('label', { className: 'cms-stripe-left' }, [
            el('input', {
              type: 'checkbox',
              checked: stripe.enabled,
              onChange: async (ev) => {
                const cloned = JSON.parse(JSON.stringify(stripes));
                cloned[idx].enabled = ev.target.checked;
                try {
                  const resp = await apiPost('/api/cms/blocks/update', {
                    slug: site.slug,
                    pageStripes: cloned
                  });
                  updateSiteInState(resp.site);
                  showToast(
                    (cloned[idx].enabled ? 'Enabled ' : 'Hidden ') +
                      cloned[idx].componentId +
                      ' (' +
                      resp.revision.revisionId +
                      ')'
                  );
                } catch (err) {
                  showToast(err.message);
                }
              }
            }),
            el('div', {}, [
              el('div', { styleObj: { fontWeight: '700', color: '#f8fafc' }, text: stripe.componentId }),
              el('div', { styleObj: { fontSize: '0.68rem', color: '#94a3b8' }, text: stripe.label })
            ])
          ]),
          el('div', { className: 'cms-stripe-actions' }, [
            el('button', {
              type: 'button',
              className: 'cms-btn cms-btn-ghost cms-btn-sm',
              text: '↑',
              title: 'Move Stripe Up',
              onClick: async () => {
                if (idx === 0) return;
                const cloned = JSON.parse(JSON.stringify(stripes));
                const tmp = cloned[idx - 1];
                cloned[idx - 1] = cloned[idx];
                cloned[idx] = tmp;
                const resp = await apiPost('/api/cms/blocks/update', {
                  slug: site.slug,
                  pageStripes: cloned
                });
                updateSiteInState(resp.site);
                showToast('Moved ' + stripe.componentId + ' up (' + resp.revision.revisionId + ')');
              }
            }),
            el('button', {
              type: 'button',
              className: 'cms-btn cms-btn-ghost cms-btn-sm',
              text: '↓',
              title: 'Move Stripe Down',
              onClick: async () => {
                if (idx === stripes.length - 1) return;
                const cloned = JSON.parse(JSON.stringify(stripes));
                const tmp = cloned[idx + 1];
                cloned[idx + 1] = cloned[idx];
                cloned[idx] = tmp;
                const resp = await apiPost('/api/cms/blocks/update', {
                  slug: site.slug,
                  pageStripes: cloned
                });
                updateSiteInState(resp.site);
                showToast('Moved ' + stripe.componentId + ' down (' + resp.revision.revisionId + ')');
              }
            })
          ])
        ]
      )
    );
    stripeListEl.replaceChildren(...stripeNodes);

    if (addStripeSelect) {
      const catOptions = state.stripeCatalog.map((c) =>
        el('option', { value: c.componentId, text: c.componentId + ' — ' + c.name })
      );
      addStripeSelect.replaceChildren(...catOptions);
    }

    // Metadata & Hero Editor Form
    const meta = site.propertyMetadata;
    const hero = site.heroMedia;
    const highlights = site.numberedHighlights || [];

    const propNameInput = el('input', { className: 'cms-input', type: 'text', value: meta.propertyName });
    const taglineInput = el('input', { className: 'cms-input', type: 'text', value: meta.tagline });
    const bannerInput = el('input', { className: 'cms-input', type: 'text', value: meta.leaseSpecialBanner });
    const popTitleInput = el('input', { className: 'cms-input', type: 'text', value: meta.featuredPopOutTitle || '' });
    const popBodyInput = el('textarea', { className: 'cms-textarea', text: meta.featuredPopOutBody || '' });
    const heroH1Input = el('input', { className: 'cms-input', type: 'text', value: hero.headline });
    const heroSubInput = el('textarea', { className: 'cms-textarea', text: hero.subheadline });
    const heroImgInput = el('input', { className: 'cms-input', type: 'url', value: hero.primaryImage });
    const addressInput = el('input', { className: 'cms-input', type: 'text', value: meta.address });
    const hoursInput = el('input', { className: 'cms-input', type: 'text', value: meta.officeHours });
    const petInput = el('input', { className: 'cms-input', type: 'text', value: meta.petPolicy });
    const walkInput = el('input', { className: 'cms-input', type: 'number', value: String(meta.walkScore || 80) });

    const badgeInputs = [0, 1, 2, 3].map((i) =>
      el('input', {
        className: 'cms-input',
        type: 'text',
        value: highlights[i] ? highlights[i].title : `Highlight 0${i + 1}`
      })
    );

    const formNode = el('div', {}, [
      el('div', { className: 'cms-form-group' }, [
        el('label', { className: 'cms-label', text: 'Property Name:' }),
        propNameInput
      ]),
      el('div', { className: 'cms-form-group' }, [
        el('label', { className: 'cms-label', text: 'Sticky Announcement & Lease Special Banner (#sticky-banner-v2):' }),
        bannerInput
      ]),
      el('div', { className: 'cms-form-group' }, [
        el('label', { className: 'cms-label', text: 'Hero H1 Headline (#gallery-basic):' }),
        heroH1Input
      ]),
      el('div', { className: 'cms-form-group' }, [
        el('label', { className: 'cms-label', text: 'Hero Subheadline:' }),
        heroSubInput
      ]),
      el('div', { className: 'cms-form-group' }, [
        el('label', { className: 'cms-label', text: 'Hero Cloudinary / Cloud CDN Image URL (HTTPS):' }),
        heroImgInput
      ]),
      el('div', { className: 'cms-form-group' }, [
        el('label', { className: 'cms-label', text: 'Featured Concession Pop-Out Title (#featured-content):' }),
        popTitleInput
      ]),
      el('div', { className: 'cms-form-group' }, [
        el('label', { className: 'cms-label', text: 'Featured Concession Pop-Out Details:' }),
        popBodyInput
      ]),
      el('div', { className: 'cms-form-group' }, [
        el('label', { className: 'cms-label', text: '01–04 Numbered Outline Badges (2424tulane.com style):' }),
        el('div', { styleObj: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem' } }, badgeInputs)
      ]),
      el('div', { className: 'cms-form-group' }, [
        el('label', { className: 'cms-label', text: 'Canonical Property Address:' }),
        addressInput
      ]),
      el('div', { className: 'cms-form-group' }, [
        el('label', { className: 'cms-label', text: 'Verified Office Hours:' }),
        hoursInput
      ]),
      el('div', { className: 'cms-form-group' }, [
        el('label', { className: 'cms-label', text: 'Pet Policy:' }),
        petInput
      ]),
      el('div', { className: 'cms-form-group' }, [
        el('label', { className: 'cms-label', text: 'Walk Score (0–100):' }),
        walkInput
      ]),
      el('button', {
        type: 'button',
        className: 'cms-btn cms-btn-emerald cms-btn-full',
        text: 'Save Changes to G5 CMS & Log Firestore Snapshot',
        onClick: async () => {
          try {
            const resp = await apiPost('/api/cms/property/update', {
              slug: site.slug,
              actor: 'G5 Visual CMS Studio (Strategist / Client)',
              propertyMetadata: {
                propertyName: propNameInput.value,
                tagline: taglineInput.value,
                leaseSpecialBanner: bannerInput.value,
                featuredPopOutTitle: popTitleInput.value,
                featuredPopOutBody: popBodyInput.value,
                address: addressInput.value,
                officeHours: hoursInput.value,
                petPolicy: petInput.value,
                walkScore: Number(walkInput.value)
              },
              heroMedia: {
                headline: heroH1Input.value,
                subheadline: heroSubInput.value,
                primaryImage: heroImgInput.value
              },
              numberedHighlights: badgeInputs.map((inp, idx) => ({
                num: `0${idx + 1}`,
                title: inp.value
              }))
            });
            updateSiteInState(resp.site);
            showToast('Saved CMS changes • Logged Firestore snapshot ' + resp.revision.revisionId);
          } catch (err) {
            showToast(err.message);
          }
        }
      })
    ]);

    formContainer.replaceChildren(formNode);
  }

  /**
   * MODULE 1 RIGHT PANE: Render the Live G5 v9.0 ("Alpine - Simple") Website Canvas
   */
  function renderLiveG5WebsitePreview() {
    const canvas = document.getElementById('g5-live-site-canvas');
    const urlBar = document.getElementById('preview-url-bar');
    if (!canvas || !state.activeSite) return;

    const site = state.activeSite;
    const meta = site.propertyMetadata;
    const hero = site.heroMedia;
    const ds = state.designSystems[site.designSystemId] || Object.values(state.designSystems)[0];

    applyFigmaTokensToRoot(site.designSystemId);

    if (urlBar) {
      const localPreviewPath = '/preview/' + site.slug;
      urlBar.replaceChildren(
        el(
          'a',
          {
            href: localPreviewPath,
            target: '_blank',
            rel: 'noopener noreferrer',
            styleObj: { color: '#38bdf8', textDecoration: 'underline', fontWeight: '700' },
            text: window.location.origin + localPreviewPath + ' ↗ (Open Standalone G5 Site)'
          }
        ),
        el('span', {
          styleObj: { marginLeft: '10px', color: '#94a3b8' },
          text: '[' + ds.name + ' • ' + site.dataHubId + ']'
        })
      );
    }

    // Always render top navigation bar
    const navBar = el('nav', { className: 'g5-nav' }, [
      el('div', { className: 'g5-nav-brand', text: meta.propertyName }),
      el('div', { className: 'g5-nav-links' }, [
        el('a', { href: '#floorplans', text: 'Floor Plans' }),
        el('a', { href: '#amenities', text: 'Amenities' }),
        el('a', { href: '#gallery', text: 'Gallery' }),
        el('a', { href: '#reviews', text: 'Reviews' })
      ])
    ]);

    const renderedStripes = [];

    (site.pageStripes || []).forEach((stripe) => {
      if (!stripe.enabled) return;

      switch (stripe.componentId) {
        case 'G5StickyBannerV2': {
          renderedStripes.push(
            el('div', { className: 'g5-sticky-banner' }, [
              el('span', { text: meta.leaseSpecialBanner }),
              el('span', { text: 'DNI Call Tracking: ' + meta.phoneMasked + ' • Walk Score ' + meta.walkScore })
            ])
          );
          break;
        }

        case 'G5HeroGalleryBasic': {
          renderedStripes.push(
            el(
              'section',
              {
                className: 'g5-hero',
                styleObj: { backgroundImage: 'url("' + hero.primaryImage + '")' }
              },
              [
                el('div', { className: 'g5-hero-scrim' }),
                el('div', { className: 'g5-hero-inner' }, [
                  el('span', {
                    className: 'g5-hero-kicker',
                    text: ds.g5ThemeId + ' • ' + meta.neighborhood
                  }),
                  el('h2', { className: 'g5-hero-h1', text: hero.headline }),
                  el('p', { className: 'g5-hero-sub', text: hero.subheadline }),
                  el('button', {
                    type: 'button',
                    className: 'g5-btn-cta',
                    text: 'Explore Floor Plans & Live Pricing',
                    onClick: () => {
                      const fpEl = document.getElementById('floorplans');
                      if (fpEl) fpEl.scrollIntoView({ behavior: 'smooth' });
                    }
                  })
                ])
              ]
            )
          );
          break;
        }

        case 'G5FeaturedContentPopOut': {
          renderedStripes.push(
            el('section', { className: 'g5-featured-popout' }, [
              el('div', {}, [
                el('h4', { text: '★ ' + (meta.featuredPopOutTitle || 'Limited-Time Move-In Special') }),
                el('p', { text: meta.featuredPopOutBody || meta.leaseSpecialBanner })
              ]),
              el('button', {
                type: 'button',
                className: 'g5-btn-cta',
                text: 'Claim Special Offer',
                onClick: () => {
                  openModal(
                    meta.featuredPopOutTitle || 'Move-In Special',
                    el('div', {}, [
                      el('p', { styleObj: { marginBottom: '0.75rem' }, text: meta.featuredPopOutBody || meta.leaseSpecialBanner }),
                      el('div', { className: 'cms-kv-row' }, [
                        el('span', { text: 'Property:' }),
                        el('strong', { text: meta.propertyName })
                      ]),
                      el('div', { className: 'cms-kv-row' }, [
                        el('span', { text: 'G5 Store URN:' }),
                        el('span', { text: meta.storeUrn })
                      ]),
                      el('div', { className: 'cms-kv-row' }, [
                        el('span', { text: 'Leasing Phone (DNI):' }),
                        el('strong', { text: meta.phoneMasked })
                      ])
                    ])
                  );
                }
              })
            ])
          );
          break;
        }

        case 'G5QuickStatsBar': {
          renderedStripes.push(
            el('section', { className: 'g5-quick-stats' }, [
              el('div', { className: 'g5-stat-cell' }, [
                el('small', { text: 'Canonical Address (Data Hub)' }),
                el('strong', { text: meta.address })
              ]),
              el('div', { className: 'g5-stat-cell' }, [
                el('small', { text: 'Leasing Office Hours' }),
                el('strong', { text: meta.officeHours })
              ]),
              el('div', { className: 'g5-stat-cell' }, [
                el('small', { text: 'Verified Pet Policy' }),
                el('strong', { text: meta.petPolicy })
              ]),
              el('div', { className: 'g5-stat-cell' }, [
                el('small', { text: 'Mobility Scores' }),
                el('strong', {
                  text:
                    'Walk ' +
                    meta.walkScore +
                    ' • Transit ' +
                    (meta.transitScore || 70) +
                    ' • Bike ' +
                    (meta.bikeScore || 75)
                })
              ])
            ])
          );
          break;
        }

        case 'G5NumberedAmenityBadges': {
          const cards = (site.numberedHighlights || []).map((item) =>
            el('div', { className: 'g5-num-card' }, [
              el('div', { className: 'g5-num-circle', text: item.num }),
              el('div', { className: 'g5-num-title', text: item.title })
            ])
          );
          renderedStripes.push(
            el('section', { className: 'g5-numbered-stripe' }, [
              el('div', { className: 'g5-numbered-grid' }, cards)
            ])
          );
          break;
        }

        case 'G5FloorPlanGrid': {
          const cats = ['All', 'Studio', '1 Bed', '2 Bed', '3 Bed'];
          const filterBtns = cats.map((c) =>
            el('button', {
              type: 'button',
              className:
                state.activeBedroomFilter === c ? 'cms-btn cms-btn-primary cms-btn-sm' : 'cms-btn cms-btn-ghost cms-btn-sm',
              text: c,
              onClick: () => {
                state.activeBedroomFilter = c;
                renderLiveG5WebsitePreview();
              }
            })
          );

          const filtered = (site.floorPlans || []).filter(
            (fp) => state.activeBedroomFilter === 'All' || fp.category === state.activeBedroomFilter
          );

          const fpCards = filtered.map((fp) =>
            el('article', { className: 'g5-fp-card' }, [
              el('div', {}, [
                el('span', { className: 'g5-fp-badge', text: fp.specialOffer }),
                el('h4', { styleObj: { color: 'var(--g5-primary)', fontWeight: '800' }, text: fp.name }),
                el('div', {
                  styleObj: { fontSize: '0.75rem', color: 'var(--g5-text-secondary)', marginTop: '0.2rem' },
                  text:
                    (fp.beds === 0 ? 'Studio' : fp.beds + ' Bed') +
                    ' • ' +
                    fp.baths +
                    ' Bath • ' +
                    fp.sqft.toLocaleString() +
                    ' Sq. Ft.'
                }),
                el('div', { className: 'g5-fp-price', text: '$' + fp.livePrice.toLocaleString() + ' / mo' }),
                el('div', {
                  styleObj: { fontSize: '0.72rem', color: '#059669', fontWeight: '700', marginBottom: '0.7rem' },
                  text: fp.availableUnits + ' Residence(s) Available • Move-In: ' + fp.moveInDate
                })
              ]),
              el('button', {
                type: 'button',
                className: 'g5-btn-cta',
                styleObj: { width: '100%' },
                text: 'Start Online Lease Application',
                onClick: () => {
                  openModal(
                    'Online Leasing Handoff • ' + fp.name,
                    el('div', {}, [
                      el('p', {
                        styleObj: { marginBottom: '0.7rem' },
                        text: 'Connected to RealPage OneSite / YieldStar Inventory Feed via Cloud Run Proxy.'
                      }),
                      el('div', { className: 'cms-kv-row' }, [
                        el('span', { text: 'Residence:' }),
                        el('strong', { text: fp.name + ' (' + fp.sqft + ' Sq. Ft.)' })
                      ]),
                      el('div', { className: 'cms-kv-row' }, [
                        el('span', { text: 'Live Monthly Rent:' }),
                        el('strong', { text: '$' + fp.livePrice.toLocaleString() + '/mo (' + fp.specialOffer + ')' })
                      ])
                    ])
                  );
                }
              })
            ])
          );

          renderedStripes.push(
            el('section', { id: 'floorplans', className: 'g5-stripe-section' }, [
              el('div', { className: 'g5-stripe-head' }, [
                el('h3', { className: 'g5-stripe-title', text: 'Real-Time Floor Plans & Availability' }),
                el('div', { styleObj: { display: 'flex', gap: '0.35rem', flexWrap: 'wrap' } }, filterBtns)
              ]),
              el('div', { className: 'g5-fp-grid' }, fpCards)
            ])
          );
          break;
        }

        case 'G5PhotoCardsMosaic': {
          const cards = (site.photoCards || []).map((pc) =>
            el('div', { className: 'g5-photo-card' }, [
              el('img', {
                className: 'g5-photo-arch-img',
                src: pc.imageUrl,
                alt: pc.title,
                loading: 'lazy'
              }),
              el('div', { className: 'g5-photo-card-body' }, [
                el('h4', { text: pc.title }),
                el('p', { text: pc.subtitle }),
                el('a', {
                  href: pc.targetAnchor || '#floorplans',
                  styleObj: {
                    fontSize: '0.75rem',
                    fontWeight: '700',
                    color: 'var(--g5-primary)',
                    textDecoration: 'underline'
                  },
                  text: pc.ctaText + ' →'
                })
              ])
            ])
          );
          renderedStripes.push(
            el('section', { id: 'gallery', className: 'g5-stripe-section' }, [
              el('div', { className: 'g5-stripe-head' }, [
                el('h3', {
                  className: 'g5-stripe-title',
                  text: 'Explore ' + meta.propertyName + ' (G5 Photo Cards Mosaic)'
                })
              ]),
              el('div', { className: 'g5-photo-cards-grid' }, cards)
            ])
          );
          break;
        }

        case 'G5AmenityPillList': {
          const commPills = (site.amenities.community || []).map((a) =>
            el('div', { className: 'g5-amen-pill', text: '✦ ' + a })
          );
          const unitPills = (site.amenities.unit || []).map((a) =>
            el('div', { className: 'g5-amen-pill', text: '✦ ' + a })
          );
          renderedStripes.push(
            el('section', { id: 'amenities', className: 'g5-stripe-section' }, [
              el('div', { className: 'g5-stripe-head' }, [
                el('h3', { className: 'g5-stripe-title', text: 'Community & Residence Amenities' })
              ]),
              el('div', { className: 'g5-amen-grid' }, [
                el('div', { className: 'g5-amen-col' }, [
                  el('h4', { text: 'Community Amenities' }),
                  ...commPills
                ]),
                el('div', { className: 'g5-amen-col' }, [
                  el('h4', { text: 'Apartment Interior Features' }),
                  ...unitPills
                ])
              ])
            ])
          );
          break;
        }

        case 'G5PromotedReviewsSlider': {
          const revCards = (site.promotedReviews || []).map((r) =>
            el('div', { className: 'g5-review-card' }, [
              el('div', { styleObj: { fontWeight: '700', color: 'var(--g5-primary)', marginBottom: '0.3rem' }, text: '★★★★★ ' + r.rating }),
              el('p', { styleObj: { fontStyle: 'italic', marginBottom: '0.4rem' }, text: '"' + r.quote + '"' }),
              el('small', { styleObj: { fontWeight: '700' }, text: '— ' + r.author })
            ])
          );
          renderedStripes.push(
            el('section', { id: 'reviews', className: 'g5-stripe-section' }, [
              el('div', { className: 'g5-stripe-head' }, [
                el('h3', { className: 'g5-stripe-title', text: 'Verified Resident Reviews (#promoted-reviews)' })
              ]),
              el('div', { className: 'g5-reviews-grid' }, revCards)
            ])
          );
          break;
        }

        case 'G5AeoStructuredDataGraph': {
          renderedStripes.push(
            el('footer', { className: 'g5-aeo-footer' }, [
              el('div', { styleObj: { display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' } }, [
                el('strong', {
                  styleObj: { color: '#38bdf8' },
                  text: 'AEO (AI-Engine Optimization) Schema.org ApartmentComplex JSON-LD Active'
                }),
                el('span', {
                  text:
                    'Indexed for Google Gemini, AI Overviews & Conversational Search • Store URN: ' +
                    meta.storeUrn
                })
              ])
            ])
          );
          break;
        }

        case 'G5FirstPartyConsentBanner': {
          renderedStripes.push(
            el('div', { className: 'g5-consent-bar' }, [
              el('span', {
                text:
                  '1st-Party Cloud Spanner Privacy & Consent Active (Third-Party OneTrust OtAutoBlock.js & Honeybadger Shed — 0ms Blocking Time)'
              }),
              el('div', { styleObj: { display: 'flex', gap: '0.4rem' } }, [
                el('button', {
                  type: 'button',
                  className: 'cms-btn cms-btn-emerald cms-btn-sm',
                  text: 'Accept 1st-Party Telemetry',
                  onClick: async () => {
                    const resp = await apiPost('/api/cms/consent/record', {
                      slug: site.slug,
                      policyChoice: 'Accept All First-Party Cloud CDN Telemetry'
                    });
                    updateSiteInState(resp.site);
                    showToast('Logged Cloud Spanner Consent Receipt: ' + resp.receipt.receiptId);
                  }
                }),
                el('button', {
                  type: 'button',
                  className: 'cms-btn cms-btn-ghost cms-btn-sm',
                  text: 'Essential Only',
                  onClick: async () => {
                    const resp = await apiPost('/api/cms/consent/record', {
                      slug: site.slug,
                      policyChoice: 'Essential Strictly Necessary Only'
                    });
                    updateSiteInState(resp.site);
                    showToast('Logged Essential-Only Consent Receipt: ' + resp.receipt.receiptId);
                  }
                })
              ])
            ])
          );
          break;
        }

        default:
          break;
      }
    });

    canvas.replaceChildren(navBar, ...renderedStripes);
  }

  /**
   * MODULE 2: Floor Plans (PMS/IUI Inventory CRUD) & Media DAM / Amenities Manager
   */
  function renderFloorPlansAndDamModule() {
    const root = document.getElementById('floorplans-dam-root');
    if (!root || !state.activeSite) return;
    const site = state.activeSite;

    // Floor Plan CRUD Card
    const fpRows = (site.floorPlans || []).map((fp) => {
      const priceInput = el('input', {
        type: 'number',
        className: 'cms-input',
        styleObj: { width: '95px' },
        value: String(fp.livePrice)
      });
      const availInput = el('input', {
        type: 'number',
        className: 'cms-input',
        styleObj: { width: '70px' },
        value: String(fp.availableUnits)
      });
      const promoInput = el('input', {
        type: 'text',
        className: 'cms-input',
        styleObj: { width: '135px' },
        value: fp.specialOffer
      });

      return el(
        'div',
        {
          styleObj: {
            background: '#131f37',
            border: '1px solid #1e293b',
            borderRadius: '8px',
            padding: '0.65rem',
            marginBottom: '0.5rem'
          }
        },
        [
          el('div', { styleObj: { display: 'flex', justifyContent: 'space-between', marginBottom: '0.45rem' } }, [
            el('strong', { text: fp.name + ' (' + fp.category + ' • ' + fp.sqft + ' Sq. Ft.)' }),
            el('button', {
              type: 'button',
              className: 'cms-btn cms-btn-danger cms-btn-sm',
              text: 'Delete',
              onClick: async () => {
                try {
                  const resp = await apiPost('/api/cms/floorplans/delete', {
                    slug: site.slug,
                    floorPlanId: fp.id
                  });
                  updateSiteInState(resp.site);
                  showToast('Removed floor plan • Logged ' + resp.revision.revisionId);
                } catch (err) {
                  showToast(err.message);
                }
              }
            })
          ]),
          el('div', { styleObj: { display: 'flex', gap: '0.45rem', alignItems: 'center', flexWrap: 'wrap' } }, [
            el('span', { styleObj: { fontSize: '0.72rem', color: '#94a3b8' }, text: 'Rent ($):' }),
            priceInput,
            el('span', { styleObj: { fontSize: '0.72rem', color: '#94a3b8' }, text: 'Units:' }),
            availInput,
            el('span', { styleObj: { fontSize: '0.72rem', color: '#94a3b8' }, text: 'Promo:' }),
            promoInput,
            el('button', {
              type: 'button',
              className: 'cms-btn cms-btn-emerald cms-btn-sm',
              text: 'Update Plan',
              onClick: async () => {
                try {
                  const resp = await apiPost('/api/cms/floorplans/upsert', {
                    slug: site.slug,
                    floorPlan: {
                      ...fp,
                      livePrice: Number(priceInput.value),
                      availableUnits: Number(availInput.value),
                      specialOffer: promoInput.value
                    }
                  });
                  updateSiteInState(resp.site);
                  showToast('Updated ' + fp.name + ' (' + resp.revision.revisionId + ')');
                } catch (err) {
                  showToast(err.message);
                }
              }
            })
          ])
        ]
      );
    });

    // Add New Floor Plan Form
    const newFpName = el('input', { className: 'cms-input', type: 'text', placeholder: 'e.g., C2 • The Esplanade Penthouse' });
    const newFpBeds = el('input', { className: 'cms-input', type: 'number', value: '2' });
    const newFpBaths = el('input', { className: 'cms-input', type: 'number', value: '2' });
    const newFpSqft = el('input', { className: 'cms-input', type: 'number', value: '1150' });
    const newFpPrice = el('input', { className: 'cms-input', type: 'number', value: '1950' });
    const newFpPromo = el('input', { className: 'cms-input', type: 'text', value: '1 Month Free!' });

    const leftCol = el('div', { className: 'cms-card' }, [
      el('div', { className: 'cms-card-header' }, [
        el('h3', { text: 'Floor Plan & PMS/IUI Inventory Manager' }),
        el('span', { className: 'cms-tag', text: site.floorPlans.length + ' Plans Active' })
      ]),
      el('div', {}, fpRows),
      el('h4', { styleObj: { margin: '0.9rem 0 0.5rem', fontSize: '0.84rem', color: '#38bdf8' }, text: '+ Add New Floor Plan to G5 Schema' }),
      el('div', { className: 'cms-form-group' }, [
        el('label', { className: 'cms-label', text: 'Floor Plan Name:' }),
        newFpName
      ]),
      el('div', { styleObj: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.4rem', marginBottom: '0.6rem' } }, [
        el('div', {}, [el('label', { className: 'cms-label', text: 'Beds' }), newFpBeds]),
        el('div', {}, [el('label', { className: 'cms-label', text: 'Baths' }), newFpBaths]),
        el('div', {}, [el('label', { className: 'cms-label', text: 'Sq. Ft.' }), newFpSqft]),
        el('div', {}, [el('label', { className: 'cms-label', text: 'Rent ($)' }), newFpPrice])
      ]),
      el('div', { className: 'cms-form-group' }, [
        el('label', { className: 'cms-label', text: 'Concession / Special Offer Badge:' }),
        newFpPromo
      ]),
      el('button', {
        type: 'button',
        className: 'cms-btn cms-btn-primary cms-btn-full',
        text: '+ Add Floor Plan & Update AEO OfferCatalog',
        onClick: async () => {
          try {
            const resp = await apiPost('/api/cms/floorplans/upsert', {
              slug: site.slug,
              floorPlan: {
                name: newFpName.value || 'New G5 Residence',
                beds: Number(newFpBeds.value),
                baths: Number(newFpBaths.value),
                sqft: Number(newFpSqft.value),
                livePrice: Number(newFpPrice.value),
                availableUnits: 4,
                specialOffer: newFpPromo.value
              }
            });
            updateSiteInState(resp.site);
            showToast('Added floor plan • Logged ' + resp.revision.revisionId);
          } catch (err) {
            showToast(err.message);
          }
        }
      })
    ]);

    // Right Column: Amenities & Cloudinary/GCS Media Library
    const newAmenityText = el('input', {
      className: 'cms-input',
      type: 'text',
      placeholder: 'e.g., Rooftop Pickleball Court & Sky Lounge'
    });
    const newAmenityScope = el('select', { className: 'cms-select' }, [
      el('option', { value: 'community', text: 'Community-Level Amenity' }),
      el('option', { value: 'unit', text: 'Residence Interior Feature' })
    ]);

    const commList = (site.amenities.community || []).map((item, idx) =>
      el('div', { className: 'cms-kv-row' }, [
        el('span', { text: '✦ ' + item }),
        el('button', {
          type: 'button',
          className: 'cms-btn cms-btn-danger cms-btn-sm',
          text: '×',
          onClick: async () => {
            const resp = await apiPost('/api/cms/amenities/update', {
              slug: site.slug,
              removeAmenity: { scope: 'community', index: idx }
            });
            updateSiteInState(resp.site);
            showToast('Removed amenity (' + resp.revision.revisionId + ')');
          }
        })
      ])
    );

    const mediaTitleInput = el('input', { className: 'cms-input', type: 'text', placeholder: 'e.g., Resort Pool Deck at Sunset' });
    const mediaUrlInput = el('input', {
      className: 'cms-input',
      type: 'url',
      placeholder: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=900&q=80'
    });

    const rightCol = el('div', { className: 'cms-card' }, [
      el('div', { className: 'cms-card-header' }, [
        el('h3', { text: 'Amenities & Cloudinary / Cloud Storage DAM' }),
        el('span', { className: 'cms-tag', text: 'Vision Categorized' })
      ]),
      el('div', { styleObj: { display: 'grid', gridTemplateColumns: '1fr 170px auto', gap: '0.4rem', marginBottom: '0.75rem' } }, [
        newAmenityText,
        newAmenityScope,
        el('button', {
          type: 'button',
          className: 'cms-btn cms-btn-emerald',
          text: '+ Add',
          onClick: async () => {
            if (!newAmenityText.value.trim()) return;
            const resp = await apiPost('/api/cms/amenities/update', {
              slug: site.slug,
              addAmenity: { scope: newAmenityScope.value, text: newAmenityText.value }
            });
            updateSiteInState(resp.site);
            showToast('Added amenity (' + resp.revision.revisionId + ')');
          }
        })
      ]),
      el('div', { styleObj: { maxHeight: '220px', overflowY: 'auto', marginBottom: '0.9rem' } }, commList),
      el('h4', { styleObj: { marginBottom: '0.45rem', fontSize: '0.84rem', color: '#38bdf8' }, text: '+ Register High-Res Asset in Cloud Storage DAM' }),
      el('div', { className: 'cms-form-group' }, [
        el('label', { className: 'cms-label', text: 'Asset Caption:' }),
        mediaTitleInput
      ]),
      el('div', { className: 'cms-form-group' }, [
        el('label', { className: 'cms-label', text: 'HTTPS Image URL (Cloudinary / GCS / Unsplash):' }),
        mediaUrlInput
      ]),
      el('button', {
        type: 'button',
        className: 'cms-btn cms-btn-primary cms-btn-full',
        text: '+ Add Asset to G5 Media Library',
        onClick: async () => {
          if (!mediaUrlInput.value.trim()) return;
          const resp = await apiPost('/api/cms/amenities/update', {
            slug: site.slug,
            addMedia: {
              category: 'Amenities',
              title: mediaTitleInput.value || 'Curated Property View',
              imageUrl: mediaUrlInput.value
            }
          });
          updateSiteInState(resp.site);
          showToast('Added media asset (' + resp.revision.revisionId + ')');
        }
      })
    ]);

    root.replaceChildren(leftCol, rightCol);
  }

  /**
   * MODULE 3: Interactive Client-Facing AI Intake Agent (Feature 3)
   */
  function renderClientIntakeAgentModule() {
    const root = document.getElementById('intake-agent-root');
    if (!root || !state.activeSite) return;
    const site = state.activeSite;

    const bubbles = (site.intakeConversation || []).map((msg) =>
      el('div', { className: 'cms-chat-bubble ' + (msg.sender === 'client' ? 'client' : 'agent') }, [
        el('div', {
          styleObj: { fontSize: '0.66rem', fontWeight: '700', color: '#38bdf8', marginBottom: '0.2rem' },
          text:
            (msg.sender === 'client' ? 'PROPERTY CLIENT (SELF-SERVICE)' : 'VERTEX AI INTAKE AGENT') +
            ' • ' +
            new Date(msg.timestamp).toLocaleTimeString()
        }),
        el('div', { text: msg.message })
      ])
    );

    const promptInput = el('input', {
      type: 'text',
      className: 'cms-input',
      placeholder: 'e.g., Offer 2 Months Free rent on all 1 & 2 bedroom units and add EV Charging to amenities...'
    });

    const quickPrompts = [
      'Offer 2 Months Free move-in special + waived admin fee on all units!',
      'Switch our brand theme to G5 Alpine El Patio Laredo Teal & Gold',
      'Switch our brand theme to G5 Alpine 2424 Tulane Blue & Arch Cards',
      'Update Pet Policy to No Weight Limits + Private Heated Dog Spa',
      'Add Rooftop Pickleball Court & Co-Working Zoom Pods to community amenities'
    ];

    const quickBtns = quickPrompts.map((q) =>
      el('button', {
        type: 'button',
        className: 'cms-btn cms-btn-ghost cms-btn-sm',
        styleObj: { textAlign: 'left' },
        text: '⚡ "' + q + '"',
        onClick: async () => {
          const resp = await apiPost('/api/cms/intake-agent/chat', {
            slug: site.slug,
            prompt: q
          });
          updateSiteInState(resp.site);
          showToast('Client Intake Agent updated live site (' + resp.revision.revisionId + ')');
        }
      })
    );

    const chatCard = el('div', { className: 'cms-card' }, [
      el('div', { className: 'cms-card-header' }, [
        el('h3', { text: 'Feature 3: Interactive Client-Facing AI Intake Agent' }),
        el('span', { className: 'cms-tag cms-tag-emerald', text: 'Zero Onboarding Phone Calls' })
      ]),
      el('p', {
        className: 'cms-help',
        text: 'Built for busy property managers who "don\'t have time for a phone call." Pre-populated from RealPage Data Hub, this agent captures natural-language requests and mutates the live G5 CMS config directly:'
      }),
      el('div', { className: 'cms-chat-log' }, bubbles),
      el('div', { styleObj: { display: 'flex', gap: '0.45rem', marginBottom: '0.75rem' } }, [
        promptInput,
        el('button', {
          type: 'button',
          className: 'cms-btn cms-btn-primary',
          text: 'Send to Agent',
          onClick: async () => {
            if (!promptInput.value.trim()) return;
            const resp = await apiPost('/api/cms/intake-agent/chat', {
              slug: site.slug,
              prompt: promptInput.value
            });
            updateSiteInState(resp.site);
            showToast('Intake Agent applied changes (' + resp.revision.revisionId + ')');
          }
        })
      ]),
      el('div', { styleObj: { display: 'flex', flexDirection: 'column', gap: '0.35rem' } }, [
        el('span', { className: 'cms-label', text: '1-Click Client Persona Test Prompts:' }),
        ...quickBtns
      ])
    ]);

    const latestAgentMsg = [...(site.intakeConversation || [])].reverse().find((m) => m.structuredVariables);
    const structuredCard = el('div', { className: 'cms-card' }, [
      el('div', { className: 'cms-card-header' }, [
        el('h3', { text: 'Structured CMS Config Output (Developer Pipeline Stream)' }),
        el('span', { className: 'cms-tag', text: 'Vertex AI Grounded' })
      ]),
      el('p', {
        className: 'cms-help',
        text: 'Every client conversation compiles into deterministic G5 v9.0 configuration variables bound by Figma Guardrails:'
      }),
      el('pre', {
        className: 'cms-code',
        text: JSON.stringify(
          {
            activeProperty: site.propertyMetadata.propertyName,
            dataHubId: site.dataHubId,
            figmaGuardrailLock: state.designSystems[site.designSystemId].figmaFileKey,
            lastIntakeMutation: latestAgentMsg ? latestAgentMsg.structuredVariables : {},
            currentLiveMetadata: site.propertyMetadata
          },
          null,
          2
        )
      })
    ]);

    root.replaceChildren(chatCard, structuredCard);
  }

  /**
   * MODULE 4: RealPage Data Hub MCP Intake Engine (Feature 1)
   */
  function renderDataHubModule() {
    const root = document.getElementById('datahub-root');
    if (!root || !state.activeSite) return;
    const site = state.activeSite;

    const profileCards = Object.values(state.dataHubRecords).map((dh) => {
      const isCurrent = site.dataHubId === dh.dataHubId;
      return el(
        'div',
        {
          styleObj: {
            background: '#131f37',
            border: isCurrent ? '1px solid #38bdf8' : '1px solid #1e293b',
            borderRadius: '8px',
            padding: '0.75rem',
            marginBottom: '0.6rem'
          }
        },
        [
          el('div', { styleObj: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' } }, [
            el('strong', { styleObj: { color: '#38bdf8' }, text: dh.dataHubId + ' • ' + dh.propertyName }),
            el('span', {
              className: 'cms-tag cms-tag-emerald',
              text: dh.onboardingQuestionsEliminated + ' Questions Eliminated'
            })
          ]),
          el('div', { styleObj: { fontSize: '0.74rem', color: '#cbd5e1', marginBottom: '0.5rem' } }, [
            el('div', { text: 'Owner: ' + dh.corporateOwner + ' | Units: ' + dh.totalUnits }),
            el('div', { text: 'Canonical Address: ' + dh.canonicalAddress }),
            el('div', { text: 'PMS Feed: ' + dh.pmsConnector })
          ]),
          el('button', {
            type: 'button',
            className: 'cms-btn cms-btn-primary cms-btn-sm',
            text: isCurrent
              ? '↻ Re-Sync Canonical Data Hub Record into Active Site'
              : '⚡ Hydrate Active Site from ' + dh.dataHubId,
            onClick: async () => {
              const resp = await apiPost('/api/cms/datahub/sync', {
                slug: site.slug,
                dataHubId: dh.dataHubId
              });
              updateSiteInState(resp.site);
              showToast('Synced Data Hub profile ' + dh.dataHubId + ' (' + resp.revision.revisionId + ')');
            }
          })
        ]
      );
    });

    const leftCard = el('div', { className: 'cms-card' }, [
      el('div', { className: 'cms-card-header' }, [
        el('h3', { text: 'Feature 1: RealPage Data Hub MCP Intake Connector' }),
        el('span', { className: 'cms-tag', text: 'Cloud Functions + MCP' })
      ]),
      el('p', {
        className: 'cms-help',
        text: 'Connects directly to RealPage\'s global onboarding tool ("Data Hub") to pull verified addresses, unit counts, PMS feeds, and corporate URN IDs—eliminating redundant intake calls:'
      }),
      ...profileCards
    ]);

    const activeDh = state.dataHubRecords[site.dataHubId] || Object.values(state.dataHubRecords)[0];
    const rightCard = el('div', { className: 'cms-card' }, [
      el('div', { className: 'cms-card-header' }, [
        el('h3', { text: 'Canonical Data Hub Payload (' + activeDh.dataHubId + ')' }),
        el('span', { className: 'cms-tag cms-tag-emerald', text: 'MCP Verified' })
      ]),
      el('pre', {
        className: 'cms-code',
        text: JSON.stringify(activeDh, null, 2)
      })
    ]);

    root.replaceChildren(leftCard, rightCard);
  }

  /**
   * MODULE 5: Vendor Shedding, First-Party Spanner Consent & AEO Engine (Feature 2)
   */
  function renderVendorsAndAeoModule() {
    const root = document.getElementById('vendors-aeo-root');
    if (!root || !state.activeSite) return;
    const site = state.activeSite;
    const vs = site.vendorShedding;

    const vendorRows = (vs.vendorsShed || []).map((v) =>
      el(
        'div',
        {
          styleObj: {
            background: '#131f37',
            border: '1px solid #1e293b',
            borderRadius: '8px',
            padding: '0.65rem',
            marginBottom: '0.5rem'
          }
        },
        [
          el('div', { styleObj: { display: 'flex', justifyContent: 'space-between', marginBottom: '0.2rem' } }, [
            el('strong', { styleObj: { color: '#f8fafc', fontSize: '0.78rem' }, text: v.vendor }),
            el('span', {
              className: 'cms-tag cms-tag-emerald',
              text: vs.shedActive ? 'SHED (-' + v.blockingImpactMs + ' ms)' : 'LEGACY ACTIVE'
            })
          ]),
          el('div', {
            styleObj: { fontSize: '0.7rem', color: '#fb7185', fontFamily: 'monospace' },
            text: 'Legacy Script Removed: ' + v.legacyScript
          }),
          el('div', {
            styleObj: { fontSize: '0.72rem', color: '#34d399', marginTop: '0.2rem' },
            text: 'GCP First-Party Replacement: ' + v.gcpNativeReplacement
          })
        ]
      )
    );

    const consentRows = (site.consentLedger || []).slice(0, 4).map((c) =>
      el('div', { className: 'cms-kv-row' }, [
        el('strong', { styleObj: { color: '#34d399' }, text: c.receiptId }),
        el('span', { text: c.policyChoice + ' (' + new Date(c.timestamp).toLocaleTimeString() + ')' })
      ])
    );

    const leftCard = el('div', { className: 'cms-card' }, [
      el('div', { className: 'cms-card-header' }, [
        el('h3', { text: 'Feature 2: Shedding Legacy 3rd-Party Vendors' }),
        el('span', {
          className: 'cms-tag cms-tag-emerald',
          text: vs.shedActive ? 'Lighthouse 98/100' : 'Legacy 58/100'
        })
      ]),
      el('p', {
        className: 'cms-help',
        text: 'All 3 of Matt\'s scraped G5 v9.0 sites loaded heavy third-party OneTrust (OtAutoBlock.js), Honeybadger, and CloudFront trackers. Shedding them for GCP native services boosts Lighthouse from 58 to 98:'
      }),
      el('div', { styleObj: { display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' } }, [
        el('button', {
          type: 'button',
          className: vs.shedActive ? 'cms-btn cms-btn-emerald' : 'cms-btn cms-btn-amber',
          text: vs.shedActive
            ? '✓ 1st-Party GCP Mode Active (Click to Simulate Legacy Bloat)'
            : '⚠ Legacy Vendor Bloat Simulated (Click to Shed Vendors)',
          onClick: async () => {
            const resp = await apiPost('/api/cms/vendors/shed', {
              slug: site.slug,
              shedActive: !vs.shedActive
            });
            updateSiteInState(resp.site);
            showToast('Updated Vendor Shedding state (' + resp.revision.revisionId + ')');
          }
        })
      ]),
      ...vendorRows,
      el('h4', { styleObj: { margin: '0.8rem 0 0.4rem', fontSize: '0.82rem', color: '#38bdf8' }, text: 'Cloud Spanner First-Party Consent Ledger (OneTrust Replacement)' }),
      ...consentRows
    ]);

    const rightCard = el('div', { className: 'cms-card' }, [
      el('div', { className: 'cms-card-header' }, [
        el('h3', { text: 'AI-Engine Optimization (AEO over Legacy SEO) JSON-LD Graph' }),
        el('span', { className: 'cms-tag', text: 'Schema.org ApartmentComplex' })
      ]),
      el('p', {
        className: 'cms-help',
        text: 'Auto-generated Schema.org ApartmentComplex + OfferCatalog JSON-LD embedded into the G5 SSR payload so Gemini, ChatGPT Search, and Google AI Overviews surface live floor plan pricing:'
      }),
      el('pre', {
        className: 'cms-code',
        text: JSON.stringify(site.aeoJsonLd, null, 2)
      })
    ]);

    root.replaceChildren(leftCard, rightCard);
  }

  /**
   * MODULE 6: Firestore & BigQuery Historic Audit Trail + 1-Click Rollback (Feature 4)
   */
  function renderAuditRollbackModule() {
    const root = document.getElementById('audit-rollback-root');
    if (!root || !state.activeSite) return;
    const site = state.activeSite;
    const history = site.auditHistory || [];

    const rows = history.map((rev, idx) =>
      el(
        'div',
        {
          styleObj: {
            background: idx === 0 ? 'rgba(56, 189, 248, 0.1)' : '#131f37',
            border: idx === 0 ? '1px solid #38bdf8' : '1px solid #1e293b',
            borderRadius: '8px',
            padding: '0.8rem',
            marginBottom: '0.6rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '1rem',
            flexWrap: 'wrap'
          }
        },
        [
          el('div', { styleObj: { flex: '1' } }, [
            el('div', { styleObj: { display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' } }, [
              el('strong', { styleObj: { color: '#38bdf8', fontSize: '0.86rem' }, text: rev.revisionId }),
              el('span', { className: 'cms-tag', text: rev.actionType }),
              el('span', { styleObj: { fontSize: '0.73rem', color: '#e2e8f0', fontWeight: '600' }, text: 'Actor: ' + rev.actor }),
              el('span', {
                styleObj: { fontSize: '0.7rem', color: '#94a3b8', fontFamily: 'monospace' },
                text: new Date(rev.timestamp).toLocaleString()
              })
            ]),
            el('div', { styleObj: { fontSize: '0.78rem', color: '#f8fafc', marginTop: '0.3rem' }, text: rev.summary }),
            el('div', {
              styleObj: { fontSize: '0.68rem', color: '#94a3b8', fontFamily: 'monospace', marginTop: '0.2rem' },
              text: 'Firestore Doc: ' + rev.firestoreDocId + ' • BigQuery Stream ID: ' + rev.bigQueryRowId
            })
          ]),
          el('button', {
            type: 'button',
            className: idx === 0 ? 'cms-btn cms-btn-ghost cms-btn-sm' : 'cms-btn cms-btn-amber cms-btn-sm',
            text: idx === 0 ? 'Current Active State' : '↺ 1-Click Rollback to ' + rev.revisionId,
            onClick: async () => {
              try {
                const resp = await apiPost('/api/cms/audit/rollback', {
                  slug: site.slug,
                  revisionId: rev.revisionId
                });
                updateSiteInState(resp.site);
                showToast('Rolled back CMS state to ' + rev.revisionId + ' (' + resp.revision.revisionId + ')');
              } catch (err) {
                showToast(err.message);
              }
            }
          })
        ]
      )
    );

    const card = el('div', { className: 'cms-card' }, [
      el('div', { className: 'cms-card-header' }, [
        el('h3', { text: 'Feature 4: Firestore & BigQuery Historic Audit Trail + 1-Click Rollbacks' }),
        el('span', { className: 'cms-tag cms-tag-emerald', text: history.length + ' Immutable Snapshots' })
      ]),
      el('p', {
        className: 'cms-help',
        text: 'Eliminates the "black hole" of untracked client template edits. Every Visual Page Builder edit, Floor Plan change, Data Hub sync, and Client AI Intake action is streamed to Firestore & BigQuery with instant 1-click rollback:'
      }),
      ...rows
    ]);

    root.replaceChildren(card);
  }

  function renderAll() {
    renderHeaderStats();
    renderSidebarProperties();
    renderSidebarFigmaPanel();
    renderVisualPageBuilder();
    renderLiveG5WebsitePreview();
    renderFloorPlansAndDamModule();
    renderClientIntakeAgentModule();
    renderDataHubModule();
    renderVendorsAndAeoModule();
    renderAuditRollbackModule();
  }

  function bindGlobalEvents() {
    const closeBtn = document.getElementById('cms-modal-close');
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    const backdrop = document.getElementById('cms-modal-backdrop');
    if (backdrop) {
      backdrop.addEventListener('click', (ev) => {
        if (ev.target === backdrop) closeModal();
      });
    }

    // Module switcher
    const modBtns = document.querySelectorAll('.cms-nav-btn');
    modBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const target = btn.getAttribute('data-module');
        modBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        document.querySelectorAll('.cms-module-view').forEach((v) => v.classList.remove('active'));
        const panel = document.getElementById(target);
        if (panel) panel.classList.add('active');
      });
    });

    // Viewport buttons
    const vpBtns = document.querySelectorAll('.cms-vp-btn');
    vpBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const vp = btn.getAttribute('data-vp') || 'desktop';
        vpBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        const frame = document.getElementById('preview-viewport-frame');
        if (frame) frame.className = 'cms-viewport-frame vp-' + vp;
      });
    });

    // Sidebar Design System Switcher
    const dsSelect = document.getElementById('sidebar-design-system-select');
    if (dsSelect) {
      dsSelect.addEventListener('change', async () => {
        if (!state.activeSite) return;
        try {
          const resp = await apiPost('/api/cms/property/update', {
            slug: state.activeSite.slug,
            designSystemId: dsSelect.value,
            actor: 'Figma API Design Token Switcher'
          });
          updateSiteInState(resp.site);
          showToast('Applied Figma Design System: ' + state.designSystems[dsSelect.value].name);
        } catch (err) {
          showToast(err.message);
        }
      });
    }

    // Add Stripe Button
    const addStripeBtn = document.getElementById('add-stripe-btn');
    if (addStripeBtn) {
      addStripeBtn.addEventListener('click', async () => {
        const sel = document.getElementById('add-stripe-select');
        if (!sel || !state.activeSite) return;
        try {
          const resp = await apiPost('/api/cms/blocks/update', {
            slug: state.activeSite.slug,
            addComponentId: sel.value
          });
          updateSiteInState(resp.site);
          showToast('Added G5 Stripe ' + sel.value + ' (' + resp.revision.revisionId + ')');
        } catch (err) {
          showToast(err.message);
        }
      });
    }

    // Create New Site from HTTPS URL
    const createSiteBtn = document.getElementById('create-site-btn');
    if (createSiteBtn) {
      createSiteBtn.addEventListener('click', async () => {
        const urlInp = document.getElementById('new-site-url-input');
        if (!urlInp || !urlInp.value.trim()) {
          showToast('Enter a valid HTTPS property URL first.');
          return;
        }
        createSiteBtn.disabled = true;
        createSiteBtn.textContent = 'Crawling & Hydrating G5 CMS...';
        try {
          const resp = await apiPost('/api/cms/property/create', {
            sourceUrl: urlInp.value.trim(),
            designSystemId: state.activeSite ? state.activeSite.designSystemId : 'g5-alpine-tulane'
          });
          urlInp.value = '';
          updateSiteInState(resp.site);
          showToast('Created new G5 CMS property workspace: ' + resp.site.propertyMetadata.propertyName);
        } catch (err) {
          showToast(err.message);
        } finally {
          createSiteBtn.disabled = false;
          createSiteBtn.textContent = 'Crawl URL + Hydrate CMS Site';
        }
      });
    }

    // Header Publish Button
    const pubBtn = document.getElementById('header-publish-btn');
    if (pubBtn) {
      pubBtn.addEventListener('click', async () => {
        if (!state.activeSite) return;
        try {
          const resp = await apiPost('/api/cms/publish', {
            slug: state.activeSite.slug,
            approver: 'Matt & Veronica (Executive Sign-Off)'
          });
          updateSiteInState(resp.site);
          const r = resp.site.hitlPublishReceipt;
          openModal(
            'Published to G5 Cloud Run Production Edge',
            el('div', {}, [
              el('p', {
                styleObj: { marginBottom: '0.75rem' },
                text:
                  resp.site.propertyMetadata.propertyName +
                  ' has passed all Figma Token Guardrails, WCAG 2.1 AA checks, and AEO JSON-LD validation.'
              }),
              el('div', { className: 'cms-kv-row' }, [
                el('span', { text: 'Spanner Publish Receipt:' }),
                el('strong', { styleObj: { color: '#34d399' }, text: r.receiptId })
              ]),
              el('div', { className: 'cms-kv-row' }, [
                el('span', { text: 'Approved By:' }),
                el('span', { text: r.approvedBy })
              ]),
              el('div', { className: 'cms-kv-row' }, [
                el('span', { text: 'Production Edge URL:' }),
                el('span', { text: r.edgeUrl })
              ])
            ])
          );
        } catch (err) {
          showToast(err.message);
        }
      });
    }
  }

  async function init() {
    try {
      const resp = await fetch('/api/cms/bootstrap', { credentials: 'same-origin' });
      const data = await resp.json();
      state.csrfToken = data.csrfToken;
      state.role = data.role;
      state.designSystems = data.designSystems || {};
      state.stripeCatalog = data.stripeCatalog || [];
      state.dataHubRecords = data.dataHubRecords || {};
      state.properties = data.properties || [];
      state.activeSite = state.properties[0] || null;

      // Support standalone full-screen site preview route (/preview/:slug)
      if (window.location.pathname.indexOf('/preview/') === 0) {
        const slug = window.location.pathname.replace('/preview/', '').trim();
        const found = state.properties.find((p) => p.slug === slug);
        if (found) state.activeSite = found;
        const header = document.querySelector('.cms-header');
        const sidebar = document.querySelector('.cms-sidebar');
        const editorCol = document.querySelector('.cms-editor-column');
        const browserBar = document.querySelector('.cms-browser-bar');
        const layout = document.querySelector('.cms-layout');
        const splitGrid = document.querySelector('.cms-split-grid');
        if (header) header.style.display = 'none';
        if (sidebar) sidebar.style.display = 'none';
        if (editorCol) editorCol.style.display = 'none';
        if (browserBar) browserBar.style.display = 'none';
        if (layout) {
          layout.style.gridTemplateColumns = '1fr';
          layout.style.padding = '0';
        }
        if (splitGrid) {
          splitGrid.style.gridTemplateColumns = '1fr';
        }
        if (state.activeSite) {
          document.title = state.activeSite.propertyMetadata.propertyName + ' | RealPage G5 v9.0 Live Site';
          const topReturnBar = el(
            'div',
            {
              styleObj: {
                background: '#09101f',
                color: '#e2e8f0',
                padding: '8px 18px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '0.78rem',
                borderBottom: '1px solid #1e293b'
              }
            },
            [
              el('span', {
                text:
                  'G5 v9.0 Cloud Run Live Preview • ' +
                  state.activeSite.propertyMetadata.propertyName +
                  ' (' +
                  state.activeSite.dataHubId +
                  ')'
              }),
              el('a', {
                href: '/',
                styleObj: { color: '#38bdf8', fontWeight: '700', textDecoration: 'none' },
                text: '← Return to G5 Enterprise CMS Studio'
              })
            ]
          );
          document.body.insertBefore(topReturnBar, document.body.firstChild);
        }
      }

      bindGlobalEvents();
      renderAll();
    } catch (_err) {
      showToast('Failed to initialize RealPage G5 Enterprise CMS.');
    }
  }

  document.addEventListener('DOMContentLoaded', init);
})();
