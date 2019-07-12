import jwt from 'jsonwebtoken';
import config from '../config.json';
enum AuthError {
    invalidToken = 'Authentication Unsuccessful. Invalid token supplied.',
    noTokenSupplied = 'Authentication Unsuccessful. No token supplied.',
}
<<<<<<< HEAD
// Verify token function. Checks returned headers as a middleware function to see if a token was supplied.
// TODO: Figure out why req.req and res.res have to be used.
const verify = (res: any, req: any, next: any) => {
    // Documentation says express returns these headers for token verification
    const token = req.req.headers['x-access-token'] || req.req.headers.authorization;
    // If no token is supplied from express, return message to client specifying they need to return headers
    if (!token) {return res.res.json({success: false, message: AuthError.noTokenSupplied}); }
    jwt.verify(token, config.auth.secretKey, (err: any, verifiedToken: object) => {
        // If error is present, the token is invalid. Return this message to user
        if (err) { return res.res.json({success: false, message: AuthError.invalidToken}); }
=======
//Verify token function. Checks returned headers as a middleware function to see if a token was supplied.
//TODO: Figure out why req.req and res.res have to be used.
let verify = (res : any, req : any, next : any) =>{
    //Documentation says express returns these headers for token verification
    let token = req.req.headers['x-access-token'] || req.req.headers['authorization']; 
    //If no token is supplied from express, return message to client specifying they need to return headers
    if(!token) return res.res.json({success: false, message: AuthError.noTokenSupplied});
    jwt.verify(token,config.auth.secretKey, (err : any, verifiedToken : object) => {
        //If error is present, the token is invalid. Return this message to user
        if(err) return res.res.json({success: false, message: AuthError.invalidToken});
>>>>>>> db2a426... Initial project
        req.req.token = verifiedToken;
        next();
    });

<<<<<<< HEAD
};
export default {verify};
=======
}
export default {verify};
>>>>>>> db2a426... Initial project
