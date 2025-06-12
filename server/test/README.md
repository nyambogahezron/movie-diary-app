# Movie Diary Testing Guide

## GraphQL Testing

This project includes a testing suite for both REST API endpoints and GraphQL resolvers. Below is a guide on how to write and execute tests for GraphQL functionality.

### Setting Up GraphQL Tests

GraphQL tests use Apollo Server's testing utilities to validate resolvers, mutations, and queries without having to spin up a full HTTP server. This approach gives us:

1. Faster test execution
2. More direct testing of resolvers
3. Better control over the test context

### Test Structure

GraphQL tests follow this general pattern:

1. Setup test data and context
2. Execute GraphQL operations against an Apollo Server instance
3. Verify the response and database state

### Example Test

```typescript
import { ApolloServer } from '@apollo/server';
import { setupTestDatabase, teardownTestDatabase } from '../setup';
import { db } from '../../db/test-db';
import * as schema from '../../db/schema';
import typeDefs from '../../graphql/schema';
import resolvers from '../../graphql/resolvers/index';
import { createTestUser, createTestMovie } from '../utils';

describe('GraphQL Feature Test', () => {
	let server: ApolloServer;
	let userId: number;

	// Setup before tests run
	beforeAll(async () => {
		await setupTestDatabase();

		// Create test user
		const { user } = await createTestUser();
		userId = user.id;

		// Create Apollo Server for testing
		server = new ApolloServer({
			typeDefs,
			resolvers,
		});

		await server.start();
	});

	// Cleanup after tests
	afterAll(async () => {
		if (server) {
			await server.stop();
		}
		await teardownTestDatabase();
	});

	// Test cases
	it('should execute a GraphQL query', async () => {
		// Create context for the operation
		const context = {
			user: { id: userId, role: 'USER' },
			services: {
				/* service instances */
			},
		};

		// Execute the operation
		const response = await server.executeOperation(
			{
				query: `query { someQuery { id name } }`,
				variables: { someVar: 'value' },
			},
			{ contextValue: context }
		);

		// Assertions
		expect(response.body.errors).toBeUndefined();
		expect(response.body.data).toBeDefined();
	});
});
```

### Testing Context

When testing GraphQL, you need to provide a context object that simulates what would normally be created by the GraphQL middleware. This typically includes:

1. `user` - The currently authenticated user (or undefined for unauthenticated requests)
2. Service instances that resolvers depend on

Use the `createGraphQLContext()` helper function to create consistent contexts for your tests.

### Testing Mutations

For mutations, you need to:

1. Define the mutation string
2. Provide variables
3. Execute the operation
4. Verify the response and database state

```typescript
const mutation = `
  mutation CreateSomething($input: SomeInput!) {
    createSomething(input: $input) {
      id
      name
    }
  }
`;

const response = await server.executeOperation(
	{
		query: mutation,
		variables: { input: { name: 'Test' } },
	},
	{ contextValue: context }
);

expect(response.body.errors).toBeUndefined();
expect(response.body.data?.createSomething).toHaveProperty('id');
```

### Testing Queries

For queries, follow a similar pattern:

```typescript
const query = `
  query GetSomething($id: ID!) {
    something(id: $id) {
      id
      name
    }
  }
`;

const response = await server.executeOperation(
	{
		query,
		variables: { id: '123' },
	},
	{ contextValue: context }
);

expect(response.body.data?.something).toBeDefined();
```

### Testing Authentication and Authorization

You can test authentication and authorization by manipulating the user in the context:

1. For unauthenticated requests, omit the user or set to undefined
2. For different roles, change the user's role property
3. For specific permissions, add the necessary properties to the user object

### Running Tests

To run GraphQL tests:

```bash
# Run all GraphQL tests
npm test -- --testPathPattern=graphql

# Run a specific GraphQL test file
npm test -- test/controllers/SomeFeature.graphql.test.ts
```

## Test Utilities

The project includes several helper functions to simplify testing:

- `createTestUser()` - Creates a test user and returns the user object and auth token
- `createTestMovie()` - Creates a test movie associated with a user
- `createGraphQLContext()` - Creates a context object for GraphQL operations

These utilities help maintain consistency across tests and reduce code duplication.
