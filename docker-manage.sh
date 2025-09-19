#!/bin/bash

# Code Sensei Docker Management Script

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if .env file exists
check_env() {
    if [ ! -f .env ]; then
        print_warning ".env file not found. Creating from env.example..."
        cp env.example .env
        print_warning "Please update .env file with your actual API keys!"
        return 1
    fi
    return 0
}

# Function to start services
start() {
    print_status "Starting Code Sensei services..."
    
    if ! check_env; then
        print_error "Please configure .env file first!"
        exit 1
    fi
    
    docker-compose up -d
    print_success "Services started successfully!"
    print_status "Application: http://localhost:3000"
    print_status "MongoDB Express: http://localhost:8081"
    print_status "MongoDB: localhost:27017"
    print_status "Redis: localhost:6379"
}

# Function to stop services
stop() {
    print_status "Stopping Code Sensei services..."
    docker-compose down
    print_success "Services stopped successfully!"
}

# Function to restart services
restart() {
    print_status "Restarting Code Sensei services..."
    docker-compose down
    docker-compose up -d
    print_success "Services restarted successfully!"
}

# Function to show logs
logs() {
    if [ -n "$1" ]; then
        docker-compose logs -f "$1"
    else
        docker-compose logs -f
    fi
}

# Function to show status
status() {
    print_status "Service Status:"
    docker-compose ps
}

# Function to clean up
clean() {
    print_warning "This will remove all containers, volumes, and images. Are you sure? (y/N)"
    read -r response
    if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
        print_status "Cleaning up..."
        docker-compose down -v --rmi all
        docker system prune -f
        print_success "Cleanup completed!"
    else
        print_status "Cleanup cancelled."
    fi
}

# Function to build
build() {
    print_status "Building Code Sensei application..."
    docker-compose build --no-cache
    print_success "Build completed!"
}

# Function to show help
help() {
    echo "Code Sensei Docker Management Script"
    echo ""
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  start     Start all services"
    echo "  stop      Stop all services"
    echo "  restart   Restart all services"
    echo "  logs      Show logs (optionally specify service name)"
    echo "  status    Show service status"
    echo "  build     Build the application"
    echo "  clean     Clean up all containers and volumes"
    echo "  help      Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 start"
    echo "  $0 logs app"
    echo "  $0 restart"
}

# Main script logic
case "${1:-help}" in
    start)
        start
        ;;
    stop)
        stop
        ;;
    restart)
        restart
        ;;
    logs)
        logs "$2"
        ;;
    status)
        status
        ;;
    build)
        build
        ;;
    clean)
        clean
        ;;
    help|--help|-h)
        help
        ;;
    *)
        print_error "Unknown command: $1"
        help
        exit 1
        ;;
esac
