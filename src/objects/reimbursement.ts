<<<<<<< HEAD
import {ReimbursementType} from '../objects/reimbursementtype';
import { ReimbursementStatus } from './reimbursementstatus';
class Reimbursement {

    public static getPropsAsColumns(): any[] {
        return ['reimbursementid', 'amount', 'author', 'datesubmitted',
        'dateresolved', 'description', 'resolver', 'status', 'type'];
    }
    private reimbursementId: number;
    private amount: number;
    private author: number;
    private dateSubmitted: number;
    private dateResolved: number;
    private description: string;
    private resolver: number;
    private status: ReimbursementStatus;
    private type: ReimbursementType;

    constructor(reimbursementId: number, author: number, amount: number,
                datesubmitted: number, dateresolved: number,
                description: string, resolver: number, status: number, type: number) {
            this.reimbursementId = reimbursementId;
            this.author = author;
            this.amount = amount;
            this.dateSubmitted = datesubmitted;
            if (dateresolved) {
                this.dateResolved = dateresolved;
            } else {
                this.dateResolved = null;
            }
            this.description = description;
            if (resolver) {
                this.resolver = resolver;
            } else {
                this.resolver = null;
            }
=======
import {ReimbursementType}  from '../objects/reimbursementtype';
import { ReimbursementStatus } from './reimbursementstatus';
class Reimbursement {
    reimbursementId : number;
    amount : number;
    author : number;
    dateSubmitted : number;
    dateResolved : number;
    description : string;
    resolver : number;
    status : ReimbursementStatus;
    type : ReimbursementType;

    constructor(reimbursementId : number, amount : number, author : number, datesubmitted : number,
        description : string, resolver : number, status : number, type : number){
            this.reimbursementId = reimbursementId;
            this.amount = amount;
            this.author = author;
            this.dateSubmitted = datesubmitted;
            this.description = description;
            this.resolver = resolver;
>>>>>>> db2a426... Initial project
            this.status = new ReimbursementStatus(status);
            this.type = new ReimbursementType(type);
        }
};
<<<<<<< HEAD
export {Reimbursement};
=======
export {Reimbursement};
>>>>>>> db2a426... Initial project
