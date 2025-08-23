# Hedaya Backend API

A secure, modular Express.js application with authentication, file uploads, and email capabilities.

## Features

- 🔐 JWT Authentication
- 📧 Email service for password reset
- 🖼️ Image upload with Cloudinary
- 🗄️ MongoDB database
- 📝 Input validation with Joi
- 🛡️ Security with Helmet
- 📊 Logging with Morgan

## API Endpoints

- `/api/auth` - Authentication routes
- `/api/users` - User management
- `/api/categories` - Category management
- `/api/subcategories` - Subcategory management
- `/api/products` - Product management
- `/api/password` - Password reset functionality
- `/api/health` - Health check

## Environment Variables

Copy `env.example` to `.env` and fill in your values:

```bash
# Database Configuration
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database_name

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=7d

# Email Configuration (Gmail)
USER_EMAIL=your_email@gmail.com
USER_PASS=your_app_password_here

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Server Configuration
PORT=5001
NODE_ENV=production

# Frontend URL (for password reset links)
FRONTEND_URL=https://your-frontend-domain.com
```

## Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Start production server
npm start
```

## Vercel Deployment

### Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **MongoDB Atlas**: Set up a MongoDB database
3. **Cloudinary Account**: Set up for image uploads
4. **Gmail App Password**: For email functionality

### Deployment Steps

1. **Install Vercel CLI**:

   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**:

   ```bash
   vercel login
   ```

3. **Deploy**:

   ```bash
   vercel
   ```

4. **Set Environment Variables**:
   - Go to your Vercel dashboard
   - Navigate to your project
   - Go to Settings > Environment Variables
   - Add all variables from your `.env` file

5. **Redeploy**:
   ```bash
   vercel --prod
   ```

### Important Notes for Vercel

- **Database**: Use MongoDB Atlas (cloud) not local MongoDB
- **File Uploads**: Cloudinary handles file storage
- **Environment Variables**: Must be set in Vercel dashboard
- **CORS**: Configure for your frontend domain
- **Password Reset**: Update `FRONTEND_URL` to your production domain

## API Documentation

Import the `Hedaya_API_Collection.postman_collection.json` file into Postman for testing all endpoints.

## Security Features

- JWT token authentication
- Password hashing with bcrypt
- Input validation and sanitization
- CORS protection
- Helmet security headers
- Rate limiting (can be added)

## Support

For issues or questions, please check the codebase or create an issue in the repository.
