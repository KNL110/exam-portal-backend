# exam-portal - Backend

A Node.js/Express.js backend for the Goa Testing Agency examination portal, providing secure authentication, exam management, and response handling.

## 🚀 Features

- **User Authentication**: JWT-based authentication for professors and candidates
- **Exam Management**: Create, update, and manage exams with MCQ and numerical answer types
- **Response Handling**: Store and evaluate student responses with automatic scoring
- **Role-based Access Control**: Separate permissions for professors and students
- **Secure API**: Protected routes with middleware authentication
- **Database Integration**: MongoDB with Mongoose ODM

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v14 or higher)
- **MongoDB** (v4.4 or higher)
- **npm** package manager

## 🛠️ Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd backend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory with the following variables:

   ```env
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017
   CORS_ORIGIN=http://localhost:5173
   
   # JWT Secrets
   ACCESS_TOKEN_SECRET=your_access_token_secret_here
   REFRESH_TOKEN_SECRET=your_refresh_token_secret_here
   ACCESS_TOKEN_EXPIRY=<your preferred time limit>
   REFRESH_TOKEN_EXPIRY=<your preferred time limit>
   ```

4. **Start MongoDB**
   Make sure your MongoDB service is running:

   ```bash
   # On Ubuntu/Linux
   sudo systemctl start mongod
   
   # On macOS (with Homebrew)
   brew services start mongodb-community
   
   # On Windows
   net start MongoDB
   ```

## 🚀 Running the Application

### Development Mode

```bash
npm run dev
```

The server will start on `http://localhost:3000` (or the port specified in your .env file).

### Production Mode

```bash
npm start
```

## 🔗 API Endpoints

### Professor Routes

- `GET /api/v1/professor/login` - professor login
- `POST /api/v1/professor/logout` - Professor logout

### Candidate Routes  

- `GET /api/v1/candidate/login` - candidate login
- `GET /api/v1/candidate/getStudent/:id` - Get student by ID
- `POST /api/v1/candidate/logout` - Candidate logout
- `POST /api/v1/candidate/getStudents` - Get multiple students by IDs

### Exam Routes

Only logged in professor and student access these protected routes

- `POST /api/v1/exam/creatExam` - Create new exam (Professor only)
- `POST /api/v1/exam/submitExam/:examID` - Submit exam responses
- `POST /api/v1/exam/startExam/:examID` - Start an exam session
- `GET /api/v1/exam/getExam` - Get all exams for professor
- `GET /api/v1/exam/getExam/:examID` - Get specific exam details
- `GET /api/v1/exam/examResult` - Get exam results

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication:

1. **Login**: Users authenticate with credentials to receive an access token
2. **Protected Routes**: Include `Authorization: Bearer <token>` in headers
3. **Role-based Access**: Routes are protected based on user roles (professor/candidate)

## 📊 Database Models

- **Professor Modeles**
- **Student Model**
- **Exam Model**
- **Question Model**
- **Response Model**

## 🐛 Error Handling

The API uses a centralized error handling system:

- **ApiError**: Custom error class for API-specific errors
- **ApiResponse**: Standardized response format
- **asyncHandler**: Wrapper for async route handlers
- **Global Error Middleware**: Catches and formats all errors

### Standard Response Format

```json
{
  "success": true/false,
  "message": "Response message",
  "data": {} // Response data (if success)
}
```

## 🧪 Testing

### Manual Testing

Use tools like Postman or curl to test the API endpoints.

## 📈 Performance Considerations

- **Database Indexing**: Unique indexes on email, examID, questionID
- **Password Hashing**: Using bcrypt for secure password storage
- **JWT Tokens**: Short-lived access tokens for security
- **Mongoose Pagination**: Built-in pagination support for large datasets

## 🔧 Configuration

### CORS Configuration

The server is configured to accept requests from the frontend URL specified in `CORS_ORIGIN`.

### Database Configuration

MongoDB connection is configured in `src/database/db.js` with automatic reconnection.

### Environment Variables

All sensitive configuration is stored in environment variables for security.

## 🤝 Contributing

1. Fork the repository
2. Create a branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 👤 Author

### Krunal Asari

## 🔗 Related Projects

- Frontend Repository: <https://github.com/KNL110/exam-portal-frontend.git>

---

For any issues or questions, please create an issue in the repository or contact me.
