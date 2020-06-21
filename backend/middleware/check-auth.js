const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, '3k56bj4r456wrktb53kthb4k3b734rg2h67b-4h67bh342k7');
    req.userData = {email: decodedToken.email, userId: decodedToken.userId};
    next();
  } catch (e) {
    res.status(401).json({
      message: 'Invalid Token'
    });
  }
};
