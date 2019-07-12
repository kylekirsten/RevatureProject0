//Import statements
import express from 'express';
import {Role,RequestType} from '../objects/role';
<<<<<<< HEAD
import * as reimbursementService from '../services/reimbursements-service';
import { RequestError } from 'objects/requesterror';
import { Reimbursement } from 'objects/reimbursement';
=======
import * as reinbursementService from '../services/reimbursements-service';
import { RequestError } from 'objects/requesterror';
>>>>>>> db2a426... Initial project
const reimbursementRouter = express.Router();
//Router to handle GET request at /reimbursements/status/:statusId
reimbursementRouter.get('/status/:statusId', (req : any, res : any) => {
    const userRole = new Role(parseInt(req.token.role.roleid));
<<<<<<< HEAD
    if(!userRole.canPerform(req.baseUrl + req.route.path,RequestType.GET)) {
        res.status(401).send({message: "You are not authorized for this operation"});
    }else{
        reimbursementService.selectReimbursementByStatus((result : any)=>{
            if('httptype' in result){
                res.status(result.httptype).send(result.message);
            }else{
                res.status(200).send(result);
            }
        },req.params.statusId);
    }
});
//Router to handle GET request at /reimbursements/author/userid/:userid
reimbursementRouter.get('/author/userId/:userId', (req : any, res : any) => {
    const userRole = new Role(parseInt(req.token.role.roleid));
    console.log(req.params.userId);
    if(!userRole.canPerform(req.baseUrl + req.route.path,RequestType.GET, parseInt(req.token.userId), parseInt(req.params.userId))) {
        res.status(401).send({message: "You are not authorized for this operation"});
    }else{
        reimbursementService.selectReimbursementByAuthor((result : any)=>{
            if('httptype' in result){
                res.status(result.httptype).send(result.message);
            }else{
                res.status(200).send(result);
            }
        },req.params.userId);
    }
=======
    console.log(req.baseUrl + req.route.path);
    if(!userRole.canPerform(req.baseUrl + req.route.path,RequestType.GET)) {
        res.status(401).send({message: "You are not authorized for this operation"});
    }else{
        res.status(200).send({message: "great!"});
    }
});
//Router to handle GET request at /reimbursements/author/userid/:userid
reimbursementRouter.get('/author/userid/:userId', (req : any, res : any) => {
    console.log("accepted get at /author/userid/:userId");
>>>>>>> db2a426... Initial project
});
//Router to handle POST request at /reimbursements
reimbursementRouter.post('/', (req : any, res : any) => {
    const userRole = new Role(parseInt(req.token.role.roleid));
<<<<<<< HEAD
    console.log(req.token);
=======
>>>>>>> db2a426... Initial project
    if(!userRole.canPerform(req.baseUrl + req.route.path,RequestType.POST)) {
        res.status(401).send({message: "You are not authorized for this operation"});
    }else{
        //Required fields to send to service: (token.userid), amount : number, description : string, type: number
<<<<<<< HEAD
        reimbursementService.newReimbursement((result : any) => {
            //If result object has property httpcode, send appropriate error response. Httpcode property is not present in a successful result.
            if('httptype' in result){
                res.status(result.httptype).send(result.message);
            }else{
                //Send 201 CREATED with successful result in format of class reimbursement
                res.status(201).send(result);
            }
        },req.token.userId,req.query);
    }
});
//Router to handle PATCH request at /reimbursements
reimbursementRouter.patch('/', (req : any, res : any) => {
    const userRole = new Role(parseInt(req.token.role.roleid));
    if(!userRole.canPerform(req.baseUrl,RequestType.PATCH)) {
        res.status(401).send({message: "You are not authorized for this operation"});
    }else{
        reimbursementService.updateReimbursement((result : any)=>{
            if('httptype' in result){
                res.status(result.httptype).send(result.message);
            }else{
                res.status(200).send(result);
            }
        },req.token.userId,req.query);
    }
=======
        console.log(req.query);
        reinbursementService.newReimbursement((result : any) => {
            //If result object has property httpcode, send appropriate error response. Httpcode property is not present in a successful result.
            if('httptype' in result){
                console.log(result.message);
                res.status(result.httptype).send(result.message);
            }else{
                console.log(result);
                //Send 201 CREATED with successful result in format of class reimbursement
                res.status(201).send(result);
            }
        },req.token.userid,req.query);
    }
});
//Router to handle PATCH request at /reimbursements
reimbursementRouter.patch('/', (req : Request, res : any) => {

>>>>>>> db2a426... Initial project
});
export default reimbursementRouter;
