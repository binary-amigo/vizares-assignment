# Task Management App

This is a simple task management application built using React. It allows users to manage tasks, including viewing, creating, and completing them. The app fetches data from an API and also supports connecting to your own backend server for managing tasks.

## Features
- View, create, and manage tasks.
- Fetch tasks from an external API (default setup).
- Option to connect to your own backend server by modifying the URI.

## Technologies Used
- **Frontend**: React
- **State Management**: useReducer
- **Backend (Optional)**: Can be linked to your own backend server for custom data handling (refer to the backend repo below).

## How to Run Locally

### Prerequisites
- [Node.js](https://nodejs.org/) (version 12 or above)
- [npm](https://www.npmjs.com/)

### Steps to Set Up

1. Clone this repository:
   ```bash
   git clone https://github.com/binary-amigo/vizares-assignment.git
   ```

2. Install the dependencies:
   ```bash
   cd vizares-assignment
   npm install
   ```

3. Set up the backend (optional):
   If you want to use your own server, modify the backend API URI in the app.

   - Clone the [backend repo](https://github.com/binary-amigo/todo-backend.git).
   - Make sure your backend is running and accessible via a URL.

   - In the frontend project, update the backend URI in the appropriate config file or environment variables, depending on how the app is structured. (Example: `.env` file or API setup in the source code.)

4. Run the application:
   ```bash
   npm run dev
   ```

5. Open the app in your browser:
   - Visit `http://localhost:5172` (or the configured port) to use the app.

## Backend Repo
If you want to run your own backend server, you can link to the [Task Management Backend Repo](https://github.com/binary-amigo/todo-backend.git). The backend handles task data, authentication, and more.
