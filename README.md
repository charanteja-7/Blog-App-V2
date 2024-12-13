

# Blog Application

A full-stack blog application that allows users to create, update, delete posts and comments, manage likes, and more. This application features user authentication, a user-friendly interface, and a responsive design.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
- [Frontend](#frontend)
- [Backend](#backend)
- [API Endpoints](#api-endpoints)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

  ![Profile Image](https://github.com/charanteja-7/Blog-App-V2/blob/main/assets/allblogs.png?raw=true)

 ![Profile Image](https://github.com/charanteja-7/Blog-App-V2/blob/main/assets/myblogs.png?raw=true)

 ![Profile Image](https://github.com/charanteja-7/Blog-App-V2/blob/main/assets/profile.png?raw=true)


## Features

- **User Authentication**: Register, login, and logout features.
- **Post Management**:
  - Add, update, and delete blog posts.
  - View all user-created blogs.
- **Comment Management**:
  - Add, update, and delete comments on posts.
- **Likes**: Like and unlike posts.
- **View Count**: Track how many times a post has been viewed.
- **Related Posts**: Display related posts for the current post.
- **About Section**: Information about the application.
- **Contact Section**: A way to contact the developer.

## Technologies Used

### Frontend
- **React**: For building user interfaces.
- **Context API**: For state management.
- **Tailwind CSS**: For styling and responsive design.
- **React Router DOM**: For navigation.
- **React Toastify**: For notifications.

### Backend
- **Node.js**: For the server environment.
- **Express.js**: For building RESTful APIs.
- **Bcrypt**: For hashing passwords.
- **JWT (JSON Web Tokens)**: For user authentication.
- **Mongoose**: For interacting with MongoDB.
- **Multer**: For handling image uploads.
- **Cookie Parser**: For managing cookies.

## Getting Started

To get started with this application, follow these steps:

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (either local or a cloud service)
- npm or yarn

### Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/charanteja-7/Blog-App-V2.git
   cd your-repo-name
   ```

2. **Install dependencies for the backend**:

   ```bash
   cd backend
   npm install
   ```

3. **Set up your environment variables**: Create a `.env` file in the backend folder with the necessary variables (e.g., MongoDB connection string, JWT secret).

4. **Run the backend server**:

   ```bash
   npm start
   ```

5. **Install dependencies for the frontend**:

   ```bash
   cd ../frontend
   npm install
   ```

6. **Run the frontend application**:

   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication
- **POST** `/api/auth/register`: Register a new user.
- **POST** `/api/auth/login`: Log in a user.
- **POST** `/api/auth/logout`: Log out the user.

### Posts
- **GET** `/api/posts`: Retrieve all posts.
- **POST** `/api/posts`: Create a new post.
- **PUT** `/api/posts/:id`: Update a post.
- **DELETE** `/api/posts/:id`: Delete a post.

### Comments
- **GET** `/api/posts/:postId/comments`: Get comments for a post.
- **POST** `/api/posts/:postId/comments`: Add a new comment.
- **PUT** `/api/comments/:id`: Update a comment.
- **DELETE** `/api/comments/:id`: Delete a comment.

### Likes
- **POST** `/api/posts/:postId/like`: Like a post.
- **DELETE** `/api/posts/:postId/like`: Unlike a post.

## Usage

After following the installation instructions, navigate to `http://localhost:5173` in your web browser to access the application. You can register a new account, log in, and start creating posts and comments!

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue if you encounter any problems.



## Contact

For any inquiries, feel free to reach out to me at [chukkalacharanteja9@gmail.com].

