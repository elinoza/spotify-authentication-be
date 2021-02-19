const passport = require("passport")
const GoogleStrategy = require("passport-google-oauth20").Strategy
const SpotifyStrategy =require("passport-spotify").Strategy
const UserSchema = require("../users/Schema")
const { authenticate } = require("./tools")

passport.use(
  "google",
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      callbackURL: "http://localhost:3005/users/googleRedirect",
    },
    async (request, accessToken, refreshToken, profile, next) => {
     

      try {
        const user = await UserSchema.findOne({ googleId: profile.id })

        if (user) {
          const tokens = await authenticate(user)
          next(null, { user, tokens })
        } else {
        const newUser = {
                googleId: profile.id,
                name: profile.name.givenName,
                surname: profile.name.familyName,
                email: profile.emails[0].value,
                // refreshToken:[]
           }
          const createdUser =  new UserSchema(newUser)
          await createdUser.save()
          const tokens = await authenticate(createdUser)
          
          next(null, { user: createdUser, tokens })
        }
      } catch (error) {
          console.log(error)
        next(error)
      }
    }
  )
)

passport.use(
    new SpotifyStrategy(
      {
        clientID: process.env.SPOTIFY_ID,
        clientSecret: process.env.SPOTIFY_SECRET,
        callbackURL: 'http://localhost:3005/users/spotifyRedirect'
      },
      async (request, accessToken, refreshToken, profile, next) => {
     

        try {
          const user = await UserSchema.findOne({ spotifyId: profile.id })
      
  
          if (user) {
            const tokens = await authenticate(user)
            console.log("tokens",tokens)
            next(null, { user, tokens })
          } else {
          const newUser = {
                  spotifyId: profile.id,
                  name: profile.displayName, 
                //   surname: profile.name.familyName,
                  email: profile.email
                  // refreshToken:[]
             }
            const createdUser =  new UserSchema(newUser)
            await createdUser.save()
            const tokens = await authenticate(createdUser)
            
            next(null, { user: createdUser, tokens })
          }
        } catch (error) {
            console.log(error)
          next(error)
        }
      }
    )
  );

passport.serializeUser(function (user, next) {
  next(null, user)
})