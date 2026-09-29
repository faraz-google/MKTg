# Product Requirement Document (PRD): Project RePlatform

| Attribute | Details |
| :--- | :--- |
| **Product Name** | RealPage Autonomous Site Ingestion, Client Experience & G5 Presentation Engine (Project RePlatform) |
| **Document Version** | 2.0 (Executive Alignment for Monday 2:00 PM CT Review w/ Veronica & Matt) |
| **Author** | Faraz Javaid (Google Cloud AI/ML CE) & Sabri (Google Cloud ProServe) |
| **Target Launch / Pilot** | **< 8 Weeks End-to-End Pilot** (Fully Funded via $1.4M Gemini Enterprise Deal w/ Google ProServe) |
| **Primary Executive Sponsors** | Veronica (VP Demand Marketing), Matt (Marketing), Kemera Reuben (Google Cloud) |
| **Target Scale** | ~16,000 G5 Ruby/Cloud sites + 4,000 Kentico/Custom sites |

---

## 1. Executive Summary & Strategic Positioning

### 📌 Key Takeaway & Operational Differentiator
RealPage is actively comparing Google's multi-dimensional **Gemini Enterprise Platform** against a narrow, "ready-to-go out-of-the-box" point solution from a competitor. Veronica and Matt are intensely focused on **time-to-value (targeting a production pilot in < 8 weeks)** and **immediate relief from client support friction**.

To win and deliver lasting enterprise value, Project RePlatform is architected not merely as a site builder, but as an **end-to-end operational and client-experience differentiator** that:
1. **Eliminates Onboarding Friction:** Connects directly to RealPage's **Data Hub** and provides a **24/7 Interactive Client-Facing Intake Agent** for property managers who "don't have time for a phone call."
2. **Sheds Expensive, Performance-Degrading Third-Party Vendors:** Replaces bloated third-party scripts (OneTrust `cdn.cookielaw.org`, Honeybadger, external ADA overlays, third-party tracking proxies) with **GCP-native first-party WCAG/ADA auditing, server-side consent logging, and first-party CDN telemetry**.
3. **Ends the Support "Black Hole":** Streams every template edit, AI intake config change, and deployment state into **Firestore** and **BigQuery** with a **One-Click Rollback Audit UI**.
4. **Dominates AEO (AI-Engine Optimization) Over Legacy SEO:** Positions Gemini Enterprise as the future single pane of glass for multi-family real estate discovery, automatically synthesizing structured Schema.org `ApartmentComplex` JSON-LD, semantic amenity graphs, and conversational search endpoints that narrow point solutions cannot match.
5. **Nullifies Competitor Speed Claims via Funded Google ProServe Delivery:** Google's Professional Services (ProServe) team led by Sabri is **fully funded under the $1.4M Gemini Enterprise agreement** to deliver this customized production system in **8 weeks or less**.

```text
                                  +-------------------------------------------------------+
                                  |        INTAKE, DESIGN & DATA HUB CONTROL PLANE        |
                                  |  RealPage Data Hub (MCP) + Client Intake Agent + Figma|
                                  +---------------------------+---------------------------+
                                                              |
                                                              v
+-----------------------------+   +-------------------------------------------------------+   +-----------------------------+
|    SOURCE PROPERTY SITES    |   |          VERTEX AI GEMINI ENTERPRISE HARNESS          |   |   TARGET STAGING PLATFORM   |
|  - Legacy Kentico Sites     |-->|  - Multimodal Layout Parsing (Gemini 2.0 Pro)         |-->|  - Cloud Run Serverless SSR |
|  - Scraped G5 v9.0 Sites    |   |  - Figma API Token & G5 Alpine v9.0 Schema Lock       |   |  - 1st-Party Consent & WCAG |
|  - Competitor URLs          |   |  - Widget Sandbox + AEO (AI-Engine Optimization)      |   |  - Instant Staging Previews |
+-----------------------------+   +---------------------------+---------------------------+   +-----------------------------+
                                                              |
                                                              v
                                  +-------------------------------------------------------+
                                  |       GOVERNANCE, VENDOR-SHEDDING & AUDIT LAYER       |
                                  |  Firestore + BigQuery Rollbacks + Spanner Consent Log |
                                  +-------------------------------------------------------+
```

