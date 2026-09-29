# RealPage Project RePlatform & G5 v9.0 Enterprise CMS

> **Autonomous Site Ingestion, Presentation Engine & G5 v9.0 Enterprise CMS Studio**  
> Built by **Google Cloud AI/ML Customer Engineering** & **Google ProServe** in collaboration with RealPage Leadership.

---

## Table of Contents

- [Executive Overview](#executive-overview)
- [Monorepo Architecture & Projects Summary](#monorepo-architecture--projects-summary)
  - [1. Project RePlatform: Autonomous Ingestion & Staging Engine (Root)](#1-project-replatform-autonomous-ingestion--staging-engine-root)
  - [2. G5 v9.0 Enterprise CMS Studio (`/g5-cms`)](#2-g5-v90-enterprise-cms-studio-g5-cms)
- [System Requirements & Prerequisites](#system-requirements--prerequisites)
- [Installation Guide](#installation-guide)
- [How to Run](#how-to-run)
  - [Option A: Running Project RePlatform (Root Server — Port 3000)](#option-a-running-project-replatform-root-server--port-3000)
  - [Option B: Running G5 CMS Studio (Subproject — Port 3001)](#option-b-running-g5-cms-studio-subproject--port-3001)
  - [Option C: Running Both Projects Concurrently](#option-c-running-both-projects-concurrently)
  - [Option D: Running with Docker](#option-d-running-with-docker)
  - [Option E: Google Cloud Build & Cloud Run Pipeline](#option-e-google-cloud-build--cloud-run-pipeline)
- [Repository Structure](#repository-structure)
- [Core Capabilities & Feature Tour](#core-capabilities--feature-tour)
- [API Reference](#api-reference)
  - [Project RePlatform Endpoints (`:3000`)](#project-replatform-endpoints-3000)
  - [G5 CMS Studio Endpoints (`:3001`)](#g5-cms-studio-endpoints-3001)
- [Pre-Loaded Property Profiles & Reference Sites](#pre-loaded-property-profiles--reference-sites)
- [Security, Compliance & Guardrails](#security-compliance--guardrails)
- [License & Authors](#license--authors)

---

## Executive Overview

RealPage manages approximately **16,000 G5 Ruby/Cloud property websites** and **4,000 legacy Kentico and custom sites**. Migrating and onboarding properties traditionally takes **30–40 days** per site, bogged down by manual questionnaires, third-party vendor bloat (OneTrust, Honeybadger, external accessibility overlays), and an untracked support "black hole."

**Project RePlatform** transforms this lifecycle into a **< 15-minute autonomous migration** and provides an **8-week time-to-value production pilot**, backed and funded by Google ProServe through the $1.4M Gemini Enterprise engagement.

This repository contains two complementary, zero-dependency Node.js projects:
1. **The Ingestion, Staging & Governance Harness (Root)** — Ingests legacy URLs, executes multimodal layout extraction (Vertex AI Gemini 2.0 Pro), enforces Figma design token constraints, sandbox-preserves PMS widgets, sheds third-party scripts, and runs CI/CD deployment pipelines.
2. **The G5 v9.0 Enterprise CMS Studio (`/g5-cms`)** — An interactive, production-grade visual CMS studio for Digital Strategists and Property Managers, featuring live split-screen visual block editing, floor plan/DAM management, self-service conversational AI intake, and 1-click rollback history.

---

## Monorepo Architecture & Projects Summary

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

### 1. Project RePlatform: Autonomous Ingestion & Staging Engine (Root)
- **Directory**: `/` (Root directory)
- **Service Name**: `realpage-project-replatform-poc`
- **Default Port**: `3000` (`http://127.0.0.1:3000`)
- **Primary Persona**: RealPage Digital Strategist, Cloud Architecture Team, Executive Leadership
- **Primary Responsibilities**:
  - **Headless Ingestion & Multimodal Extraction**: Crawls and transforms legacy Kentico, competitor, or custom apartment URLs into structured G5 v9.0 schema via Gemini 2.0 Pro multimodal reasoning.
  - **Figma Design System Lock**: Enforces exact design tokens (`--theme_primary_color`, `--theme_header_color`, typography, spacing) mapped from real G5 v9.0 production sites (`2424 Tulane`, `El Patio`, `Rockvale Circle`).
  - **Widget Sandboxing & CORS Fallback**: Identifies and sandboxes PMS widgets (YieldStar, LRO, Entrata, Tour24, Matterport), providing seamless fallback when cross-origin locks occur.
  - **RealPage Data Hub MCP Sync**: 1-click hydration from canonical Data Hub records (`DH-NOLA-2424`, `DH-LRD-5908`, `DH-BOS-02130`, `DH-PLN-5900`), eliminating 40+ onboarding questions.
  - **Vendor Shedding & AEO Engine**: Demonstrates shedding legacy 3rd-party scripts (OneTrust, Honeybadger) to boost Lighthouse from ~58 to 98, logging first-party consent receipts into Cloud Spanner and generating Schema.org `ApartmentComplex` JSON-LD for AI search discovery.
  - **HITL (Human-in-the-Loop) Approval**: Digital Strategist sign-off gate before production container promotion.

### 2. G5 v9.0 Enterprise CMS Studio (`/g5-cms`)
- **Directory**: `/g5-cms`
- **Service Name**: `realpage-g5-enterprise-cms`
- **Default Port**: `3001` (`http://127.0.0.1:3001`)
- **Primary Persona**: Property Managers, Regional Marketing Directors, RealPage Support Engineers
- **Primary Responsibilities**:
  - **Visual Split-Screen Page Builder (`mod-split-studio`)**: Reorder (`↑`/`↓`), toggle, and customize certified G5 v9.0 (`Alpine - Simple`) Page Stripes (`G5StickyBannerV2`, `G5HeroGalleryBasic`, `G5FeaturedContentPopOut`, `G5QuickStatsBar`, `G5NumberedAmenityBadges`, `G5FloorPlanGrid`, `G5PhotoCardsMosaic`, `G5AmenityPillList`, `G5PromotedReviewsSlider`, `G5AeoStructuredDataGraph`, `G5FirstPartyConsentBanner`).
  - **Floor Plans & Media DAM Management (`mod-floorplans-dam`)**: Full CRUD for floor plan inventory (pricing, sqft, available units, move-in specials) and unit/community amenities.
  - **Interactive Client-Facing Intake Agent (`mod-intake-agent`)**: Natural-language conversational AI agent for property managers who "don't have time for a phone call." Converts requests (e.g., "Change lease special to 2 months free and add EV charging") into validated G5 CMS mutations.
  - **Vendor Shedding & Cloud Spanner Consent (`mod-vendors-aeo`)**: Live interactive toggle to view before/after third-party vendor shedding and generate cryptographic first-party consent records.
  - **Firestore & BigQuery Audit Log + 1-Click Rollback (`mod-audit-rollback`)**: Complete immutable revision history (`v1.0`, `v2.0`, ...) with instant 1-click state restoration.
  - **Standalone Property Previews**: Full-screen, client-ready preview URLs (`/preview/:slug`).

---

## System Requirements & Prerequisites

- **Node.js**: `v20.0.0` or higher recommended (minimum `v18.0.0` for `g5-cms`).
- **Operating System**: macOS, Linux, or Windows (WSL recommended for Windows).
- **Web Browser**: Modern evergreen browser (Chrome, Firefox, Safari, Edge).
- **External npm Dependencies**: **None!** Both projects are built with **zero external npm packages**, utilizing only native Node.js core modules (`http`, `crypto`, `fs`, `path`, `url`).
- **Docker** *(Optional)*: Docker 24+ for containerized deployment.

---

## Installation Guide

Since both projects have **zero external npm dependencies**, installation takes less than 5 seconds:

```bash
# 1. Clone or navigate to the repository directory
cd /Users/farazj/RP/MKTg

# 2. (Optional) Run npm install in root — note: there are no external dependencies
npm install

# 3. (Optional) Run npm install in the G5 CMS subproject
cd g5-cms && npm install && cd ..
```

> [!NOTE]
> `package.json` contains no external `dependencies` or `devDependencies`. Node.js built-ins (`http`, `crypto`, `fs`, `path`) handle all HTTP routing, crypto generation, CSPRNG sessions, and static asset streaming.

---

## How to Run

### Option A: Running Project RePlatform (Root Server — Port 3000)

Start the root server from the repository root:

```bash
# Start via npm script
npm start

# Or directly via Node.js
node server.js
```

- **Root UI URL**: [http://127.0.0.1:3000](http://127.0.0.1:3000)
- **Standalone Staging Previews**:
  - `http://127.0.0.1:3000/staging/2424-tulane-nola`
  - `http://127.0.0.1:3000/staging/el-patio-laredo`
  - `http://127.0.0.1:3000/staging/rockvale-circle-jp`
  - `http://127.0.0.1:3000/staging/kensington-legacy-west`

---

### Option B: Running G5 CMS Studio (Subproject — Port 3001)

Start the G5 CMS Studio server from either the subfolder or repository root:

```bash
# From within the g5-cms folder
cd g5-cms
npm start

# Or directly from the repository root
node g5-cms/server.js
```

- **G5 CMS Studio URL**: [http://127.0.0.1:3001](http://127.0.0.1:3001)
- **Full-Screen Client Previews**:
  - `http://127.0.0.1:3001/preview/2424-tulane-nola` (2424 Tulane Apartments)
  - `http://127.0.0.1:3001/preview/el-patio-laredo` (El Patio Apartments)
  - `http://127.0.0.1:3001/preview/rockvale-circle-jp` (Rockvale Circle Cooperative)
  - `http://127.0.0.1:3001/preview/kensington-legacy-west` (The Kensington at Legacy West)

---

### Option C: Running Both Projects Concurrently

To run both the Ingestion Engine and the CMS Studio concurrently for a full executive demo:

**Terminal Tab 1 (Project RePlatform):**
```bash
cd /Users/farazj/RP/MKTg
PORT=3000 node server.js
```

**Terminal Tab 2 (G5 Enterprise CMS Studio):**
```bash
cd /Users/farazj/RP/MKTg/g5-cms
PORT=3001 node server.js
```

**Or in a single command:**
```bash
node server.js & node g5-cms/server.js
```

| Service | Port | Local URL | Role |
| :--- | :--- | :--- | :--- |
| **Project RePlatform** | `3000` | `http://127.0.0.1:3000` | Ingestion, Multimodal Extraction, Figma Lock, Pipeline Orchestration |
| **G5 CMS Studio** | `3001` | `http://127.0.0.1:3001` | Visual Page Builder, Floor Plan DAM, Client AI Intake, Audit Rollbacks |

---

### Option D: Running with Docker

Both projects include production-hardened `Dockerfile` configurations with non-root security principles (`node:22-alpine`):

#### 1. Running Project RePlatform Container
```bash
# Build the Docker image
docker build -t realpage-replatform-engine .

# Run the container
docker run -d --name replatform-poc -p 3000:3000 realpage-replatform-engine

# View logs
docker logs -f replatform-poc
```

#### 2. Running G5 CMS Studio Container
```bash
# Build the Docker image
docker build -t realpage-g5-cms ./g5-cms

# Run the container
docker run -d --name g5-cms-studio -p 3001:3001 realpage-g5-cms

# View logs
docker logs -f g5-cms-studio
```

---

### Option E: Google Cloud Build & Cloud Run Pipeline

The included `cloudbuild.yaml` file defines the continuous delivery pipeline:
1. Builds the container image: `us-central1-docker.pkg.dev/$PROJECT_ID/replatform-repo/g5-presentation-engine:$COMMIT_SHA`
2. Pushes the image to **Google Cloud Artifact Registry**
3. Deploys to **Google Cloud Run** with production environment flags, VPC Service Controls, and Secret Manager bindings.

To submit a build manually via the Google Cloud SDK:
```bash
gcloud builds submit --config=cloudbuild.yaml .
```

---

## Repository Structure

```text
/Users/farazj/RP/MKTg/
├── Dockerfile                   # Production container definition for RePlatform Engine
├── PRD.md                       # Comprehensive Product Requirements Document (v2.0)
├── README.md                    # Project overview & running instructions (this document)
├── cloudbuild.yaml              # Google Cloud Build & Cloud Run CI/CD deployment pipeline
├── package.json                 # RePlatform Engine configuration & npm scripts
├── server.js                    # RePlatform Engine HTTP server, API router & state engine
├── session_secret.txt           # CSPRNG session secret key for CSRF/session HMACs
│
├── public/                      # RePlatform Engine Frontend Web App
│   ├── app.js                   # Client-side UI logic, interactive modules & API client
│   ├── index.html               # Executive Demo Single Page Application UI
│   └── styles.css               # Styling, Figma design tokens & responsive CSS grid
│
├── src/                         # RePlatform Engine Core Business Logic
│   └── presets.js               # Reference site presets, Figma tokens, Data Hub profiles & AEO generator
│
└── g5-cms/                      # RealPage G5 v9.0 Enterprise CMS Studio Subproject
    ├── Dockerfile               # Production container definition for G5 CMS Studio
    ├── README.md                # Dedicated G5 CMS Studio documentation
    ├── package.json             # G5 CMS Studio configuration & npm scripts
    ├── server.js                # G5 CMS Studio HTTP server, API endpoints & persistence engine
    ├── cms_session_secret.txt   # G5 CMS CSPRNG session secret key
    │
    ├── data/                    # CMS Data Layer & Persistence Store
    │   ├── cms-seed.js          # Certified G5 Stripe catalog, Data Hub records, Figma themes
    │   └── cms-state.json       # File-backed persistence store for CMS properties & audit logs
    │
    └── public/                  # G5 CMS Studio Frontend Application
        ├── cms.css              # G5 CMS Studio layout, split-screen editor & preview styles
        ├── cms.js               # Visual builder, live preview sync, AI intake & rollback client
        └── index.html           # G5 Enterprise CMS Studio Single Page Application UI
```

---

## Core Capabilities & Feature Tour

### 1. Visual Page Builder & Live Split-Screen Preview
- **Stripe Catalog**: Reorder, toggle, and configure certified G5 v9.0 page stripes (`G5StickyBannerV2`, `G5HeroGalleryBasic`, `G5FeaturedContentPopOut`, `G5NumberedAmenityBadges`, `G5FloorPlanGrid`, `G5PhotoCardsMosaic`, etc.).
- **Live Preview Sync**: Instant visual feedback in the split-screen pane upon modifying property names, taglines, promo banners, or hero imagery.

### 2. RealPage Data Hub MCP Intake Engine
- Connects directly to RealPage's master onboarding tool ("Data Hub") via Model Context Protocol (MCP) and REST connectors.
- Automatically hydrates canonical address, leasing hours, pet policies, walk scores, PMS connector bindings, and store URNs.
- Eliminates 40+ redundant questions per property onboarding.

### 3. Vendor Shedding, First-Party Spanner Consent & AEO
- **Vendor Shedding**: Eliminates slow third-party scripts (`OneTrust OtAutoBlock.js`, `Honeybadger`, third-party accessibility overlays) in favor of GCP-native solutions.
- **Performance Jump**: Boosts Lighthouse performance scores from **~58 to 98** and slashes Total Blocking Time (TBT) from 1,420ms to 40ms.
- **Cloud Spanner Consent**: Logs visitor privacy and cookie consent receipts directly into Cloud Spanner with cryptographic IDs.
- **AEO (AI-Engine Optimization)**: Emits Schema.org `ApartmentComplex` JSON-LD graphs with live floor plan pricing and verified amenities for conversational AI search engines (Gemini, Google AI Overviews).

### 4. Interactive Client-Facing AI Intake Agent
- Self-service Vertex AI conversational agent for property managers who "don't have time for a phone call."
- Parses natural language updates (e.g., *"Change our lease special to 2 Months Free and set headline to Experience Modern Luxury"*) into typed G5 schema mutations.
- Enforces strict Figma design system guardrails to prevent layout breakage.

### 5. Historic Audit Log & 1-Click Rollback
- Every CMS change, AI agent interaction, Data Hub sync, and stripe reorder is recorded as an immutable versioned snapshot (`v1.0`, `v2.0`, `v3.0`).
- Streams metadata to simulated Firestore and BigQuery audit streams.
- **1-Click Rollback**: Instantly restores previous layout, design tokens, copy, and floor plans in under 2 seconds.

---

## API Reference

### Project RePlatform Endpoints (`:3000`)

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/bootstrap` | Returns CSRF token, session info, G5 templates, certified components, and presets |
| `POST` | `/api/ingest` | Ingests a pre-configured demo preset or runs live crawler extraction on a custom URL |
| `POST` | `/api/template` | Switches active G5 design system template and locks corresponding Figma tokens |
| `POST` | `/api/cms-save` | Saves live visual CMS modifications, layout stripes, floor plans, and amenities |
| `POST` | `/api/datahub-sync` | Synchronizes property metadata with RealPage Data Hub profile records |
| `POST` | `/api/vendor-shed` | Toggles vendor shedding mode and recalculates Cloud Run Lighthouse metrics |
| `POST` | `/api/consent-log` | Records a first-party cookie consent choice into Cloud Spanner ledger |
| `POST` | `/api/intake-agent` | Submits conversational client prompt to Vertex AI Intake Agent |
| `POST` | `/api/rollback` | Restores a historical configuration revision snapshot (1-click rollback) |
| `POST` | `/api/widget-mode` | Toggles simulated PMS widget CORS lock and activates fallback pricing mode |
| `POST` | `/api/approve` | Records HITL Digital Strategist production sign-off and promotion |
| `GET` | `/staging/:slug` | Serves standalone full-screen staging preview for a property |

---

### G5 CMS Studio Endpoints (`:3001`)

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/cms/bootstrap` | Retrieves CSRF token, CMS properties, Figma design systems, and Stripe catalog |
| `POST` | `/api/cms/property/update` | Updates core property metadata, hero copy, and branding |
| `POST` | `/api/cms/blocks/update` | Updates layout block ordering and visibility flags |
| `POST` | `/api/cms/floorplans/upsert`| Creates or updates floor plan inventory records |
| `POST` | `/api/cms/floorplans/delete`| Deletes a floor plan from property inventory |
| `POST` | `/api/cms/amenities/update` | Adds community or unit amenities |
| `POST` | `/api/cms/datahub/sync` | Hydrates property state from RealPage Data Hub profile |
| `POST` | `/api/cms/vendors/shed` | Toggles vendor shedding and updates performance scores |
| `POST` | `/api/cms/consent/record` | Commits first-party consent receipt |
| `POST` | `/api/cms/intake-agent/chat`| Executes conversational AI prompt against CMS property state |
| `POST` | `/api/cms/audit/rollback` | Rolls back CMS state to a previous version |
| `POST` | `/api/cms/publish` | Publishes live changes to Cloud Run production edge |
| `POST` | `/api/cms/property/create` | Provisions a new property website in the CMS |
| `GET` | `/preview/:slug` | Serves client-ready full-screen property preview |

---

## Pre-Loaded Property Profiles & Reference Sites

The platform includes real production models extracted from live RealPage properties:

| Property Name | Location | Reference G5 URL | Design Palette / Tokens | Data Hub Record |
| :--- | :--- | :--- | :--- | :--- |
| **2424 Tulane Apartments** | New Orleans, LA | `https://www.2424tulane.com/` | Slate Blue (`#2B5C81`), Charcoal (`#262626`), Seafoam (`#A5CCC4`), Barlow Font | `DH-NOLA-2424` |
| **El Patio Apartments** | Laredo, TX | `https://www.patioaptslaredo.com/` | Deep Teal (`#05323A`), Alabaster (`#DCE2E2`), Gold (`#B28206`), Freight Sans | `DH-LRD-5908` |
| **Rockvale Circle Cooperative** | Jamaica Plain, MA | `https://www.rockvalecircle.com/` | Architectural Black (`#000000`), Arboretum Olive (`#627A48`), Open Sans | `DH-BOS-02130` |
| **The Kensington at Legacy West** | Plano, TX | Migrated from Kentico 12 | Navy (`#1D3557`), Cream (`#F1FAEE`), Crimson (`#E63946`), Inter Font | `DH-PLN-5900` |

---

## Security, Compliance & Guardrails

Both projects adhere strictly to enterprise multi-family compliance and Google Cloud SecureCoder standards:

1. **Strict Localhost Binding**: Server binds strictly to `127.0.0.1` by default to avoid unintended external interface exposure during local development.
2. **Deterministic Layout Generation (Anti-"Vibe Coding")**: Gemini 2.0 Pro does not output arbitrary unconstrained HTML. It binds content to certified G5 v9.0 component models governed by Figma API token contracts.
3. **Safe DOM Construction**: The client-side applications (`app.js` and `cms.js`) use safe DOM construction methods (`document.createElement`, `textContent`, `setAttribute`, `replaceChildren`) with zero use of `innerHTML` or `document.write`.
4. **Session & CSRF Hardening**: HMAC-signed Synchronizer CSRF tokens are validated on all state-changing `POST` requests. Session IDs are cryptographically generated via CSPRNG (`crypto.randomBytes`) and stored in `HttpOnly`, `SameSite=Lax` cookies.
5. **SSRF & Path Traversal Defenses**: URL ingestion requests strictly check against private IP ranges and accept only public HTTPS URLs. Static file serving enforces `PUBLIC_DIR` directory boundaries.
6. **Container Least Privilege**: Docker images run as an unprivileged application user (`replatform` / `g5cms`), never root.

---

## License & Authors

- **Author**: Faraz Javaid (Google Cloud AI/ML Customer Engineering) & Sabri (Google Cloud ProServe)
- **Stakeholders**: Veronica (VP Demand Marketing), Matt (Marketing Leadership), Kemera Reuben (Google Cloud)
- **License**: Proprietary — Developed for RealPage Enterprise Partnership
