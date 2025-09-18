# Fantacsi Project

Fantacsi is a web application designed for managing fantasy sports leagues. This project allows users to create and manage championships, add players, and view matches in a user-friendly interface.

## Features

- User authentication with login and registration.
- Create and manage championships.
- Add and manage players.
- View matches and results.
- Responsive design with a consistent user interface.

## Technologies Used

- React: A JavaScript library for building user interfaces.
- Vite: A build tool that provides a fast development environment.
- CSS: For styling the application with a focus on consistency and responsiveness.

## Project Structure

```
frontend
├── .gitignore
├── Dockerfile
├── eslint.config.js
├── index.html
├── package.json
├── README.md
├── vite.config.js
├── public
│   └── vite.svg
├── src
│   ├── App.css
│   ├── index.css
│   ├── main.jsx
│   ├── App.jsx
│   ├── api
│   │   ├── auth.js
│   │   ├── championships.js
│   │   └── matches.js
│   ├── assets
│   │   ├── logo.png
│   │   └── react.svg
│   ├── auth
│   │   ├── AuthContext.jsx
│   │   ├── AuthProvider.jsx
│   │   ├── components
│   │   │   └── LoginForm.jsx
│   │   └── pages
│   │       └── AuthPage.jsx
│   ├── components
│   │   ├── AddPlayerForm.jsx
│   │   ├── Header.jsx
│   │   ├── Modal.jsx
│   │   ├── Navbar.jsx
│   │   ├── calendar
│   │   │   ├── Day.jsx
│   │   │   ├── EventModal.jsx
│   │   │   └── Notification.jsx
│   ├── pages
│   │   ├── AddPlayersPage.jsx
│   │   ├── CalendarPage.jsx
│   │   ├── ChampionshipListPage.jsx
│   │   ├── CreateChampionshipPage.jsx
│   │   ├── DashboardPage.jsx
│   │   ├── ImportPlayersPage.jsx
│   │   └── NotFoundPage.jsx
│   └── utils
│       ├── api.js
│       ├── auth.js
│       └── status.js
```

## Getting Started

1. Clone the repository:
   ```
   git clone <repository-url>
   ```

2. Navigate to the project directory:
   ```
   cd frontend
   ```

3. Install the dependencies:
   ```
   npm install
   ```

4. Start the development server:
   ```
   npm run dev
   ```

5. Open your browser and go to `http://localhost:3000` to view the application.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.