import * as passwordHash from '../auth/password-hash';
import config from '../config.json';
import {RequestError } from '../objects/requesterror';
import {Role} from '../objects/role';
import {Query_Type, SQLquery} from '../objects/sqlquery';
import {User} from '../objects/user';
/**
 * Used to list an array of users or a specific user object as specified by userID
 * @param callback Function to call after completed.
 * @param userID userID of user you want to display. Defaults to 0, which lists all users
 * @returns User, User[], or RequestError. Works via callback function
 */
export function listUsers(callback: any, userID: number = 0) {
    // define a new SQL_Query class in order to get userlist
    const userListQuery = new SQLquery('users', ['userid', 'username', 'hash'
    , 'firstname', 'lastname', 'email', 'role']);
    // Retrieving user list via a select query
    userListQuery.setQuery(Query_Type.Select);
    if (userID) {
        userListQuery.setCondition('WHERE', ['userid'], [`${userID}`]);
    }
    userListQuery.sendQuery().then((sqlQueryResult: any) => {
        if (sqlQueryResult.rows.length === 0) { return callback(new RequestError(200, config.errormsg.noUsersFound)); }
        // Deconstructing query result into new user class
        const userList: User[] = new Array();
        // If only one user is returned return only that user. Otherwise continue on an create a user array
        sqlQueryResult.rows.forEach((element: any) =>  {
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
/**
 * Updates an existing user in the database
 * Utilizes many different checks to see if user provided input is valid
 * @param callback Function to call after completed.
 * @param userID ID of user you want to update
 * @param params Object passed to database. No parameters are required.
 * Optional parameters include username, password, firstname, lastname, email, role
 * @returns User. Works via callback function
 */
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
        if (params.role) {
            params.role = correctRole(params.role);
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
/** function correctRole
 *  Checks if user put role in as type string or type number and attempts to convert if is a type string.
 *  If it cannot convert or it is not a valid type, returns undefined.
 *  Used to ensure consistancy across database entries.
 *  @param role type any
 *  @returns number
 */
function correctRole(role: any): number {
    if (isNaN(role)) {
        role = role as string;
        role = Role.getIdFromType(role.toUpperCase());
        if (!role) {
            role = undefined;
        }
    }
    return role;
}
