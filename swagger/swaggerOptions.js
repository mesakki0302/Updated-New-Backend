module.exports = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Bed Management API',
            version: '1.0.0',
            description: 'API endpoints for managing beds.',
        },
        servers: [
            {
                url: 'http://localhost:5000', // Adjust the URL as per your server configuration
                description: 'Development server',
            },
        ],
    },
    apis: ['./admit/admitRoutes.js', './bed/bedRoutes.js', './transfer/transferRoutes.js', './discharge/dischargeRoutes.js','./dashboard/dashFirst.js' ], // Paths to the files containing your Swagger definitions
  };