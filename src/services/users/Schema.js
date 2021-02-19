const { Schema, model } = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new Schema(
  {
    name: {
      type: String
    },
    surname: {
      type: String
    },
    email: {
      type: String
    },
    password: {
      type: String
    },
    googleId:{
      type:String
    },
    spotifyId:{
      type:String
    }
    // refreshTokens: [
    //   {
    //     token: {
    //       type: String,
    //     },
    //   },
    // ],
  },
  { timestamps: true }
);


UserSchema.methods.toJSON = function () {
  const user = this
  const userObject = user.toObject()

  delete userObject.password
  delete userObject.__v

  return userObject
}

UserSchema.pre("save", async function (next) {
  const user= this
  const plainPW = user.password

  if (user.isModified("password")) {
    user.password = await bcrypt.hash(plainPW, 10)
  }
  next()
})

UserSchema .statics.findByCredentials = async function(email, plainPW)  {
  const user = await this.findOne({ email })
  
  if (user) {
    const isMatch = await bcrypt.compare(plainPW, user.password)
    console.log("isMatch?",isMatch)
    if (isMatch) 
    return user
    else return null
  } else {
    return null
  }
}



module.exports = model("user", UserSchema);
