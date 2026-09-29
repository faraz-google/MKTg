# RealPage G5 v9.0 Enterprise CMS Studio (`/g5-cms`)

A standalone, zero-dependency **G5 v9.0 Enterprise Content Management System (CMS)** built from scratch for the RealPage executive review with Veronica (VP Demand Marketing) and Matt.

> Part of the [RealPage Project RePlatform Monorepo](../README.md).

---

## Quick Start

```bash
node g5-cms/server.js
```

Open **`http://127.0.0.1:3001`** in your browser.
- **Standalone Full-Screen Property Previews**:
  - `http://127.0.0.1:3001/preview/2424-tulane-nola` (**2424 Tulane Apartments** — `https://www.2424tulane.com/`)
  - `http://127.0.0.1:3001/preview/el-patio-laredo` (**El Patio Apartments** — `https://www.patioaptslaredo.com/`)
  - `http://127.0.0.1:3001/preview/rockvale-circle-jp` (**Rockvale Circle Cooperative** — `https://www.rockvalecircle.com/`)
  - `http://127.0.0.1:3001/preview/kensington-legacy-west` (**The Kensington at Legacy West** — Legacy Kentico 12 migrated to G5 v9.0)

---

## Core CMS Studio Modules

1. **Visual Page Builder & Live G5 v9.0 Preview (`mod-split-studio`)**
   - Toggle, reorder (`↑`/`↓`), or add certified G5 v9.0 (`Alpine - Simple`) Page Stripes (`G5StickyBannerV2`, `G5HeroGalleryBasic`, `G5FeaturedContentPopOut`, `G5QuickStatsBar`, `G5NumberedAmenityBadges`, `G5FloorPlanGrid`, `G5PhotoCardsMosaic`, `G5AmenityPillList`, `G5PromotedReviewsSlider`, `G5AeoStructuredDataGraph`, `G5FirstPartyConsentBanner`).
   - Edit property metadata, sticky lease special banner, Hero H1/subheadline, Cloudinary/GCS hero image, Featured Pop-Out modal copy, and `01`–`04` numbered outline badges with real-time split-screen preview.
2. **Floor Plans (PMS/IUI Inventory) & Media DAM (`mod-floorplans-dam`)**
   - Full CRUD for Floor Plans (create new floor plans, update live rent, available units, and special offers, or delete plans) plus Community/Unit Amenity & Cloudinary/GCS Media DAM management.
3. **Interactive Client-Facing AI Intake Agent (`mod-intake-agent` — Feature 3)**
   - Self-service conversational Vertex AI agent for property managers who "don't have time for a phone call." Converts natural-language requests into structured G5 CMS config mutations while enforcing Figma API Guardrails.
4. **RealPage Data Hub MCP Intake Engine (`mod-datahub` — Feature 1)**
   - 1-click pull from RealPage's global onboarding tool ("Data Hub" profiles `DH-NOLA-2424`, `DH-LRD-5908`, `DH-BOS-02130`, `DH-PLN-5900`) to pre-populate canonical property data and eliminate 40+ redundant onboarding questions.
5. **Vendor Shedding, First-Party Spanner Consent & AEO Engine (`mod-vendors-aeo` — Feature 2)**
   - Sheds performance-degrading third-party scripts found on legacy sites (`OneTrust OtAutoBlock.js`, `Honeybadger`, `CloudFront` trackers, 3rd-party ADA overlays) in favor of Cloud Run Jobs Lighthouse/WCAG 2.1 AA audits (`58 -> 98`), Cloud Spanner first-party consent receipts, and Schema.org `ApartmentComplex` JSON-LD for **AI-Engine Optimization (AEO)**.
6. **Firestore & BigQuery Historic Audit Log + 1-Click Rollback (`mod-audit-rollback` — Feature 4)**
   - Streams every CMS edit, Page Builder stripe reorder, Floor Plan update, Data Hub sync, and Client AI Intake change into an immutable version history (`v1.0`, `v2.0`, ...) with instant **1-Click Rollback**.
