import express, {Request, Response} from 'express';
import config from '../config.json';
import {RequestError } from '../objects/requesterror';
import {RequestType, Role} from '../objects/role';
import {User} from '../objects/user';
import * as usersService from '../services/users-service';
const usersRouter = express.Router();
// Router that handles only /users, with no id argument at end
// req must be type any because token key-pair is passed through it
usersRouter.get('/', (req: any, res: Response, next) => {
    const userRole = new Role(parseInt(req.token.role.roleId, 10));
    // Check if user can perform action and send base url (/users) for check
    if (!userRole.canPerform(req.baseUrl, RequestType.GET)) {
        res.status(401).send({message: config.errormsg.notAuthorized});
    } else {
        usersService.listUsers((userListResult: User | RequestError) => {
            // Checks if type RequestError is sent, otherwise sends result
            if (userListResult instanceof RequestError) {
                res.status(userListResult.getHttpType()).send(userListResult.getMessage());
            } else {
                res.status(200).send(userListResult);
            }
        });
    }
});
// Router that handles /users/[id]. I.e. user checking via ID.
usersRouter.get('/:id', (req: any, res: any, next) => {
    const userRole = new Role(parseInt(req.token.role.roleId, 10));
    // Check if user can perform action, supplying base url (/users) and path (i.e. if parameters are provided)
    if (!userRole.canPerform(req.baseUrl + req.route.path, RequestType.GET,
        parseInt(req.token.userId, 10), parseInt(req.params.id, 10))) {
        res.status(401).send({message: config.errormsg.notAuthorized});
    } else {
        usersService.listUsers((userListResult: User[] | RequestError) => {
            // Checks if type RequestError is sent, otherwise sends result
            if (userListResult instanceof RequestError) {
                res.status(userListResult.getHttpType()).send(userListResult.getMessage());
            } else {
                res.status(200).send(userListResult);
            }
        }, req.params.id);
    }
});
// Router that handles PATCH on /users
usersRouter.patch('/', (req: any, res: any, next) => {
    const userRole = new Role(parseInt(req.token.role.roleId, 10));
    const {userid, ...paramsWithoutId} = req.query;
    // Check if user can perform action, supplying base url (/users) and path (i.e. if parameters are provided)
    if (!userRole.canPerform(req.baseUrl, RequestType.PATCH)) {
        res.status(401).send({message: config.errormsg.notAuthorized});
    } else {
        usersService.updateUser((result: User | RequestError) => {
            if (result instanceof RequestError) {
                res.status(result.getHttpType()).send(result.getMessage());
            } else {
                res.status(200).send(result);
            }
        }, req.query.userid, paramsWithoutId);
    }
});
export default usersRouter;
