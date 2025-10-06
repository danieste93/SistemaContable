const jwt = require('jsonwebtoken');
const authFuncion= async (req, res, next)=>{

 const token = req.headers["x-access-token"]
 if(!token){
   res.status(401).send({status: "error", message: "sin token"});
 }
 try {

 const decode = await jwt.verify(token, req.app.get('secretKey') )


if(decode.iat < decode.exp){
  req.datatoken = decode
  next();
}
else{
  throw new Error("token malo")
}

 
 }
 catch(err){
   console.log(err)
  return res.status(401).send({status: "error", message: "error al decodificar el token"});
 }
}
 module.exports = authFuncion 