### Key Business Goals
* **8-Week Time-to-Value (ProServe Backed):** Deliver a working production pilot in **< 8 weeks** (fully funded under the $1.4M GE deal), compressing per-site stand-up time from 30–40 days down to **< 15 minutes** for staging generation and **< 48 hours** for production sign-off.
* **Shed Legacy Third-Party Vendors:** Eliminate third-party compliance, tracking, and accessibility script bloat (OneTrust, Honeybadger, external overlays) using native Cloud Run Lighthouse jobs, Cloud Spanner consent logging, and Cloud CDN first-party telemetry.
* **Preserve G5 Core Backend:** Modernize the presentation, intake, and governance layers immediately while keeping G5's underlying billing, CRM, and leasing database connectors intact.
* **AI-Engine Optimization (AEO) Leadership:** Future-proof all 20,000+ RealPage property websites for AI-native apartment search (Gemini, Search Generative Experience, conversational leasing agents) with automated structured data and semantic entity graphs.

---

## 2. User Personas & Use Cases

| Persona | Role | Primary Objective | Pain Point Addressed |
| :--- | :--- | :--- | :--- |
| **Digital Strategist (RealPage)** | Client account growth & marketing ops | Rapidly migrate Kentico & competitor sites using Data Hub auto-intake and G5/Figma guardrails. | Eliminates 40-day manual queue and redundant client onboarding questionnaires. |
| **Property Manager (Client)** | Multi-family property marketing manager | Self-serve onboarding and brand updates via an interactive conversational agent without scheduling phone calls. | Eliminates phone-tag delays and the "black hole" of waiting weeks for simple template edits. |
| **Support & Ops Engineer (RealPage)** | CMS maintenance & tier-2 support | Inspect historical configuration changes and execute instant 1-click rollbacks when client edits break layouts. | Solves untracked template edits, clunky ticketing, and broken production states. |
| **Prospective Tenant (End User & AI Search)** | Apartment seeker / AI Search Agent | Discover properties via AI search (AEO), view real-time floor plans, and initiate leases with fast, accessible pages. | Eliminates slow third-party cookie/overlay scripts, broken widgets, and mobile layout shifts. |

---

## 3. Core Capabilities & Functional Requirements

### Capability 1: One-Click Lift & Shift Migration Engine (Kentico to G5 v9.0)
The platform ingests legacy Kentico or external property URLs and outputs a fully formed, brand-compliant G5 site grounded in real G5 v9.0 (`Alpine - Simple`) component models and Figma tokens.

```text
+------------------+       +-------------------+       +--------------------+       +-------------------+
|  1. Data Hub +   |  -->  |  2. Extraction    |  -->  |  3. Transformation |  -->  |  4. Generation    |
|  Crawler Ingest  |       |  DOM, Assets,     |       |  Figma + G5 v9.0   |       |  Cloud Build &    |
|  Cloud Run Job   |       |  Copy to GCS      |       |  Design Token Lock |       |  Cloud Run Deploy |
+------------------+       +-------------------+       +--------------------+       +-------------------+
```

#### Detailed Functional Specs:
* **FR-1.1 Headless Site Crawler:** Distributed crawler deployed on Cloud Run Jobs utilizing Playwright/Puppeteer. Executes deep DOM traversal, downloads high-res media assets to Cloud Storage (GCS), and captures viewport screenshots across mobile (`390px`), tablet (`768px`), and desktop (`1440px`).
* **FR-1.2 Multimodal Semantic Parsing:** Ingests raw HTML, CSS stylesheets, and screenshots into Vertex AI (Gemini 2.0 Pro) to semantically extract Property Metadata, Community vs. Unit Amenities, Media Galleries, and Navigation Hierarchy.
* **FR-1.3 Scraped G5 v9.0 & Figma Token Mapping Engine:** Normalizes unstructured content into a typed JSON schema adhering to RealPage's latest G5 v9.0 (`Alpine - Simple`) production reference sites (`2424tulane.com`, `patioaptslaredo.com`, `rockvalecircle.com`) and strict Figma API spacing/style tokens.
* **FR-1.4 One-Click Staging Link Deployment:** Automatically builds and deploys a containerized SSR preview to Cloud Run (`https://staging-[client-slug].realpage-preview.com`) protected by Identity-Aware Proxy (IAP).

