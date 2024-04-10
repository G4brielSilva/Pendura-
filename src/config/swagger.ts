import swaggerJSDoc from 'swagger-jsdoc';

export const swaggerConfig: swaggerJSDoc.OAS3Options = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Penduraí API',
            description: 'Endpoints do projeto Penduraí.',
            version: '1.12.0'
        },
        host: 'localhost:8080',
        tags: [],
        externalDocs: {
            description: 'View swagger.json',
            url: '../swagger.json'
        },
        components: {
            parameters: {
                page: {
                    in: 'query',
                    name: 'page',
                    required: false,
                    schema: {
                        type: 'integer',
                        default: 1
                    },
                    description: 'Número da página para paginação'
                },
                size: {
                    in: 'query',
                    name: 'size',
                    required: false,
                    schema: {
                        type: 'integer',
                        default: 10
                    },
                    description: 'Quantidade de itens por página para paginação'
                },
                order: {
                    in: 'query',
                    name: 'order',
                    required: false,
                    schema: {
                        type: 'string'
                    },
                    description: 'Campo para ordenação'
                },
                orderBy: {
                    in: 'query',
                    name: 'orderBy',
                    required: false,
                    schema: {
                        type: 'string',
                        enum: ['ASC', 'DESC']
                    }
                }
            },
            responses: {
                Success200: {
                    code: 200,
                    description: 'Sucess',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    message: {
                                        type: 'string',
                                        description: 'Sucess message'
                                    },
                                    data: {
                                        type: 'object',
                                        description: 'Returned data from request'
                                    }
                                }
                            }
                        }
                    }
                },
                SuccessEmpty204: {
                    description: 'Sucess Empty'
                }
            },
            securitySchemes: {
                BearerAuth: {
                    in: 'header',
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            }
        }
    },
    apis: [
        '../../baseapi_express/src/third-party/swagger/**/*.ts',
        'src/endpoints/**/*.ts',
        '../node_modules/baseapi_express/src/third-party/swagger/**/*.js',
        'endpoints/**/*.js'
    ]
};
