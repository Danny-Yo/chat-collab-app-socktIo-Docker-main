// src/middleware/checkAuth.js
module.exports = function checkAuth(req, res, next) {
  // get device IP
  const ip = req.ip;
  // TODO: check if ip is authenticated in a simple memory store
  if (!global.authenticatedIPs) global.authenticatedIPs = new Set();

  if (global.authenticatedIPs.has(ip)) return next();
  
  // redirect to login page if not authenticated
  res.redirect('http://<host-ip>:5173'); 
};
