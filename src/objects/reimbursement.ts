import {ReimbursementType} from '../objects/reimbursementtype';
import { ReimbursementStatus } from './reimbursementstatus';
class Reimbursement {
    /** getPropsAsColumns function
     *  Gets properties of Reimbursement object and returns them as a string array
     *  @returns string[]
     */
    public static getPropsAsColumns(): string[] {
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

    constructor(obj) {
            this.reimbursementId = obj.reimbursementid;
            this.author = obj.author;
            this.amount = obj.amount;
            this.dateSubmitted = obj.datesubmitted;
            if (obj.dateresolved) {
                this.dateResolved = obj.dateresolved;
            } else {
                this.dateResolved = null;
            }
            this.description = obj.description;
            if (obj.resolver) {
                this.resolver = obj.resolver;
            } else {
                this.resolver = null;
            }
            this.status = new ReimbursementStatus(obj.status);
            this.type = new ReimbursementType(obj.type);
    }
    /** getAuthor function
     *  Gets author of current Reimbursement object
     *  @returns number
     */
    public getAuthor(): number {
        return this.author;
    }
    /** getId function
     *  Gets ReimbursementId of current Reimbursement object
     *  @returns number
     */
    public getId(): number {
        return this.reimbursementId;
    }
}
export {Reimbursement};
