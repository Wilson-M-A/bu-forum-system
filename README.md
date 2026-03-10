🧑‍💻 BU Forum – Outdoor Community Platform

A web-based community platform built with Node.js, Express, and SQLite.

This project combines a traditional community discussion forum with outdoor activity tools, allowing users to share hiking experiences, explore hiking routes, organize events, and communicate with other community members.

It demonstrates full-stack web development including backend APIs, database integration, server-side rendering, and interactive front-end features.

📌 Features
Community Forum System

The platform includes a full discussion system where users can:

User registration and login

Create and manage discussion posts

Reply to existing posts

Multiple discussion boards

Admin management system

Simple and responsive interface

Users can share hiking experiences, discuss routes, and participate in community conversations.

🥾 Hiking Exploration Module

The system includes an interactive hiking map where users can explore hiking routes and checkpoints.

Features include:

Interactive hiking map with route visualization

View hiking trails and route checkpoints

Mark checkpoints as completed (hiking check-in system)

Navigate to trail start points or checkpoints via Google Maps

Discuss specific hiking routes through the forum

This module allows the platform to function not only as a forum but also as an outdoor exploration tool for hikers.

📅 Activity Calendar

The platform includes a community activity calendar for organizing outdoor events.

Features include:

Publish hiking or community events

View upcoming activities on the calendar

Export events to personal device calendars using the ICS format

Users can download event files and add them to their own calendar applications such as Apple Calendar, Google Calendar, or Outlook.

💬 Private Messaging

The platform also provides a private messaging system that allows users to communicate directly.

Features include:

Send private messages to other users

Inbox for received messages

Direct communication for coordinating hiking activities

🏗️ Tech Stack
Backend

Node.js

Express.js

Frontend

HTML

CSS

JavaScript

EJS Template Engine

Database

SQLite

Map Tools

Leaflet

Google Maps

Development Tools

Git

GitHub

📂 Project Structure
bu-forum-system
│
├── public/        # Static assets (CSS, JS, hiking map)
├── routes/        # Express routes
├── views/         # EJS templates
│
├── db.js          # Database connection
├── server.js      # Main server
├── i18n.js        # Internationalization support
├── package.json   # Dependencies
└── setup.sh       # Setup script
🚀 Getting Started
1 Clone the repository
git clone https://github.com/Wilson-M-A/bu-forum-system.git

2 Enter project directory
cd bu-forum-system

3 Install dependencies
npm install

4 Run the server
node server.js

5 Open in browser
http://localhost:3000

🧪 Example Use Cases

Users can:

Create discussion posts about hiking experiences

Reply to other users and share route tips

Explore hiking routes using the interactive map

Navigate to hiking trail start points

Organize hiking activities using the calendar

Export events to their personal calendars

Send private messages to coordinate with other hikers

🔮 Future Improvements

Planned improvements include:

🤖 AI-powered post summarization

🤖 AI reply suggestions

👤 User profile system

🔎 Smart search system

🌐 Cloud deployment

📱 Improved UI/UX

📊 Hiking statistics and activity tracking

🌍 Deployment (Future)

The application can be deployed to cloud platforms such as:

Render

Railway

Vercel (frontend)

👨‍💻 Author

Mingyang Ma

Computer Science Student
Hong Kong Baptist University

GitHub
https://github.com/Wilson-M-A

⭐ If you like this project, feel free to give it a star ⭐ on GitHub.
