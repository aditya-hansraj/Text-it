# Real-Time Chat Application

This is a real-time chat application built using the MERN stack (MongoDB, Express, React, Node.js). The application supports user authentication, real-time messaging, chat with multiple users, and a real-time notification system.

## Features

- **User Authentication:** Secure login and registration using bcrypt.
- **Real-Time Messaging:** Chat with multiple users in real-time using socket.io.
- **Notification System:** Real-time notifications for new messages.

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v14 or higher)
- [MongoDB](https://www.mongodb.com/try/download/community) (Running locally or a cloud instance)
- [Git](https://git-scm.com/)

## Setup

1. **Clone the repository:**

   ```bash
   git clone https://github.com/yourusername/your-repo-name.git
2. **Navigate to the project directory:**
   ```bash
   cd Text-it
3. **Navigate to the server directory:**
   ```bash
   cd server
4. **Install dependencies using npm:**
   ```bash
   npm install
5. **Set up your cloud database in mongodb atlas and get your connection string, then set your environment variables:**
    ```bash
    MONGODB_URI=mongodb+srv://your-connection-string
    JWT_SECRET_KEY = yoursecretkey
6. **Start the server:**
   ```bash
   npm start
7. **Navigate to the client directory:**
   ```bash
   cd ../client
8. **Install dependencies using npm:**
   ```bash
   npm install
9. **Run the client:**
   ```bash
   npm run dev
10. **Navigate to the socket directory & start the socket server:**
    ```bash
    cd ../sockete
    npm start
11. Open your browser and navigate to http://localhost:5173/
12. Now register and use the real time chat applicaion.









