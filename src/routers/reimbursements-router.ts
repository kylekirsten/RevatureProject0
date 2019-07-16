import express from 'express';
import config from '../config.json';

import { RequestError } from '../objects/requesterror';
import {RequestType, Role} from '../objects/role';
import * as reimbursementService from '../services/reimbursements-service';
const reimbursementRouter = express.Router();
// Router to handle GET request at /reimbursements/status/:statusId
reimbursementRouter.get('/status/:statusId', (req: any, res: any) => {
    const userRole = new Role(parseInt(req.token.role.roleId, 10));
    if (!userRole.canPerform(req.baseUrl + req.route.path, RequestType.GET)) {
        res.status(401).send({message: config.errormsg.notAuthorized});
    } else {
        reimbursementService.selectReimbursementByStatus((result: any) => {
            if (result instanceof RequestError) {
                res.status(result.getHttpType()).send(result.getMessage());
            } else {
                res.status(200).send(result);
            }
        }, req.params.statusId);
    }
});
// Router to handle GET request at /reimbursements/author/userid/:userid
reimbursementRouter.get('/author/userId/:userId', (req: any, res: any) => {
    const userRole = new Role(parseInt(req.token.role.roleId, 10));
    if (!userRole.canPerform(req.baseUrl + req.route.path, RequestType.GET,
                            parseInt(req.token.userId, 10), parseInt(req.params.userId, 10))) {
        res.status(401).send({message: config.errormsg.notAuthorized});
    } else {
        reimbursementService.selectReimbursementByAuthor((result: any) => {
            if (result instanceof RequestError) {
                res.status(result.getHttpType()).send(result.getMessage());
            } else {
                res.status(200).send(result);
            }
        }, req.params.userId);
    }
});
// Router to handle POST request at /reimbursements
reimbursementRouter.post('/', (req: any, res: any) => {
    const userRole = new Role(parseInt(req.token.role.roleId, 10));
    if (!userRole.canPerform(req.baseUrl + req.route.path, RequestType.POST)) {
        res.status(401).send({message: config.errormsg.notAuthorized});
    } else {
        // Required fields to send to service: (token.userid), amount : number, description : string, type: number
        reimbursementService.newReimbursement((result: any) => {
        // If result object has property httpcode, send appropriate error response.
        // Httpcode property is not present in a successful result.
            if (result instanceof RequestError) {
                res.status(result.getHttpType()).send(result.getMessage());
            } else {
                // Send 201 CREATED with successful result in format of class reimbursement
                res.status(201).send(result);
            }
        }, req.token.userId, req.query);
    }
});
// Router to handle PATCH request at /reimbursements
reimbursementRouter.patch('/', (req: any, res: any) => {
    // Check to see if user can access resource. If they can call updateReimbursement()
    const userRole = new Role(parseInt(req.token.role.roleId, 10));
    if (!userRole.canPerform(req.baseUrl, RequestType.PATCH)) {
        res.status(401).send({message: config.errormsg.notAuthorized});
    } else {
        reimbursementService.updateReimbursement((result: any) => {
            if (result instanceof RequestError) {
                res.status(result.getHttpType()).send(result.getMessage());
            } else {
                res.status(200).send(result);
            }
        }, req.token.userId, req.query);
    }
});
export default reimbursementRouter;
