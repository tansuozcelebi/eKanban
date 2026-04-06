require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const stockRoutes = require('./routes/stock');
const warehouseRoutes = require('./routes/warehouses');
const operationRoutes = require('./routes/operations');
const kanbanRoutes = require('./routes/kanban');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// API routes
app.use('/api/stock', stockRoutes);
app.use('/api/warehouses', warehouseRoutes);
app.use('/api/operations', operationRoutes);
app.use('/api/kanban', kanbanRoutes);

// Serve React build in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../../client/build')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../client/build', 'index.html'));
  });
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`e-Kanban server running on port ${PORT}`);
});
