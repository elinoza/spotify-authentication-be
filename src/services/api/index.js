const express = require("express");
const fetch = require("node-fetch");

const artistRouter = express.Router();


artistRouter.get("/", async (req, res, next) => {
  try {
    const response = await fetch(
      `https://deezerdevs-deezer.p.rapidapi.com/genre/` + "Rock" + `/artists`,
      {
        headers: {
          "x-rapidapi-key":
            "7058b459femsh8bbc3e5e09ff45bp16ae10jsnaa8151340a4c",
          "x-rapidapi-host": "deezerdevs-deezer.p.rapidapi.com",
        },
      }
    );
    const artist = await response.json();
    res.send(artist.data);
  } catch (error) {
    next(error);
  }
});

module.exports = artistRouter;
