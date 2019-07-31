import config from '../config.json';
import { Query_Type, SQLquery } from '../objects/sqlquery';

class ReimbursementType {
    /** populateTypes function
     *  Called when program starts. Retrieves all types of reimbursementtype from database
     *  and populates class as a static property in order to be retrieved in all other instances
     *  @returns void
     */
    public static  populateTypes(): Promise<boolean> {
        // Select current reimbursement types from database
        return new Promise ((resolve, reject) => {
            const sqlRetrieveQuery = new SQLquery('reimbursementtype', ['typeid', 'type']);
            sqlRetrieveQuery.setQuery(Query_Type.Select);
            sqlRetrieveQuery.sendQuery().then((sqlQueryResult: any) => {
                // Loop through results and put them in an array
                for (const obj of sqlQueryResult.rows) {
                this.typesofReimbursement[parseInt(obj.typeid, 10)] = obj.type;
                }
                resolve(true);
            }).catch((error: any) => {
                // tslint:disable-next-line: no-console
                console.error(config.errormsg.initialDatabaseConnectError);
                reject(false);
            });
        });
    }
    /** getIdFromType function
     * Used to get back the typeid when given a type in the form of a string.
     * Used to translate user input to id syntax.
     *  @params type: string - Type of reimbursement
     *  @returns number
     */
    public static getIdFromType(type: string): number {
        const retrievedId = ReimbursementType.typesofReimbursement.indexOf(type);
        // If there is no index, the value will be -1, so it is set to 0 instead so it can evaluated as a falsy value
        if (retrievedId === -1) {
            return 0;
        }
        return retrievedId;
    }
    private static typesofReimbursement = [];
    private typeId: number;
    private type: string;

    constructor(typeid: number) {
        this.typeId = typeid;
        this.type = ReimbursementType.typesofReimbursement[typeid];
    }
    /** getType function
     *  DIsplays the reimbursement type string of the current instance
     *  @returns string
     */
    public getType(): string {
        return this.type;
    }

    /** getTypeId function
     *  DIsplays the reimbursement type id of the current instance
     *  @returns number
     */
    public getTypeId(): number {
        return this.typeId;
    }
}
export {ReimbursementType};
