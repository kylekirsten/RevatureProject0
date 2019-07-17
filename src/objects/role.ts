import config from '../config.json';
import {Query_Type, SQLquery} from '../objects/sqlquery';

enum RequestType {
    GET,
    POST,
    PATCH,
    PUT,
    DELETE,
}
class Role {
    /** populateTypes function
     *  Called when program starts. Retrieves all types of roles from database
     *  and populates class as a static property in order to be retrieved in all other instances
     *  @returns void
     */
    public static populateTypes(): void {
        const sqlRetrieveQuery = new SQLquery('roles', ['*']);
        sqlRetrieveQuery.setQuery(Query_Type.Select);
        sqlRetrieveQuery.sendQuery().then((sqlQueryResult: any) => {
            for (const obj of sqlQueryResult.rows) {
                Role.typesOfRole[parseInt(obj.roleid, 10)] = obj.rolename;
            }
        }).catch((error: any) => {
            // tslint:disable-next-line: no-console
            console.error(config.errormsg.initialDatabaseConnectError);
        });
    }
    /** getIdFromType function
     * Used to get back the typeid when given a type in the form of a string. Used to translate user input to id syntax.
     *  @params type: string - Type of role
     *  @returns number
     */
    public static getIdFromType(type: string): number {
        const retrievedId = Role.typesOfRole.indexOf(type);
        // If there is no index, the value will be -1, so it is set to 0 instead so it can evaluated as a falsy value
        if (retrievedId === -1) {
            return 0;
        }
        return retrievedId;
    }
    private static typesOfRole = [];
    private role: string;
    private roleId: number;
    constructor( roleid: number) {
        this.roleId = roleid;
        this.role = Role.typesOfRole[roleid];
    }
    /** canPerform function
     *  Used to check whether a user can access or interact with a certain resource. userId
     *  and resourceId parameters can be used to check whether requested resource is the user's own
     *  or another user's resource and handled accordingly.
     *  @params url: string - Absolute route of routed request. Example: (/users/:userid).
     *  userId (optional) : number - userId of user performing request.
     *  resourceId : number - id of owner of requested resource.
     *  @returns boolean
     */
    public canPerform(url: string, type: RequestType, userId: number = 0, resourceId: number = 0): boolean {

        // work on putting this all in config file
        const configPerms = config.permissions;
        let fixedURL = url;
        // Fix trailing slashes at the end of urls
        while (fixedURL.endsWith('/')) {
            fixedURL = fixedURL.substring(0, fixedURL.length - 1);
        }
        let jsonPath: any = configPerms[RequestType[type]][fixedURL];
        if (jsonPath.hasOwnProperty('SELF')) {
            if (userId === resourceId) {
                jsonPath = jsonPath.SELF;
            } else {
                jsonPath = jsonPath.OTHER;
            }
        }

        for (const applicableRoles of jsonPath) {
            if (this.roleId === applicableRoles) {
                return true;
            }
        }
    }
    /** getRoleType function
     * Gets role type string of current Role instance
     *  @returns string
     */
    public getRoleType(): string {

        return `${this.role}`;
    }
    /** getRoleId function
     * Gets roleid of current Role instance
     *  @returns number
     */
    public getRoleId(): number {
        return this.roleId;
    }

}
export {RequestType, Role};
