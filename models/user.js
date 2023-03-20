const { model, Schema } = require("mongoose");
const Joi = require("joi");

const { handleError } = require("../helpers");

const emailRegex =
  /^(?!.*@.*@.*$)(?!.*@.*--.*\..*$)(?!.*@.*-\..*$)(?!.*@.*-$)((.*)?@.+(\..{1,11})?)$/;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      match: emailRegex,
      unique: true,
    },
    password: {
      type: String,
      minlenght: 6,
      required: [true, "Set password for user"],
    },
    subscription: {
      type: String,
      enum: ["starter", "pro", "business"],
      default: "starter",
    },
    token: String,
    default: null,
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

userSchema.post("save", handleError);

const registerSchemaJoi = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required().pattern(emailRegex),
  password: Joi.string().min(6).required(),
  subscription: Joi.string().required(),
});

const loginSchemaJoi = Joi.object({
  email: Joi.string().required().pattern(emailRegex),
  password: Joi.string().min(6).required(),
});

const updateSubscriptionSchemaJoi = Joi.object({
  subscription: Joi.string().valid("starter", "pro", "business").required(),
});

const User = model("user", userSchema);

module.exports = {
  User,
  registerSchemaJoi,
  loginSchemaJoi,
  updateSubscriptionSchemaJoi,
};
