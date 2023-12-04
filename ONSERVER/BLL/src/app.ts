import express, { Application, Request, Response } from 'express';
import bodyParser from 'body-parser';
import swagger from "swagger-ui-express";
import {swaggerDocument} from './swagger';
import customerRouter from './domains/customer/customerRouter';
import employeeRouter from './domains/employee/employeeRouter';
import anonymousRouter from './domains/anonymous/anonymousRouter';
import mongoose from 'mongoose';
require('dotenv').config({ path: __dirname+'/.env' });

var cors = require('cors');


const app: Application = express();
app.use(cors());

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(employeeRouter);
app.use(customerRouter);
app.use(anonymousRouter);

app.get('/', (req: Request, res: Response) => {
  return res.send('Healthy')
});

const PORT = process.env.PORT || 80;


mongoose.connect(String(process.env.MONGODBCONSTRING))
.then(()=>{
    app.emit('ready')
})
.catch(e=>console.log(e))

app.use("/api-docs", swagger.serve, swagger.setup(swaggerDocument));

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`)
});