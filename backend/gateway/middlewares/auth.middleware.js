import redis from "../../shared/redis/redis.js";


// middleware to protect routes
export const protect = async(req,res,next)=>{
 try{
   const sessionId = req?.cookies?.session;

   if(!sessionId){
     return res.status(401).json({
       message:"Unauthorized"
     });
   }

   // check if session exists in redis
   const session = await redis.get(`session:${sessionId}`);

   if(!session){
     return res.status(401).json({
       message:"Session Expired"
     });
   }

   // session === stringified user object,

   // attach user to request object
   req.user = JSON.parse(session);

   next();

 }catch(error){
   return res.status(500).json({
    message:error.message
   });
 }

}