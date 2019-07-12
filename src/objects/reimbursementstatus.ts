<<<<<<< HEAD
import { SQLquery, Query_Type } from "./sqlquery";
=======
import { SQL_Query, Query_Type } from "./sqlquery";
>>>>>>> db2a426... Initial project

class ReimbursementStatus{
    static statusesofReimbursement = [];
    statusId : number;
    status : string;
    
    getStatus(){
        return this.status;
    }
<<<<<<< HEAD
    public static populateTypes() : void{
        //Select current reimbursement types from database
        let sqlRetrieveQuery = new SQLquery('reimbursementstatus',['status','statusid']);
        sqlRetrieveQuery.setQuery(Query_Type.Select);
        sqlRetrieveQuery.sendQuery().then((sqlQueryResult : any)=>{
            //Loop through results and put them in an array
                for(let obj of sqlQueryResult.rows){
                this.statusesofReimbursement[parseInt(obj.statusid)] = obj.status;
            }        
            }).catch((error:any)=> { console.log("Error connecting to database! Exit application now to avoid errors");
        console.log(error);})
=======
    static populateTypes() : void{
        //Select current reimbursement types from database
        let sqlRetrieveQuery = new SQL_Query('reimbursementstatus',['*']);
        sqlRetrieveQuery.setQuery(Query_Type.Select);
        sqlRetrieveQuery.sendQuery().then((sqlQueryResult : any)=>{
        //Loop through results and put them in an array
            for(let obj of sqlQueryResult.rows){
            this.statusesofReimbursement[parseInt(obj.statusid)] = obj.status;
        }        
        }).catch((error:any)=> { console.log("Error connecting to database! Exit application now to avoid errors");
    console.log(error);})
>>>>>>> db2a426... Initial project
    }
    constructor(statusid : number){
        this.statusId = statusid;
        this.status = ReimbursementStatus.statusesofReimbursement[statusid];
    }
}
export {ReimbursementStatus};