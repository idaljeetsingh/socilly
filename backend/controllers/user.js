const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user")

exports.createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10,)
    .then(hash => {
      const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hash
      });
      user.save()
        .then(result => {
          res.status(201).json({
            message: 'User Created',
            result: result
          });
        })
        .catch(err => {
          res.status(500).json({
            error: err,
            message: 'User Already registered'
          });
        });
    })
}

exports.loginUser = (req, res, next) => {
  let fetchedUser;
  User.findOne({email: req.body.email})
    .then(user => {
      if (!user) {
        return res.status(401).json({
          message: "Authentication Failed"
        });
      }
      fetchedUser = user;
      return bcrypt.compare(req.body.password, user.password);
    })
    .then(result => {
      if (!result) {
        return res.status(401).json({
          message: "Authentication Failed"
        });
      }
      // CREATE JWT
      const token = jwt.sign(
        {
          email: fetchedUser.email,
          userId: fetchedUser._id
        },
        '3k56bj4r456wrktb53kthb4k3b734rg2h67b-4h67bh342k7',
        {expiresIn: '1h'}
      );
      res.status(200).json({
        token: token,
        expiresIn: 3600,
        name: fetchedUser.name,
        userId: fetchedUser._id
      });
    })
    .catch(err => {
      return res.status(401).json({
        message: "Authentication Failed"
      });
    });
}
