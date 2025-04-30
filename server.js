import 'dotenv/config';
import app from "./src/core/routes.js"
import sequelize from "./src/config/squeDB.js";
import './src/models/associations.js';

const PORT = process.env.PORT || 8000;
const HOSTNAME = '0.0.0.0';
const startServer = async () => {
    try {
        await sequelize.sync({ alter: true });
        console.log('Database & tables created!');

        app.listen(PORT, HOSTNAME,() => {
            console.log(`Server is running on http://${HOSTNAME}:${PORT}/api-docs`);
        });
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
};

startServer();