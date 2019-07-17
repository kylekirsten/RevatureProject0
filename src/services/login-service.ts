import * as passwordHash from '../auth/password-hash';
import config from '../config.json';
import {RequestError} from '../objects/requesterror';
import {Role} from '../objects/role';
import {Query_Type, SQLquery} from '../objects/sqlquery';
import {User} from '../objects/user';
/** checkUser Function.
 * Checks to see if the username and password provided match a result in the database and constitutes
 * a valid user.
 * @param username Username provided by user input. Type: string
 * @param password Password provided by user input. Type: string
 * @param callback Callback function setup. This function doesn't use promises
 * @returns void. Works via callback function
 */
export function checkUser(username: string , password: string , callback: any) {
    if (!username || !password) {
        return callback(new RequestError(400, config.errormsg.invalidParameters));
    }
    let loggedInUserObject: User;
    // Send new sql query with SQL_Query class to verify user login is correct
    const loginQuery = new SQLquery('users', ['userid', 'username', 'hash', 'firstname', 'lastname', 'email', 'role']);
    // This call is to verify existing database content, so query type select is used.
    loginQuery.setQuery(Query_Type.Select);
    loginQuery.setCondition('WHERE', ['username'], [username]);
    // Send query and send results through a callback function
    loginQuery.sendQuery().then((result: any) => {
        return result;
    }).catch(() => {
        return callback(new RequestError(500, config.errormsg.databaseError));
    }).then((sqlQueryResult) => {
        if (sqlQueryResult.rows.length === 0) {
            return callback(new RequestError(400, config.errormsg.invalidCredentials));
        }
        loggedInUserObject = new User(sqlQueryResult.rows[0]);
        passwordHash.compareHash(password, sqlQueryResult.rows[0].hash).then((hashResult: boolean) => {
            if (hashResult) {
                return callback(loggedInUserObject);
            } else {
                return callback(new RequestError(400, config.errormsg.invalidCredentials));
            }
        }).catch(() => {
            return callback(new RequestError(500, config.errormsg.passwordGenerationError));
        });
    });
}