---

### Capability 2: Third-Party Widget & Dynamic Script Preservation
Multi-family real estate sites rely on external JavaScript widgets connecting to Property Management Systems (PMS) for live leasing and pricing.

#### Detailed Functional Specs:
* **FR-2.1 Dynamic Script Identification:** Intercepts network calls and DOM mutations to identify script tags and iframes matching real estate vendor signatures (RealPage YieldStar, LRO, OneSite, Knock CRM, Entrata, Yardi RentCafe, Matterport, Tour24, G5 Call Tracking Edge `cpnsUrl`, and G5 Enhanced Lead Forms).
* **FR-2.2 Container & Configuration Sandboxing:** Extracts initialization snippets, DOM anchor selectors, location URNs (`g5-cl-*`), and runtime configuration JSON blocks.
* **FR-2.3 Secure Ingestion & Secrets Isolation:** Extracts public/private tokens into **Google Cloud Secret Manager** and routes cross-origin widget requests through a **Cloud Run Proxy Gateway**.
* **FR-2.4 Fallback & Graceful Degradation:** If an external widget fails to render due to competitor CORS domain locks, the engine automatically renders an interactive cached pricing snapshot from Cloud Spanner and alerts the Digital Strategist.

---

### Capability 3: RealPage "Data Hub" Integration (Autonomous Intake Engine)
Eliminates redundant customer onboarding questions by pulling structured property records directly from RealPage's global onboarding system ("Data Hub") before crawling or prompting the client.

| Feature Category | Core Requirement & Capability | GCP-Native Implementation |
| :--- | :--- | :--- |
| **1. Data Hub Integration (Intake Engine)** | • Integrate directly with RealPage's global onboarding tool ("Data Hub") to pull structured properties like addresses, property names, store URNs, and URLs.<br>• Eliminates redundant customer questions during onboarding. | • Secure connector built with **Vertex AI Agent Builder** and **Cloud Functions** (2nd Gen) to fetch intake profiles from the Data Hub via an **MCP (Model Context Protocol) Server** or REST API. |

#### Detailed Functional Specs:
* **FR-3.1 MCP Server & REST Connector for Data Hub:** Exposes a standardized Model Context Protocol (MCP) tool (`get_datahub_property_profile`) hosted on Cloud Functions / Cloud Run that queries RealPage Data Hub by Client ID, Store URN, or Property Name.
* **FR-3.2 Pre-Populated Property Hydration:** Automatically hydrates canonical property fields—Street Address, City/State/Zip, Leasing Phone, Office Hours (`OpeningHoursSpecification`), GeoCoordinates, Corporate Parent (`G5_CLIENT_ID`), and PMS Floor Plan Feed IDs—prior to site generation.
* **FR-3.3 Zero-Redundancy Delta Detection:** Compares Data Hub records against crawled source DOM data and flags only missing or conflicting fields for the client or Digital Strategist to confirm.

---

### Capability 4: Core Platform Capabilities, "Shedding Vendors" & AEO Readiness
Replaces expensive, performance-degrading third-party compliance, tracking, and accessibility tools (such as OneTrust `OtAutoBlock.js`, Honeybadger, CloudFront third-party scripts, and external ADA overlays) with high-speed, first-party GCP-native capabilities and AI-Engine Optimization (AEO).

| Feature Category | Core Requirement & Capability | GCP-Native Implementation |
| :--- | :--- | :--- |
| **2. Core Platform Capabilities & "Shedding Vendors"** | • Replace third-party compliance, tracking, and accessibility tools that degrade page speed and Core Web Vitals.<br>• Provide out-of-the-box solutions for **WCAG/ADA accessibility** and **OneTrust-style cookie consent/privacy management**. | • Run automated **Lighthouse / WCAG 2.1 AA accessibility** audits using **Cloud Run Jobs**.<br>• Implement server-side cookie/consent logging w/ **Cloud Spanner** and secure first-party tracking via **Cloud DNS / Cloud CDN** for complete first-party data ownership. |

