# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

# Intelligent-Civic-Response
[![Hackathon](https://img.shields.io/badge/Hackathon-Innovate%20For%20Impact-blue.svg)](https://github.com/Peiyu2004/Intelligent-Civic-Response)
[![Tech Stack](https://img.shields.io/badge/Tech%20Stack-React%20%7C%20Flask%20%7C%20SQLite-green.svg)](https://github.com/Peiyu2004/Intelligent-Civic-Response)

**CiviScan** is a centralized, AI-powered smart city web application designed to streamline and automate public infrastructure damage reporting. Developed during the *Innovate For Impact: AI Solutions for Real World Challenges* Hackathon, the platform serves as an efficient bridge between the general public and local municipalities to accelerate civic repairs, mitigate public safety risks, and implement standardized priority management.

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


### 💻 Technical Stack

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

### 2. Backend Initialization (Flask)
# Install required packages from the root or backend folder
pip install -r requirements.txt

# Run database setup scripts to initialize the SQLite engine schema
python database.py

# Fire up the local Flask server
python app.py

### 3. Frontend Initialization (React)
# Move into frontend folder
npm install
npm start