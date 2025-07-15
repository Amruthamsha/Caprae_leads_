# 🚀 SmartLeadGen – AI-Powered Lead Generation Tool

SmartLeadGen is a modern, AI-augmented lead generation tool inspired by SaaSquatch Leads and developed as part of the Caprae Capital AI-Readiness Pre-Screening Challenge.

Unlike traditional scrapers, SmartLeadGen goes beyond data collection—delivering **actionable intelligence** that helps businesses prioritize, personalize, and close leads more efficiently.

---

## 🌟 Key Features

### 🔍 Smart Lead Prioritization
- Built-in scoring system to rank leads as **High Potential**, **Warm**, or **Cold**.
- Uses available metadata like domain authority, industry, and employee size.

### ✉️ Contact Enrichment & Validation
- API integrations for:
  - **Email Verification**
  - **LinkedIn Lookup**
  - **Technology Stack Detection**
  - **Clearbit/Hunter Enrichment** (modular for future use)

### 📊 CRM-Ready Export
- Download leads in CSV, Excel, or Salesforce/HubSpot-ready formats.
- Zapier/Webhook endpoint for integration (optional).

### ✨ Beautiful UI/UX
- Responsive and intuitive dashboard.
- Light/dark mode toggle.
- Advanced filtering by industry, location, or score.

### 🔁 Deduplication + Tagging
- Auto-removal of duplicates.
- User-added lead tags (e.g., "Follow-Up", "Do Not Contact").

### 🧠 (Optional) AI Outreach Generator
- Dynamic persona-based cold email suggestions.
- Based on scraped business context.

---

## 🛠️ Tech Stack

- **Frontend:** React.js + Tailwind CSS
- **Backend:** FastAPI / Flask
- **Scraping:** BeautifulSoup, Playwright (optional for dynamic pages)
- **AI/ML:** scikit-learn / Rule-based logic
- **Extras:** SQLite for local save (or Firebase/PostgreSQL if deployed)

---

## 🚀 Getting Started

### 🔧 Setup

```bash
git clone https://github.com/yourusername/SmartLeadGen.git
cd SmartLeadGen
pip install -r requirements.txt
npm install
npm run dev
