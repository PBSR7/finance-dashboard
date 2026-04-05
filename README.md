# Finance Dashboard

A modern and interactive **Finance Dashboard UI** built to help users track, analyze, and understand their financial activity. This project focuses on clean design, intuitive user experience, and efficient state management on the frontend.

## Live Demo
https://finance-dashboard-gray-alpha.vercel.app/

## Project Objective

The goal of this project is to demonstrate frontend development skills by building a **responsive and visually appealing dashboard** that:

* Displays financial summaries
* Allows transaction exploration
* Provides insights into spending patterns
* Simulates role-based UI behavior

This project is intentionally frontend-focused and uses mock/static data.

---

## Approach & Design Decisions

### 1. Component-Based Architecture

The application is structured into reusable components such as:

* Summary Cards
* Charts
* Transactions Table
* Insights Panel
* Role Switcher

This improves **scalability, readability, and maintainability**.

---

### 2. State Management

State is managed efficiently using:

* Centralized store (Zustand / React state)
* Handles:

  * Transactions data
  * Search & filters
  * User role (Admin / Viewer)

This keeps UI logic predictable and clean.

---

### 3. UI/UX Strategy

* Clean and minimal layout for clarity
* Responsive grid system for all screen sizes
* Clear visual hierarchy (cards → charts → tables)
* Smooth interactions and feedback

---

### 4. Data Handling

* Uses mock/static data
* Simulates real-world financial transactions
* Enables filtering, searching, and calculations

---

## Features

### Dashboard Overview

* Total Balance, Income, and Expenses cards
* Dynamic calculations from transaction data
* Clean card-based UI

---

### Data Visualization

* **Line Chart** → Financial trend over time
* **Pie Chart** → Spending breakdown by category

---

### Transactions Section

* Displays:

  * Date
  * Amount
  * Category
  * Type (Income/Expense)

#### Functionalities:

* 🔍 Search transactions
* 🔽 Filter by category/type
* 📊 Sorted display

---

### Role-Based UI (Simulated)

* **Viewer**

  * Can only view data
* **Admin**

  * Can add/edit transactions (UI-level simulation)

Role switching is handled via a dropdown for demonstration.

---

### Insights Section

* Highlights key financial observations:

  * Highest spending category
  * Expense trends
  * Useful summaries

---

### Responsive Design

* Fully responsive across:

  * Mobile
  * Tablet
  * Desktop
* Uses flexible layouts and grid systems

---

### Additional Enhancements

* Smooth UI interactions
* Clean color palette
* Empty state handling
* Modular code structure

---

## Tech Stack

| Category | Technology            |
| -------- | --------------------- |
| Frontend | React (Vite)          |
| Styling  | Tailwind CSS          |
| Charts   | Recharts              |
| State    | Zustand / React State |
| Icons    | Lucide React          |

---

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/PBSR7/finance-dashboard.git
cd finance-dashboard
```

---

### 2. Install Dependencies

```bash
npm install
```

---

### 3. Run Development Server

```bash
npm run dev
```

---

### 4. Open in Browser

```
http://localhost:5173
```

---

## 📂 Project Structure

```
src/
│
├── components/      # Reusable UI components
├── store/           # State management
├── data/            # Mock data
├── pages/           # Main pages (Dashboard)
├── App.jsx
└── main.jsx
```

---

## Edge Case Handling

* No transactions → Displays empty state
* Search with no results → Graceful UI feedback
* Responsive layout maintained across devices

---

## Future Improvements

* Dark mode support 🌙
* Data persistence (Local Storage / API)
* Export transactions (CSV/JSON)
* Advanced filtering & analytics
* Authentication & real RBAC

---

## Conclusion

This project demonstrates:

* Strong understanding of frontend fundamentals
* Ability to design intuitive user interfaces
* Clean state management
* Component-driven architecture

It reflects a balance between **functionality, design, and scalability**, making it a solid foundation for real-world dashboard applications.

---

## Contact
sairamanujampb2006@gmail.com

---
