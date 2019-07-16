import jwt from 'jsonwebtoken';
import config from '../config.json';
/** verify function checks to make sure a token is valid
 *  function is used in this program to check user inputted tokens and see if they're valid.
 *  This function acts as middleware for express' function app.use
 *  @params res, req, next : any - Variables passed from express app.use.
 *  @returns void
 */
export default function verify(res: any, req: any, next: any): void {
    // Documentation says express returns these headers for token verification
    const token = req.req.headers['x-access-token'] || req.req.headers.authorization;
    // If no token is supplied from express, return message to client specifying they need to return headers
    if (!token) {return res.res.status(401).json({message: config.errormsg.noTokenSupplied}); }
    jwt.verify(token, config.auth.secretKey, (err: any, verifiedToken: object) => {
        // If error is present, the token is invalid. Return this message to user
        if (err) { return res.res.status(401).json({message: config.errormsg.invalidToken}); }
        req.req.token = verifiedToken;
        next();
    });
}
