import Invoice from "./invoice.model.js";
import Subscription from "./subscription.model.js";
import Plan from "./plan.model.js";
import User from "./user.model.js";
import PaymentMethod from "./paymentMethod.model.js";
import Currencie from "./currencie.model.js";
import BankTransactionDetail from "./bank_details.model.js";
import Transaction from "./transaction.model.js";


// ------------------- INVOICE ↔ TRANSACTION (1-1) -------------------

Invoice.hasOne(Transaction, {
  foreignKey: 'invoice_id',
  as: 'transaction',
  onDelete: 'CASCADE'
});
Transaction.belongsTo(Invoice, {
  foreignKey: 'invoice_id',
  as: 'invoice'
});

// ------------------- SUBSCRIPTION ↔ INVOICE (1-1) -------------------
Subscription.hasOne(Invoice, {
  foreignKey: 'subscription_id',
  as: 'invoices',
  onDelete: 'CASCADE'
});
Invoice.belongsTo(Subscription, {
  foreignKey: 'subscription_id',
  as: 'subscription'
});

// ------------------- PLAN ↔ SUBSCRIPTION (1-M) -------------------
Plan.hasMany(Subscription, {
  foreignKey: 'plan_id',
  as: 'subscriptions',
  onDelete: 'CASCADE'
});
Subscription.belongsTo(Plan, {
  foreignKey: 'plan_id',
  as: 'plan'
});

// ------------------- USER ↔ SUBSCRIPTION (1-M) -------------------
User.hasMany(Subscription, {
  foreignKey: 'user_id',
  as: 'subscriptions',
  onDelete: 'CASCADE'
});
Subscription.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user'
});

// ------------------- TRANSACTION ↔ PAYMENT METHOD (M-1) -------------------
PaymentMethod.hasMany(Transaction, {
  foreignKey: 'payment_method_id',
  as: 'transactions'
});
Transaction.belongsTo(PaymentMethod, {
  foreignKey: 'payment_method_id',
  as: 'paymentMethod'
});

// ------------------- TRANSACTION ↔ CURRENCY (M-1) -------------------
Currencie.hasMany(Transaction, {
  foreignKey: 'code',
  sourceKey: 'code',
  as: 'transactions',
});

Transaction.belongsTo(Currencie, {
  foreignKey: 'code',
  targetKey: 'code',
  as: 'currency',
});

// ------------------- TRANSACTION ↔ BANK DETAIL (1-1) -------------------
Transaction.hasOne(BankTransactionDetail, {
  foreignKey: 'transaction_id',
  as: 'bankDetail',
  onDelete: 'CASCADE'
});
BankTransactionDetail.belongsTo(Transaction, {
  foreignKey: 'transaction_id',
  as: 'transaction'
});


Subscription.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'users'
});