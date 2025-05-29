# Movie Diary Backend

A GraphQL API backend for managing movie diaries, built with Node.js, Express, MongoDB, and Apollo Server.

## Features

- User authentication (register/login)
- Movie diary management (add, update, delete, list movies)
- GraphQL API with Apollo Server
- MongoDB database with Mongoose ODM
- JWT-based authentication
- Search and filtering capabilities
- Pagination support

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file in the root directory with the following variables:

```
PORT=4000
MONGODB_URI=mongodb://localhost:27017/movie-diary
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=development
```

3. Start MongoDB service on your machine

4. Start the development server:

```bash
npm run dev
```

The server will start at http://localhost:4000 with the GraphQL playground available at http://localhost:4000/graphql

## API Documentation

### Authentication

- `register(input: UserInput!): AuthPayload!`
- `login(email: String!, password: String!): AuthPayload!`

### Movie Operations

- `addMovie(input: MovieInput!): Movie!`
- `updateMovie(id: ID!, input: MovieInput!): Movie!`
- `deleteMovie(id: ID!): Boolean!`
- `movie(id: ID!): Movie`
- `movies(limit: Int, offset: Int, search: String, sortBy: String, sortOrder: String): [Movie!]!`
- `userMovies(userId: ID!, limit: Int, offset: Int): [Movie!]!`

### User Operations

- `me: User`

## Authentication

All movie operations require authentication. Include the JWT token in the Authorization header:

```
Authorization: Bearer <your-token>
```

## Development

- `npm run dev` - Start development server with hot reload
- `npm start` - Start production server
- `npm test` - Run tests

## Security

- Passwords are hashed using bcrypt
- JWT tokens are used for authentication
- Input validation is implemented
- MongoDB queries are sanitized

## Error Handling

The API uses standard GraphQL error handling. All errors are returned in the standard GraphQL error format with appropriate error messages.

# Test

// bun run test -- -t "AuthController" # Run only AuthController tests
// bun run test -- --coverage # Run tests with coverage report
