<<<<<<< HEAD
import {SQLquery,Query_Type} from '../objects/sqlquery';
=======
import {SQL_Query,Query_Type} from '../objects/sqlquery';
>>>>>>> db2a426... Initial project
import {User} from '../objects/user';
import { Role} from '../objects/role';
export function listUsers(callback : Function, userID : number = 0){
    //define a new SQL_Query class in order to get userlist
    const condition = userID === 0 ? '' : `userid = '${userID}'`;
<<<<<<< HEAD
    const userListQuery = new SQLquery('users',['userid','username','password'
=======
    const userListQuery = new SQL_Query('users',['userid','username','password'
>>>>>>> db2a426... Initial project
    ,'firstname','lastname','email','role'],condition);
    //Retrieving user list via a select query
    userListQuery.setQuery(Query_Type.Select);
    userListQuery.sendQuery().then((sqlQueryResult : any)=>{
        if(sqlQueryResult.rows.length === 0) return callback("No Users Found");
        //Deconstructing query result into new user class
        const userList : Array<User> = new Array();
        //If only one user is returned return only that user. Otherwise continue on an create a user array
<<<<<<< HEAD
=======
        if(sqlQueryResult.rows.length === 1) callback(sqlQueryResult.rows[0]);
>>>>>>> db2a426... Initial project
        sqlQueryResult.rows.forEach((element : any) =>  {
            //Deconstruct sqlQueryResult values into respective fields for addition to new User class.
            //***Might be able to shorten function */
            const {userid,username,password,firstname,lastname,email,role} = element;
            const newRole : Role = new Role(parseInt(role));
            const newUser : User = new User(userid,username,
            firstname,lastname,email,newRole);
            //Add each created User class to user array
            userList.push(newUser);
        });
<<<<<<< HEAD
        if(userList.length === 1){
            return callback(userList[0]);
        }else{
            return callback(userList);
        }
=======
        return callback(userList);
>>>>>>> db2a426... Initial project
    }).catch((error : string)=>{return callback(error);
    });
}
export function updateUser(callback : Function, userID : number, params : object){
    let columnsArray = [];
    let valuesArray = [];
    for(let columns in params){
        //push all keys of params into columns array
        columnsArray.push(columns);
        //push all values of params into values array. (Makes sense, don't it?)
        valuesArray.push(params[columns]);
    }
<<<<<<< HEAD
    let updateUserQuery = new SQLquery('users',columnsArray,`userid = ${userID}`,valuesArray);
    updateUserQuery.setQuery(Query_Type.Update);
    updateUserQuery.sendQuery().then((updateQueryResult : string | object) => {
        let selectUserQuery = new SQLquery('users',['userid','username','password','firstname','lastname','email','role'],`userid = ${userID}`);
=======
    let updateUserQuery = new SQL_Query('users',columnsArray,`userid = ${userID}`,valuesArray);
    updateUserQuery.setQuery(Query_Type.Update);
    updateUserQuery.sendQuery().then((updateQueryResult : string | object) => {
        let selectUserQuery = new SQL_Query('users',['userid','username','password','firstname','lastname','email','role'],`userid = ${userID}`);
>>>>>>> db2a426... Initial project
        selectUserQuery.setQuery(Query_Type.Select);
        selectUserQuery.sendQuery().then((selectQueryResult : any) => {
            if(typeof selectQueryResult === 'object'){
                const {username,firstname,lastname,email,role} = selectQueryResult.rows[0];
                const newRole : Role = new Role(parseInt(role));
                const newUser : User = new User(userID,username,
                firstname,lastname,email,newRole);
                callback(newUser);
            }else{
                callback(selectQueryResult);
            }
        });
    }).catch((error: any) => { return callback(new Error(error))});
}
