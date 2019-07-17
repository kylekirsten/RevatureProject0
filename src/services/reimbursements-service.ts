import config from '../config.json';
import {Reimbursement} from '../objects/reimbursement';
import { ReimbursementStatus } from '../objects/reimbursementstatus';
import { ReimbursementType } from '../objects/reimbursementtype';
import {RequestError} from '../objects/requesterror';
import {Query_Type, SQLquery} from '../objects/sqlquery';
/**
 * Creates a new reimbursement in the database given parameters.
 * Utilizes many different checks to see if user provided input is valid
 * @param callback Function to call after completed.
 * @param password UserID as type integer. integer
 * @param params Object passed to database. Required parameters include: amount, type, description
 * @returns void. Works via callback function
 */
export function newReimbursement(callback: any, userID: number, params: any) {
    const columns: string[] = [];
    const values: string[] = [];
    // Corrects reimbursementtype to allow it to take string and numeric values.
    if (params.type) {
        params.type = correctType(params.type);
    }
    // This is an array of parameters that we allow the user to update. This prohibits the user from updating
    // certain fields, such as reimbursementId, which are not supposed to be changed.
    // Non-changable fields in Reimbursement:
    const applicableParams: string[] = ['amount', 'type', 'description'];
    // Seperate the indexes and values into their own arrays from the passed parameter "params"
    for (const column in params) {
        // If the parameter is not part of notPassedParams, proceed.
        if (applicableParams.includes(column)) {
            columns.push(column);
            if (params[column]) {
                values.push(params[column]);
            }
        }
    }
    // The following three if statements are for parameter error checking to ensure user has submitted appropriate
    // values. If they didn't, this code provides constructive 400 Bad Request responses via the RequestError class.
    if (columns.length !== values.length || columns.length < 1) {
        return callback(new RequestError(400, config.errormsg.invalidParameters));
    }
    // Add in userID for author column, after our validation checks are done
    columns.push('author');
    values.push(`${userID}`);
    // Add in status with ID 0, aka status pending
    columns.push('status');
    values.push('1');
    // These are parameters that are absolutely required in table reinbursement (i.e. NOT NULL). Check to see if
    // columns array contains all of those fields with the every function. If one or more of those fields are missing,
    // return an error code of 400 type.
    const checkedParams =  ['author', 'amount', 'type', 'description'];
    const hasCorrectParams = checkedParams.every((element) => {
        return columns.includes(element);
    });
    // Check the statement from above and also to see if any params passed were empty ('') or with the wrong type.
    // If any of the tests passes, return an error.
    if (!hasCorrectParams || values.includes('') || !typeCheckReimbursementParams(params)) {
        return callback(new RequestError(400, config.errormsg.invalidParameters));
    }
    // Add current date into columns and values arrays for insertion into database
    const datesubmit = Date.now();
    columns.push(`datesubmitted`);
    values.push(`${datesubmit}`);
    // Send new SQL_Query to table reimbursements with values and columns respectively from the variables above.
    // Empty string is provided as an argument for condition parameter because conditions don't matter with
    // INSERT queries.
    const insertSQLQuery = new SQLquery('reimbursements', columns, values);
    insertSQLQuery.setQuery(Query_Type.Insert);
    insertSQLQuery.sendQuery().then((sqlInsertResult: any) => {
        // Add reimbursementid to the columns list because we want the user to get this value as well
        columns.push('reimbursementid');
        callback(new Reimbursement(sqlInsertResult.rows[0]));
    }).catch((error) => {
        return callback(new RequestError(500, config.errormsg.databaseError));
    });
}
/**
 * Selects reimbursements from database that match author provided.
 * Utilizes many different checks to see if user provided input is valid
 * @param callback Function to call after completed.
 * @param password UserID as type integer. integer
 * @param params Object passed to database. Required parameters include: amount, type, description
 * @returns void. Works via callback function
 */
