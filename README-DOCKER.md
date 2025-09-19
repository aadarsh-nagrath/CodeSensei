# Code Sensei - Docker Setup

## 🚀 Quick Start

### 1. Setup Environment
```bash
# Copy environment file
cp env.example .env

# Edit .env with your API keys
nano .env
```

### 2. Start Services
```bash
# Make script executable (if not already)
chmod +x docker-manage.sh

# Start all services
./docker-manage.sh start
```

### 3. Access the Application
- **Application**: http://localhost:3000
- **MongoDB Express**: http://localhost:8081 (admin/password)
- **MongoDB**: localhost:27017
- **Redis**: localhost:6379

## 📋 Available Commands

```bash
# Start services
./docker-manage.sh start

# Stop services
./docker-manage.sh stop

# Restart services
./docker-manage.sh restart

# View logs
./docker-manage.sh logs

# View logs for specific service
./docker-manage.sh logs app

# Check status
./docker-manage.sh status

# Build application
./docker-manage.sh build

# Clean up everything
./docker-manage.sh clean
```

## 🔧 Environment Variables

Update `.env` file with your actual values:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/codesensei
REDIS_URL=redis://localhost:6379

# AI APIs
NEXT_PUBLIC_GENAI_API_KEY=your_google_ai_key_here
OPENAI_API_KEY=your_openai_key_here

# JWT
JWT_SECRET=your_jwt_secret_here

# App
NODE_ENV=development
PORT=3000
```

## 🏗️ Architecture

- **Next.js App**: Main application with API routes
- **MongoDB**: Database for users, questions, sessions
- **Redis**: Caching and rate limiting
- **MongoDB Express**: Database management UI

## 📊 Features Implemented

- ✅ **AI Question Generation**: Google Gemini AI integration
- ✅ **Redis Caching**: Question and topic caching
- ✅ **Rate Limiting**: IP-based rate limiting
- ✅ **Performance Monitoring**: Execution time tracking
- ✅ **Database Optimization**: Proper indexing
- ✅ **Docker Setup**: Complete containerization
- ✅ **Error Handling**: Comprehensive error management

## 🚀 Production Deployment

For production deployment to GCP:

1. Update environment variables for production
2. Use Cloud Run for the app
3. Use MongoDB Atlas for database
4. Use Cloud Memorystore for Redis
5. Configure proper secrets management

## 🐛 Troubleshooting

### Common Issues

1. **Port already in use**
   ```bash
   ./docker-manage.sh stop
   # Wait a moment
   ./docker-manage.sh start
   ```

2. **Environment variables not loaded**
   - Make sure `.env` file exists
   - Check that all required variables are set

3. **Redis connection failed**
   - Check if Redis container is running
   - Verify REDIS_URL in .env

4. **MongoDB connection failed**
   - Check if MongoDB container is running
   - Verify MONGODB_URI in .env

### View Logs
```bash
# All services
./docker-manage.sh logs

# Specific service
./docker-manage.sh logs app
./docker-manage.sh logs mongo
./docker-manage.sh logs redis
```

## 📈 Performance

- **Question Generation**: Cached for 1 hour
- **Topics**: Cached for 30 minutes
- **Rate Limiting**: 100 requests per 15 minutes per IP
- **Database**: Optimized with proper indexes
- **Auto-scaling**: Ready for Cloud Run deployment
