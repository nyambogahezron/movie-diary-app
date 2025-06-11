#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored messages
print_message() {
    color=$1
    message=$2
    echo -e "${color}${message}${NC}"
}

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check if server is running
check_server() {
    print_message "$BLUE" "Checking if server is running..."
    if curl -s http://localhost:4000/health > /dev/null; then
        print_message "$GREEN" "Server is running!"
        return 0
    else
        print_message "$RED" "Server is not running. Please start the server first."
        return 1
    fi
}

# Install dependencies if needed
install_dependencies() {
    print_message "$BLUE" "Checking dependencies..."
    
    # Check for required commands
    for cmd in node npm npx; do
        if ! command_exists "$cmd"; then
            print_message "$RED" "Error: $cmd is not installed"
            exit 1
        fi
    done
    
    # Check for required npm packages
    if [ ! -d "node_modules" ]; then
        print_message "$YELLOW" "Installing dependencies..."
        npm install
    fi
    
    # Check for required packages for testing
    if ! npm list graphql-request chalk > /dev/null 2>&1; then
        print_message "$YELLOW" "Installing test dependencies..."
        npm install --save-dev graphql-request chalk
    fi
}

# Run basic tests
run_basic_tests() {
    print_message "$BLUE" "Running basic GraphQL tests..."
    npx ts-node scripts/test-queries.ts
    basic_status=$?
    
    if [ $basic_status -eq 0 ]; then
        print_message "$GREEN" "Basic tests completed successfully!"
    else
        print_message "$RED" "Basic tests failed!"
    fi
    
    return $basic_status
}

# Run advanced tests
run_advanced_tests() {
    print_message "$BLUE" "Running advanced GraphQL tests..."
    npx ts-node scripts/test-advanced-queries.ts
    advanced_status=$?
    
    if [ $advanced_status -eq 0 ]; then
        print_message "$GREEN" "Advanced tests completed successfully!"
    else
        print_message "$RED" "Advanced tests failed!"
    fi
    
    return $advanced_status
}

# Run specialized tests
run_specialized_tests() {
    print_message "$BLUE" "Running specialized GraphQL tests..."
    npx ts-node scripts/test-specialized.ts
    specialized_status=$?
    
    if [ $specialized_status -eq 0 ]; then
        print_message "$GREEN" "Specialized tests completed successfully!"
    else
        print_message "$RED" "Specialized tests failed!"
    fi
    
    return $specialized_status
}

# Generate test report
generate_report() {
    local timestamp=$(date +"%Y-%m-%d_%H-%M-%S")
    local report_dir="test-reports"
    local report_file="${report_dir}/test_report_${timestamp}.txt"
    
    # Create reports directory if it doesn't exist
    mkdir -p "$report_dir"
    
    # Generate report content
    {
        echo "GraphQL API Test Report"
        echo "====================="
        echo "Timestamp: $(date)"
        echo
        echo "Test Results Summary:"
        echo "-------------------"
        echo "Basic Tests: $([ $1 -eq 0 ] && echo "PASSED" || echo "FAILED")"
        echo "Advanced Tests: $([ $2 -eq 0 ] && echo "PASSED" || echo "FAILED")"
        echo "Specialized Tests: $([ $3 -eq 0 ] && echo "PASSED" || echo "FAILED")"
        echo
        echo "Performance Metrics:"
        echo "------------------"
        # Extract performance metrics from specialized test output
        if [ -f "test-reports/performance_metrics.json" ]; then
            cat "test-reports/performance_metrics.json"
        fi
    } > "$report_file"
    
    print_message "$GREEN" "Test report generated: $report_file"
}

# Main execution
main() {
    # Check server status
    check_server || exit 1
    
    # Install dependencies
    install_dependencies
    
    # Run tests
    print_message "$BLUE" "Starting API tests..."
    echo "----------------------------------------"
    
    # Run basic tests
    run_basic_tests
    basic_result=$?
    
    echo "----------------------------------------"
    
    # Run advanced tests
    run_advanced_tests
    advanced_result=$?
    
    echo "----------------------------------------"
    
    # Run specialized tests
    run_specialized_tests
    specialized_result=$?
    
    echo "----------------------------------------"
    
    # Generate test report
    generate_report $basic_result $advanced_result $specialized_result
    
    # Print final status
    if [ $basic_result -eq 0 ] && [ $advanced_result -eq 0 ] && [ $specialized_result -eq 0 ]; then
        print_message "$GREEN" "All tests completed successfully! 🎉"
        exit 0
    else
        print_message "$RED" "Some tests failed! ❌"
        exit 1
    fi
}

# Run main function
main 