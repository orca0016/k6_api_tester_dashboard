# 🚀 K6 Load Testing Dashboard (Next.js)

A web-based load testing dashboard built with **Next.js** and **k6** that allows you to configure, run, visualize, and review API load tests directly from the browser.

This project provides a clean UI to:
- Configure test scenarios
- Run k6 tests on any API
- Visualize results using charts
- Store and review test history

---

## ✨ Features

- 🧪 Run k6 load tests from a web UI
- 📝 Configurable test scenarios
- 📊 Interactive charts (Average Response Time vs VUs)
- 🧾 Detailed metrics per test run
- 🕒 Test history with timestamps
- 📁 Scenario-based test execution
- 🇮🇷 Persian date formatting support
- 💾 LocalStorage-based history persistence

---

## 🛠 Tech Stack

- **Next.js (App Router)**
- **TypeScript**
- **k6**
- **Chart.js**
- **Tailwind CSS**
- **Node.js child_process**

---

## 📂 Project Structure

# 🚀 K6 Load Testing Dashboard (Next.js)

A web-based load testing dashboard built with **Next.js** and **k6** that allows you to configure, run, visualize, and review API load tests directly from the browser.

This project provides a clean UI to:
- Configure test scenarios
- Run k6 tests on any API
- Visualize results using charts
- Store and review test history

---

## ✨ Features

- 🧪 Run k6 load tests from a web UI
- 📝 Configurable test scenarios
- 📊 Interactive charts (Average Response Time vs VUs)
- 🧾 Detailed metrics per test run
- 🕒 Test history with timestamps
- 📁 Scenario-based test execution
- 🇮🇷 Persian date formatting support
- 💾 LocalStorage-based history persistence

---

## 🛠 Tech Stack

- **Next.js (App Router)**
- **TypeScript**
- **k6**
- **Chart.js**
- **Tailwind CSS**
- **Node.js child_process**

---

## 📂 Project Structure

├── app/
│ ├── api/
│ │ └── test/
│ │ └── route.ts # API route to run k6 tests
│ ├── history/
│ │ └── page.tsx # Test history & chart view
│ ├── layout.tsx
│ ├── page.tsx # Main page (test form)
│ └── globals.css
│
├── icons/
│ └── icons.tsx
│
├── k6/
│ ├── script.js # Main k6 test runner
│ └── tokens.json # Optional auth tokens
│
├── public/
│
├── scenarios/
│ ├── functions.ts # Scenario handlers
│ ├── run-test.ts # k6 execution logic
│ └── scenarios-list.ts # Scenario definitions
│
├── types/
│ └── scenario.ts # Shared TypeScript interfaces
│
├── utils/
│ └── date-formater.ts # Persian date formatter
│
├── README.md
├── package.json
├── tsconfig.json
└── next.config.ts


---

## ⚙️ Prerequisites

Make sure the following are installed:

- **Node.js >= 18**
- **k6**

### Install k6

```bash
brew install k6
# or
choco install k6

---
## Running the Project

``` bash 
npm install
npm run dev


---

## ⚙️📈 Charts & Visualization


X Axis: Target VUs

Y Axis: Average Response Time (ms)

Hovering on a data point shows:

Avg & P95 response time

Success rate

Error rate

Total requests

Test duration

Execution timestamp
---

###🧪 How It Works

User fills the test form:

-Target API URL

-Test duration

-Target VUs

-Scenario selection

The form sends a request to a Next.js API route

The API spawns a k6 process using child_process

k6 executes the test with environment variables

Test results are parsed and returned

Results are visualized in a chart

Test history is stored in localStorage
---
### 📊 Metrics Collected

Each test execution produces the following metrics:

Average Response Time

P95 Response Time

Success Rate

Error Rate

Total Requests

Target VUs

Test Duration

Timestamp
---
##⚠️ Important Notes
Intended for development / staging environments

High VU values may cause:

Network saturation

API rate limiting

status code 0 errors in k6

Avoid running against production APIs without safeguards
---
##🤝 Contributing
Pull requests, issues, and suggestions are welcome.
---