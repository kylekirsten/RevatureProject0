<<<<<<< HEAD
import {SQLquery,Query_Type} from '../objects/sqlquery'
=======
import {SQL_Query,Query_Type} from '../objects/sqlquery'
>>>>>>> db2a426... Initial project
import {User} from '../objects/user';
import {Role} from '../objects/role';
export function checkUser(username : string , password : string , callback : Function){
    //Error variable definitions
    const errorInvalidInput : string = "Invalid Input";
    const errorInvalidCredentials : string = "Invalid Credentials";
    
    if(!username || !password) return callback(errorInvalidInput);
    //Send new sql query with SQL_Query class to verify user login is correct
<<<<<<< HEAD
    const loginQuery = new SQLquery('users',['userId','firstName','lastName','email','role'],
=======
    const loginQuery = new SQL_Query('users',['userId','firstName','lastName','email','role'],
>>>>>>> db2a426... Initial project
    `username = '${username}' AND password = '${password}'`);
    //This call is to verify existing database content, so query type select is used.
    loginQuery.setQuery(Query_Type.Select);
    //Send query and send results through a callback function
    loginQuery.sendQuery().then((sqlQueryResult : any)=>{
        //If database result is empty, the user credentials must be wrong. Send back "invalid credentials"
        if(sqlQueryResult.rows.length === 0) return callback(errorInvalidCredentials);
        //Deconstructing query result into new user class
        const {userid,firstname,lastname,email,role} = sqlQueryResult.rows[0];
        const newRole : Role = new Role(parseInt(role));
        let newUserSession : User = new User(userid,username,
            firstname,lastname,email,newRole);
        //return newly created User object
        return callback(newUserSession);
    }).catch((error)=>{return callback(error)});
}