const express = require("express");
const UserSchema = require("./Schema");
const passport = require("passport")
const fetch = require('node-fetch')

const { authenticate} = require("../auth/tools")
const { authorize } = require("../auth/middleware")

const userRouter = express.Router();

// get all users
userRouter.get("/", async (req, res, next) => {

  try {
    let response = await fetch(
      `https://deezerdevs-deezer.p.rapidapi.com/genre/` + "Rock" + `/artists`,
      {
        method: "GET",
        headers: {
          "x-rapidapi-key": process.env.API_KEY,
          "x-rapidapi-host": "deezerdevs-deezer.p.rapidapi.com",
        }}
        );
        let artist = await response.json();
        res.status(200).send(artist.data)


    
  } catch (error) {
    next(error);
    
  }
  // try {
  //   const users = await UserSchema.find();
  //   res.status(200).send(users);
  // } catch (error) {
  //   next(error);
  // }
});

userRouter.get(
  "/spotifyLogin",
  passport.authenticate("spotify", { scope: ['user-read-email', 'user-read-private'] })
)

// userRouter.get(
//   "/spotifyRedirect",
//   passport.authenticate("spotify"),
//   async (req, res, next) => {
//     try {
    
//       res.cookie("accessToken", req.user.tokens.accessToken, {
//         httpOnly: true,
//       })
//       // res.cookie("refreshToken", req.user.tokens.refreshToken, {
//       //   httpOnly: true,
//       //   path: "/authors/refreshToken",
//       // })
//        res.status(200).redirect("http://localhost:3000/")
//       // res.redirect("http://localhost:3000/"+"?accessToken="+req.user.tokens.accessToken) -->without cookies shitty method:D
//     } catch (error) {
//       next(error)
//     }
//   }
// )

userRouter.get(
  "/googleLogin",
  passport.authenticate("google", { scope: ["profile", "email"] })
)

userRouter.get(
  "/googleRedirect",
  passport.authenticate("google"),
  async (req, res, next) => {
    try {
    
      res.cookie("accessToken", req.user.tokens.accessToken, {
        httpOnly: true,
      })
      // res.cookie("refreshToken", req.user.tokens.refreshToken, {
      //   httpOnly: true,
      //   path: "/authors/refreshToken",
      // })
       res.status(200).redirect("http://localhost:3000/")
      // res.redirect("http://localhost:3000/"+"?accessToken="+req.user.tokens.accessToken) -->without cookies shitty method:D
    } catch (error) {
      next(error)
    }
  }
)

// get single user
userRouter.get("/me", authorize,async (req, res, next) => {
  try {
    res.send(req.user);
  } catch (error) {
    next(error);
  }
});



// edit user
userRouter.put("/me", authorize,async (req, res, next) => {
  try {
    const updates = Object.keys(req.body);
    updates.forEach((update) => (req.user[update] = req.body[update]));
    await req.user.save();
    res.send(res.user);
    res.send(updates);
  } catch (error) {
    next(error);
  }
});

// delete user
userRouter.delete("/me",authorize, async (req, res, next) => {
  try {
    await res.user.deleteOne();
    res.status(204).send("Delete");
  } catch (error) {
    next(error);
  }
});

//post a new user
userRouter.post("/", async (req, res, next) => {
  try {
    
    const newUser = new UserSchema(req.body)
    const { _id } = await newUser.save()

    res.status(201).send(_id)
  } catch (error) {
    next(error)
  }
})

userRouter.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body
    const user= await UserSchema.findByCredentials(email, password)
    console.log(user)
    const {accessToken} = await authenticate(user)
    console.log(accessToken)
    // without cookies res.send(tokens)
    //  Send back tokens
     res.cookie("accessToken", accessToken, {
      httpOnly: true,
      path: "/",
    })
    // res.cookie("refreshToken", refreshToken, {
    //   httpOnly: true,
    //   path: "/users/refreshToken",
    // })

    res.send(accessToken)
  } catch (error) {
    next(error)
  }
})



module.exports = userRouter;
