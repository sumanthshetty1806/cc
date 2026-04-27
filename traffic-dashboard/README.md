# Traffic Dashboard

A multi-dimensional analytical dashboard built with React, Node.js, Express, and MongoDB mapping roadway structural infrastructures mathematically against crash volumes.

## 🚀 Local Development (Docker Orchestration)

You can launch both the frontend and backend instances flawlessly using Docker Compose.

### 1. Build and Run the Image Blocks
Execute the underlying composer natively in the root directory:
```bash
docker-compose up --build -d
```
- **Frontend** actively maps to `http://localhost:3000`
- **Backend** exposes API on `http://localhost:5000`

### 2. Run the Data Ingestion Script
To load CSV geometries directly through your active MongoDB shell into the containerized stack:
```bash
# Ensure MongoDB is actively running locally on port 27017
cd backend
npm install
node scripts/importData.js
```

---

## ☁️ Google Cloud Platform Deployment (Cloud Run)

The application containers align perfectly with horizontally scaled Serverless Architecture metrics via **Google Cloud Run** and the **Artifact Registry**.

### Step 1: Configure Your GCP Environment
```bash
# Login and configure your centralized project
gcloud auth login
gcloud config set project YOUR_PROJECT_ID

# Enable requisite native APIs
gcloud services enable run.googleapis.com artifactregistry.googleapis.com
```

### Step 2: Establish the Artifact Registry
```bash
# Create a dedicated docker repository block natively parsing images
gcloud artifacts repositories create traffic-dashboard-repo \
  --repository-format=docker \
  --location=us-central1 \
  --description="Traffic Dashboard Immutable Images"
```

### Step 3: Build & Push the Backend Server Image
```bash
# Map authorization for pushing to the registry
gcloud auth configure-docker us-central1-docker.pkg.dev

# Build and Push
cd backend
docker build -t us-central1-docker.pkg.dev/YOUR_PROJECT_ID/traffic-dashboard-repo/backend:latest .
docker push us-central1-docker.pkg.dev/YOUR_PROJECT_ID/traffic-dashboard-repo/backend:latest
```

### Step 4: Deploy the Backend to Cloud Run
```bash
gcloud run deploy traffic-backend \
  --image us-central1-docker.pkg.dev/YOUR_PROJECT_ID/traffic-dashboard-repo/backend:latest \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars="MONGO_URI=mongodb+srv://<USER>:<PASS>@<YOUR_MONGO_ATLAS_CLUSTER>" \
  --port 5000
```
> **Note:** Copy the `Service URL` deployed here. Your frontend bundle needs this URL explicitly to bridge API connections!

### Step 5: Build & Deploy the React Frontend

Before deploying, you must instruct your Frontend to communicate with the newly established Cloud Run Backend URL instead of `localhost:5000`. You can handle this gracefully locally by explicitly replacing the manual `const API_BASE = 'http://localhost:5000/api'` path inside `src/App.jsx` with the actual `<BACKEND_SERVICE_URL>/api`.

```bash
# Build and Push
cd frontend
docker build -t us-central1-docker.pkg.dev/YOUR_PROJECT_ID/traffic-dashboard-repo/frontend:latest .
docker push us-central1-docker.pkg.dev/YOUR_PROJECT_ID/traffic-dashboard-repo/frontend:latest

# Deploy specifically mapping the NGINX port natively
gcloud run deploy traffic-frontend \
  --image us-central1-docker.pkg.dev/YOUR_PROJECT_ID/traffic-dashboard-repo/frontend:latest \
  --region us-central1 \
  --allow-unauthenticated \
  --port 80
```

Your system is now permanently hosted leveraging Google Cloud’s global load balancer architecture!
