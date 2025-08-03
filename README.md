# DailyNote 📝

A modern, responsive note-taking application built with React and Firebase. DailyNote allows users to create, edit, and manage their personal notes with a beautiful, intuitive interface.

## Features

-  User Authentication**: Secure login and registration with Firebase Auth
-  Note Management**: Create, edit, and delete notes with real-time updates
-  Modern UI**: Beautiful, responsive design built with Tailwind CSS
-  Dashboard**: Clean dashboard interface for managing all your notes
-  Real-time**: Instant updates and synchronization across devices
-  Responsive**: Works seamlessly on desktop, tablet, and mobile devices
-  Secure**: User-specific notes with Firebase security rules

## 🛠️ Tech Stack

- **Frontend**: React 18, React Router DOM
- **Styling**: Tailwind CSS
- **Backend**: Firebase (Authentication, Firestore Database)
- **Charts**: Chart.js with React Chart.js 2
- **Build Tool**: Create React App

## 🚀 Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn package manager
- Firebase project setup

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd dailynote
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Firebase Configuration**
   
   Create a Firebase project and add your configuration to `src/firebase.js`:
   ```javascript
   const firebaseConfig = {
     apiKey: "your-api-key",
     authDomain: "your-project.firebaseapp.com",
     projectId: "your-project-id",
     storageBucket: "your-project.appspot.com",
     messagingSenderId: "your-sender-id",
     appId: "your-app-id"
   };
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

   The application will open at [http://localhost:3000](http://localhost:3000)

## 📖 Usage

### Authentication
- **Register**: Create a new account with email and password
- **Login**: Sign in with your existing credentials
- **Dashboard**: Access your personal notes after authentication

### Note Management
- **Create Notes**: Click "Add New Note" to create a new note
- **Edit Notes**: Click the edit icon on any note to modify it
- **Delete Notes**: Click the delete icon to remove a note
- **View Notes**: All your notes are displayed in chronological order

## 🏗️ Project Structure

```
dailynote/
├── public/                 # Static files
├── src/
│   ├── components/         # React components
│   │   ├── dashboard.js    # Main dashboard component
│   │   ├── home.js         # Landing page component
│   │   ├── login.js        # Login component
│   │   └── register.js     # Registration component
│   ├── App.js             # Main application component
│   ├── firebase.js        # Firebase configuration
│   └── index.js           # Application entry point
├── package.json           # Dependencies and scripts
└── tailwind.config.js    # Tailwind CSS configuration
```

## 🚀 Available Scripts

- **`npm start`** - Runs the app in development mode
- **`npm test`** - Launches the test runner
- **`npm run build`** - Builds the app for production
- **`npm run eject`** - Ejects from Create React App (one-way operation)

## 🔧 Configuration

### Firebase Setup
1. Create a new Firebase project
2. Enable Authentication (Email/Password)
3. Create a Firestore database
4. Set up security rules for the `notes` collection
5. Add your Firebase config to `src/firebase.js`

### Environment Variables
Create a `.env` file in the root directory for sensitive configuration:
```
REACT_APP_FIREBASE_API_KEY=your-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-domain
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
```

## 🎨 Customization

### Styling
The application uses Tailwind CSS for styling. You can customize the design by modifying:
- `tailwind.config.js` - Tailwind configuration
- Component-specific CSS classes
- Color schemes and themes

### Features
- Add new features by creating new components
- Extend the Firebase database schema
- Implement additional authentication methods

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [React](https://reactjs.org/) - A JavaScript library for building user interfaces
- [Firebase](https://firebase.google.com/) - Backend-as-a-Service platform
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Chart.js](https://www.chartjs.org/) - Simple yet flexible JavaScript charting

## 📞 Support

If you encounter any issues or have questions, please:
- Contact the development team at visonovaofficial@gmail.com

---

**Happy Note-Taking! 📝✨**