#### Detailed Functional Specs:
* **FR-4.1 Automated Lighthouse & WCAG/ADA Compliance Engine (Cloud Run Jobs):** Every migration and template update triggers a headless Lighthouse + Axe-core accessibility audit on Cloud Run Jobs, enforcing WCAG 2.1 AA contrast ratios, focus ring states (`--wcag_focus_primary`), ARIA landmarks, and alt-text completeness without bloated third-party JS overlays.
* **FR-4.2 Native First-Party Privacy & Consent Manager (Replacing OneTrust):** Replaces external `cdn.cookielaw.org` / `otSDKStub.js` scripts with a zero-layout-shift, server-rendered G5 Privacy & Consent Banner. User consent receipts (GDPR/CCPA/CPRA categories) are logged with cryptographic timestamps directly into **Cloud Spanner**.
* **FR-4.3 First-Party Edge Telemetry (Cloud DNS + Cloud CDN):** Routes analytics and call-tracking attribution (`G5_DNI_SCRIPT_ID`) through first-party Cloud CDN edge endpoints, eliminating third-party cookie blocking and improving Lighthouse Performance scores from ~58 to **96+**.
* **FR-4.4 AI-Engine Optimization (AEO) Over Legacy SEO:** Automatically synthesizes rich Schema.org `ApartmentComplex`, `PostalAddress`, `GeoCoordinates`, `OpeningHoursSpecification`, and live unit availability graphs so Gemini, Google AI Overviews, and conversational search engines rank and cite RealPage properties as the authoritative source.

---

### Capability 5: Interactive Client-Facing Intake Agent
Provides a self-service conversational AI onboarding experience for property managers and regional directors who "don't have time for a phone call."

| Feature Category | Core Requirement & Capability | GCP-Native Implementation |
| :--- | :--- | :--- |
| **3. Interactive Client-Facing Intake Agent** | • Provide a self-service interactive agent interface for clients who "don't have time for a phone call."<br>• The agent guides the client through a conversation to capture design preferences, brand styles, and configurations. | • Deploy a conversational **Vertex AI Agent** fronted by a simple, highly interactive web app on **Cloud Run**.<br>• Output structured config variables straight to the developer pipeline. |

#### Detailed Functional Specs:
* **FR-5.1 Conversational Brand & Style Discovery:** Grounded in the property's pre-loaded Data Hub profile, the Vertex AI Agent asks targeted, high-leverage questions (e.g., target resident demographic, preferred G5 v9.0 / Figma palette, lease special promotions, pet policy highlights).
* **FR-5.2 Live Visual Preview Mutation:** As the client converses with the Intake Agent, responses are compiled in real time into deterministic G5 CSS theme tokens (`--theme_primary_color`, `--theme_secondary_color`, `--theme_tertiary_color`, `--theme_primary_font`) and schema attributes, updating the live staging preview immediately.
* **FR-5.3 Structured Pipeline Handoff:** Outputs a validated, schema-locked JSON configuration payload directly into the Cloud Build / Cloud Run developer pipeline and records an audit entry in Firestore.

---

### Capability 6: Historic Logging, Support Audit Trails & One-Click Rollbacks
Solves the support "black hole" of untracked client template edits and broken configurations by introducing immutable version history and instant rollbacks.

| Feature Category | Core Requirement & Capability | GCP-Native Implementation |
| :--- | :--- | :--- |
| **4. Historic Logging & Support Audit Trails** | • Solve the "black hole" of untracked client template edits by introducing historical configuration logging and rollbacks. | • Stream all configuration changes and deployment states directly into **Firestore** and **BigQuery** w/ a developer audit log UI, enabling one-click rollbacks. |

#### Detailed Functional Specs:
* **FR-6.1 Real-Time Configuration Event Streaming:** Every action—Data Hub sync, Client Intake Agent update, Figma token synchronization, Strategist template switch, or HITL approval—writes an immutable revision document to **Cloud Firestore** and streams an analytics row to **BigQuery**.
* **FR-6.2 Visual Diff & Support Audit Trail UI:** Support engineers and Digital Strategists can view a chronological timeline of every revision (`v1`, `v2`, `v3`...), including the actor, timestamp, changed tokens/fields, and Cloud Run revision hash.
* **FR-6.3 Instant One-Click Rollback:** Support staff can click **"Rollback to Revision"** on any historical state in the Audit UI to immediately restore previous G5 design tokens, widget bindings, and copy in under 2 seconds.