export function selectReimbursementByAuthor(callback: any, author: number,
                                            columns: string[] = Reimbursement.getPropsAsColumns(),
                                            datesubmitted: number = 0) {
    // sqlCondition modifies the query based on context provided. Function newReimbusement
    // calls this function with a datesubmitted as well as an author argument. It only wants
    // to return the reimbursement that was just created, thus the datesubmitted is added as a condition
    // For all other uses, date submitted is not needed, as a user calling /reimbursements/author/userid
    // would want all the reimbursements by the specified userID, not just the most recent one.
    const testAuthor = (author) ? true : false;
    const testParams = {author};
    if (!author || !typeCheckReimbursementParams(testParams)) {
        return callback(new RequestError(400, config.errormsg.invalidParameters));
    }
    const sqlCondition: string = (datesubmitted) ? `dateSubmitted = '${datesubmitted}' AND author = '${author}'` :
                                 `author = '${author}'`;
    const selectSQLQuery: SQLquery = new SQLquery('reimbursements', columns);
    selectSQLQuery.setQuery(Query_Type.Select);
    if (datesubmitted) {
        selectSQLQuery.setCondition('WHERE', ['datesubmitted', 'author'], [`${datesubmitted}`, `${author}`], 'AND');
    } else {
        selectSQLQuery.setCondition('WHERE', ['author'], [`${author}`]);
    }
    selectSQLQuery.sendQuery().then((sqlSelectResult: any) => {
        const reimbursementsArray: Reimbursement[] = [];
        for (const rowResult of sqlSelectResult.rows) {
            reimbursementsArray.push(new Reimbursement(rowResult));
        }
    // If one result, return one Reimbursement object (not as array), otherwise return as array of type Reimbursement
        if (reimbursementsArray.length === 1) {
            return callback(reimbursementsArray[0]);
        }
        // If no results, return 404 error.
        if (reimbursementsArray.length === 0) {
            return callback(new RequestError(404, config.errormsg.noReimbursementsFound));
        }
        return callback(reimbursementsArray);
    }).catch((error) => {
        return callback (new RequestError(500, config.errormsg.databaseError));
    });
}
export function selectReimbursementByStatus(callback: any, statusId: any): any {
    const params = {status : statusId};
    // Formats status so it can take string or numerical id values
    if (params.status) {
        statusId = correctStatus(params.status);
        params.status = statusId;
    }
    if (!statusId || !typeCheckReimbursementParams(params)) {
        return callback(new RequestError(400,
                config.errormsg.invalidParameters).sendObject());
    }
    const selectSQLQuery: SQLquery = new SQLquery('reimbursements', Reimbursement.getPropsAsColumns());
    selectSQLQuery.setQuery(Query_Type.Select);
    selectSQLQuery.setCondition('WHERE', ['status'], [`${statusId}`]);
    selectSQLQuery.sendQuery().then((sqlSelectResult: any) => {
        const reimbursementsArray: Reimbursement[] = [];
        for (const rowResult of sqlSelectResult.rows) {
            reimbursementsArray.push(new Reimbursement(rowResult));
        }
        // If no reimbursements in array, return 404 error
        if (reimbursementsArray.length === 0) {
            return callback(new RequestError(404, config.errormsg.noReimbursementsFound));
        }
        return callback(reimbursementsArray);
    }).catch((error) => {
        return callback(new RequestError(500, config.errormsg.databaseError));
    });
}
export function updateReimbursement(callback: any, userId: number, params: any) {
    // These two code blocks enable users to pass type and status as string values or numerical id values
    if (params.status) {
        params.status = correctStatus(params.status);
    }
    if (params.type) {
        params.type = correctType(params.type);
    }
    const columns: string[] = [];
    const values: string[] = [];
    // This is an array of parameters that we allow the user to update.
    // This prohibits the user from updating certain fields, such as
    // reimbursementId, which are not supposed to be changed.
    // Non-changable fields in Reimbursement:
    const applicableParams: string[] = ['amount', 'status', 'type', 'description'];
    // Seperate the indexes and values into their own arrays from the passed parameter "params"
    for (const column in params) {
        // If the parameter is not part of notPassedParams, proceed.
        if (applicableParams.includes(column)) {
            columns.push(column);
            if (params[column]) {
                values.push(params[column]);
            }
        }
    }
    /** The following three if statements are for parameter error checking to ensure user has submitted
     * appropriate values. If they didn't, this code provides constructive 400 Bad Request responses
     * via the RequestError class.
     */

    if (!typeCheckReimbursementParams(params) || columns.length < 1 || columns.length !== values.length) {
        return callback(new RequestError(400, config.errormsg.invalidParameters));
    }
    /** Following code block is used to check if the reimbursement being updated is owned by the requestor.
     *  A user should not be able to update their own reimbursements.
     */
    let isOwnReimbursement: boolean = false;
    selectReimbursementById(params.reimbursementId).then((result) => {
        if (result instanceof RequestError) {
            isOwnReimbursement = true;
            return callback(result);
        } else {
            const singleResult: Reimbursement = result as Reimbursement;
            if (singleResult.getAuthor() === userId) {
                isOwnReimbursement = true;
            }
        }
    }).catch((error) => {
        return callback(new RequestError(500, config.errormsg.databaseError));
    }).then(() => {
        if (isOwnReimbursement) { return callback(new RequestError(400, config.errormsg.isOwnReimbursement)); }
        // Add current date into columns,values arrays to set as resolvedate.
        // Also add resolver as the current userId passed to function
        columns.push(`dateresolved`);
        values.push(`${Date.now()}`);
        columns.push(`resolver`);
        values.push(`${userId}`);
        // Setup update query in order to update row with specified reimbursementId with values
        // and columns specified from earlier.
        const sqlUpdateQuery: SQLquery = new SQLquery('reimbursements', columns, values);
        sqlUpdateQuery.setQuery(Query_Type.Update);
        sqlUpdateQuery.setCondition('WHERE', ['reimbursementid'], [params.reimbursementId]);
        sqlUpdateQuery.sendQuery().then((sqlUpdateResult) => {
            return callback(new Reimbursement(sqlUpdateResult.rows[0]));
        }).catch((error) => {
            return callback(new RequestError(500, config.errormsg.databaseError));
        });
    });
}
function selectReimbursementById(reimbursementId: number) {
    return new Promise((resolve, reject) => {
        const selectSQLQuery: SQLquery = new SQLquery('reimbursements', Reimbursement.getPropsAsColumns());
        selectSQLQuery.setQuery(Query_Type.Select);
        selectSQLQuery.setCondition('WHERE', ['reimbursementid'], [`${reimbursementId}`]);
        selectSQLQuery.sendQuery().then((sqlSelectResult: any) => {
            resolve(new Reimbursement(sqlSelectResult.rows[0]));
        }).catch((error) => {
            return reject(new RequestError(500, config.errormsg.databaseError));
        });
    });
}
function typeCheckReimbursementParams(params): boolean {
    // Type checking for passed parameters. Calls error if:
    // - ReimbursementId is not a number
    // - amount is not a number
    // - author is not a number
    // - description is not a string
    // - type is not an existing type in the database
    // - status is not an existing status in the database
    try {
        if (params.hasOwnProperty('amount')) {
            if (isNaN(params.amount)) { throw Error; }
        }
        if (params.hasOwnProperty('reimbursementId')) {
            if (isNaN(params.reimbursementId)) { throw Error; }
        }
        if (params.hasOwnProperty('author')) {
            if (isNaN(params.author)) { throw Error; }
        }
        if (params.hasOwnProperty('description')) {
            if (typeof params.description !== 'string') {
                throw Error;
            }
        }
        if (params.hasOwnProperty('type')) {
            const testType = new ReimbursementType(parseInt(params.type, 10));
            if (!testType.getType()) {
                throw Error;
            }
        }
        if (params.hasOwnProperty('status')) {
            const testStatus = new ReimbursementStatus(parseInt(params.status, 10));
            if (!testStatus.getStatus()) {
                throw Error;
            }
        }
        return true;
    } catch (error) {
        return false;
    }
}
/** function correctStatus
 *  Checks if user put Reimbursementstatus is as type string or type number and attempts to convert if type string.
 *  If it cannot convert or it is not a valid type, returns undefined.
 *  Used to ensure consistancy across database entries.
 *  @param status type any
 *  @returns number
 */
function correctStatus(status: any): number {
    if (isNaN(status)) {
        status = status as string;
        status = ReimbursementStatus.getIdFromType(status.toUpperCase());
        if (!status) {
            status = undefined;
        }
    }
    return status;
}
/** function correctType
 *  Checks if user put Reimbursementtype is as type string or type number and attempts to convert if type string.
 *  If it cannot convert or it is not a valid type, returns undefined.
 *  Used to ensure consistancy across database entries.
 *  @param type type any
 *  @returns number
 */
function correctType(type: any): number {

    if (isNaN(type)) {
        type = type as string;
        type = ReimbursementType.getIdFromType(type.toUpperCase());
        if (!type) {
            type = undefined;
        }
    }
    return type;
}
