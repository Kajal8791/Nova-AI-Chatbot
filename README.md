# ✨ Nova AI – Intelligent AI Chat Assistant

Nova AI is a full-stack AI-powered chatbot application designed to provide intelligent, helpful, and user-friendly conversations. It integrates the Groq API for AI-generated responses and provides secure user authentication with personalized chat history.

## 🚀 Features

- **AI-Powered Conversations:** Get intelligent responses using the Groq API.
- **User Authentication:** Register and log in using an email address and password.
- **JWT-Based Security:** Secure API access using JSON Web Tokens.
- **Personal Chat History:** Each user can access their own saved conversations.
- **Chat Management:** Create new conversations, view previous chats, and delete individual chats.
- **Persistent Storage:** User accounts and conversations are stored in MySQL.
- **Responsive Interface:** Designed for desktop, tablet, and mobile screens.
- **User Profile:** Displays the logged-in user's profile information.
- **Logout:** Securely ends the current login session.
- **Code Formatting:** Supports formatted AI responses, including code blocks.

## 🛠️ Technologies Used

### Frontend
- HTML5
- CSS3
- JavaScript

### Backend
- Java 25
- Spring Boot 3.5.16
- Spring Web
- Spring WebFlux
- Spring Security
- Spring Data JPA
- Hibernate

### Database
- MySQL 8

### AI Integration
- Groq API
- OpenAI-compatible Chat Completions API
- Model: `openai/gpt-oss-20b`

### Authentication
- JWT (JSON Web Token)
- JJWT 0.12.6

### Build Tool
- Apache Maven

## 📁 Project Structure

```text
Nova-AI/
│
├── backend/
│   ├── src/
│   │   └── main/
│   │       ├── java/com/example/chatbot/
│   │       │   ├── controller/
│   │       │   ├── dto/
│   │       │   ├── entity/
│   │       │   ├── repository/
│   │       │   ├── security/
│   │       │   └── service/
│   │       │
│   │       └── resources/
│   │           └── application.properties
│   │
│   └── pom.xml
│
├── frontend/
│   ├── index.html
│   ├── auth.html
│   ├── app.js
│   └── style.css
│
└── README.md
```

## ⚙️ Requirements

Before running Nova AI, install:

- Java JDK 25
- Apache Maven
- MySQL Server 8
- A Groq API key
- Visual Studio Code or another code editor

## 💻 Installation and Setup

### 1. Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd Nova-AI
```

### 2. Create the MySQL Database

Open MySQL and execute:

```sql
CREATE DATABASE nova_ai_db;
```

Configure your MySQL username and password for the backend.

### 3. Configure Environment Variables

Set the following environment variables on your computer:

| Variable | Description |
|---|---|
| `GROQ_API_KEY` | Your Groq API key |
| `NOVA_DB_PASSWORD` | Your MySQL database password |
| `JWT_SECRET` | A strong secret key for JWT signing |

Never commit API keys, passwords, or JWT secrets to GitHub.

### 4. Configure Backend

Open:

```text
backend/src/main/resources/application.properties
```

Configure the required database and API settings using environment variables.

### 5. Run the Backend

Open PowerShell:

```powershell
cd backend
mvn spring-boot:run
```

The backend runs locally on:

```text
http://localhost:8080
```

### 6. Run the Frontend

Open the `frontend` folder in Visual Studio Code.

Use the Live Server extension to launch:

```text
frontend/index.html
```

The frontend communicates with the Spring Boot backend.

## 🔐 Security and Privacy

- Passwords are handled through the backend authentication system.
- JWT authentication protects private API endpoints.
- Chat history is associated with individual user accounts.
- Users can manage and delete their own conversations.
- Sensitive environment variables should never be published in the repository.

## 📡 Main API Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Log in |
| POST | `/api/chat` | Send a message to Nova AI |
| GET | `/api/chats` | Get the logged-in user's chats |
| POST | `/api/chats` | Create a new chat |
| GET | `/api/chats/{chatId}/messages` | Get chat messages |
| POST | `/api/chats/{chatId}/messages` | Save a chat message |
| DELETE | `/api/chats/{chatId}` | Delete a chat |

## 🎯 Project Goals

Nova AI aims to provide a simple and accessible AI chat experience with secure user accounts, personalized conversation history, and a responsive user interface.

## 👩‍💻 Author

**Kajal**

Full-Stack Development Project

## 📄 License

This project is available for educational and personal learning purposes. Add a formal open-source license before granting reuse or redistribution rights.