---

## 4. Design & Template Strategy: Figma API Connector & Scraped G5 v9.0 Reference Models

Matt confirmed that RealPage wants migrated sites dropped into **strict, custom-designed parameter sets** rather than allowing unconstrained AI layout generation.

### 4.1 Direct Figma API Connector (Strict Guardrails)
* **Figma REST API / MCP Integration:** The platform connects directly to RealPage's Figma design files via the Figma API (`/v1/files/:file_key/variables/local` & `/v1/files/:file_key/nodes`).
* **Deterministic Token Extraction:** The engine parses Figma Variable Collections (spacing scales, typography tokens, border radii, upper/lowercase header transforms, and color variables) and compiles them into locked CSS custom properties (`--theme_primary_color`, `--theme_secondary_color`, `--theme_tertiary_color`, `--theme_header_color`, `--theme_body_link_color`, `--theme_primary_font`, `--theme_secondary_font`).
* **Zero Freeform Layout Drift:** Gemini 2.0 Pro is strictly prohibited from inventing arbitrary DOM structures; it populates only certified G5 v9.0 stripe and widget containers governed by the Figma variable contract.

### 4.2 Scraped G5 v9.0 ("Alpine - Simple") Production Reference Templates
Per Faraz's recommendation, the platform has ingested the three newly released G5 v9.0 production URLs provided by Matt to extract their exact styling tokens, `dataLayer` metadata, and component models:

| Reference Property | Live G5 URL | Extracted G5 Store / Client URN & Theme | Extracted CSS Design Tokens (`:root`) | Extracted G5 v9.0 Component Model |
| :--- | :--- | :--- | :--- | :--- |
| **1. 2424 Tulane Apartments** *(New Orleans, LA)* | `https://www.2424tulane.com/` | • Client: `g5-c-663rw26jd-key-management`<br>• Store: `g5-cl-1qti3ft04w-key-management-new-orleans-la`<br>• Theme: `Alpine - Simple` (`v9.0.8`) | • Primary: `#2B5C81` (Tulane Slate Blue)<br>• Secondary: `#262626` (Charcoal)<br>• Tertiary: `#A5CCC4` (Seafoam Sage)<br>• Header: `#DCE6E2`<br>• Link: `#366748`<br>• Font: `Barlow` | • `Featured Content Pop Out` ("1 Month Free!")<br>• `Content Carousel` (3-col loop)<br>• `Number Background Outline` (`01`–`04` Amenity Badges)<br>• `Top-Right-Corner` 400px radius mask<br>• Walk Score `80` / Bike Score `86` |
| **2. El Patio Apartments** *(Laredo, TX)* | `https://www.patioaptslaredo.com/` | • Client: `g5-c-69419ji7w-bp-newman-investment-company`<br>• Store: `g5-cl-1qj4co50d8-bp-newman-investment-company-laredo-tx`<br>• Theme: `Alpine - Simple` (`v9.0.7`) | • Primary: `#DCE2E2` (Cool Alabaster)<br>• Secondary: `#05323A` (Deep Teal)<br>• Tertiary: `#005A6A` (Lagoon Teal)<br>• Link/Accent: `#B28206` (Warm Ochre Gold)<br>• Fonts: `Freight Sans Pro` / `Freight Neo Cnd Pro` | • `Content Stripe` (`row-halves` & `row-uneven-thirds-1`)<br>• `Photo Cards Mosaic` (3-col Criss-Cross hover transition)<br>• `Promoted Reviews` (Chatmeter/Yext -> 1st-Party)<br>• `Contact Info Sheet` (`b-right` flyout) |
| **3. Rockvale Circle Cooperative** *(Jamaica Plain, MA)* | `https://www.rockvalecircle.com/` | • Client: `g5-c-5wq1x8clb-peabody-properties-inc`<br>• Store: `g5-cl-1pp5e1a1l9-peabody-properties-inc-jamaica-plain-ma`<br>• Theme: `Alpine - Simple` (`v9.0.5`) | • Primary: `#000000` (Architectural Black)<br>• Secondary: `#000000`<br>• Tertiary: `#747371` (Warm Stone)<br>• Link/Accent: `#627A48` (Arboretum Olive)<br>• Fonts: `Open Sans` / `Montserrat` (Uppercase `.2em` tracking) | • `Sticky Banner V2` (Top phone ribbon `833-343-6518`)<br>• `Gallery Basic` (2000x800 hero slideshow)<br>• `Photo Cards Mosaic` ("Your New Home Awaits")<br>• JPNDC & Peabody FHEO/ADA footer compliance |

