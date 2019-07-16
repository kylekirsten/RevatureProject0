class RequestError extends Error {
    private httptype: number;
    constructor(httptype: number, message: string) {
        super(message);
        this.httptype = httptype;
    }
    /** getHttpType function
     *  Displays the http status code in current instance of RequestError
     *  @returns number
     */
    public getHttpType(): number {
        return this.httptype;
    }
    /** getMessage function
     *  Displays the error message in current instance of RequestError
     *  @returns string
     */
    public getMessage(): string {
        return this.message;
    }
    /** sendObject function
     *  Returns a generic object of httptype and message fields of current instance.
     *  Used as a shorthand for returning a RequestError object to another function
     *  @returns object
     */
    public sendObject(): object {
        return {
            httptype: this.httptype,
            message: this.message,
        };
    }
}
export {RequestError};
