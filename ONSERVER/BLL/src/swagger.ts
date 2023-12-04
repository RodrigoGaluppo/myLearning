export const swaggerDocument = {
    openapi: '3.0.1',
    info: {
        version: '1.0.0',
        title: 'APIs Document',
        description: 'your description here',
        termsOfService: '',
        contact: {
            name: 'Tran Son hoang',
            email: 'son.hoang01@gmail.com',
            url: 'https://hoangtran.co'
        },
        license: {
            name: 'Apache 2.0',
            url: 'https://www.apache.org/licenses/LICENSE-2.0.html'
        }
    },
    servers: [
        {
            "url": "http://localhost:8080",
            "description": "The production API server",
            "variables": {
                "env": {
                    "default": "app-dev",
                    "description": "DEV Environment"
                },
                "port": {
                    "enum": [
   
                        "8080",
           
                    ],
                    "default": "8080"
                },
                "basePath": {
                    "default": "v1"
                }
            }
        }
    ]
}