// Imports and express variable declaration
import express, {Request, Response} from 'express';
import jwt from 'jsonwebtoken';
import config from '../config.json';
import { RequestError } from '../objects/requesterror';
import * as loginService from '../services/login-service';
const loginRouter = express.Router();
// Handles POST request at /login. Handles user login and session generation.
loginRouter.post('/', (req: Request, res: Response) => {
    loginService.checkUser(req.query.username, req.query.password, (result: any) => {
        if (result instanceof RequestError) {
            // if the username or password was incorrect or the database had an error, this block of code is run
            res.status(result.getHttpType());
            res.json({
                message: result.getMessage(), // return invalid credentials
            });
        } else {
            // Create JWT token with object containing userId and role
            const token = jwt.sign({userId: result.userId, role: result.role},
                config.auth.secretKey,
                { expiresIn: config.auth.tokenExpiration,
                },
              );
            res.status(200).json({
                message : result,
                token,
            }); // message sent back to the requestor

        }
    });
});
export default loginRouter;
