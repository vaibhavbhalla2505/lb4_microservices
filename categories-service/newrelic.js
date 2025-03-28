'use strict';
require('dotenv').config();
exports.config = {
  app_name: ['categories-service'], // Replace with the service name, e.g., 'BookServices', 'bms-api-gateway'
  license_key: process.env.LISCENCE_KEY, // Get this from your New Relic account
  logging: {
    level: 'info', // Adjust log level as needed (e.g., 'debug', 'error')
  },
  host: 'collector.newrelic.com', // Default collector, adjust if using EU region
  distributed_tracing: {
    enabled: true, // Enable distributed tracing for microservices
  },
  slow_sql: {
    enabled: true, // Monitor slow SQL queries if applicable
  },
  transaction_tracer: {
    enabled: true, // Enable detailed transaction tracing
  },
};