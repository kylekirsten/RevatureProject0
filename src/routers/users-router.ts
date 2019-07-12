import express, {Request, Response} from 'express';
import checktoken from '../auth/checktoken';
import {Role,RequestType} from '../objects/role';
import {User} from '../objects/user';
import * as usersService from '../services/users-service';
const usersRouter = express.Router();
//Router that handles only /users, with no id argument at end
//req must be type any because token key-pair is passed through it
usersRouter.get('/', (req : any, res : Response, next) => {
    const userRole = new Role(parseInt(req.token.role.roleid));
    //Check if user can perform action and send base url (/users) for check
    if(!userRole.canPerform(req.baseUrl,RequestType.GET)) {
        res.status(401).send({message: "You are not authorized for this operation"});
    }else{
        usersService.listUsers(function(userListResult : User | string){
            res.status(200).send({message: userListResult});
        });
    }
});
//Router that handles /users/[id]. I.e. user checking via ID.
usersRouter.get('/:id', (req : any, res : any, next) => {
    //TODO: Add check for role finance-manager
    const userRole = new Role(parseInt(req.token.role.roleid));
    
    //Check if user can perform action, supplying base url (/users) and path (i.e. if parameters are provided)
<<<<<<< HEAD
    if(!userRole.canPerform(req.baseUrl + req.route.path, RequestType.GET, parseInt(req.token.userId), parseInt(req.params.id))) {
=======
    if(!userRole.canPerform(req.baseUrl + req.route.path, RequestType.GET)) {
>>>>>>> db2a426... Initial project
        res.status(401).send({message: "You are not authorized for this operation"});
    }else{
        usersService.listUsers(function(userListResult : Array<User> | string){
            res.status(200).send({message: userListResult});
        },req.params.id);
    }
});
//Router that handles PATCH on /users
usersRouter.patch('/', (req : any, res : any, next) => {
    const userRole = new Role(parseInt(req.token.role.roleid));
    let {userid, ...paramsWithoutId} = req.query;
    console.log(`Parameters: ${paramsWithoutId}`);
    console.log(`Full Parameters: ${req.query}`);
    if(!req.query.userid){
        res.status(400).send({message: "UserID parameter not provided."})
    }
    else if(paramsWithoutId === {}){
        res.status(400).send({message: "No parameters were provided"})
    }
    //Check if user can perform action, supplying base url (/users) and path (i.e. if parameters are provided)
    else if(!userRole.canPerform(req.baseUrl,RequestType.PATCH)) {
        res.status(401).send({message: "You are not authorized for this operation"});
    }else{
        usersService.updateUser(function(result : string | object){
            res.status(200).send({message: result});
        },req.query.userid,paramsWithoutId);
    }
});
export default usersRouter;