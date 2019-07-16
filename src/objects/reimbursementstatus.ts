import config from '../config.json';
import { Query_Type, SQLquery } from '../objects/sqlquery';
class ReimbursementStatus {
    /** populateTypes function
     *  Called when program starts. Retrieves all types of reimbursementstatus from database
     *  and populates class as a static property in order to be retrieved in all other instances
     *  @returns void
     */
    public static populateTypes(): void {
        // Select current reimbursement types from database
        const sqlRetrieveQuery = new SQLquery('reimbursementstatus', ['status', 'statusid']);
        sqlRetrieveQuery.setQuery(Query_Type.Select);
        sqlRetrieveQuery.sendQuery().then((sqlQueryResult: any) => {
            // Loop through results and put them in an array
                for (const obj of sqlQueryResult.rows) {
                this.statusesofReimbursement[parseInt(obj.statusid, 10)] = obj.status;
            }
            }).catch((error: any) => {
                // tslint:disable-next-line: no-console
                console.error(config.errormsg.initialDatabaseConnectError);
            });
    }
    /** getIdFromType function
     * Used to get back the statusid when given a status in the form of a string.
     * Used to translate user input to id syntax.
     *  @params type: string - Type of reimbursementstatus
     *  @returns number
     */
    public static getIdFromType(type: string): number {
        const retrievedId = ReimbursementStatus.statusesofReimbursement.indexOf(type);
        // If there is no index, the value will be -1, so it is set to 0 instead so it can evaluated as a falsy value
        if (retrievedId === -1) {
            return 0;
        }
        return retrievedId;
    }
    private static statusesofReimbursement = [];
    private statusId: number;
    private status: string;
    constructor(statusid: number) {
        this.statusId = statusid;
        this.status = ReimbursementStatus.statusesofReimbursement[statusid];
    }

    /** getStatus function
     *  DIsplays the status type of the current instance
     *  @returns string
     */
    public getStatus(): string {
        return this.status;
    }

    /** getStatusId function
     *  Displays the status id of the current instance
     *  @returns number
     */
    public getStatusId(): number {
        return this.statusId;
    }
}
export {ReimbursementStatus};
