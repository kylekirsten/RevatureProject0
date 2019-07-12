import {Pool} from 'pg';
import config from '../config.json';
enum Query_Type {
    Insert,
    Select,
    Update,
<<<<<<< HEAD
    Delete,
}
class SQLquery {
    private tableName: string;
    private columnNames: string[];
    private query: string;
    private values: string[];
    private condition: string;
    private pool: Pool;
    private queryArguments: string[];

    constructor(tableName: string , columnNames: string[],
                condition: string = '', values: string[] = []) {
        this.tableName = tableName;
        this.columnNames = columnNames;
        this.values = values;
        this.condition = condition;
        this.pool = new Pool(config.SQL);
    }
    // Set query string according to one of the CRUD operations
    // Parameters: operation : String. Only "insert", "select", "update", "delete"
    public setQuery(operation: Query_Type) {

        switch (operation) {
            case Query_Type.Insert:
                this.query = `INSERT INTO ${this.tableName} VALUES ('$1'); `;
                this.queryArguments = [this.values.join(`','`)];
                break;
            case Query_Type.Select:
                const basicSelectQuery = `SELECT ${this.columnNames} FROM ${this.tableName}`;
                if (!this.condition) { this.query = basicSelectQuery; }
                if (this.condition) { this.query = basicSelectQuery + ' WHERE ' + this.condition + ';'; }
                break;
            case Query_Type.Update:
                // Check to see if some values are undefined
                this.values = this.values.filter((value) => {
                    if (!value) {
                        const index = this.values.indexOf(value);
                        this.columnNames.splice(index, 1);
=======
    Delete
}
class SQL_Query {
    tableName : string;
    columnNames : Array<string>;
    query : string;
    values : Array<string>;
    condition : string;
    pool : Pool;
    //Set query string according to one of the CRUD operations
    //Parameters: operation : String. Only "insert", "select", "update", "delete"
    setQuery(operation : Query_Type){

        switch(operation){
            case Query_Type.Insert:
                this.query = `INSERT INTO ${this.tableName} (${this.columnNames.join(',')}) VALUES (${this.values.join(',')}); `;
                break;
            case Query_Type.Select:
                const basicSelectQuery = `SELECT ${this.columnNames.join(',')} FROM ${this.tableName}`;
                if(!this.condition) this.query = basicSelectQuery;
                if(this.condition) this.query = `${basicSelectQuery} WHERE ${this.condition};`;
                break;
            case Query_Type.Update:
                //Check to see if some values are undefined
                this.values = this.values.filter((value)=>{
                    if(!value){
                        let index = this.values.indexOf(value);
                        this.columnNames.splice(index,1);
>>>>>>> db2a426... Initial project
                        return false;
                    }
                    return true;
                });
<<<<<<< HEAD
                let basicUpdateQuery: string;
                // If there is only one column name value pair, we cannot use parenthasis in postgresql.
                // This check removes them
                if (this.columnNames.length < 2) {
                    basicUpdateQuery = `UPDATE ${this.tableName} SET $1 = '$2'`;
                } else {
                 basicUpdateQuery = `UPDATE ${this.tableName} SET ($1) = ('$2')`;
                }
                this.queryArguments = [this.columnNames.join(','), this.values.join(`','`)];
                // This is the worst case scenario when a user sends only one parameter
                // incorrectly to update and it becomes undefined
                // The provided condition is used as a failsafe so no data is harmed
                // This also fixes input that contains absolute nonsense parameters
                if (this.values.length === 0 || this.columnNames.length === 0) {
                    basicUpdateQuery = `UPDATE ${this.tableName} SET ${this.condition}`;
                }
                if (!this.condition) { this.query = basicUpdateQuery; }
                if (this.condition) { this.query = `${basicUpdateQuery} WHERE ${this.condition};`; }
=======
                let basicUpdateQuery : string;
                //If there is only one column name value pair, we cannot use parenthasis in postgresql. This check removes them
                if(this.columnNames.length < 2){
                    basicUpdateQuery = `UPDATE ${this.tableName} SET ${this.columnNames[0]} = '${this.values[0]}'`;
                }else{
                 basicUpdateQuery = `UPDATE ${this.tableName} SET (${this.columnNames.join(`,`)}) = ('${this.values.join(`','`)}')`;
                }
                //This is the worst case scenario when a user sends only one parameter incorrectly to update and it becomes undefined
                //The provided condition is used as a failsafe so no data is harmed
                //This also fixes input that contains absolute nonsense parameters
                if(this.values.length === 0 || this.columnNames.length === 0){
                    basicUpdateQuery = `UPDATE ${this.tableName} SET ${this.condition}`;
                }
                if(!this.condition) this.query = basicUpdateQuery;
                if(this.condition) this.query = `${basicUpdateQuery} WHERE ${this.condition};`;
>>>>>>> db2a426... Initial project
                break;
            case Query_Type.Delete:
                this.query = `DELETE FROM ${this.tableName} WHERE ${this.condition};`;
                break;
        }
    }
<<<<<<< HEAD
    // Get query string. Returns String
    public getQuery(): string {
        return this.query;
    }
    //  Send query to SQL server. Returns Promise
    public sendQuery(): Promise<object> {
        // These variables have to be defined here because in the promise (a callback function),
        // the this keyword doesnt work
        const values: string = this.values.join(`','`);
        const queryPool = this.pool;
        const queryString = this.query;
        const queryArguments = this.queryArguments;
        return new Promise((resolve, reject) => {
            queryPool.query(queryString, queryArguments, (error: any, results: any) => {
=======
    //Get query string. Returns String
    getQuery() : string{
        return this.query;
    }
    //Send query to SQL server. Returns Promise and 
    sendQuery() : Promise<string | object> {
        //These variables have to be defined here because in the promise (a callback function), the this keyword doesnt work
        const queryPool = this.pool;
        const sqlQuery = this.query;
        return new Promise(function (resolve, reject){
            queryPool.query(sqlQuery, (error : any, results : any) => {
                if(!sqlQuery) reject("No query provided");
>>>>>>> db2a426... Initial project
                if (error) {
                    reject(error);
                }
                resolve(results);
            });
        });
    }
<<<<<<< HEAD
}
export {SQLquery, Query_Type};
=======
    constructor(tableName : string , columnNames : Array<string>,
        condition: string = '', values : Array<string> = [])
    {
        this.tableName = tableName;
        this.columnNames = columnNames;
        this.values = values;
        this.condition = condition;
        this.pool = new Pool(config.SQL);
    }
}

//let sqlquery = new Pool({
 //   host: "localhost",
 //   database: "Project0",
 //   user: "postgres",
 //   password: "password",
 //   port: 5432
//})
export {SQL_Query, Query_Type};
>>>>>>> db2a426... Initial project