---

## 5. Technical & System Architecture (GCP-Native)

| Architecture Layer | GCP Service | Functional Role |
| :--- | :--- | :--- |
| **AI Orchestration & AEO Engine** | Vertex AI Gemini 2.0 Pro | Multimodal DOM/screenshot parsing, G5 v9.0 schema normalization, and AEO JSON-LD synthesis. |
| **Data Hub & Figma Connectors** | Vertex AI Agent Builder + Cloud Functions (MCP) | Secure MCP Server & REST connectors pulling RealPage Data Hub profiles and Figma API design variables. |
| **Client-Facing Intake Agent** | Vertex AI Conversational Agent + Cloud Run | Self-service interactive client onboarding web app outputting structured config variables to the pipeline. |
| **Vendor-Shedding Compliance** | Cloud Run Jobs (Lighthouse) + Cloud Spanner | Automated WCAG 2.1 AA accessibility audits and server-side first-party cookie/consent ledger (replacing OneTrust). |
| **Historic Audit & Rollbacks** | Cloud Firestore + BigQuery | Real-time versioned configuration store, visual diff inspection, and instant 1-click rollbacks. |
| **Compute, Storage & Edge CDN** | Cloud Run SSR + Cloud Storage + Cloud CDN | Containerized G5 presentation serving, WebP media optimization, and first-party DNS/CDN tracking. |
| **Security & Secrets Governance** | Secret Manager + Cloud KMS + Cloud Armor + IAP | Isolation of PMS widget tokens, VPC Service Controls perimeter, and RBAC/HITL approval gates. |

---

## 6. Security, Governance & Mandatory Secure Web Guardrails

To satisfy enterprise multi-family compliance and Google Cloud SecureCoder standards, Project RePlatform enforces strict security controls across both the migration harness and generated sites:

