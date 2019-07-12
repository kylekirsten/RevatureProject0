<<<<<<< HEAD
import { SQLquery, Query_Type } from "./sqlquery";

class ReimbursementType{
    public static  populateTypes(): void{
        //Select current reimbursement types from database
        let sqlRetrieveQuery = new SQLquery('reimbursementtype',['typeid','type']);
        sqlRetrieveQuery.setQuery(Query_Type.Select);
        sqlRetrieveQuery.sendQuery().then((sqlQueryResult: any) => {
            //Loop through results and put them in an array
                for (const obj of sqlQueryResult.rows) {
                this.typesofReimbursement[parseInt(obj.typeid)] = obj.type;
            }
            }).catch((error:any)=> { console.log("Error connecting to database! Exit application now to avoid errors");
        console.log(error);})
    }

    private static typesofReimbursement = [];
    private typeId: number;
    private type: string;

    constructor(typeid: number) {
        this.typeId = typeid;
        this.type = ReimbursementType.typesofReimbursement[typeid];
    }
    public getType() {
        return this.type;
    }
    
    //static getExistingTypes() : Array<number>{
    //    let existingTypesArr = [];
    //    for(let checkKey in this.typesofReimbursement.keys){
    //        if(this.typesofReimbursement[checkKey]){
    //            existingTypesArr.push(checkKey);
    //        }
    //    }
    //    return existingTypesArr;
    //}

=======
import { SQL_Query, Query_Type } from "./sqlquery";

class ReimbursementType{
    static typesofReimbursement = [];
    typeId : number;
    type : string;
    
    getType(){
        return this.type;
    }
    static populateTypes() : void{
        //Select current reimbursement types from database
        let sqlRetrieveQuery = new SQL_Query('reimbursementtype',['*']);
        sqlRetrieveQuery.setQuery(Query_Type.Select);
        sqlRetrieveQuery.sendQuery().then((sqlQueryResult : any)=>{
        //Loop through results and put them in an array
            for(let obj of sqlQueryResult.rows){
            this.typesofReimbursement[parseInt(obj.typeid)] = obj.type;
        }        
        }).catch((error:any)=> { console.log("Error connecting to database! Exit application now to avoid errors");
    console.log(error);})
    }
    constructor(typeid : number){
        this.typeId = typeid;
        this.type = ReimbursementType.typesofReimbursement[typeid];
    }
>>>>>>> db2a426... Initial project
}
export {ReimbursementType};
