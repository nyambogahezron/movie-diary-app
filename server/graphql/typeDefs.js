const { gql } = require('apollo-server-express');

const typeDefs = gql`
	type User {
		id: ID!
		username: String!
		email: String!
		avatar: String
		createdAt: String!
		updatedAt: String!
	}

	type Movie {
		id: ID!
		title: String!
		tmdbId: String!
		posterPath: String
		releaseDate: String
		overview: String
		rating: Float
		watchDate: String
		review: String
		genres: [String]
		user: User!
		createdAt: String!
		updatedAt: String!
	}

	type AuthPayload {
		token: String!
		user: User!
	}

	input MovieInput {
		title: String!
		tmdbId: String!
		posterPath: String
		releaseDate: String
		overview: String
		rating: Float
		watchDate: String
		review: String
		genres: [String]
	}

	input UserInput {
		username: String!
		email: String!
		password: String!
		avatar: String
	}

	type Query {
		me: User
		movie(id: ID!): Movie
		movies(
			limit: Int
			offset: Int
			search: String
			sortBy: String
			sortOrder: String
		): [Movie!]!
		userMovies(userId: ID!, limit: Int, offset: Int): [Movie!]!
	}

	type Mutation {
		# Auth mutations
		register(input: UserInput!): AuthPayload!
		login(email: String!, password: String!): AuthPayload!

		# Movie mutations
		addMovie(input: MovieInput!): Movie!
		updateMovie(id: ID!, input: MovieInput!): Movie!
		deleteMovie(id: ID!): Boolean!
	}
`;

module.exports = typeDefs;
