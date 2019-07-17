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
// Populate roles and reimbursement types from database
Role.populateTypes();
ReimbursementType.populateTypes();
ReimbursementStatus.populateTypes();
app.use(bodyParser.json());
// User router with authentication check
app.use('/users', checktoken, usersRouter);
// Reimbursement router with authentication check
app.use('/reimbursements', checktoken, reimbursementRouter);
// Login router
app.use('/login', loginRouter);
// Handle invalid route requests and return 404 error
app.get('/*', (req, res) => {
    res.status(404).send({message: 'Resource not found'});
});
// Start the server listening at port 3000.
const PORT = 3000; // port of API server. Change to 3000 for production.
app.listen(PORT, () => {
    console.info(config.infomsg.serverStartMessage);
    console.info(`Access via port ${PORT}`);
});
