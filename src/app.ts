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
app.use(bodyParser.json());
Promise.all([ReimbursementStatus.populateTypes()
            ,ReimbursementType.populateTypes(),Role.populateTypes()])
    .then(result => {
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
    }).catch( () => {
        //If initial database connection didn't work, the rest of the program won't work so just
        //display an error for every request for user friendliness.
        app.use('/*',cors(), (req: Request, res: Response) => {
            res.status(500).send(config.errormsg.databaseError);
        });
    });

const PORT = parseInt(config.ServerVariable.serverPort, 10);
    // Start the server listening at specified port.
app.listen(PORT, () => {
    console.info(config.infomsg.serverStartMessage);
    console.info(`Access via port ${PORT}`);
});
