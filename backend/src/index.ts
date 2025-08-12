import express, { Request, Response } from "express"
import dotenv from "dotenv";

dotenv.config();
const app = express();
const PORT : string | undefined = process.env.BACKEND_PORT;

app.use(express.json());

app.get('/', async(req: Request, res: Response) : Promise<void> => {
    res.status(400).json({
        message : "Hi there!"
    })
})

app.listen(PORT, () : void => {
    console.log(`Port ${PORT} open`)
})

