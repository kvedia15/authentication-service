import express, { Express } from 'express';
import { PrimaryAdapter } from '../../../core/ports/primary';
import { Server } from './app_server';
export class HttpAdapter implements PrimaryAdapter {
    app: Express;
    private port: number 
    public constructor(port: number) {
        const app = express()
        let server = new Server();
        this.app = server.app;
        this.port = port
    }

    run(){
        console.log('running http adapter');
        this.app.listen(this.port, () => {
            console.log(`Example app listening on port ${this.port}`)
        })
    }

    stop(){ 
        console.log('stopping http adapter');
    }
}