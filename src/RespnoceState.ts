export class ResponseState {
    public static success_response ( message : any ) {
        return {
            success : true  ,
            response : message
        }
     } 



     public static failed_response ( message : any ) {
        return {
            success : false  ,
            response : message
        }
     } 


}