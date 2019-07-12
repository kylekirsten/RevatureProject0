<<<<<<< HEAD
import {SQLquery, Query_Type} from '../objects/sqlquery';
import {Reimbursement} from '../objects/reimbursement';
import {RequestError} from '../objects/requesterror';
import { ReimbursementType } from '../objects/reimbursementtype';
import { ReimbursementStatus } from '../objects/reimbursementstatus';
export function newReimbursement(callback : Function, userID : number, params : object) : Function {
=======
import {SQL_Query, Query_Type} from '../objects/sqlquery';
import {Reimbursement} from '../objects/reimbursement';
import {RequestError} from '../objects/requesterror';
export function newReimbursement(callback : Function, userID : number, params : object){
>>>>>>> db2a426... Initial project
    let columns : Array<string> = []; 
    let values : Array<string> = [];
    for(let column in params){
        columns.push(column);
<<<<<<< HEAD
        if(params[column]){
            values.push(params[column]);
        }   
    //The following three if statements are for parameter error checking to ensure user has submitted appropriate values. If they
    //didn't, this code provides constructive 400 Bad Request responses via the RequestError class.
    }
=======
        values.push(params[column]);
    }
    console.log(`${columns} ${values}`);
    console.log(`${columns.length} ${values.length}`);
>>>>>>> db2a426... Initial project
    if(columns.length !== values.length){
        return callback(new RequestError(400,"Incorrect parameters supplied. Please modify request.").sendObject());
    }
    if(columns.length < 1){
        return callback(new RequestError(400,"No parameters supplied. Please modify request.").sendObject());
    }
    //Add in userID for author column, after our validation checks are done
    columns.push('author');
    values.push(`${userID}`);
<<<<<<< HEAD
    //These are parameters that are absolutely required in table reinbursement (i.e. NOT NULL). Check to see if columns array
    //contains all of those fields with the every function. If one or more of those fields are missing, return an error code of 400 type.
    const checkedParams =  ["author","amount","status","type","description"];
    const hasCorrectParams = checkedParams.every((element)=>{
        return columns.includes(element);
    });
    //Check the statement from above and also to see if any params passed were empty ('') or with the wrong type.
    // If any of the tests passes, return an error.
    if(!hasCorrectParams || values.includes('') || !typeCheckReimbursementParams(params)){
        return callback(new RequestError(400,"Incorrect parameters supplied. One or more parameters not in correct format.").sendObject());
    }
    //Add current date into columns and values arrays for insertion into database
    let datesubmit = Date.now();
    columns.push(`datesubmitted`);
    values.push(`${datesubmit}`);
    //Send new SQL_Query to table reimbursements with values and columns respectively from the variables above. 
    //Empty string is provided as an argument for condition parameter because conditions don't matter with INSERT queries.
    let insertSQLQuery = new SQLquery('reimbursements',columns,'',values);
    insertSQLQuery.setQuery(Query_Type.Insert);
    console.log(insertSQLQuery.getQuery());
    insertSQLQuery.sendQuery().then((sqlInsertResult : any)=>{
        //Add reimbursementid to the columns list because we want the user to get this value as well
        columns.push('reimbursementid');
        selectReimbursementByAuthor((result)=>{
            callback(result);
        },userID,columns,datesubmit);
    }).catch((error)=>{
        return callback(new RequestError(500,`Error retrieving information from database: ${error}`).sendObject());
    });
};
export function selectReimbursementByAuthor(callback : Function, author : number, columns : Array<string> = Reimbursement.getPropsAsColumns(),
                                            datesubmitted : number = 0) : Function{
    //sqlCondition modifies the query based on context provided. Function newReimbusement calls this function with a datesubmitted as well
    //as an author argument. It only wants to return the reimbursement that was just created, thus the datesubmitted is added as a condition
    //For all other uses, date submitted is not needed, as a user calling /reimbursements/author/userid would want all the reimbursements
    //by the specified userID, not just the most recent one.
    let testParams = {author: author};
    if(!author || !typeCheckReimbursementParams(testParams)){
        return callback(new RequestError(400,`Incorrect parameters supplied. One or more parameters not in correct format`).sendObject());
    }
    let sqlCondition : string = (datesubmitted) ? `dateSubmitted = '${datesubmitted}' AND author = '${author}'` : `author = '${author}'`;
    let selectSQLQuery : SQLquery = new SQLquery('reimbursements',columns,sqlCondition);
    selectSQLQuery.setQuery(Query_Type.Select);
    selectSQLQuery.sendQuery().then((sqlSelectResult : any)=>{
        let reimbursementsArray : Array<Reimbursement> = [];
        for (let rowResult of sqlSelectResult.rows){
            let {reimbursementid, author, amount, datesubmitted, dateresolved, description, resolver,status,type} = rowResult;
            reimbursementsArray.push(new Reimbursement(reimbursementid,author,amount,
            datesubmitted,dateresolved,description,resolver,status,type));
        }
                //If one result, return one Reimbursement object (not as array), otherwise return as array of type Reimbursement
        if(reimbursementsArray.length === 1){
            return callback(reimbursementsArray[0]);
        }
        return callback(reimbursementsArray);
    }).catch((error)=>{
        return callback (new RequestError(500,`Error retrieving information from database: ${error}`).sendObject());
    });
}
export function selectReimbursementByStatus(callback : Function, statusId : number) : Function{
    if(!statusId){
        return callback(new RequestError(400,`Invalid parameters passed. statusID was not passed with a value`).sendObject());
    }
    let params = {status : statusId};
    if(!typeCheckReimbursementParams(params)){
        return callback(new RequestError(400,"Incorrect parameters supplied. One or more parameters not in correct format").sendObject());
    }
    let selectSQLQuery : SQLquery = new SQLquery('reimbursements', Reimbursement.getPropsAsColumns(), `status = ${statusId}`);
    selectSQLQuery.setQuery(Query_Type.Select);
    selectSQLQuery.sendQuery().then((sqlSelectResult : any)=>{
        let reimbursementsArray : Array<Reimbursement> = [];
        for (let rowResult of sqlSelectResult.rows){
            let {reimbursementid, author, amount, datesubmitted, dateresolved, description, resolver,status,type} = rowResult;
            reimbursementsArray.push(new Reimbursement(reimbursementid,author,amount,
            datesubmitted,dateresolved,description,resolver,status,type));
        }
        return callback(reimbursementsArray);
    }).catch((error)=>{
        return callback(new RequestError(500,`Error retrieving information from database: ${error}`).sendObject());
    });
}
export function updateReimbursement(callback : Function, userId : number, params : object){
    let columns : Array<string> = []; 
    let values : Array<string> = [];
    //This is an array of parameters that we allow the user to update. This prohibits the user from updating certain fields, such as
    //reimbursementId, which are not supposed to be changed.
    //Non-changable fields in Reimbursement: 
    let applicableParams : Array<string> = ['amount','status','type','description'];
    //Seperate the indexes and values into their own arrays from the passed parameter "params"
    for(let column in params){
        //If the parameter is not part of notPassedParams, proceed.
        if(applicableParams.includes(column)){
            columns.push(column);
            if(params[column]){
                values.push(params[column]);
            }
        }
    }
    /** The following three if statements are for parameter error checking to ensure user has submitted appropriate values. If they
    * didn't, this code provides constructive 400 Bad Request responses via the RequestError class.
    */
    if(!typeCheckReimbursementParams(params) || columns.length < 1 || columns.length !== values.length){
        return callback(new RequestError(400,"Incorrect parameters supplied. One or more parameters not in correct format").sendObject());
    }
    //Add current date into columns,values arrays to set as resolvedate. Also add resolver as the current userId passed to function
    let resolvedate = Date.now();
    columns.push(`dateresolved`);
    values.push(`${resolvedate}`);
    columns.push(`resolver`);
    values.push(`${userId}`);
    //Setup update query in order to update row with specified reimbursementId with values and columns specified from earlier.
    let sqlUpdateQuery : SQLquery = new SQLquery('reimbursements',columns,`reimbursementid = ${params['reimbursementId']}`,values);
    sqlUpdateQuery.setQuery(Query_Type.Update);
    console.log(sqlUpdateQuery.getQuery());
    sqlUpdateQuery.sendQuery().then((sqlUpdateResult)=>{
        console.log(sqlUpdateResult);
        selectReimbursementById((result : Function)=>{
            return callback(callback(result));
        },params['reimbursementId']);
    }).catch((error)=>{
        return callback(new RequestError(500,`Error retrieving information from database: ${error}`).sendObject());
    })
}
function selectReimbursementById(callback : Function, reimbursementId : number){
    let selectSQLQuery : SQLquery = new SQLquery('reimbursements',Reimbursement.getPropsAsColumns(),`reimbursementid = '${reimbursementId}'`);
    selectSQLQuery.setQuery(Query_Type.Select);
    console.log(selectSQLQuery.getQuery());
    selectSQLQuery.sendQuery().then((sqlSelectResult : any)=>{
        let {reimbursementid, author, amount, datesubmitted, dateresolved, description, resolver,status,type} = sqlSelectResult.rows[0];
        let selectedReimbursement = new Reimbursement(reimbursementid,author,amount,
        datesubmitted,dateresolved,description,resolver,status,type);
        console.log(selectedReimbursement);
        return callback(selectedReimbursement);
    }).catch((error)=>{
        return callback (new RequestError(500,`Error retrieving information from database: ${error}`).sendObject());
    });
}
function typeCheckReimbursementParams(params : object) : boolean{
        //Type checking for passed parameters. Calls error if:
    // - ReimbursementId is not a number
    // - amount is not a number
    // - author is not a number
    // - description is not a string
    // - type is not an existing type in the database
    // - status is not an existing status in the database
    try{
        if(params.hasOwnProperty('amount')){
            if(isNaN(params['amount'])){ return false; }
        }
        if(params.hasOwnProperty('reimbursementId')){
            if(isNaN(params['reimbursementId'])){ return false; }
        }
        if(params.hasOwnProperty('author')){
            if(isNaN(params['author'])){ return false; }
        }
        if(params.hasOwnProperty('description')){
            if(typeof params['description'] !== 'string'){
                throw Error;
            }
        }
        if(params.hasOwnProperty('type')){
            let testType = new ReimbursementType(parseInt(params['type']));
            if(!testType.getType()){
                throw Error;
            }
        }
        if(params.hasOwnProperty('status')){
            let testStatus = new ReimbursementStatus(parseInt(params['status']));
            if(!testStatus.getStatus()){
                throw Error;
            }
        }
        return true;
    }catch(error){
        return false;
    }
}
=======
    //Send new SQL_Query to table reimbursements with values and columns respectively from the variables above. Empty string is provided as an
    //argument for condition parameter because conditions don't matter with INSERT queries.
    let insertSQLQuery = new SQL_Query('reimbursements',columns,'',values);
    insertSQLQuery.setQuery(Query_Type.Insert);
    insertSQLQuery.sendQuery().then((sqlInsertResult : any)=>{
        let selectSQLQuery : SQL_Query = new SQL_Query('reimbursements',columns,`author = '${userID}`);
        selectSQLQuery.setQuery(Query_Type.Select);
        selectSQLQuery.sendQuery().then((sqlSelectResult : any)=>{
            let {reimbursementid, amount, author, datesubmitted, description, resolver,status,type} = sqlSelectResult.rows;
            let recentlyAddedReimbursement = new Reimbursement(reimbursementid,amount,author,
                datesubmitted,description,resolver,status,type);
            return callback(recentlyAddedReimbursement);
        }).catch((error)=>{
            return callback (new RequestError(500,"Error retrieving information from database.").sendObject());
        });
    }).catch((error)=>{
        return callback(new RequestError(500,"Error retrieving information from database.").sendObject());
    });
};
>>>>>>> db2a426... Initial project
