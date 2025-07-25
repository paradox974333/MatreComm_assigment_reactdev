


# 📚 Book Review Platform

A full-stack MERN application that allows users to discover, rate, and review their favorite books. This platform features a clean, modern UI, secure authentication, a robust review system, and an admin dashboard.

---

## 🚀 Live Demo

> 🌐 [Visit the Live Site](https://matre-comm-assigment-reactdev-8bg2.vercel.app/)

---

## ✨ Key Features

- **🔐 Secure User Authentication**  
  JSON Web Tokens (JWT) and bcryptjs ensure safe login and registration.

- **📖 Dynamic Book Catalog**  
  View detailed book information: title, description, author, and cover image.

- **⭐ Review System**  
  - Authenticated users can rate (1–5 stars) and review books.  
  - Average ratings are automatically calculated.  
  - Users can update or delete their own reviews.  
  - One review per book per user enforced.

- **🛠️ Admin Dashboard**  
  Protected admin-only area to monitor users, books, and reviews.

- **☁️ Cloud Image Uploads**  
  Book cover uploads handled via [Cloudinary](https://cloudinary.com/).

- **🛡️ Abuse Protection**  
  Built-in checks to prevent spam and duplicate reviews.

---

## 🛠️ Tech Stack

| Area       | Technologies Used |
|------------|-------------------|
| Frontend   | React, TypeScript, Tailwind CSS |
| Backend    | Node.js, Express.js |
| Database   | MongoDB (Mongoose) |
| Auth       | JWT, bcryptjs |
| Storage    | Cloudinary |
| Deployment | Vercel (Frontend), Render (Backend) |

---

## ⚙️ Getting Started

Follow these steps to run the app locally:

### ✅ Prerequisites

- Node.js v16 or above
- npm or yarn
- MongoDB Atlas account
- Cloudinary account

---

### 📥 Installation

#### 1. Clone the repository:

```bash
git clone https://github.com/paradox974333/MatreComm_assigment_reactdev.git
cd MatreComm_assigment_reactdev
````

#### 2. Backend Setup:

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` folder with the following:

```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_super_secret_jwt_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

#### 3. Frontend Setup:

```bash
cd ../frontend
npm install
```

Create a `.env` file in the `frontend/` folder:

```env
VITE_BACKEND_URL=http://localhost:5000
```

---

### ▶️ Run the Application

Start backend server:

```bash
cd backend
npm run dev
```

Start frontend server:

```bash
cd ../frontend
npm run dev
```

Now, open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🔄 CI/CD Workflow

This project follows a modern Git-based development workflow:

* **Branch-based Development**: Feature branches are used for isolated changes.
* **GitHub for Source Control**.
* **CI/CD Integration**:

  * **Frontend**: Auto-deploys to [Vercel](https://vercel.com)
  * **Backend**: Auto-deploys to [Render](https://render.com)

Pull requests merged into `main` are automatically deployed to production.

---

## 📞 Contact

**Manoj L**
📧 [manoj123l288@gmail.com](mailto:manoj123l288@gmail.com)
🔗 [GitHub Profile](https://github.com/paradox974333)
🔗 [Project Repository](https://github.com/paradox974333/MatreComm_assigment_reactdev)

---


