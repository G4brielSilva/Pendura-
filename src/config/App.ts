/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import 'dotenv/config';
import express, { Application, Router } from 'express';
import helmet from 'helmet';
import path from 'path';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { DataSource } from 'typeorm';
import { RoutesSetup } from './routes';

export class App {
    public app: Application;

    public port: number;

    public path: string;

    public dataSource: DataSource | undefined;

    public swaggerConfig: swaggerJSDoc.OAS3Options | undefined;

    public docs: boolean | undefined;

    public assets: any[] | undefined;

    public logger: any;

    constructor(appInit: {
        path?: string;
        port: number;
        middlewares: any[];
        controllers: any[];
        dataSource?: DataSource;
        docs?: boolean;
        assets?: any[];
        logger?: any;
        swaggerConfig?: swaggerJSDoc.OAS3Options;
    }) {
        this.app = express();
        this.port = appInit.port;
        this.path = appInit.path || '/';
        this.dataSource = appInit.dataSource;
        this.swaggerConfig = appInit.swaggerConfig;
        this.docs = appInit.docs;
        this.assets = appInit.assets;
        this.logger = appInit.logger;

        this.setupLogger();

        this.app.use(express.json());
        this.app.use(helmet());

        this.middlewares(appInit.middlewares);
        this.routes(appInit.controllers);

        this.setUpSwagger();

        this.setupDocs();
        this.setupAssets();
    }

    private setupDocs(): void {
        if (!this.docs) return;

        this.app.use('/docs', express.static(path.join('./docs')));
    }

    private setupLogger(): void {
        if (!this.logger) return;

        this.app.use(this.logger.log);
    }

    private setupAssets(): void {
        if (!this.assets || this.assets?.length === 0) return;

        this.assets.forEach(asset => {
            this.app.use(asset.route, express.static(path.join(asset.dir)));
        });
    }

    private setUpSwagger(): void {
        if (!this.swaggerConfig) return;
        const swaggerSpecs = swaggerJSDoc(this.swaggerConfig);
        this.app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));
    }

    private middlewares(middlewares: { forEach: (arg0: (middleware: any) => void) => void }): void {
        middlewares.forEach(middleware => {
            this.app.use(middleware);
        });
    }

    private routes(controllers: any[]): void {
        controllers.forEach(controller => {
            const router = Router();
            router.use('/', RoutesSetup.getEndpointsFromControllers(controller as unknown as Function));
            this.app.use(this.path, router);
        });
    }

    private async databaseConnect(): Promise<void> {
        if (!this.dataSource) return;

        await this.dataSource.initialize();
        await this.dataSource.runMigrations();
    }

    public async start(): Promise<void> {
        this.databaseConnect();
        this.app.listen(this.port, () => {
            console.log(`App listening on the http://localhost:${this.port}\n\n`);
        });
    }
}