* **Deterministic Component & Figma Lock (Anti-"Vibe Coding"):** Gemini 2.0 Pro cannot generate unconstrained HTML, inline scripts, or arbitrary CSS. It populates only certified G5 v9.0 components bound to Figma API token contracts.
* **Strict XSS Prevention & Safe DOM Rendering:** All frontend views in the Strategist Console, Client Intake Agent, and G5 Staging Preview are constructed exclusively via safe DOM APIs (`document.createElement`, `textContent`, `setAttribute`, `replaceChildren`) with zero usage of `innerHTML`, `outerHTML`, or `document.write`.
* **Content Security Policy (CSP) & Clickjacking Defense:** Enforces strict HTTP response headers including `Content-Security-Policy` (restricting scripts to `'self'` and images to trusted origins including GCS/Cloudinary), `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, and `Permissions-Policy`.
* **Session, CSRF & Authentication Hardening:** Uses cryptographically random session identifiers stored in `HttpOnly`, `SameSite=Lax` cookies with finite expiration, HMAC-signed Synchronizer/Double-Submit CSRF tokens required on all state-changing `POST` endpoints, per-IP rate limiting, and multi-tiered secret resolution (`process.env` -> local restricted keyfile -> CSPRNG ephemeral fallback).
* **SSRF & Path Traversal Protection:** External crawl URLs are validated against a strict `https:` public IP allow-list (blocking `localhost`, `127.0.0.1`, `169.254.x.x`, and RFC1918 private ranges), and static file resolution enforces `path.basename()` and directory prefix boundaries.
* **PII & Secret Masking:** Phone numbers, applicant emails, and PMS widget tokens are masked in strategist UI views (`***`) and isolated in Google Cloud Secret Manager.

---

## 7. 8-Week Delivery Milestones (Funded via $1.4M GE Deal + Google ProServe)

Google's Professional Services (ProServe) team (Sabri) is **fully funded under the $1.4M Gemini Enterprise agreement** to deliver this customized production platform in **8 weeks or less**, neutralizing any perceived speed advantage of narrow point-solution competitors.

| Week / Phase | Target Window | Key Deliverables (Google ProServe + CE) | Success Criteria |
| :--- | :--- | :--- | :--- |
| **Week 0: Concrete Executive Demo** | Sept 28, 2026 *(Monday 2 PM CT)* | • Live Kentico-to-G5 v9.0 migration using Matt's 3 real G5 URLs (`2424tulane.com`, `patioaptslaredo.com`, `rockvalecircle.com`).<br>• Live Data Hub MCP sync, Client Intake Agent, Vendor-Shedding WCAG/Consent, and Firestore/BigQuery Rollback UI. | Veronica and Matt validate concrete functionality ("No Pumpkin Villages") and approve 8-week pilot kickoff. |
| **Weeks 1–2: Data Hub MCP & Figma API Lock** | Weeks 1–2 | • Production MCP connector to RealPage Data Hub via Cloud Functions.<br>• Direct Figma REST API variable parser mapped to G5 `Alpine - Simple` v9.0 tokens. | Zero-touch property metadata hydration and deterministic Figma-to-G5 token compilation. |
| **Weeks 3–4: Crawler, Widget Sandbox & Vendor Shedding** | Weeks 3–4 | • Cloud Run Jobs Playwright crawler + Vertex AI Gemini 2.0 Pro multimodal extractor.<br>• First-party Cloud Spanner consent ledger (shedding OneTrust) & automated Lighthouse WCAG runner. | Migrate 10 Kentico/Competitor sites with 95+ Lighthouse scores and preserved YieldStar/LRO/Entrata widgets. |
| **Weeks 5–6: Interactive Client Intake Agent & Audit UI** | Weeks 5–6 | • Cloud Run conversational Vertex AI Intake Agent for self-service client onboarding.<br>• Firestore + BigQuery historical configuration log with 1-click support rollbacks. | Clients complete self-service brand intake in < 10 mins; support team executes 1-click rollbacks in < 2s. |
| **Weeks 7–8: Pilot Production Cutover & AEO Launch** | Weeks 7–8 | • Full pilot rollout across initial 50–100 Kentico & G5 properties.<br>• Automated AEO Schema.org graph publishing & Cloud CDN first-party tracking cutover. | **Pilot delivered in < 8 weeks**; onboarding cycle compressed from 30–40 days to < 15 minutes. |

---

## 8. Action Plan for Monday's 2:00 PM Central Meeting w/ Veronica & Matt

1. **No "Pumpkin Villages" (100% Concrete, Live Functional Demo):**
   * Demonstrate real Kentico-to-G5 migrations landing directly into the extracted styling tokens, Cloudinary media assets, and component structures of Matt's three newly released G5 v9.0 URLs:
     * **2424 Tulane Apartments** (`https://www.2424tulane.com/` — `v9.0.8`, Barlow, `#2B5C81` / `#A5CCC4`)
     * **El Patio Apartments** (`https://www.patioaptslaredo.com/` — `v9.0.7`, Freight Sans Pro, `#05323A` / `#DCE2E2` / `#B28206`)
     * **Rockvale Circle Cooperative** (`https://www.rockvalecircle.com/` — `v9.0.5`, Open Sans / Montserrat, `#000000` / `#627A48`)
2. **Align the 8-Week Timeline (ProServe Fully Funded):**
   * Emphasize that Sabri's Google ProServe team is already funded under the **$1.4M Gemini Enterprise deal** to deliver this exact tailored system in **8 weeks or less**—giving RealPage both the speed of an out-of-the-box tool and full enterprise ownership.
3. **Position AEO (AI-Engine Optimization) Over Legacy SEO:**
   * Show how Gemini Enterprise positions RealPage as the **future single pane of glass for multi-family real estate search**, automatically structuring every property site for AI search engines and conversational leasing discovery.
