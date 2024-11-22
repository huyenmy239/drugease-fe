# Frontend Project

This project is the frontend of an interactive web platform for creating and participating in online classrooms. The platform is designed to provide users with an intuitive and engaging experience. It allows users to create rooms, participate in discussions, and share content in a seamless manner.

## Project Structure

### 1. **assets/**
This directory contains all static resources such as images, fonts, and global CSS styles.

- **images/**: Stores image files used throughout the application.
- **fonts/**: Stores custom font files used for the platform.
- **styles/**: Contains global CSS files. The main global stylesheet is `main.css`.

### 2. **js/**
This directory contains all JavaScript files required for the functionality of the frontend.

- **components/**: Reusable UI components that are used across different pages (e.g., `header.js`, `footer.js`).
- **pages/**: Contains logic specific to each page (e.g., `home.js`, `about.js`).
- **services/**: Includes services to interact with APIs and handle data processing (e.g., `api.js`).
- **utils/**: Helper functions to support various operations (e.g., `domUtils.js`, `formatDate.js`).
- **main.js**: The entry point of the application. It is the main JavaScript file that initializes and configures the app.

### 3. **pages/**
This directory contains HTML files for different pages in the web application.

- **index.html**: The home page of the platform.
- **about.html**: A page that provides information about the platform.
- **contact.html**: A page for contacting the support team.

### 4. **.gitignore**
This file specifies which files and directories Git should ignore when pushing code to the repository.

### 5. **README.md**
This file (you are currently reading) provides an overview of the project and instructions for setup, usage, and contributing.

## Features

- **Home Page**: Includes a user-friendly layout with a search bar, featured rooms, and a navigation bar. Users can access their profiles, search for rooms, and explore suggested rooms based on their interests.
- **Room Creation**: Users can create new rooms by providing a title, description, and selecting a topic. Room settings include privacy options and permissions for mic control.
- **Room Interaction**: Users can join rooms, chat with other participants, share files, and share screens. The rooms also support real-time communication via voice and text.
- **Room Management**: Room creators (hosts) can manage the room, including adding/removing participants, locking the room, and setting permissions for mic access.
- **User Profile**: Each user has a profile with customizable information such as profile picture and password. Users can also view their room history (last 24 hours).

## Installation

To get started with the project locally, follow these steps:

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```

2. Navigate to the project directory:
   ```bash
   cd <project-directory>
   ```

3. Open the project in your favorite code editor.

4. Open the `index.html` file in a browser to view the homepage.

Alternatively, you can use a local server setup like `live-server` for a smoother experience.

## Usage

Once the application is running, users can:

- **Create Rooms**: Use the 'Create Room' form to set up a new classroom with a title, description, and privacy settings.

- **Join Rooms**: Browse and search for available rooms, join discussions, or participate in activities.

- **Communicate**: Use the chat, microphone, and screen-sharing features to interact with other participants.

- **Profile Management**: Update personal information and change settings from the user profile section.


## Technologies Used

- **HTML5**
- **CSS3** (with custom styling)
- **JavaScript** (ES6+)
- **APIs** for data handling (integrated via `api.js`)


## Contributing

If you would like to contribute to this project, please follow these steps:

1. Fork the repository.

2. Create a new branch (`git checkout -b feature-branch`).

3. Make your changes and commit them (`git commit -am 'Add new feature'`).

4. Push to your fork (`git push origin feature-branch`).

5. Open a pull request with a description of the changes.