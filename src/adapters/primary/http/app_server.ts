import express, { Express } from 'express';
export class Server {
    public app: Express;
    public constructor() {
        this.app = express();

        this.app.get('/', (req, res) => {
            res.send('Hello World!')
        })
    }
    
}