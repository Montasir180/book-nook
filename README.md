📚 BookNook – A Small Online Library

BookNook is an online library platform where readers can explore books, add new books, borrow books, and return them. It provides a simple and user-friendly way to manage a personal library and discover new reads.

🌐 Live Website

- Live Site: [Add Your Live Website URL]
- Frontend Repository: [GitHub Repository]
- Backend Repository: [GitHub Repository]

✨ Features

- 📖 Browse Books: Explore a collection of books with detailed information.
- 🔐 Authentication: Secure registration and login using email and password.
- 🔵 Google Login: Sign in easily using your Google account.
- ➕ Add Books: Add new books with images, categories, and descriptions.
- ✏️ Manage Books: Edit and delete books added by you.
- 📚 Borrow Books: Borrow available books from the library.
- 🔄 Return Books: Return borrowed books and manage your borrowing history.
- 👤 User Dashboard: Access your personal books and borrowing information.
- 📱 Responsive Design: Optimized for mobile, tablet, and desktop devices.
- 🔔 Toast Notifications: Get feedback for successful actions and errors.

🛠️ Technologies Used

Frontend

- Next.js (App Router)
- JavaScript (ES6+)
- ShareSkin UI
- Tailwind CSS
- Swiper.js
- Other UI libraries and components

Backend

- Node.js
- Express.js
- JavaScript
- MongoDB

Authentication & Security

- Better Auth
- Google OAuth Authentication
- JWT (JSON Web Token)

Additional Tools

- Git & GitHub
- imgbb / Postimages (Image Hosting)
- npm

📂 Main Pages

Page| Description
Home| Hero banner, latest arrivals, and featured sections
All Books| Browse all available books
Book Details| View complete information about a book
Add Book| Add new books to the library
My Books| Manage books added by you
My Borrows| View and return borrowed books
Login| Sign in using email or Google
Register| Create a new account

⚙️ Core Functionalities

- Complete CRUD operations for book management.
- User authentication and protected routes.
- Google OAuth login integration.
- RESTful API integration with Express.js.
- MongoDB database integration.
- Book borrowing and returning system.
- Available book copy management.
- Duplicate borrowing prevention.
- Responsive navigation and user interface.
- Custom loading states and error handling.

🚀 Getting Started

Clone the repositories

git clone YOUR_FRONTEND_REPOSITORY_URL
git clone YOUR_BACKEND_REPOSITORY_URL

Install dependencies

Run this command inside both project directories:

npm install

Environment Variables

Create the required environment files and configure your credentials.

Frontend (.env.local)

NEXT_PUBLIC_API_URL=your_backend_api_url

Backend (.env)

PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLIENT_URL=your_frontend_url

Also configure your Better Auth and Google OAuth credentials according to your implementation.

Run the Project

Start the backend:

npm run dev

Start the frontend in another terminal:

npm run dev

📡 API Endpoints

Method| Endpoint| Description
GET| "/books"| Get all books
GET| "/books/:id"| Get book details
POST| "/books"| Add a new book
PATCH| "/books/:id"| Update a book
DELETE| "/books/:id"| Delete a book
POST| "/borrows"| Borrow a book
GET| "/borrows"| Get borrowed books
DELETE| "/borrows/:id"| Return a book

🎯 Project Goal

The main goal of BookNook is to make book discovery and library management easier through a simple, interactive, and user-friendly web application.

---

Built with ❤️ using Next.js, Express.js, and MongoDB.
