import docsRoute from "../routes/docs.route.js";
import userRoutes from "../routes/user.routes.js";
import app from "../core/settings.js";

app.use('/docs', docsRoute);
app.use('/users', userRoutes);

export default app;