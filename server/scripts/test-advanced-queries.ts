import { GraphQLClient } from 'graphql-request';
import { advancedExamples } from '../examples/advanced-queries';
import chalk from 'chalk';

// Create GraphQL client
const client = new GraphQLClient('http://localhost:4000/graphql', {
	headers: {
		// Add auth token if needed
		// Authorization: `Bearer ${token}`,
	},
});

// Test result interface
interface TestResult {
	name: string;
	success: boolean;
	duration: number;
	error?: any;
	warnings?: string[];
}

// Test runner with timeout
async function runTestWithTimeout<T>(
	name: string,
	testFn: () => Promise<T>,
	timeout: number = 10000
): Promise<TestResult> {
	const startTime = Date.now();
	const warnings: string[] = [];

	try {
		const result = await Promise.race([
			testFn(),
			new Promise((_, reject) =>
				setTimeout(
					() => reject(new Error(`Test timed out after ${timeout}ms`)),
					timeout
				)
			),
		]);

		const duration = Date.now() - startTime;

		// Add warning if test took too long
		if (duration > 5000) {
			warnings.push(`Test took ${duration}ms to complete`);
		}

		return {
			name,
			success: true,
			duration,
			warnings: warnings.length > 0 ? warnings : undefined,
		};
	} catch (error) {
		return {
			name,
			success: false,
			duration: Date.now() - startTime,
			error,
		};
	}
}

// Test nested queries
async function testNestedQueries(): Promise<TestResult[]> {
	const results: TestResult[] = [];

	// Test user profile query
	results.push(
		await runTestWithTimeout('User Profile Query', async () => {
			const variables = { userId: '1' };
			return client.request(advancedExamples.nestedQueries, variables);
		})
	);

	// Test movie details query
	results.push(
		await runTestWithTimeout('Movie Details Query', async () => {
			const variables = { movieId: '1' };
			return client.request(advancedExamples.nestedQueries, variables);
		})
	);

	// Test advanced search
	results.push(
		await runTestWithTimeout('Advanced Search Query', async () => {
			const variables = {
				input: {
					query: 'action',
					year: 2020,
					genres: ['Action', 'Adventure'],
					minRating: 7,
					sortBy: 'RATING',
					sortOrder: 'DESC',
					page: 1,
					limit: 10,
				},
			};
			return client.request(advancedExamples.nestedQueries, variables);
		})
	);

	return results;
}

// Test error handling
async function testErrorHandling(): Promise<TestResult[]> {
	const results: TestResult[] = [];

	// Test validation errors
	results.push(
		await runTestWithTimeout('Validation Errors', async () => {
			return client.request(advancedExamples.errorHandlingExamples);
		})
	);

	// Test authentication errors
	results.push(
		await runTestWithTimeout('Authentication Errors', async () => {
			return client.request(advancedExamples.errorHandlingExamples);
		})
	);

	// Test rate limiting
	results.push(
		await runTestWithTimeout('Rate Limiting', async () => {
			return client.request(advancedExamples.errorHandlingExamples);
		})
	);

	// Test concurrent operations
	results.push(
		await runTestWithTimeout('Concurrent Operations', async () => {
			return client.request(advancedExamples.errorHandlingExamples);
		})
	);

	// Test edge cases
	results.push(
		await runTestWithTimeout('Edge Cases', async () => {
			return client.request(advancedExamples.errorHandlingExamples);
		})
	);

	return results;
}

// Test performance
async function testPerformance(): Promise<TestResult[]> {
	const results: TestResult[] = [];

	// Test large result sets
	results.push(
		await runTestWithTimeout(
			'Large Result Sets',
			async () => {
				return client.request(advancedExamples.performanceExamples);
			},
			30000
		) // Longer timeout for large queries
	);

	// Test complex aggregations
	results.push(
		await runTestWithTimeout(
			'Complex Aggregations',
			async () => {
				return client.request(advancedExamples.performanceExamples);
			},
			20000
		)
	);

	// Test nested relationships
	results.push(
		await runTestWithTimeout(
			'Nested Relationships',
			async () => {
				return client.request(advancedExamples.performanceExamples);
			},
			15000
		)
	);

	return results;
}

// Print test results
function printResults(results: TestResult[]) {
	console.log('\nTest Results:');
	console.log('=============');

	results.forEach((result) => {
		if (result.success) {
			console.log(chalk.green(`✓ ${result.name}`));
			console.log(`  Duration: ${result.duration}ms`);
			if (result.warnings) {
				result.warnings.forEach((warning) => {
					console.log(chalk.yellow(`  Warning: ${warning}`));
				});
			}
		} else {
			console.log(chalk.red(`✗ ${result.name}`));
			console.log(`  Duration: ${result.duration}ms`);
			console.log(chalk.red(`  Error: ${result.error.message}`));
			if (result.error.response?.errors) {
				result.error.response.errors.forEach((err: any) => {
					console.log(chalk.red(`    - ${err.message}`));
				});
			}
		}
		console.log('---');
	});

	// Print summary
	const total = results.length;
	const passed = results.filter((r) => r.success).length;
	const failed = total - passed;
	const avgDuration = results.reduce((sum, r) => sum + r.duration, 0) / total;

	console.log('\nSummary:');
	console.log('========');
	console.log(`Total Tests: ${total}`);
	console.log(chalk.green(`Passed: ${passed}`));
	console.log(chalk.red(`Failed: ${failed}`));
	console.log(`Average Duration: ${avgDuration.toFixed(2)}ms`);
}

// Main test runner
async function runAdvancedTests() {
	console.log(chalk.blue('Running Advanced GraphQL Tests...'));
	console.log('==============================\n');

	try {
		// Run all test suites
		const [nestedResults, errorResults, performanceResults] = await Promise.all(
			[testNestedQueries(), testErrorHandling(), testPerformance()]
		);

		// Combine and print all results
		const allResults = [
			...nestedResults,
			...errorResults,
			...performanceResults,
		];
		printResults(allResults);

		// Exit with appropriate code
		const hasFailures = allResults.some((r) => !r.success);
		process.exit(hasFailures ? 1 : 0);
	} catch (error) {
		console.error(chalk.red('Test runner failed:'), error);
		process.exit(1);
	}
}

// Run tests if called directly
if (require.main === module) {
	runAdvancedTests();
}

// Export for programmatic use
export { runAdvancedTests };
