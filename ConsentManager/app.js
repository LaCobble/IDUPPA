require('dotenv').config();
const express = require('express');
const eurekaClient = require('./config/eureka');

const dataRoutes = require('./routes/dataRoutes');
const rectificationRoutes = require('./routes/rectificationRoutes');
const forgottenRoutes = require('./routes/forgottenRoutes');

const app = express();
app.use(express.json());

app.use(dataRoutes);
app.use(rectificationRoutes);
app.use(forgottenRoutes);

const PORT = process.env.PORT || 8086;

app.listen(PORT, () => {
  console.log(`Provider Microservice running on port ${PORT}`);
  eurekaClient.start();
});
