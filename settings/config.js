module.exports = {
  token: `${process.env.TOKEN}`, // Main Token
  //token: `${process.env.DEVTOKEN}`, // Dev Token
  logs: "1004704810811002910",
  mongo: `${process.env.MONGOOSE}`,
  ArtieAPI: {
    url: `${process.env.API_URL}`,
    key: `${process.env.API_KEY}`,
    id: `${process.env.API_ID}`,
  },
  Admins: ["510065483693817867", "896951964234043413"],
};
