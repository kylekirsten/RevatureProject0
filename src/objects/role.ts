import config from '../config.json';
<<<<<<< HEAD
import {SQLquery , Query_Type} from '../objects/sqlquery';
=======
import {SQL_Query,Query_Type} from '../objects/sqlquery';
>>>>>>> db2a426... Initial project
enum RequestType {
    GET,
    POST,
    PATCH,
    PUT,
    DELETE
}
class Role {
    static typesOfRole = [];
    roletype : string;
    roleid : number;
    
<<<<<<< HEAD
    static async populateTypes () : Promise<any>{
        let sqlRetrieveQuery = new SQLquery('roles',['roleid,rolename']);
=======
    static populateTypes () : void{
        let sqlRetrieveQuery = new SQL_Query('roles',['*']);
>>>>>>> db2a426... Initial project
        sqlRetrieveQuery.setQuery(Query_Type.Select);
        sqlRetrieveQuery.sendQuery().then((sqlQueryResult : any)=>{
            for(let obj of sqlQueryResult.rows){
                Role.typesOfRole[parseInt(obj.roleid)] = obj.rolename;
            }
        }).catch((error : any) => {console.log("Database Connection Failed! Please exit application to avoid errors");
        console.log(error);
        });
    }
<<<<<<< HEAD
    canPerform(url : string, type: RequestType, userId : number = 0, resourceId : number = 0) : boolean{
=======
    canPerform(url : string, type: RequestType) : boolean{
>>>>>>> db2a426... Initial project
        //work on putting this all in config file
        let configPerms = config.permissions;
        let fixedURL = url;
        //Fix trailing slashes at the end of urls
        while(fixedURL.endsWith('/')){
<<<<<<< HEAD
            fixedURL = fixedURL.substring(0,fixedURL.length - 1);        
        }
        let jsonPath : any = configPerms[RequestType[type]][fixedURL];
        if (jsonPath.hasOwnProperty("SELF")){
            if(userId === resourceId){
                jsonPath = jsonPath['SELF'];
            }else{
                jsonPath = jsonPath['OTHER'];
            }
        }
=======
            fixedURL = fixedURL.substring(0,fixedURL.length - 1);        }
        let jsonPath = configPerms[RequestType[type]][fixedURL];
>>>>>>> db2a426... Initial project
        for(let applicableRoles of jsonPath){
            if(this.roleid === applicableRoles){
                return true;
            }
        }
    }
    getRoleType() : string{

        return `${this.roletype}`;
    }
    constructor( roleid : number){
        this.roleid = roleid;
        this.roletype = Role.typesOfRole[roleid];       
<<<<<<< HEAD
=======
        console.log("Added user with role of " + this.roletype)
>>>>>>> db2a426... Initial project
    }
}
export {Role,RequestType};











