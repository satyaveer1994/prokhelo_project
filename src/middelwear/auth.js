const jwt = require("jsonwebtoken");

// const authentication = async function (req, res, next) {
//     try {
//         const token = res.setHeader["x-api-key"];
//         if (token) {
//             const decoded = jwt.verify(token,'prokhelo')
//             if (decoded) {
//                 req.decodedToken = decoded
//             }
//             else {
//                 return res.status(401).send({ status: false, msg: "invalid authentication token" })
//             }
//         }else{
//             return res.status(403).send({ status: false, message: `Missing authentication token in request` })
//         }
//         next()
//     } catch (error) {
//         return res.status(500).send({ status: false, msg: error.message })
//     }
// }

const authenticaiton = async function (req, res, next) {
  try {
    // validating token --
    const token = req.cookies["x-auth-token"];
    if (!token)
      return res
        .status(401)
        .send({
          stauts: false,
          message: "please login first, to generate or view orders ",
        });

    jwt.verify(token, "prokhelo", (error, token) => {
      if (error)
        return res.status(401).send({ status: false, message: error.message });
      req.id = token.userId;
      next();
    });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

module.exports.authenticaiton = authenticaiton;
