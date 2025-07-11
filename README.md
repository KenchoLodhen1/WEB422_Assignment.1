
# 📚 Library Management System

A full-stack web application for managing library operations built with **Node.js, Express, MongoDB**, and **Bootstrap**.

---

## ✨ Features

✅ **Book Management:**  
Add, view, update, and delete books.

✅ **Transaction Management:**  
Borrow and return books with due date tracking.

✅ **User Interface:**  
Responsive Bootstrap-based frontend.

✅ **Real-time Updates:**  
Dynamic content updates without page refresh.

✅ **Data Validation:**  
Comprehensive input validation on both frontend and backend.

✅ **Error Handling:**  
User-friendly error messages and robust backend error handling.

---

## 🚀 Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **CORS** - Cross-origin support
- **Body-parser** - Parse JSON request bodies

### Frontend
- **HTML5**, **CSS3**
- **Bootstrap 5**
- **JavaScript (ES6)**
- **Font Awesome** - Icons

---

## ⚙️ Prerequisites
- **Node.js** (v14+)
- **MongoDB** (v4.4+)
- **npm** (comes with Node.js)

---

## 🚀 Installation

1️⃣ **Clone the repository:**
```bash
git clone https://github.com/KenchoLodhen1/WEB422_Assignment.1.git
cd WEB422_Assignment.1
```

2️⃣ **Install dependencies:**
```bash
npm install
```

3️⃣ **Set up environment variables:**
Create a `.env` file in the root:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/library_management
```

4️⃣ **Start MongoDB:**
```bash
mongod
```

5️⃣ **Run the application:**
- For development (auto-restart with nodemon):
```bash
npm run dev
```
- For production:
```bash
npm start
```

---

## 🖥 Access the app
Open your browser and navigate to:  
```
http://localhost:5000
```

---

## 📂 Project Structure
```
library-management-system/
├── backend/
│   ├── config/database.js
│   ├── models/Book.js
│   ├── models/Transaction.js
│   ├── routes/books.js
│   ├── routes/transactions.js
│   ├── middleware/errorHandler.js
│   └── server.js
├── frontend/
│   ├── css/style.css
│   ├── js/app.js
│   └── index.html
├── .env
├── package.json
└── README.md
```

---

## 🔌 API Documentation

### 📚 Books API

| Method | Endpoint          | Description              |
| ------ | ----------------- | ------------------------ |
| GET    | `/api/books`      | Get all books            |
| GET    | `/api/books/:id`  | Get book by ID           |
| POST   | `/api/books`      | Create a new book        |
| PUT    | `/api/books/:id`  | Update a book by ID      |
| DELETE | `/api/books/:id`  | Delete a book by ID      |

---

### 🔄 Transactions API

| Method | Endpoint                       | Description                  |
| ------ | ------------------------------ | ---------------------------- |
| GET    | `/api/transactions`            | Get all transactions         |
| POST   | `/api/transactions/borrow`     | Borrow a book                |
| POST   | `/api/transactions/return`     | Return a book                |
| GET    | `/api/transactions/user/:email`| Get user's borrowed books    |

---

## 🚀 Example API Requests

### ➕ Create a new book
```json
POST /api/books
{
  "title": "My First Book",
  "author": "Ken Lo",
  "isbn": "1234567890",
  "genre": "Fiction",
  "publishedYear": 2025,
  "totalCopies": 3,
  "description": "A simple test book"
}
```

### 📚 Borrow a book
```json
POST /api/transactions/borrow
{
  "bookId": "687064b4b3160452dfddee2e",
  "borrowerName": "Ken Lo",
  "borrowerEmail": "kenlo@example.com",
  "borrowDays": 14
}
```

### 🔙 Return a book
```json
POST /api/transactions/return
{
  "transactionId": "68706d29b3160452dfddee34"
}
```

---

## 🗄️ Database Schemas

### 📘 Book Schema
```javascript
{
  title: String,
  author: String,
  isbn: String (unique),
  publishedYear: Number,
  genre: String,
  totalCopies: Number,
  availableCopies: Number,
  description: String,
  createdAt: Date,
  updatedAt: Date
}
```

### 🔄 Transaction Schema
```javascript
{
  bookId: ObjectId (ref: Book),
  borrowerName: String,
  borrowerEmail: String,
  borrowDate: Date,
  dueDate: Date,
  returnDate: Date,
  status: "borrowed" | "returned" | "overdue",
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🎨 Frontend Design
- Fully responsive with **Bootstrap 5**
- 📚 Books Management: Add, edit, delete books
- 📖 Transaction History: See borrowed & returned records
- 🔄 Borrow/Return: Borrow by selecting books, return by email
- Alerts, badges, and modals for modern UX

---

## 🚨 Error Handling & Security
- Global Express error middleware for clean JSON errors
- Frontend alerts for validations & errors
- CORS configured for secure API access
- Mongoose input validation for data integrity

---

## 📝 Testing & Usage
- Test via browser UI or tools like curl / Postman
```bash
curl http://localhost:5000/api/books
curl -X POST http://localhost:5000/api/books  -H "Content-Type: application/json"  -d '{"title":"Another Test","author":"Ken Lo","isbn":"2234567890","publishedYear":2025,"genre":"Fiction","totalCopies":4}'
```

---

## 🔒 Environment Variables
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/library_management
NODE_ENV=production
```

---