# Intelligent-Civic-Response
[![Hackathon](https://img.shields.io/badge/Hackathon-Innovate%20For%20Impact-blue.svg)](https://github.com/Peiyu2004/Intelligent-Civic-Response)
[![Tech Stack](https://img.shields.io/badge/Tech%20Stack-React%20%7C%20Flask%20%7C%20SQLite-green.svg)](https://github.com/Peiyu2004/Intelligent-Civic-Response)

**CiviScan** is a centralized, AI-powered smart city web application designed to streamline and automate public infrastructure damage reporting. Developed during the *Innovate For Impact: AI Solutions for Real World Challenges* Hackathon, the platform serves as an efficient bridge between the general public and local municipalities to accelerate civic repairs, mitigate public safety risks, and implement standardized priority management.

---

## 📱 App Demo

<details>
  <summary>Click to expand video demo</summary>
  
  https://github.com/user-attachments/assets/9e224a13-1800-4c24-8180-1657490df1c5
  
</details>

---

## 📌 Problem Statement & Gaps

Municipalities heavily struggle with accurately prioritizing infrastructure repairs due to the inefficiencies of handling manual reports. Key systemic challenges include:

* **No Centralized Channel:** The lack of a unified public reporting ecosystem leads to fragmented data and redundant manpower wasted managing disorganized lists.
* **Manual Processing Bottlenecks:** High reporting volumes require extensive administrative manpower to manually sort and categorize issues. On heavy traffic days, critical, high-priority public damages risk slipping through unread.
* **Subjective Evaluation & Bias:** Human evaluation introduces personal biases and varying definitions of what constitutes a "high-priority" hazard, preventing a unified standard for dispatching repair crews.

---

## 🚀 Key Features

* **One-Stop Reporting Platform:** Citizens can instantly log infrastructure faults by pinning locations on an interactive map component, detailing descriptions, and uploading clear image attachments.
* **Automated AI Severity Analysis:** Integrated with the **FlexToken API**, the platform analyzes report contents dynamically to classify the type of damage and determine an objective severity rating.
* **Intelligent Geospatial Clustering:** Reports coming from overlapping or adjacent areas are automatically grouped into spatial clusters. This allows public service crews to bundle repairs and resolve multiple local damages in a single dispatch.
* **Standardized Dashboard Classification:** Minimizes manual overhead for municipalities by displaying systematically structured, objective historical report grids sorted cleanly by calculated priority levels.

---

## 🏗️ System Architecture

The software utilizes a decoupled full-stack web architecture to feed interactive client submissions through a structured AI processing pipeline:

```text
       [ User ] 
          │  interacts
          ▼
┌──────────────────┐
│   Web Frontend   │ (React / TypeScript)
└─────────┬────────┘
          │  makes API requests
          ▼
┌──────────────────┐       Analysis Payloads       ┌────────────────┐
│   Backend App    ├──────────────────────────────►│  FlexToken API │
│     (Flask)      │◄──────────────────────────────┤    (AI Core)   │
└─────────┬────────┘        Severity Scores        └────────────────┘
          │
          ▼  records results
┌──────────────────┐
│     Database     │ (SQLite)
└──────────────────┘
```

---

## 💻 Technical Stack

* **Frontend UI:** React, TypeScript, HTML5, CSS3, Map Rendering via Leaflet (OpenStreetMap)
* **Backend Application:** Python (Flask)
* **Database Engine:** SQLite
* **Machine Learning Engine:** FlexToken API

---

## 🛠️ Getting Started

### Prerequisites
* Python 3.8+
* Node.js v16+
* npm or yarn

### 1. Repository Setup
```bash
git clone https://github.com/Peiyu2004/Intelligent-Civic-Response.git
cd Intelligent-Civic-Response
```

### 2. Backend Initialization (Flask)
#### Install required packages from the root or backend folder
```bash
pip install -r requirements.txt
```

#### Run database setup scripts to initialize the SQLite engine schema
```bash
python database.py
```

#### Fire up the local Flask server
```bash
python app.py
```

### 3. Frontend Initialization (React)
#### Move into frontend folder
```bash
npm install
npm start
```