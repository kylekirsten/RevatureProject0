class RequestError extends Error{
    private httptype : number;
    constructor(httptype : number, message : string){
        super(message);
        this.httptype = httptype;
    }

    getHttpType() : number{
        return this.httptype;
    }
    getMessage() : string{
        return this.message;
    }
    sendObject() : object{
        return {
            httptype: this.httptype,
            message: this.message
        };
    }
}
export {RequestError};