const jwt = require("jsonwebtoken");

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader?.startsWith("Bearer ")) return res.sendStatus(401);

  // get token which is after the space
  const token = authHeader.split(" ")[1];
  console.log({ verifier: authHeader });

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    console.log({ decoded: JSON.stringify(decoded) });
    if (err) return res.sendStatus(403); //invalid token
    console.log({ errorMessage: err });
    req.user = decoded.UserInfo.username;
    req.roles = decoded.UserInfo.roles;
    next();
  });
};

module.exports = verifyJWT;
