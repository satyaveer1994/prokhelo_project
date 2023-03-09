const userModel = require("../model/userModel");
const validator = require("../middelwear/validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const createProfile = async function (req, res) {
  try {
    let data = req.body;
    if (Object.keys(data).length === 0) {
      return res.status(400).send({
        status: false,
        message: "Please enter Data like tile,fullname etc",
      });
    }
    const { name, email, password } = data;

    if (!validator.isValid(name)) {
      return res
        .status(400)
        .send({ status: false, massage: "please enter name" });
    }

    if (!validator.isValid(email)) {
      return res
        .status(400)
        .send({ status: false, massage: "please enter email" });
    }
    if (!validator.isValidEmail(email)) {
      return res.status(400).send({
        status: false,
        massage: "please enter correct email like:- abc@gmail.com",
      });
    }

    // checking unique
    const user = await userModel.findOne({ email: email });
    if (user) {
      return res
        .status(400)
        .send({ status: false, message: "email already in use" });
    }

    if (!validator.isValid(password)) {
      return res
        .status(400)
        .send({ status: false, massage: "please enter password" });
    }
    if (password.length < 6 || password.length > 15) {
      return res.status(400).send({
        status: false,
        massage: "please length should be 6 to 15 password",
      });
    }
    const hash = bcrypt.hashSync(password, 6);
    data.password = hash;

    let createUser = await userModel.create(data);
    return res
      .status(201)
      .send({ status: true, message: "successful", data: createUser });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    Data = req.body;

    if (Object.keys(Data) == 0) {
      return res.status(400).send({
        status: false,
        message: "Please provide email id or password",
      });
    }
    const { email, password } = Data;
    if (!validator.isValid(email)) {
      return res
        .status(400)
        .send({ status: false, message: `Email is required` });
    }
    if (!validator.isValidEmail(email)) {
      return res
        .status(400)
        .send({ status: false, message: `Email is not correct ` });
    }

    if (!validator.isValid(password)) {
      res.status(400).send({ status: false, message: `password is required` });
      return;
    }

    const user = await userModel.findOne({ email: email });
    if (!user) {
      return res.status(401).send({ status: false, message: "email is wrong" });
    }
    const decrpted = bcrypt.compareSync(password, user.password);
    if (decrpted == true) {
      const token = jwt.sign(
        {
          UserId: user._id,
        },
        "prokhelo"
      );

      res.cookie("x-auth-token", token);

      res
        .status(200)
        .send({ status: true, message: "login Successful", token: token });
    } else {
      res.status(400).send({ status: false, message: "password is incorrect" });
    }
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

const getUser = async function (req, res) {
  try {
    const data = req.query;
    if (Object.keys(data) == 0)
      return res.status(400).send({ status: false, msg: "No input provided" });

    const user = await userModel.find({
      $and: [data, { isDeleted: false }],
    });

    if (user.length == 0)
      return res.status(404).send({ status: false, msg: "No user Available." });
    return res.status(200).send({ status: true, data: user });
  } catch (error) {
    return res.status(500).send({ status: false, msg: error.message });
  }
};

//////////////////////////////////////////////////
const updateUser = async function (req, res) {
  try {
    //Validate: The userId is present in request path params or not.
    let user_Id = req.params.userId;
    if (!user_Id)
      return res
        .status(400)
        .send({ status: false, msg: "user Id is required" });

    //Validate: The userId is valid or not.
    let user = await userModel.findById(user_Id);
    if (!user)
      return res
        .status(404)
        .send({ status: false, msg: "user does not exists" });

    //Validate: If the userId exists (must have isDeleted false)
    let is_Deleted = user.isDeleted;
    if (is_Deleted == true)
      return res
        .status(404)
        .send({ status: false, msg: "user is already deleted" });

    //Updates a user by changing the its name, body, adding phone,
    let name = req.body.name;
    let email = req.body.email;
    let updateduser = await userModel.findOneAndUpdate(
      { _id: user_Id },
      {
        $set: {
          name: name,
          email: email,
        },
      },
      { new: true }
    );
    //Sending the updated response
    return res.status(200).send({ status: true, data: updateduser });
  } catch (err) {
    console.log("This is the error :", err.message);
    return res
      .status(500)
      .send({ status: false, msg: " Server Error", error: err.message });
  }
};

/////////////////////////////////////////////////

module.exports = { createProfile, loginUser, getUser, updateUser };
