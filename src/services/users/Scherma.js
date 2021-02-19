const { Schema, model } = require("mongoose");
const Bcrypt = require("bcryptjs");

const UserSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
      min: 6,
    },
    refreshTokens: [
      {
        token: {
          type: String,
        },
      },
    ],
  },
  { timestamps: true }
);

// compare the user passwords
UserSchema.statics.findByCredentials = async function (email, password) {
  const user = await this.findOne({ email });

  if (user) {
    const isMatch = await Bcrypt.compare(password, user.password);

    if (isMatch) return user;
    return null;
  } else {
    return null;
  }
};

UserSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();

  delete userObject.password;
  delete userObject__v;

  return userObject;
};

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = Bcrypt.hashSync(this.password, 10);
  next();
});

module.exports = model("user", UserSchema);
