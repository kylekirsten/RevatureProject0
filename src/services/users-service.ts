import * as passwordHash from '../auth/password-hash';
import config from '../config.json';
import {RequestError } from '../objects/requesterror';
import {Role} from '../objects/role';
import {Query_Type, SQLquery} from '../objects/sqlquery';
import {User} from '../objects/user';
export function listUsers(callback: any, userID: number = 0) {
    // define a new SQL_Query class in order to get userlist
    const condition = userID === 0 ? '' : `userid = '${userID}'`;
    const userListQuery = new SQLquery('users', ['userid', 'username', 'hash'
    , 'firstname', 'lastname', 'email', 'role']);
    // Retrieving user list via a select query
    userListQuery.setQuery(Query_Type.Select);
    if (condition) {
        userListQuery.setCondition('WHERE', ['userid'], [`${userID}`]);
    }
    userListQuery.sendQuery().then((sqlQueryResult: any) => {
        if (sqlQueryResult.rows.length === 0) { return callback(new RequestError(200, config.errormsg.noUsersFound)); }
        // Deconstructing query result into new user class
        const userList: User[] = new Array();
        // If only one user is returned return only that user. Otherwise continue on an create a user array
        sqlQueryResult.rows.forEach((element: any) =>  {
            // const {userid, username, hash, firstname, lastname, email, role} = element;
            // const newRole: Role = new Role(parseInt(role, 10));
            const newUser: User = new User(element);
            // Add each created User class to user array
            userList.push(newUser);
        });
        if (userList.length === 1) {
            return callback(userList[0]);
        } else {
            return callback(userList);
        }
    }).catch((error) => {return callback(new RequestError(500, config.errormsg.databaseError));
    });
}
export function updateUser(callback: any, userID: number, params: any) {
    const columnsArray = [];
    const valuesArray = [];
    let procedureAfterHash;
    // If a user is updating their password, this block turns it into a hash.
    if (params.password) {
        passwordHash.generateHash(params.password).then((result) => {
            params.hash = result;
            params.password = undefined;
            procedureAfterHash();
        }).catch(() => {
            return callback(new RequestError(500, config.errormsg.passwordGenerationError));
        });
    } else {
        procedureAfterHash();
    }
    procedureAfterHash = (() => {
        // Checks if role was returned as string (indicating they are using role type).
        // This block turns it into a roleid which is what is required by the database.
        if (isNaN(params.role) && (params.role)) {
            params.role = Role.getIdFromType(params.role);
            if (!params.role) {
                params.role = undefined;
            }
        }
        const appplicableParams: string[] = ['username', 'hash', 'firstname', 'lastname', 'email', 'role'];
        for (const columns in params) {
            // push applicable keys of params into columns array
            if (appplicableParams.includes(columns) && (params[columns])) {
                columnsArray.push(columns);
                // push all applicable param values into values array. (Makes sense, don't it?)
                valuesArray.push(params[columns]);
            }
        }
        const updateUserQuery = new SQLquery('users', columnsArray, valuesArray);
        updateUserQuery.setQuery(Query_Type.Update);
        updateUserQuery.setCondition('WHERE', ['userid'], [userID]);
        updateUserQuery.sendQuery().then((updateQueryResult) => {
        // if no users returned, return an error message
            if (updateQueryResult.rows.length === 0) {
                return callback(new RequestError(400, config.errormsg.noUsersFound));
            }
            const newUser = new User(updateQueryResult.rows[0]);
            return callback(newUser);
        }).catch((error: any) =>  {return callback(new RequestError(500, config.errormsg.databaseError));
        });
    });
}
