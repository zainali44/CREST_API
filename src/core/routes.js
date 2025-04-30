import docsRoute from "../routes/docs.route.js";
import userRoutes from "../routes/user.routes.js";
import googleRoutes from "../routes/googleAuth.routes.js";
import planRoutes from "../routes/plan.routes.js";
import subscriptionRoutes from "../routes/subscription.routes.js";
import app from "../core/settings.js";
import currencieRoutes from "../routes/currencie.routes.js";
import invoiceRoutes from "../routes/invoice.routes.js";
import paymentMethodRoutes from "../routes/paymentMethod.routes.js";
import transactionRoutes from "../routes/transaction.routes.js";

app.use('/docs', docsRoute);
app.use('/users', userRoutes);
app.use('/plans',planRoutes);
app.use('/subscriptions',subscriptionRoutes);
app.use('/currencies',currencieRoutes);
app.use('/invoices',invoiceRoutes);
app.use('/payment-methods',paymentMethodRoutes);
app.use('/transactions',transactionRoutes);
app.use('/google',googleRoutes);

export default app;