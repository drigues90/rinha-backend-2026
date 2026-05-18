const app = require('./app');
const { initLanceDb } = require('./services/lanceDb');

const port = Number(process.env.PORT) || 3000;

async function startServer() {
  try {
    await initLanceDb();
    app.listen(port, () => {
      console.log(`API listening on port ${port}`);
    });
  } catch (error) {
    console.error('Failed to initialize LanceDB', error);
    process.exit(1);
  }
}

startServer();
