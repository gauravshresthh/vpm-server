# VPM Server

## Overview
VPM Server is a Node.js-based backend server developed using TypeScript and Express. This project provides essential features such as authentication, session management, and API documentation using Swagger. It includes robust linting, formatting, and commit conventions to maintain high-quality code.

## Features
- **Authentication**: Supports JWT, Google OAuth 2.0, and local authentication strategies using Passport.js.
- **API Documentation**: Integrated with Swagger for API documentation.
- **Validation**: Data validation using Joi.
- **Database**: Mongoose for MongoDB integration.
- **Code Quality**: ESLint, Prettier, and Husky for consistent code style and linting.
- **TypeScript Support**: Strongly typed code for better maintainability.

## Prerequisites
- Node.js (>= 16.x)
- npm (>= 8.x)
- MongoDB

## Installation
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd vpm-server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and configure the following:
   ```env
   PORT=3000
   MONGO_URI=<your-mongodb-uri>
   JWT_SECRET=<your-jwt-secret>
   GOOGLE_CLIENT_ID=<your-google-client-id>
   GOOGLE_CLIENT_SECRET=<your-google-client-secret>
   ```

## Scripts
- **Start the server:**
  ```bash
  npm start
  ```

- **Run in development mode:**
  ```bash
  npm run dev
  ```

- **Build the project:**
  ```bash
  npm run build
  ```

- **Lint the code:**
  ```bash
  npm run lint
  ```

- **Fix linting issues:**
  ```bash
  npm run lint:fix
  ```

- **Format the code:**
  ```bash
  npm run format
  ```

## Folder Structure
```
├── src
│   ├── controllers   # Request handlers
│   ├── middleware    # Custom middleware functions
│   ├── models        # Mongoose schemas
│   ├── routes        # API route definitions
│   ├── utils         # Helper functions
│   └── server.ts     # Entry point
├── dist              # Compiled output
├── .env              # Environment variables
├── package.json      # Project configuration
```

## API Documentation
Swagger is used to document the APIs. After starting the server, the documentation can be accessed at:
```
http://localhost:<PORT>/api-docs
```

## Contributing
1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "feat: Add your message"
   ```
4. Push to the branch:
   ```bash
   git push origin feature/your-feature-name
   ```
5. Open a pull request.

## Commit Conventions
This project uses [Commitlint](https://commitlint.js.org/) to enforce commit message conventions. Follow the conventional commit format:
```
<type>: <subject>

Types:
- feat: A new feature
- fix: A bug fix
- docs: Documentation changes
- style: Code style changes (non-functional)
- refactor: Code refactoring
- test: Adding or fixing tests
- chore: Other changes (build process, dependencies, etc.)
```

## License
This project is licensed under the ISC License.

## Author
Gaurav Shrestha

