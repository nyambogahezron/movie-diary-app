# GraphQL API Migration Guide

## Overview

The Movie Diary API has been migrated from a REST API to a GraphQL API. This guide will help you understand the changes and how to update your client applications.

## Why GraphQL?

GraphQL provides several advantages over REST:

- Fetch exactly the data you need, no over-fetching or under-fetching
- Get multiple resources in a single request
- Strong typing through the GraphQL schema
- Introspection enables better documentation and tooling

## GraphQL Endpoint

The GraphQL API is available at `/graphql`. You can use this endpoint for all operations.

## GraphQL Playground

You can explore the GraphQL API using the GraphQL Playground, which is available at `/graphql` in your browser when running the server in development mode.

## Authentication

Authentication works the same way as before, but now you'll receive tokens from GraphQL mutations instead of REST endpoints:

```graphql
mutation Login {
	login(email: "user@example.com", password: "password") {
		token
		refreshToken
		user {
			id
			username
			email
		}
	}
}
```

## Common Operations

### Fetching Movies

```graphql
query GetMovies {
	movies(limit: 10, offset: 0) {
		id
		title
		overview
		posterPath
		releaseDate
		averageRating
		isFavorite
	}
}
```

### Getting a Single Movie

```graphql
query GetMovie($id: ID!) {
	movie(id: $id) {
		id
		title
		overview
		posterPath
		releaseDate
		averageRating
		isFavorite
		reviews {
			id
			rating
			review
			user {
				username
			}
		}
	}
}
```

### Creating a Movie Review

```graphql
mutation CreateReview($input: CreateReviewInput!) {
	createReview(input: $input) {
		id
		rating
		review
		movie {
			id
			title
		}
	}
}
```

## Migration Timeline

The REST API is now deprecated but will continue to function for some time to allow for a smooth transition. We recommend migrating to the GraphQL API as soon as possible.

## Need Help?

If you have any questions about migrating to the GraphQL API, please contact the development team.
