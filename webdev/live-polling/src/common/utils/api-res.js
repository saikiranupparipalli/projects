const response =   (statusCode, msg, data= null)=>({
  success: true,
  statusCode,
   msg,
   data,
})


const ApiResponse = {
  ok: (data,msg='DATA FETCH SUCCESS')=>{
    return response(200, msg, data)
  }
}




export default ApiResponse;

