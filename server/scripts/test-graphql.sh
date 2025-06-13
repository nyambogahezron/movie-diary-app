#!/bin/bash

# Set colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}=========================================${NC}"
echo -e "${GREEN}Running GraphQL API Tests${NC}"
echo -e "${BLUE}=========================================${NC}"

# Run tests for each GraphQL controller
echo -e "\n${YELLOW}Running Auth GraphQL tests...${NC}"
bun test test/controllers/AuthController.graphql.test.ts

echo -e "\n${YELLOW}Running Movie GraphQL tests...${NC}"
bun test test/controllers/MovieController.graphql.test.ts

echo -e "\n${YELLOW}Running Review GraphQL tests...${NC}"
bun test test/controllers/MovieReviewController.graphql.test.ts

echo -e "\n${YELLOW}Running Watchlist GraphQL tests...${NC}"
bun test test/controllers/WatchlistController.graphql.test.ts

echo -e "\n${YELLOW}Running Favorite GraphQL tests...${NC}"
bun test test/controllers/FavoriteController.graphql.test.ts

echo -e "\n${YELLOW}Running Post GraphQL tests...${NC}"
bun test test/controllers/PostController.graphql.test.ts

echo -e "\n${YELLOW}Running Advanced GraphQL tests...${NC}"
bun test test/controllers/AdvancedQueries.graphql.test.ts

echo -e "\n${YELLOW}Running GraphQL Coverage tests...${NC}"
bun test test/graphql-coverage.test.ts

echo -e "\n${BLUE}=========================================${NC}"
echo -e "${GREEN}All GraphQL tests completed${NC}"
echo -e "${BLUE}=========================================${NC}"
