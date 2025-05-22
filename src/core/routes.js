import docsRoute from "../routes/docs.route.js";
import userRoutes from "../routes/user.routes.js";
import app from "../core/settings.js";

// Middleware to restrict access to only specific user endpoints
app.use((req, res, next) => {
  // Always allow access to Swagger docs
  if (req.path.startsWith('/docs')) {
    return next();
  }
  
  // Only allow specific user endpoints
  const allowedPaths = [
    '/users/create',
    '/users/login',
    '/users/validate-token',
    '/users/verify-email'
  ];
  
  // Check if the requested path is in the allowed list
  if (allowedPaths.some(path => req.path === path)) {
    return next();
  }
  
  // Block access to all other routes
  return res.status(404).json({ error: 'Not found' });
});

// Register routes
app.use('/docs', docsRoute);
app.use('/users', userRoutes);

export default app;