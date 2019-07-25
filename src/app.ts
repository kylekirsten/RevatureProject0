import bodyParser from 'body-parser';
import express, {Request, Response} from 'express';
import checktoken from './auth/checktoken';
import config from './config.json';
import {ReimbursementStatus} from './objects/reimbursementstatus';
import {ReimbursementType} from './objects/reimbursementtype';
import { Role } from './objects/role';
import loginRouter from './routers/login-router';
import reimbursementRouter from './routers/reimbursements-router';
import usersRouter from './routers/users-router';

const app = express();
// Use body parser
app.use(bodyParser.urlencoded({
   extended: true,
}));
// Add cors middleware
var cors = require('cors');
app.options('*', cors()) // include before other routes
// Populate roles and reimbursement types from database
Role.populateTypes();
ReimbursementType.populateTypes();
ReimbursementStatus.populateTypes();
app.use(bodyParser.json());
// User router with authentication check
app.use('/users',cors(), checktoken, usersRouter);
// Reimbursement router with authentication check
app.use('/reimbursements',cors(), checktoken, reimbursementRouter);
// Login router
app.use('/login', cors(), loginRouter);
// Handle invalid route requests and return 404 error
app.use('/*', (req, res) => {
    res.status(404).send({message: 'Resource not found'});
});
const PORT = parseInt(config.ServerVariable.serverPort, 10);
// Start the server listening at port 3000.
app.listen(PORT, () => {
    console.info(config.infomsg.serverStartMessage);
    console.info(`Access via port ${PORT}`);
});
