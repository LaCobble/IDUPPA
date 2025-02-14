# 🛠 PRIAM Integration with TeaStore

## 📌 Overview
This repository documents the integration of **PRIAM** (Privacy Rights Management) with **TeaStore**, a microservices-based web application. The goal of this integration is to **ensure GDPR compliance** by managing **user consent, data access, rectification, and deletion requests** in a secure and efficient way.

## 📎 Project Structure

```
priam-provider-microservice/
├── config/
│   ├── db.js                 # Database configuration
│   ├── eureka.js             # Eureka service discovery configuration
├── controllers/
│   ├── dataController.js     # Handles data access requests
│   ├── rectificationController.js # Manages data rectification
│   ├── forgottenController.js     # Handles data deletion requests
├── routes/
│   ├── dataRoutes.js         # API routes for data access
│   ├── rectificationRoutes.js # API routes for rectification
│   ├── forgottenRoutes.js    # API routes for data deletion
├── public/
│   ├── privacy.html          # Privacy Rights UI page
│   ├── styles.css            # Styling for the UI
├── .env                      # Environment variables
├── app.js                    # Main application entry point
└── package.json              # Project dependencies
```

---

## 🌟 **Integration Objectives**
✅ Ensure **GDPR compliance** by implementing user consent management.  
✅ Provide a **centralized interface** for data access, rectification, and deletion requests.  
✅ Enable **interoperability** with TeaStore using **RESTful APIs**.  

---

## ⚙ **Technologies Used**
| Technology       | Purpose |
|-----------------|---------|
| **Java (Spring Boot)** | Backend development for PRIAM and TeaStore |
| **Node.js (Express.js)** | Middleware for API management |
| **REST API** | Communication between TeaStore and PRIAM |
| **MariaDB / MySQL** | Storing user consent and personal data |
| **Eureka** | Service discovery for microservices |
| **Keycloak** | Authentication and access control |
| **Docker / Kubernetes** | Deployment and container orchestration |
| **JWT (JSON Web Token)** | Secure API authentication |
| **JUnit / Jest** | Testing and validation |

---

### **Connecting PRIAM with TeaStore**
TeaStore interacts with PRIAM through **REST APIs** for managing user consent and data rights.

- PRIAM **exposes** the following APIs:
    - `GET /api/dataAccessRight` → Retrieves user access rights.
    - `POST /api/dataValue` → Gets specific user data.
    - `POST /api/rectification` → Modifies user data upon request.
    - `POST /api/forgotten` → Deletes user data upon request.

- TeaStore **calls** these APIs when users interact with their privacy settings.

### **Authentication and Security**
- **Keycloak** is used for authentication.
- **JWT tokens** ensure secure communication between services.
- **OAuth2** secures API endpoints.

### **Implementing the Privacy Rights Button in TeaStore**
A **"Privacy Rights"** button was added to the **TeaStore UI** to allow users to manage their data preferences.

**Button Implementation (`index.html`):**
```html
<button id="privacy-rights-btn" class="button-23">Privacy Rights</button>
<script>
    document.getElementById("privacy-rights-btn").addEventListener("click", function() {
        window.location.href = "http://localhost:8086/consent-management";
    });
</script>
```

### **Testing and Validation**
Before deployment, the following tests were conducted:

- ✅ API tests to verify correct **data retrieval, rectification, and deletion**.
- ✅ Performance tests to optimize **API response time**.
- ✅ UI tests to check **button functionality and redirection**.

---

## 🛡 **Challenges & Solutions**
| Challenge | Solution |
|-----------|----------|
| **Ensuring seamless data synchronization** | Implemented an **ID mapping system** between TeaStore & PRIAM |
| **High latency in API calls** | Implemented **caching mechanisms** for consent decisions |
| **Database schema mismatch** | Standardized **data structures across both systems** |

---

## 📌 **Results & Benefits**
✅ **Full GDPR compliance** in TeaStore through PRIAM integration.  
✅ **Modular architecture**, allowing independent updates for PRIAM and TeaStore.  
✅ **Optimized performance** through caching, reducing unnecessary API calls.  

---