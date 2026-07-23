import proxy from "express-http-proxy";

// adds user to the header so that the downstream service can access user information
// as cookies are not passed to the downstream service, we need to pass user information in the header

export const proxyWithUser = (serviceUrl)=>{

 return proxy(
  serviceUrl, // url of the downstream service
  {

   proxyReqOptDecorator: // function that allows us to modify 
   // the request options before sending the request to the downstream service
   (proxyReqOpts, srcReq)=>{

    if(srcReq.user){ // if the user is authenticated, add user information to the header

      // custom headers to pass user information to the downstream service
      proxyReqOpts.headers[
       "x-user-id"
      ] = srcReq.user.userId;
      proxyReqOpts.headers[
       "x-user-email"
      ] = srcReq.user.email;
      proxyReqOpts.headers[
       "x-user-avatar"
      ] = srcReq.user.avatar

    }

    return proxyReqOpts;

   }

  }
 );

}