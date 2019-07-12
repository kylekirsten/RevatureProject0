<<<<<<< HEAD
// Imports and express variable declaration
import express, {Request, Response} from 'express';
import jwt from 'jsonwebtoken';
import config from '../config.json';
// change to service, not controller
import * as loginService from '../services/login-service';
const loginRouter = express.Router();

loginRouter.post('/', (req: Request, res: Response) => {
    loginService.checkUser(req.query.username,req.query.password, (result: any) => {
    // In this scenario, the User Class Object is returned, then return the User object
        if (typeof result === 'object') {
            // console.log(`Logged in user ${result.username}`);
            const token = jwt.sign({userId: result.userId, role: result.role},
                config.auth.secretKey,
                { expiresIn: '24hr', // expires in 24 hours
                },
              );
            res.status(200).json({
                message : result,
                success : true,
                token : {token},
            }); // message sent back to the requestor

        } else {
            // if the username or password was incorrect or the database had an error, this block of code is run
            // console.warn(`Denied login access for user ${req.query.username} because of: ${result}`);
            res.status(400);
            res.json({
                message: result, // return invalid credentials
            });
        }
    });
});
export default loginRouter;
=======
//Imports and express variable declaration
import express, {Request, Response} from 'express';
import {User} from '../objects/user';
import {SQL_Query,Query_Type} from '../objects/sqlquery';
import config from '../config.json';
import jwt from 'jsonwebtoken';
//change to service, not controller
import * as loginService from '../services/login-service'
const loginRouter = express.Router();

loginRouter.post('/', (req : Request, res : any) => {
    loginService.checkUser(req.query.username,req.query.password, function(result : any){
    //In this scenario, the User Class Object is returned, then return the User object
        if(typeof result === 'object'){
            console.log(`Logged in user ${result.username}`);
            //Userid is not being passed here??
            let token = jwt.sign({userid: result.userid, role: result.role},
                config.auth.secretKey,
                { expiresIn: '24hr' // expires in 24 hours
                }
              );
            res.status(200).json({
                success : true,
                message : result,
                token : token
            }); //message sent back to the requestor
        }else{
            //if the username or password was incorrect or the database had an error, this block of code is run
            console.log(`Denied login access for user ${req.query.username} because of: ${result}`);
            res.status(400);
            res.json({
                message: result //return invalid credentials
            })
        }
    })
});
export default loginRouter;
>>>>>>> db2a426... Initial project
