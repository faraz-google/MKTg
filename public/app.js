'use strict';

(function () {
  const state = {
    csrfToken: '',
    strategistRole: '',
    templates: {},
    certifiedComponents: [],
    presets: [],
    activeSite: null,
    selectedPresetKey: 'kentico-legacy',
    activeBedroomFilter: 'All',
    activeViewport: 'desktop'
  };

  /**
   * Safe DOM element builder using strictly createElement, setAttribute, textContent, and appendChild.
   * Zero usage of innerHTML, outerHTML, insertAdjacentHTML, or document.write.
   */
  function el(tag, attrs, children) {
    const node = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach((key) => {
        const val = attrs[key];
        if (val === undefined || val === null) return;
        if (key === 'className') {
          node.className = String(val);
        } else if (key === 'text') {
          node.textContent = String(val);
        } else if (key === 'styleObj' && typeof val === 'object') {
          Object.keys(val).forEach((styleProp) => {
            node.style[styleProp] = String(val[styleProp]);
          });
        } else if (key.startsWith('on') && typeof val === 'function') {
          node.addEventListener(key.slice(2).toLowerCase(), val);
        } else {
          node.setAttribute(key, String(val));
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

  function showToast(message) {
    const container = document.getElementById('rp-toast-container');
    if (!container) return;
    const toast = el('div', { className: 'rp-toast', text: message });
    container.appendChild(toast);
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 3800);
  }

  function openModal(titleText, bodyNode) {
    const backdrop = document.getElementById('rp-modal-backdrop');
    const titleEl = document.getElementById('rp-modal-title');
    const bodyEl = document.getElementById('rp-modal-body');
    if (!backdrop || !titleEl || !bodyEl) return;
    titleEl.textContent = titleText;
    bodyEl.replaceChildren(bodyNode);
    backdrop.classList.remove('hidden');
  }

  function closeModal() {
    const backdrop = document.getElementById('rp-modal-backdrop');
    if (backdrop) {
      backdrop.classList.add('hidden');
    }
  }

  async function refreshCsrfSession() {
    const bootResp = await fetch('/api/bootstrap', { credentials: 'same-origin' });
    if (bootResp.ok) {
      const bootData = await bootResp.json();
      if (bootData && bootData.csrfToken) {
        state.csrfToken = bootData.csrfToken;
      }
    }
  }

  async function apiPost(endpoint, payload) {
    if (!state.csrfToken) {
      await refreshCsrfSession();
    }
    let response = await fetch(endpoint, {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': state.csrfToken
      },
      body: JSON.stringify(payload)
    });
    if (response.status === 403) {
      await refreshCsrfSession();
      response = await fetch(endpoint, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': state.csrfToken
        },
        body: JSON.stringify(payload)
      });
    }
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'API request failed');
    }
    return data;
  }

  function applyG5DesignTokensToRoot(templateId) {
    const tpl = state.templates[templateId];
    if (!tpl || !tpl.tokens) return;
    const root = document.documentElement;
    root.style.setProperty('--g5-primary', tpl.tokens.primaryColor);
    root.style.setProperty('--g5-secondary', tpl.tokens.secondaryColor);
    root.style.setProperty('--g5-accent', tpl.tokens.accentColor);
    root.style.setProperty('--g5-surface', tpl.tokens.surfaceColor);
    root.style.setProperty('--g5-muted', tpl.tokens.mutedSurfaceColor);
    root.style.setProperty('--g5-text-primary', tpl.tokens.textPrimary);
    root.style.setProperty('--g5-text-secondary', tpl.tokens.textSecondary);
    root.style.setProperty('--g5-heading-font', tpl.tokens.headingFont);
    root.style.setProperty('--g5-body-font', tpl.tokens.bodyFont);
    root.style.setProperty('--g5-radius', tpl.tokens.borderRadius);
  }

  function renderPresetSelectorList() {
    const listEl = document.getElementById('preset-selector-list');
    if (!listEl) return;

    const items = state.presets.map((preset) => {
      const isActive = state.activeSite && state.activeSite.stagingSlug === preset.stagingSlug;
      return el(
        'button',
        {
          type: 'button',
          className: isActive ? 'rp-preset-item active' : 'rp-preset-item',
          onClick: () => {
            state.selectedPresetKey = preset.presetKey;
            state.activeSite = preset;
            state.activeBedroomFilter = 'All';
            const customInput = document.getElementById('custom-url-input');
            if (customInput) customInput.value = '';
            const tplSelect = document.getElementById('template-select');
            if (tplSelect) tplSelect.value = preset.targetTemplateId;
            const corsCheckbox = document.getElementById('cors-fallback-checkbox');
            if (corsCheckbox) corsCheckbox.checked = Boolean(preset.widgetFallbackSimulation);
            renderAll();
            showToast('Loaded migration workspace: ' + preset.g5Schema.propertyMetadata.propertyName);
          }
        },
        [
          el('div', { className: 'rp-preset-badge', text: preset.badge }),
          el('div', { className: 'rp-preset-name', text: preset.g5Schema.propertyMetadata.propertyName }),
          el('div', { className: 'rp-preset-url', text: preset.sourceUrl })
        ]
      );
    });

    listEl.replaceChildren(...items);
  }

  function renderTemplateDropdown() {
    const selectEl = document.getElementById('template-select');
    if (!selectEl) return;
    const options = Object.values(state.templates).map((tpl) =>
      el('option', {
        value: tpl.id,
        text: tpl.name + ' — ' + tpl.category
      })
    );
    selectEl.replaceChildren(...options);
    if (state.activeSite) {
      selectEl.value = state.activeSite.targetTemplateId;
    }
  }

  function renderPipelineSteps() {
    const container = document.getElementById('pipeline-steps-container');
    if (!container || !state.activeSite) return;

    const steps = (state.activeSite.pipelineTrace || []).map((item) =>
      el('div', { className: 'rp-pipe-step' }, [
        el('div', { className: 'rp-pipe-top' }, [
          el('span', { text: item.step + '. ' + item.service }),
          el('span', { className: 'rp-pipe-time', text: item.durationMs + ' ms' })
        ]),
        el('div', { className: 'rp-pipe-desc', text: item.action })
      ])
    );

    container.replaceChildren(...steps);
  }

  function renderHitlCard() {
    const container = document.getElementById('hitl-status-container');
    if (!container || !state.activeSite) return;

    const hitl = state.activeSite.hitlApproval || {};
    if (hitl.approved) {
      const box = el('div', { className: 'rp-kv-list' }, [
        el('div', { className: 'rp-kv-row' }, [
          el('span', { text: 'Production Status:' }),
          el('strong', { styleObj: { color: '#34d399' }, text: 'APPROVED & LIVE ON G5' })
        ]),
        el('div', { className: 'rp-kv-row' }, [
          el('span', { text: 'Approved By:' }),
          el('span', { text: hitl.approvedBy })
        ]),
        el('div', { className: 'rp-kv-row' }, [
          el('span', { text: 'Spanner Audit ID:' }),
          el('span', { text: hitl.auditReceiptId })
        ])
      ]);
      container.replaceChildren(box);
      return;
    }

    const formBox = el('div', {}, [
      el('p', {
        className: 'rp-helper-text',
        text: 'Staging sites require explicit Digital Strategist sign-off before promoting to production DNS.'
      }),
      el('div', { className: 'rp-form-group' }, [
        el('label', { className: 'rp-label', for: 'hitl-approver-input', text: 'Digital Strategist Reviewer:' }),
        el('input', {
          id: 'hitl-approver-input',
          type: 'text',
          className: 'rp-input',
          value: 'Matt & Veronica (Executive Sign-Off)'
        })
      ]),
      el('button', {
        type: 'button',
        className: 'rp-btn rp-btn-emerald rp-btn-full',
        text: 'Approve & Promote Staging Site to Production',
        onClick: async () => {
          const inputEl = document.getElementById('hitl-approver-input');
          const strategistName = inputEl ? inputEl.value : 'RealPage Digital Strategist';
          try {
            const resp = await apiPost('/api/approve', {
              stagingSlug: state.activeSite.stagingSlug,
              strategistName
            });
            state.activeSite = resp.site;
            const idx = state.presets.findIndex((p) => p.stagingSlug === resp.site.stagingSlug);
            if (idx > -1) state.presets[idx] = resp.site;
            renderAll();
            openModal(
              'Production Promotion Complete • Cloud Spanner Audit Receipt',
              el('div', { className: 'rp-kv-list' }, [
                el('p', {
                  text:
                    state.activeSite.g5Schema.propertyMetadata.propertyName +
                    ' has passed all WCAG 2.1 AA and Anti-Vibe-Coding guardrails and is now promoted.'
                }),
                el('div', { className: 'rp-kv-row' }, [
                  el('span', { text: 'Audit Receipt ID:' }),
                  el('strong', { text: resp.site.hitlApproval.auditReceiptId })
                ]),
                el('div', { className: 'rp-kv-row' }, [
                  el('span', { text: 'Reviewer:' }),
                  el('span', { text: resp.site.hitlApproval.approvedBy })
                ]),
                el('div', { className: 'rp-kv-row' }, [
                  el('span', { text: 'Staging Origin:' }),
                  el('span', { text: resp.site.stagingUrl })
                ])
              ])
            );
          } catch (err) {
            showToast(err.message);
          }
        }
      })
    ]);

    container.replaceChildren(formBox);
  }

  /**
   * TAB 1: Render the Standardized G5 Property Website inside the Staging Canvas
   */
  function renderG5StagingSite() {
    const root = document.getElementById('g5-staging-site-root');
    const urlDisplay = document.getElementById('staging-url-display');
    const tplPill = document.getElementById('staging-template-pill');
    if (!root || !state.activeSite) return;

    const site = state.activeSite;
    const schema = site.g5Schema;
    const meta = schema.propertyMetadata;
    const tpl = state.templates[site.targetTemplateId] || Object.values(state.templates)[0];

    applyG5DesignTokensToRoot(site.targetTemplateId);

    if (urlDisplay) {
      const localStagingPath = '/staging/' + site.stagingSlug;
      const localFullUrl = window.location.origin + localStagingPath;
      urlDisplay.replaceChildren(
        el(
          'a',
          {
            href: localStagingPath,
            target: '_blank',
            rel: 'noopener noreferrer',
            styleObj: {
              color: '#38bdf8',
              textDecoration: 'underline',
              fontWeight: '600'
            },
            text: localFullUrl + ' ↗ (Open Full-Screen Staging Site)'
          }
        ),
        el('span', {
          styleObj: { marginLeft: '10px', opacity: '0.65', fontSize: '0.78rem' },
          text: '[Cloud Run Alias: ' + site.stagingUrl + ']'
        })
      );
    }
    if (tplPill && tpl) tplPill.textContent = tpl.name + ' • ' + tpl.tokens.wcagContrastPrimary;

    // 1. Lease Special Top Ribbon (G5HeroCarousel sub-component)
    const ribbon = el('div', { className: 'g5-special-ribbon' }, [
      el('span', { text: meta.leaseSpecialBanner }),
      el('span', { text: 'Walk Score ' + meta.walkScore + ' • ' + meta.phoneMasked })
    ]);

    // 2. Navigation Bar
    const navLinks = (schema.navigationHierarchy || []).map((nav) => {
      const children = [el('span', { text: nav.label })];
      if (nav.badge) {
        children.push(el('span', { className: 'g5-nav-badge', text: nav.badge }));
      }
      return el('a', { href: nav.anchor, className: 'g5-nav-link' }, children);
    });

    const navbar = el('nav', { className: 'g5-navbar' }, [
      el('div', { className: 'g5-brand-title', text: meta.propertyName }),
      el('div', { className: 'g5-nav-links' }, navLinks)
    ]);

    // 3. Hero Banner (Certified G5HeroCarousel)
    const hero = el(
      'section',
      {
        id: 'overview',
        className: 'g5-hero',
        styleObj: { backgroundImage: 'url("' + schema.heroMedia.primaryImage + '")' }
      },
      [
        el('div', { className: 'g5-hero-overlay' }),
        el('div', { className: 'g5-hero-content' }, [
          el('span', {
            className: 'g5-hero-kicker',
            text: 'Certified G5 Component: G5HeroCarousel • ' + meta.neighborhood
          }),
          el('h2', { className: 'g5-hero-h1', text: schema.heroMedia.headline }),
          el('p', { className: 'g5-hero-sub', text: schema.heroMedia.subheadline }),
          el('div', { className: 'g5-cta-row' }, [
            el('button', {
              type: 'button',
              className: 'g5-btn-primary',
              text: 'Explore Live Floor Plans & Pricing',
              onClick: () => {
                const fpSec = document.getElementById('floorplans');
                if (fpSec) fpSec.scrollIntoView({ behavior: 'smooth' });
              }
            }),
            el('button', {
              type: 'button',
              className: 'g5-btn-outline',
              text: 'Launch 3D Virtual Walkthrough & Self-Guided Tour',
              onClick: () => {
                const tourWidget = site.preservedWidgets[1] || site.preservedWidgets[0];
                openModal(
                  'Sandboxed 3D Virtual Tour & Tour24 Scheduler (' + tourWidget.vendor + ')',
                  el('div', { className: 'rp-kv-list' }, [
                    el('p', {
                      text:
                        'Interactive 3D Matterport / Tour24 container preserved from ' +
                        site.sourceUrl +
                        ' and hydrated inside G5DynamicTourShowcase.'
                    }),
                    el('div', { className: 'rp-kv-row' }, [
                      el('span', { text: 'DOM Anchor Selector:' }),
                      el('strong', { text: tourWidget.domAnchorSelector })
                    ]),
                    el('div', { className: 'rp-kv-row' }, [
                      el('span', { text: 'Secret Manager Isolation:' }),
                      el('span', { text: tourWidget.secretManagerRef })
                    ]),
                    el('div', { className: 'rp-kv-row' }, [
                      el('span', { text: 'Cloud Run Proxy Route:' }),
                      el('span', { text: tourWidget.corsProxyRoute })
                    ])
                  ])
                );
              }
            })
          ])
        ])
      ]
    );

    // 4. Quick Stats Bar (Certified G5QuickStatsBar)
    const statsBar = el('section', { className: 'g5-stats-strip' }, [
      el('div', { className: 'g5-stat-box' }, [
        el('div', { className: 'g5-stat-label', text: 'Property Address' }),
        el('div', { className: 'g5-stat-val', text: meta.address })
      ]),
      el('div', { className: 'g5-stat-box' }, [
        el('div', { className: 'g5-stat-label', text: 'Leasing Office Hours' }),
        el('div', { className: 'g5-stat-val', text: meta.officeHours })
      ]),
      el('div', { className: 'g5-stat-box' }, [
        el('div', { className: 'g5-stat-label', text: 'Pet Policy' }),
        el('div', { className: 'g5-stat-val', text: meta.petPolicy })
      ]),
      el('div', { className: 'g5-stat-box' }, [
        el('div', { className: 'g5-stat-label', text: 'Source CMS Migrated' }),
        el('div', { className: 'g5-stat-val', text: site.sourcePlatform })
      ])
    ]);

    // 5. Dynamic Floor Plan & Pricing Widget Section (Certified G5FloorPlanGrid + FR-2.1/2.4 Sandbox)
    const primaryWidget = site.preservedWidgets[0];
    const isFallback = Boolean(site.widgetFallbackSimulation);

    const widgetBanner = el(
      'div',
      {
        className: isFallback
          ? 'g5-widget-sandbox-banner fallback-mode'
          : 'g5-widget-sandbox-banner'
      },
      [
        el('div', {}, [
          el('strong', {
            text: isFallback
              ? 'FR-2.4 GRACEFUL DEGRADATION ACTIVE (Competitor CORS Restriction Simulated): '
              : 'FR-2.1–2.3 LIVE WIDGET HYDRATED (' + primaryWidget.vendor + '): '
          }),
          el('span', {
            text: isFallback
              ? 'External script origin blocked staging domain. Automatically serving cached crawl pricing (' +
                primaryWidget.fallbackRecordsCached +
                ' units cached) & alerting Digital Strategist to whitelist *.realpage-preview.com.'
              : 'Mounted at ' +
                primaryWidget.domAnchorSelector +
                ' via Cloud Run Proxy (' +
                primaryWidget.corsProxyRoute +
                ') with token isolated in Secret Manager (' +
                primaryWidget.maskedTokenPreview +
                ').'
          })
        ])
      ]
    );

    const filterCategories = ['All', 'Studio', '1 Bed', '2 Bed', '3 Bed'];
    const filterButtons = filterCategories.map((cat) =>
      el('button', {
        type: 'button',
        className: state.activeBedroomFilter === cat ? 'g5-filter-pill active' : 'g5-filter-pill',
        text: cat,
        onClick: () => {
          state.activeBedroomFilter = cat;
          renderG5StagingSite();
        }
      })
    );

    const filteredPlans = (schema.floorPlans || []).filter((fp) => {
      if (state.activeBedroomFilter === 'All') return true;
      return fp.category === state.activeBedroomFilter;
    });

    const floorPlanCards = filteredPlans.map((fp) => {
      const displayPrice = isFallback ? fp.cachedFallbackPrice : fp.livePrice;
      return el('article', { className: 'g5-fp-card' }, [
        el('div', {}, [
          el('span', { className: 'g5-fp-special', text: fp.specialOffer }),
          el('h4', { className: 'g5-fp-name', text: fp.name }),
          el('div', {
            className: 'g5-fp-specs',
            text:
              (fp.beds === 0 ? 'Studio' : fp.beds + ' Bed') +
              ' • ' +
              fp.baths +
              ' Bath • ' +
              fp.sqft.toLocaleString() +
              ' Sq. Ft.'
          }),
          el('div', { className: 'g5-fp-price-box' }, [
            el('div', {
              className: 'g5-fp-price',
              text: '$' + displayPrice.toLocaleString() + ' / mo'
            }),
            el('div', {
              className: 'g5-fp-avail',
              text:
                fp.availableUnits +
                ' Residence(s) Available • Move-in: ' +
                fp.moveInDate +
                (isFallback ? ' (Cached Snapshot)' : ' (Live PMS Feed)')
            })
          ])
        ]),
        el('button', {
          type: 'button',
          className: 'g5-btn-primary',
          text: 'Select Residence & Start Online Lease',
          onClick: () => {
            openModal(
              'Online Leasing Handoff • ' + fp.name,
              el('div', { className: 'rp-kv-list' }, [
                el('p', {
                  text:
                    'Sandboxed PMS Leasing Flow (' +
                    primaryWidget.vendor +
                    ') connected via Cloud Run Proxy Gateway.'
                }),
                el('div', { className: 'rp-kv-row' }, [
                  el('span', { text: 'Selected Floor Plan:' }),
                  el('strong', { text: fp.name + ' (' + fp.sqft + ' Sq. Ft.)' })
                ]),
                el('div', { className: 'rp-kv-row' }, [
                  el('span', { text: 'Quoted Monthly Rent:' }),
                  el('strong', { text: '$' + displayPrice.toLocaleString() + '/mo (' + fp.specialOffer + ')' })
                ]),
                el('div', { className: 'rp-kv-row' }, [
                  el('span', { text: 'Secret Manager Token Ref:' }),
                  el('span', { text: primaryWidget.secretManagerRef })
                ])
              ])
            );
          }
        })
      ]);
    });

    const floorPlanSection = el('section', { id: 'floorplans', className: 'g5-section' }, [
      el('div', { className: 'g5-section-header' }, [
        el('div', {}, [
          el('h3', {
            className: 'g5-section-title',
            text: 'Real-Time Floor Plans & Availability (Certified G5FloorPlanGrid)'
          })
        ]),
        el('div', { className: 'g5-filter-pills' }, filterButtons)
      ]),
      widgetBanner,
      el('div', { className: 'g5-fp-grid' }, floorPlanCards)
    ]);

    // 6. Community vs. Unit Amenities Section (Certified G5AmenityPillList)
    const commPills = (schema.amenities.community || []).map((a) =>
      el('div', { className: 'g5-amenity-pill', text: '✦ ' + a })
    );
    const unitPills = (schema.amenities.unit || []).map((a) =>
      el('div', { className: 'g5-amenity-pill', text: '✦ ' + a })
    );

    const amenitiesSection = el('section', { id: 'amenities', className: 'g5-section' }, [
      el('div', { className: 'g5-section-header' }, [
        el('h3', {
          className: 'g5-section-title',
          text: 'Curated Community & Residence Amenities (Certified G5AmenityPillList)'
        })
      ]),
      el('div', { className: 'g5-amenities-columns' }, [
        el('div', { className: 'g5-amenity-box' }, [
          el('h4', { text: 'Community-Level Amenities (Gemini Semantic Classification)' }),
          el('div', { className: 'g5-pill-wrap' }, commPills)
        ]),
        el('div', { className: 'g5-amenity-box' }, [
          el('h4', { text: 'Residence Interior Features (Gemini Semantic Classification)' }),
          el('div', { className: 'g5-pill-wrap' }, unitPills)
        ])
      ])
    ]);

    // 7. Categorized High-Res Media Gallery (Certified G5MediaGalleryMasonry)
    const galleryCards = (schema.mediaGallery || []).map((item) =>
      el('div', { className: 'g5-gallery-card' }, [
        el('img', {
          className: 'g5-gallery-img',
          src: item.imageUrl,
          alt: item.title,
          loading: 'lazy'
        }),
        el('div', {
          className: 'g5-gallery-caption',
          text: '[' + item.category + '] ' + item.title
        })
      ])
    );

    const gallerySection = el('section', { id: 'gallery', className: 'g5-section' }, [
      el('div', { className: 'g5-section-header' }, [
        el('h3', {
          className: 'g5-section-title',
          text: 'Vision-Categorized High-Res Media Gallery (Cloud Storage + Cloud CDN)'
        })
      ]),
      el('div', { className: 'g5-gallery-grid' }, galleryCards)
    ]);

    root.replaceChildren(ribbon, navbar, hero, statsBar, floorPlanSection, amenitiesSection, gallerySection);
  }

  /**
   * TAB 2: Render Third-Party Widget Sandbox & Secret Manager Inspector (FR-2.1–2.4)
   */
  function renderWidgetsInspector() {
    const root = document.getElementById('widgets-inspector-root');
    if (!root || !state.activeSite) return;

    const cards = (state.activeSite.preservedWidgets || []).map((w) =>
      el('div', { className: 'rp-info-panel' }, [
        el('h3', { text: w.vendor }),
        el('p', { className: 'rp-helper-text', text: w.type }),
        el('div', { className: 'rp-kv-list' }, [
          el('div', { className: 'rp-kv-row' }, [
            el('span', { text: 'DOM Anchor Selector (FR-2.2):' }),
            el('strong', { text: w.domAnchorSelector })
          ]),
          el('div', { className: 'rp-kv-row' }, [
            el('span', { text: 'External Script Origin:' }),
            el('span', { text: w.scriptOrigin })
          ]),
          el('div', { className: 'rp-kv-row' }, [
            el('span', { text: 'Secret Manager Isolation (FR-2.3):' }),
            el('span', { text: w.secretManagerRef })
          ]),
          el('div', { className: 'rp-kv-row' }, [
            el('span', { text: 'Masked Token Preview:' }),
            el('strong', { styleObj: { color: '#fbbf24' }, text: w.maskedTokenPreview })
          ]),
          el('div', { className: 'rp-kv-row' }, [
            el('span', { text: 'Cloud Run Proxy Gateway:' }),
            el('span', { text: w.corsProxyRoute })
          ]),
          el('div', { className: 'rp-kv-row' }, [
            el('span', { text: 'FR-2.4 Fallback Records Cached:' }),
            el('strong', { styleObj: { color: '#34d399' }, text: w.fallbackRecordsCached + ' Units Cached in Spanner' })
          ])
        ])
      ])
    );

    root.replaceChildren(...cards);
  }

  /**
   * TAB 3: Render Gemini 2.0 Pro G5 Schema & Section 6 Anti-Vibe-Coding Lock Inspector
   */
  function renderSchemaInspector() {
    const root = document.getElementById('schema-inspector-root');
    if (!root || !state.activeSite) return;

    const componentRows = state.certifiedComponents.map((c) =>
      el('div', { className: 'rp-kv-row' }, [
        el('strong', { text: c.componentId + ' (v' + c.version + ')' }),
        el('span', { text: c.wcagStatus + ' — ' + c.purpose })
      ])
    );

    const leftPanel = el('div', { className: 'rp-info-panel' }, [
      el('h3', { text: 'Section 6 Anti-"Vibe Coding" Deterministic Component Lock' }),
      el('p', {
        className: 'rp-helper-text',
        text: 'Gemini 2.0 Pro is strictly blocked from writing unconstrained HTML/CSS. It can only populate this certified G5 component allowlist:'
      }),
      el('div', { className: 'rp-kv-list' }, componentRows),
      el('h3', { styleObj: { marginTop: '1rem' }, text: 'Legacy Unstructured Source Markup (Pre-Ingestion)' }),
      el('pre', { className: 'rp-code-block', text: state.activeSite.legacyDomSample })
    ]);

    const rightPanel = el('div', { className: 'rp-info-panel' }, [
      el('h3', { text: 'Normalized G5 Design System JSON Schema (Vertex AI Gemini 2.0 Pro Output)' }),
      el('p', {
        className: 'rp-helper-text',
        text: 'Typed, validated schema persisted in Cloud Spanner & bound to G5 presentation templates:'
      }),
      el('pre', {
        className: 'rp-code-block',
        text: JSON.stringify(state.activeSite.g5Schema, null, 2)
      })
    ]);

    root.replaceChildren(leftPanel, rightPanel);
  }

  /**
   * TAB 4: Render GCP Native Architecture & Section 8 Stakeholder Technical Q&A Matrix
   */
  function renderArchitectureInspector() {
    const root = document.getElementById('architecture-inspector-root');
    if (!root) return;

    const qaItems = [
      {
        q: 'Q1. Widget Authentication & CORS Policies (*.realpage-preview.com)',
        a: 'Solved via the Cloud Run Widget Proxy Gateway (FR-2.3) + FR-2.4 Graceful Degradation Fallback. If an Entrata or YieldStar script restricts domain origin via CORS, requests route through proxy.realpage-preview.com with header rewriting, or immediately degrade to cached crawl pricing while alerting the Strategist.'
      },
      {
        q: 'Q2. G5 Presentation Layer Specs (Ruby ERB/Liquid vs. Headless Cloud Run SSR)',
        a: 'Dual-Adapter Output: The Normalized G5 JSON Schema compiles deterministically into both G5 Ruby Liquid/ERB templates (for immediate drop-in to the 16,000 G5 fleet) AND containerized Cloud Run SSR bundles, keeping G5 core billing, CRM, and database back-ends 100% untouched.'
      },
      {
        q: 'Q3. Legacy ODBC & Direct Database Connectors',
        a: 'Zero direct TCP/ODBC connections are exposed to the browser or staging containers. Legacy ODBC-backed pricing feeds are wrapped behind an internal Cloud Run VPC Connector REST API Bridge secured by Cloud KMS & Secret Manager.'
      },
      {
        q: 'Q4. Target Design System Assets & Figma Token Grounding',
        a: 'Grounded directly in G5 Design System tokens (Typography scales, Hex palettes, Spacing variables) with automated WCAG 2.1 AA contrast verification (minimum 4.5:1 body / 7.0:1 primary contrast enforced prior to HITL sign-off).'
      }
    ];

    const qaPanel = el('div', { className: 'rp-info-panel' }, [
      el('h3', { text: 'Section 8: Technical Stakeholder Q&A Resolution Matrix (Matt & Veronica Review)' }),
      el(
        'div',
        { className: 'rp-kv-list' },
        qaItems.map((item) =>
          el('div', { styleObj: { marginBottom: '0.65rem' } }, [
            el('div', { styleObj: { fontWeight: '700', color: '#ffffff' }, text: item.q }),
            el('div', { className: 'rp-helper-text', text: item.a })
          ])
        )
      )
    ]);

    const gcpPanel = el('div', { className: 'rp-info-panel' }, [
      el('h3', { text: 'Section 4: GCP-Native Serverless Architecture Stack' }),
      el('pre', {
        className: 'rp-code-block',
        text: [
          '1. Ingestion & Crawling:   Cloud Run Jobs + Headless Playwright (Mobile/Tablet/Desktop)',
          '2. Asset & Media Lake:     Cloud Storage (GCS) + Cloud CDN (WebP Auto-Transcoding)',
          '3. Multimodal AI Engine:   Vertex AI Gemini 2.0 Pro (Layout, Copy & Widget Extraction)',
          '4. Governance Harness:     Google Cloud Antigravity (Certified G5 Component Lock)',
          '5. State & Audit Store:    Cloud Spanner (ACID Migration State & HITL Sign-Off Receipts)',
          '6. Secrets Isolation:      Secret Manager + Cloud KMS (PMS API Keys & Widget Tokens)',
          '7. Staging Execution:      Cloud Build -> Artifact Registry -> Cloud Run SSR + IAP + Cloud Armor'
        ].join('\n')
      })
    ]);

    root.replaceChildren(qaPanel, gcpPanel);
  }

  function renderAll() {
    renderPresetSelectorList();
    renderPipelineSteps();
    renderHitlCard();
    renderG5StagingSite();
    renderWidgetsInspector();
    renderSchemaInspector();
    renderArchitectureInspector();
  }

  function bindEvents() {
    // Modal close events
    const modalCloseBtn = document.getElementById('rp-modal-close');
    if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
    const backdrop = document.getElementById('rp-modal-backdrop');
    if (backdrop) {
      backdrop.addEventListener('click', (ev) => {
        if (ev.target === backdrop) closeModal();
      });
    }

    // Tab switching
    const tabButtons = document.querySelectorAll('.rp-tab');
    tabButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const targetId = btn.getAttribute('data-tab');
        tabButtons.forEach((b) => {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');

        document.querySelectorAll('.rp-tab-panel').forEach((panel) => {
          panel.classList.remove('active');
        });
        const targetPanel = document.getElementById(targetId);
        if (targetPanel) targetPanel.classList.add('active');
      });
    });

    // Viewport switcher (Desktop / Tablet / Mobile)
    const vpButtons = document.querySelectorAll('.rp-vp-btn');
    vpButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const vp = btn.getAttribute('data-vp') || 'desktop';
        vpButtons.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        const wrapper = document.getElementById('staging-viewport-wrapper');
        if (wrapper) {
          wrapper.className = 'rp-viewport-wrapper vp-' + vp;
        }
      });
    });

    // Live G5 Template Variant Change
    const tplSelect = document.getElementById('template-select');
    if (tplSelect) {
      tplSelect.addEventListener('change', async () => {
        if (!state.activeSite) return;
        try {
          const resp = await apiPost('/api/template', {
            stagingSlug: state.activeSite.stagingSlug,
            templateId: tplSelect.value
          });
          state.activeSite = resp.site;
          renderAll();
          showToast('Applied G5 Design System Template: ' + state.templates[tplSelect.value].name);
        } catch (err) {
          showToast(err.message);
        }
      });
    }

    // FR-2.4 Competitor CORS Block Simulation Toggle
    const corsCheckbox = document.getElementById('cors-fallback-checkbox');
    if (corsCheckbox) {
      corsCheckbox.addEventListener('change', async () => {
        if (!state.activeSite) return;
        try {
          const resp = await apiPost('/api/widget-mode', {
            stagingSlug: state.activeSite.stagingSlug,
            simulateCorsBlock: corsCheckbox.checked
          });
          state.activeSite = resp.site;
          renderAll();
          showToast(
            corsCheckbox.checked
              ? 'FR-2.4 Fallback Active: Serving cached pricing snapshot & alerting Strategist.'
              : 'Live Cloud Run Proxy Mode Restored: Hydrating real-time PMS pricing feed.'
          );
        } catch (err) {
          showToast(err.message);
        }
      });
    }

    // Run One-Click Lift & Shift Pipeline Button
    const runBtn = document.getElementById('run-ingestion-btn');
    if (runBtn) {
      runBtn.addEventListener('click', async () => {
        const customUrlInput = document.getElementById('custom-url-input');
        const customUrl = customUrlInput ? customUrlInput.value.trim() : '';
        const templateId = tplSelect ? tplSelect.value : 'g5-luxe-highrise';

        runBtn.disabled = true;
        runBtn.textContent = 'Running Cloud Run Crawler & Gemini 2.0 Pro...';

        try {
          const resp = await apiPost('/api/ingest', {
            presetKey: customUrl ? '' : state.selectedPresetKey,
            customUrl,
            templateId
          });
          state.activeSite = resp.site;
          const existingIdx = state.presets.findIndex((p) => p.stagingSlug === resp.site.stagingSlug);
          if (existingIdx > -1) {
            state.presets[existingIdx] = resp.site;
          } else {
            state.presets.unshift(resp.site);
          }
          renderAll();
          const localUrl = window.location.origin + '/staging/' + resp.site.stagingSlug;
          showToast('Staging Site Live: ' + localUrl + ' (rendered in canvas & clickable in URL bar)');
        } catch (err) {
          showToast(err.message);
        } finally {
          runBtn.disabled = false;
          runBtn.textContent = 'Run One-Click Lift & Shift Pipeline';
        }
      });
    }
  }

  async function init() {
    try {
      const response = await fetch('/api/bootstrap', { credentials: 'same-origin' });
      const data = await response.json();
      state.csrfToken = data.csrfToken;
      state.strategistRole = data.strategistRole;
      state.templates = data.templates || {};
      state.certifiedComponents = data.certifiedComponents || [];
      state.presets = data.presets || [];
      state.activeSite = state.presets[0] || null;

      if (window.location.pathname.indexOf('/staging/') === 0) {
        const slug = window.location.pathname.replace('/staging/', '').trim();
        const matched = state.presets.find((p) => p.stagingSlug === slug);
        if (matched) {
          state.activeSite = matched;
        }
        const topbar = document.querySelector('.rp-topbar');
        const sidebar = document.querySelector('.rp-sidebar');
        const toolbar = document.querySelector('.rp-stage-toolbar');
        const chrome = document.querySelector('.rp-browser-chrome');
        const workspace = document.querySelector('.rp-workspace');
        const mainStage = document.querySelector('.rp-main-stage');
        const vpWrapper = document.getElementById('staging-viewport-wrapper');
        if (topbar) topbar.style.display = 'none';
        if (sidebar) sidebar.style.display = 'none';
        if (toolbar) toolbar.style.display = 'none';
        if (chrome) chrome.style.display = 'none';
        if (workspace) {
          workspace.style.display = 'block';
          workspace.style.gridTemplateColumns = '1fr';
          workspace.style.padding = '0';
          workspace.style.maxWidth = '100%';
          workspace.style.width = '100%';
        }
        if (mainStage) {
          mainStage.style.width = '100%';
          mainStage.style.maxWidth = '100%';
        }
        if (vpWrapper) {
          vpWrapper.style.maxWidth = '100%';
          vpWrapper.style.width = '100%';
          vpWrapper.style.border = 'none';
          vpWrapper.style.borderRadius = '0';
          vpWrapper.style.margin = '0';
        }
        if (state.activeSite && state.activeSite.g5Schema) {
          const propName = state.activeSite.g5Schema.propertyMetadata.propertyName;
          document.title = propName + ' | RealPage G5 Cloud Run Staging';
          const standaloneBar = el(
            'div',
            {
              styleObj: {
                background: '#09101f',
                borderBottom: '1px solid #1e293b',
                color: '#e2e8f0',
                padding: '8px 20px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '0.8rem',
                fontFamily: 'Inter, system-ui, sans-serif'
              }
            },
            [
              el('div', { styleObj: { display: 'flex', alignItems: 'center', gap: '10px' } }, [
                el('span', {
                  styleObj: {
                    background: 'rgba(16, 185, 129, 0.18)',
                    color: '#34d399',
                    padding: '2px 8px',
                    borderRadius: '999px',
                    fontWeight: '700',
                    fontSize: '0.7rem'
                  },
                  text: 'CLOUD RUN STAGING LIVE'
                }),
                el('span', {
                  text: propName + ' (' + state.activeSite.stagingUrl + ')'
                })
              ]),
              el('a', {
                href: '/',
                styleObj: {
                  color: '#38bdf8',
                  textDecoration: 'none',
                  fontWeight: '600'
                },
                text: '← Back to RePlatform Strategist Console'
              })
            ]
          );
          document.body.insertBefore(standaloneBar, document.body.firstChild);
        }
      }

      renderTemplateDropdown();
      bindEvents();
      renderAll();
    } catch (_err) {
      showToast('Failed to initialize Project RePlatform console.');
    }
  }

  document.addEventListener('DOMContentLoaded', init);
})();
