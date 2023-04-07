import express from "express";
import cors from 'cors';
import { customerRouter } from "./routers/customer";
import { equipmentRouter } from "./routers/equipment";
import { userRecord } from "./routers/user";
const app = express();

app.use(express.json()) ;
app.use(cors({
  origin: 'http://localhost:3000',
}));


app.use('/customer', customerRouter);
app.use('/equipment', equipmentRouter);
app.use('/user', userRecord);



app.listen(3001, () => console.log("Backend server is running!"));
