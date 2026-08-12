import proxy from "express-http-proxy";

// Adds user information to the downstream service request.
// Cookies are not forwarded, so authentication/user headers are copied manually.

export const proxyWithUser = (serviceUrl) => {
  return proxy(serviceUrl, {
    proxyReqPathResolver: (req) => {
      return req.originalUrl.replace(/^\/api\/(chat|agent|billing)/, "");
    },

    proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
      if (srcReq.headers.authorization) {
        proxyReqOpts.headers.authorization = srcReq.headers.authorization;
      }

      const fallbackSessionHeader =
        srcReq.headers["x-session-id"] ||
        srcReq.headers["x-auth-token"] ||
        srcReq.headers["x-access-token"];

      if (fallbackSessionHeader) {
        proxyReqOpts.headers["x-session-id"] = fallbackSessionHeader;
      }

      if (srcReq.user) {
        proxyReqOpts.headers["x-user-id"] = srcReq.user.userId;
        proxyReqOpts.headers["x-user-email"] = srcReq.user.email;
        proxyReqOpts.headers["x-user-avatar"] = srcReq.user.avatar;
      }

      return proxyReqOpts;
    },
  });
};