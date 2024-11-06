require('dotenv').config();
const AppManager = require('./system/core/AppManager');

const PORT = process.env.PORT || 3000;

async function startServer() {
    try {
        const app = await AppManager.initialize();
        
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

startServer();