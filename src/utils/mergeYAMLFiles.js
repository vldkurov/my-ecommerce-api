const YAML = require('yamljs');
const fs = require('fs-extra');
const path = require('path');

const docsPath = path.join(__dirname, '..', '..', 'docs');
const outputPath = path.join(__dirname, '..', '..', 'docs', 'api-docs.yaml');

const mergeYAMLFiles = () => {
    let mainDoc = {

        openapi: '3.0.0',
        info: {
            title: 'The e-commerce API',
            version: '1.0.0',
            description: 'This is a simple CRUD API application made with Express and documented with Swagger',
        },
        servers: [
            {
                url: 'http://localhost:3000/api',
                description: 'Development server',
            },
        ],
        paths: {},
        components: {
            schemas: {},
            responses: {},
            parameters: {},
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
    };

    // List your YAML files here
    const files = [
        'users.yaml',
        'products.yaml',
        'carts.yaml',
        'orders.yaml',
        'accounts.yaml'
    ];

    files.forEach((file) => {
        const filePath = path.join(docsPath, file);
        const doc = YAML.load(filePath);

        // Merge paths
        mainDoc.paths = {...mainDoc.paths, ...doc.paths};

        // Merge components
        if (doc.components) {
            if (doc.components.schemas) {
                mainDoc.components.schemas = {...mainDoc.components.schemas, ...doc.components.schemas};
            }
            if (doc.components.responses) {
                mainDoc.components.responses = {...mainDoc.components.responses, ...doc.components.responses};
            }
            if (doc.components.parameters) {
                mainDoc.components.parameters = {...mainDoc.components.parameters, ...doc.components.parameters};
            }
            // Add other component types as needed
        }
    });

    // Optionally merge other sections (components, etc.)

    fs.writeFileSync(outputPath, YAML.stringify(mainDoc, 10));
    console.log('Merged API documentation created at:', outputPath);
};

module.exports = {mergeYAMLFiles}
