import 'reflect-metadata';
import { config } from 'dotenv';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { AuthResolver } from './graphql/resolvers/AuthResolver';
import { MovieResolver } from './graphql/resolvers/MovieResolver';
import { WatchlistResolver } from './graphql/resolvers/WatchlistResolver';
import { AuthService } from './services/AuthService';
import { Context } from './types/context';

// Load environment variables
config();

const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

// Connect to MongoDB
mongoose
	.connect(process.env.MONGODB_URI!, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => console.log('Connected to MongoDB'))
	.catch((err) => console.error('MongoDB connection error:', err));

async function startServer() {
	// Build GraphQL schema
	const schema = await buildSchema({
		resolvers: [AuthResolver, MovieResolver, WatchlistResolver],
		emitSchemaFile: true,
		validate: false,
	});

	// Create Apollo Server
	const server = new ApolloServer({
		schema,
		context: async ({ req }): Promise<Context> => {
			const token = req.headers.authorization?.replace('Bearer ', '');
			const user = token ? await AuthService.verifyToken(token) : undefined;
			return { req, user };
		},
	});

	await server.start();
	server.applyMiddleware({ app });

	const PORT = process.env.PORT || 4000;
	app.listen(PORT, () => {
		console.log(`Server running on http://localhost:${PORT}`);
		console.log(
			`GraphQL endpoint: http://localhost:${PORT}${server.graphqlPath}`
		);
	});
}

startServer().catch((err) => console.error('Error starting server:', err));
