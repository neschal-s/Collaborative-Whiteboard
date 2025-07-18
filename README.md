# Collaborative Whiteboard - COLLABPAD

[![MIT License](https://img.shields.io/badge/license-MIT-green)](LICENSE)  
[![Frontend Build](https://img.shields.io/badge/frontend-Vercel-blue?logo=vercel)](https://vercel.com)  
[![Backend Build](https://img.shields.io/badge/backend-Render-blue?logo=render)](https://render.com)

A real-time collaborative whiteboard app with live drawing, chat, and collaborative code editor — perfect for teams, remote collaboration, and creative brainstorming.

---

## Live demo:  
https://collab-webpad.vercel.app 

---

## Features

- Real-time collaborative drawing: pencil, line, rectangle tools  
- Color picker, undo, redo, and clear canvas  
- Collaborative live code editor synced across users  
- User chat in rooms with notifications  
- Room creation and joining using UUID codes  
- Online users list with join/leave alerts  
- Dark/light theme toggle with persistence via localStorage  
- Animated loaders using Lottie and Framer Motion  
- Backend powered by Node.js, Express, Socket.IO  
- Secure code execution via Judge0 API  

---

## Tech Stack

Frontend: React, React Router, Framer Motion, React Toastify  
Backend: Node.js, Express.js, Socket.IO, Judge0 API  
Others: Axios, Lottie animations, Bootstrap 5  


---

## Folder Structure

Collaborative-Whiteboard/  
├── backend/                      # Backend server  
│   ├── utils/                    # Helper utilities (users.js)  
│   ├── server.js                 # Express + Socket.IO + API routes  
│   ├── package.json              # Backend dependencies  
│   └── .env                     # Backend environment variables  

├── public/                      # Static assets  
├── src/                         # Frontend React source  
│   ├── assets/                  # Images, animations  
│   ├── components/              # UI components (ChatBar, WhiteBoard, Loader, Forms)  
│   ├── pages/                   # Pages (RoomPage, Forms)  
│   ├── App.js                   # Root component + routing  
│   ├── index.js                 # React entry point  
│   └── index.css                # Global styles  

├── .gitignore  
├── package.json                 # Frontend dependencies  
├── README.md                   # This file  

---

## Getting Started

### Prerequisites

- Node.js v14+  
- npm or yarn

## Running Locally

### Start backend server:

cd backend  
npm install  
npm run dev  

### Start frontend app:

cd ..  
npm install  
npm start  


## How It Works

- Users create or join rooms via unique UUID codes.  
- Socket.IO handles real-time syncing of drawing, chat messages, and collaborative code editor.  
- Backend communicates with Judge0 API for secure code execution.  
- UI features dark/light theme toggle with persistence.  
- Animated loaders and smooth transitions improve UX.  
- Users receive join/leave notifications and see online participants list.  


## Deployment

- Frontend deployed on Vercel with automatic GitHub integration.  
- Backend deployed on Render for fast cold-start and reliable hosting.    

## Available Scripts

### Frontend

- npm start - Runs frontend in development mode  
- npm run build - Builds frontend for production  


### Backend

- npm run dev - Runs backend server with nodemon for development  


## Contributing

Contributions are welcome! Please open issues or submit pull requests for bug fixes or feature requests.  


## License

This project is licensed under the MIT License.  


## Contact

Created by Neschal Singh
Email: singhneschal@gmail.com


-Thank you for checking out COLLABPAD! 🚀


### Installation
```bash
git clone https://github.com/neschal-s/Collaborative-Whiteboard.git
cd Collaborative-Whiteboard
