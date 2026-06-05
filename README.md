# GCC (VisionCoders)

## Project Overview

GCC is a full-stack collaborative code editor built with React, Vite, Node.js, Express, MongoDB, and Socket.IO. It enables users to register, log in, create projects, add files, invite members, and collaborate on code in real-time.

The project consists of:
- `gcc-web/` — frontend React application using Vite and Monaco Editor
- `server/` — backend Express API with MongoDB data persistence and Socket.IO for live collaboration
- `Rules and Regulations/` — separate documentation folder for project guidelines and policies

## Key Features

- User authentication with registration and login
- JWT-based session support
- Create and manage coding projects
- Add files to a project and save file content
- Invite members to share a project by email
- Real-time collaborative editing through Socket.IO
- JavaScript and Python code execution from the editor interface
- MongoDB-backed persistence for users, projects, files, and membership

## Architecture

- Frontend: React + Vite with `@monaco-editor/react` for editor UI
- Backend: Express server with RESTful routes
- Database: MongoDB via Mongoose
- Realtime: Socket.IO for collaborative code updates
- Authentication: bcrypt for password hashing and JWT for tokens

## Folder Structure

- `gcc-web/`
  - `src/`
    - `pages/` — React pages (`Login`, `Register`, `Dashboard`, `Project`)
    - `services/` — API and Socket.IO clients
    - `routes.jsx` — application routing
    - `App.jsx` — app entry component
  - `public/` — static assets
  - `package.json` — frontend dependencies and scripts

- `server/`
  - `controllers/` — route handlers for auth, projects, and code execution
  - `models/` — Mongoose schemas for `User` and `Project`
  - `routes/` — API endpoints for authentication, projects, and code
  - `server.js` — Express app setup, MongoDB setup, Socket.IO server
  - `package.json` — backend dependencies and scripts

## Setup Instructions

### Prerequisites

- Node.js (recommended latest LTS)
- npm
- Python installed and available on the system path
- MongoDB instance or MongoDB Atlas

### Environment Variables

Create a `.env` file inside `server/` with the following values:

```env
MONGO_URI=<your_mongo_connection_string>
JWT_SECRET=<your_jwt_secret>
PORT=5001
```

### Install Dependencies

From the root of the repository, run:

```bash
cd server
npm install
cd ../gcc-web
npm install
```

### Run the Backend

From `server/`:

```bash
npm run dev
```

This starts the backend on `http://localhost:5001`.

### Run the Frontend

From `gcc-web/`:

```bash
npm run dev
```

Open the Vite server URL shown in the terminal, usually `http://localhost:5173`.

## API Endpoints

### Authentication

- `POST /api/auth/register` — register new user
- `POST /api/auth/login` — user login

### Projects

- `POST /api/projects/create` — create a new project
- `GET /api/projects/:userId` — get projects for a user
- `GET /api/projects/project/:id` — get project by project ID
- `POST /api/projects/add-file` — add a file to a project
- `PUT /api/projects/update-file` — update file content
- `POST /api/projects/invite` — invite a user to a project by email

### Code Execution

- `POST /api/code/run` — backend route for running JavaScript and Python code

> Note: the editor now sends code to the backend runtime for execution. Python support is available for `.py` files, and JavaScript files execute on the server as well.

## Realtime Collaboration

The backend creates a Socket.IO server and listens for:
- `join-file` — join a shared editing room for a file
- `code-change` — broadcast code changes to other connected peers
- `receive-code` — receive live code updates from collaborators

The frontend connects to Socket.IO at `http://localhost:5001` and emits changes when the editor content updates.

## Development Notes

- The frontend currently stores the authenticated user in `localStorage`.
- Projects and file contents are persisted in MongoDB with the `Project` model.
- Each project includes an owner, member list, and file tree schema.
- The backend uses `bcryptjs` for password hashing and `jsonwebtoken` for token generation.

## Known Limitations

- Invite flow only works if the invited user is already registered in the system.
- File save uses file `name` matching; duplicate file names may cause conflicts.
- Code execution is currently limited to JavaScript files in the browser.

## Future Improvements

- Add logout and token expiration handling in frontend
- Improve file tree support for nested folders
- Persist live editor changes automatically
- Integrate backend `/api/code/run` route in the frontend
- Add better error handling and user notifications
- Add Python language runtime support in the editor and backend

## Team / Contributors

This README can be extended with member names and roles once available.

Example:

- Alice — Frontend
- Bob — Backend
- Carol — UI/UX
- Dave — Testing

---

If you want, I can also add a dedicated section for group members and their roles once you provide the details.
