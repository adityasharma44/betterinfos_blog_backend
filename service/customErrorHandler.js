class CustomErrorHandler extends Error{
    constructor(statusCode,message){
        super();
        this.statusCode=statusCode;
        this.message=message;
    }

    static alreadyExist(message){
        return new CustomErrorHandler(409,message)
    }

    static wrongCredentials(message){
        return new CustomErrorHandler(401,message)
    }

    static serverError(message){
        return new CustomErrorHandler(500,message)
    }
}

export default CustomErrorHandler;