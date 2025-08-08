# 🧠 NeuroFlow – Advanced Neurological Care Management Platform

**NeuroFlow** is a comprehensive stroke care coordination system designed for healthcare professionals, enabling efficient communication, patient tracking, and real-time decision-making in neurological care.

## 🚀 Overview

NeuroFlow streamlines stroke care by providing **role-based dashboards** for technicians and neurologists, offering **real-time patient data**, **lab result management**, and **interactive analytics** in one unified platform.

## ✨ Features

* 🏥 **Role-based Dashboards** – Separate, secure interfaces for **technicians** and **doctors** with tailored workflows.
* 📊 **Real-time Analytics** – Live monitoring of performance metrics and patient outcomes.
* 🧪 **Lab Management** – Track blood work, diagnostic tests, and results with timestamps.
* 📈 **Interactive Charts** – Custom-built visualizations for actionable insights.
* 📱 **Responsive Design** – Optimized for desktop, tablet, and mobile devices.
* 🔐 **Secure Access** – Role-based authentication and HIPAA-conscious data handling.

## 🎥 Demo

**Technician Login:**

```
Username: technician  
Password: demo
```

**Doctor Login:**

```
Username: doctor  
Password: demo
```

## 🛠 Tech Stack

* **Frontend Framework:** [Next.js 14](https://nextjs.org/) (App Router)
* **Language:** [TypeScript](https://www.typescriptlang.org/)
* **Styling:** [Tailwind CSS](https://tailwindcss.com/)
* **Icons:** [Lucide React](https://lucide.dev/)
* **Charts:** Custom chart components built with React

## 📦 Installation & Setup

Clone the repository and install dependencies:

```bash
git clone https://github.com/enocko/neuroflow-healthcare-platform.git
cd neuroflow-healthcare-platform
npm install
```

Run the development server:

```bash
npm run dev
```

The app will be available at:

```
http://localhost:3000
```

## 📂 Project Structure

```
neuroflow/
 ├── components/       # Reusable UI components
 ├── pages/            # App pages & routing
 ├── styles/           # Global and Tailwind styles
 ├── public/           # Static assets
 ├── utils/            # Helper functions
 ├── README.md         # Project documentation
 └── package.json      # Dependencies & scripts
```

## 🚀 Future Enhancements

* 🔐 Authentication system using NextAuth.js for secure role-based access
* 🗄 Database integration with Supabase/PostgreSQL for persistent data storage
* 📡 Real-time updates via WebSockets for instant patient status changes
* 📄 PDF report generation for medical summaries and lab results
* 📱 Mobile app version using React Native for cross-platform access

