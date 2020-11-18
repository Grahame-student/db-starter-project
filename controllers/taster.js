const Taster = require("../models/Taster");

exports.list = async (req, res) => {
  const message = req.query.message;
  try {
    const tasters = await Taster.find({});
    res.render("tasters", {tasters: tasters, message:message});
  } catch (e) {
    res.status(404).send({message: "could not list tasters"});
  }
};

exports.delete = async (req, res) => {
  const id = req.params.id;
  try {
    await Taster.findByIdAndRemove(id);
    res.redirect("/tasters");
  } catch (e) {
    res.status(404).send({
      message: `could not delete record ${id}.`,
    });
  }
};

exports.create =  async (req, res) => {
  let taster = new Taster({name: req.body.name, twitter: req.body.twitter});
  try {
    await taster.save();
    res.redirect('/tasters/?message=taster has been created');
  } catch (e) {
    return res.status(400).send({
      message: JSON.parse(e),
    })
  }
};
