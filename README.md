# 🌍 Wander AI: Multi-Agent Travel Intelligence

**Wander AI** is an agentic orchestration platform designed to mitigate travel risks through real-time intelligence and automated contingency planning. Built as a high-performance prototype, the system transitions from simple data extraction to complex, parallel reasoning to ensure travelers are never left without a "Plan B."

---

## ⚠️ Important Note for Reviewers
**Project Status: Local Agentic Prototype**

This project utilizes a **Distributed Agentic Architecture** where the "Intelligence Engine" (n8n) runs in a local environment to leverage real-time parallel processing. 

* **Live Execution:** Because the AI agents are currently hosted on a local n8n instance, the AI response features may not trigger on external machines. 
* **Logic Verification:** To inspect the full reasoning logic of the **Crisis** and **Contingency** agents, please refer to the `wander-ai-workflow.json` file included in this repository. 
* **Demo Evidence:** A full demonstration of the real-time agentic reasoning, extraction, and report generation is available in the project demo video.

---

## 🧠 Technical Architecture: Distributed Agentic Orchestration

The project utilizes a decoupled architecture to separate the user interface from the intensive computational logic required for real-time risk assessment.



### 1. Agentic Workflow Orchestration (n8n)
The core intelligence layer is orchestrated via **n8n**, utilizing a non-linear execution path to minimize total latency through parallel processing:

* **Ingestion & Entity Extraction:** Leverages Gemini AI to normalize unstructured ticket data or text into a structured JSON schema.
* **Parallel Intelligence Streams:**
    * **Threat Intelligence Agent:** Asynchronously queries real-time web indices to identify localized geopolitical or environmental disruptions (strikes, weather, etc.).
    * **Heuristic Optimization Agent:** Simultaneously executes a "Plan B" contingency algorithm to identify alternative logistics (train, bus, or hospitality).
* **Synthesis Engine:** A final supervisor node performs data fusion, merging the intelligence streams into a single, actionable traveler report.

### 2. Backend Infrastructure & Security
* **State Management:** Built on **Node.js/Express**, the backend manages asynchronous callbacks from the n8n pipeline and ensures persistent state storage.
* **Data Persistence:** Utilizes a **MongoDB** document store for the "Private Travel Vault," optimized for high-read/write availability.
* **Security Protocols:** Strict implementation of `.env` variable management and `.gitignore` protocols prevents the exposure of sensitive API credentials.



---

## 🛠️ Tech Stack
* **Frontend:** HTML5, CSS3, JavaScript (Mobile-responsive UI).
* **Backend:** Node.js, Express.js.
* **Database:** MongoDB.
* **Orchestration:** n8n (Agentic Logic).
* **AI Models:** Gemini 1.5 Pro/Flash.

---

## 📂 Project Resources
* `server.js`: Core Express server logic.
* `wander-ai-workflow.json`: The complete agent orchestration logic (Exported from n8n).
* `package.json`: Dependency manifest with stabilized versions for portability.

---

## 🚀 Future Roadmap
The current architecture is designed for **Horizontal Scaling**. Future iterations involve migrating the local Node.js environment to cloud-native platforms (Vercel/Railway) and deploying n8n workers to a containerized Docker environment for global accessibility.
