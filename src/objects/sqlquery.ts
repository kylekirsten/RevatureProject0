import {Pool, QueryResult} from 'pg';
import config from '../config.json';
enum Query_Type {
    Insert,
    Select,
    Update,
    Delete,
}
class SQLquery {
    private tableName: string;
    private columnNames: string[];
    private query: string;
    private values: string[];
    private pool: Pool;
    private queryArguments: string[] = [];

    constructor(tableName: string , columnNames: string[],
                values: string[] = []) {
        this.tableName = tableName;
        this.columnNames = columnNames;
        this.values = values;
        this.pool = new Pool(config.SQL);
        this.query = '';
    }
    // Set query string according to one of the CRUD operations
    // Parameters: operation : String. Only "insert", "select", "update", "delete"
    public setQuery(operation: Query_Type) {
        // The following code block creates a placeholder string for our values being passed into the query.
        // This setup is prevent SQL injection, by passing values in as parameters to the Pool.query function.
        // Pool.query uses 'dollar-sign' identifiers in order to pass the parameters directly into the query.
        // This block creates dollar sign identifiers into a valuePlaceholderString variable.
        let valuePlaceholderString: string = '';
        let j: number;
        for (j = 0; j < this.values.length; j++) {
            if (j !== 0) {
                valuePlaceholderString += `,`;
            }
            valuePlaceholderString += `$${j + 1}`;
        }
        this.queryArguments = this.values;
        // Check operation, each operation (of type Query_Type) will have different query strings
        switch (operation) {
            case Query_Type.Insert:
                this.query = `INSERT INTO ${this.tableName} (${this.columnNames.join(',')})
                 VALUES (${valuePlaceholderString}) RETURNING *; `;
                break;
            case Query_Type.Select:
                this.query += `SELECT ${this.columnNames} FROM ${this.tableName} `;
                break;
            case Query_Type.Update:
                // Check to see if some values are undefined
                this.values = this.values.filter((value) => {
                    if (!value) {
                        const index = this.values.indexOf(value);
                        this.columnNames.splice(index, 1);
                        return false;
                    }
                    return true;
                });
                // If there is only one column name value pair, we cannot use parenthases in postgresql.
                // This check removes them
                if (this.columnNames.length < 2) {
                    this.query += `UPDATE ${this.tableName} SET ${this.columnNames[0]} = $1 `;
                } else {
                 this.query += `UPDATE ${this.tableName} SET (${this.columnNames.join(',')})
                  = (${valuePlaceholderString}) `;
                }
                // This is the worst case scenario when a user sends only one parameter
                // incorrectly to update and it becomes undefined
                // The provided condition is used as a failsafe so no data is harmed
                // This also fixes input that contains absolute nonsense parameters
                if (this.values.length === 0 || this.columnNames.length === 0) {
                    this.query = `UPDATE ${this.tableName} SET () `;
                }
                break;
            case Query_Type.Delete:
                this.query += `DELETE FROM ${this.tableName} `;
                break;
        }
    }
    /** Set Condition Function
     * Used to set various constraints for current SqlQuery instance, including WHERE, HAVING, ect.
     * @Params : type: string; Ex: WHERE, HAVING, ect. ,
     *  columns: array of columns, values: array of values, additionKey: Takes either AND or OR.
     * @returns: void
     */
    public setCondition(type: string, columns: string[], values: any[], additionKey: string = 'AND') {
        this.query += `${type} `;
        this.query += columns[0];
        this.query += `= $${this.queryArguments.length + 1}`;
        this.queryArguments.push(values[0]);
        if (columns.length > 1) {
            let i: number = 0;
            for (i = 1; i < columns.length; i++) {
                this.query += ` ${additionKey} ${columns[i]} = $${this.queryArguments.length + i}`;
                this.queryArguments.push(values[i]);
            }
        }
        // This check makes sure the returning keyword is not used on SELECT statements
        // (because it would return a syntax error)
        if (!this.query.includes('SELECT')) {
        this.query += ' RETURNING *;';
        }
    }
    /** GetQuery Function
     * Gets full query string of current SqlQuery instance. Useful for logging and error checking.
     * @returns: string
     */
    public getQuery(): string {
        return this.query;
    }

    /** sendQuery Function
     * Sends postgreSQL query with pool of current instance. Will return a QueryResult that is
     * normally called via the rows property.
     * @returns: Promise<QueryResult>
     */
    public sendQuery(): Promise<QueryResult> {
        // These variables have to be defined here because in the promise (a callback function),
        // the this keyword doesnt work
        const queryPool = this.pool;
        const queryString = this.query;
        const queryArguments = this.queryArguments;
        return new Promise((resolve, reject) => {
            queryPool.query(queryString, queryArguments, (error: any, results: any) => {
                if (error) {
                    reject(error);
                }
                resolve(results);
            });
            this.pool.end();

        });
    }
}
export {SQLquery, Query_Type};
