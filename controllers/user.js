const User = require("../models/User");


exports.join = async (req, res) => {
  try {
    res.render("create-user", {errors: {}});
  } catch (e) {
    res.status(404).send({
      message: `could not generate create data`,
    });
  }
};

exports.create = async (req, res) => {
  try {
    const user = await User.findById(req.body._id);
    await User.create({
      email: req.body.email,
      password: req.body.password
    })
    res.redirect('/index/?message=user has been created')
  } catch (e) {
    if (e.errors) {
      res.render('join', {errors: e.errors})
      return;
    }
    return res.status(400).send({
      message: "Could not save user",
    });
  }
};