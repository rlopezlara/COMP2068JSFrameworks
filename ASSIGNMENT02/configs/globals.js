// require and initialize dotenv
require("dotenv").config();
// create configuration object
const configurations = {
  ConnectionStrings: {
    MongoDB: process.env.CONNECTION_STRING_MONGODB,
  }, // github auth configuration
  GithubAuth: {
    clientId: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackUrl: process.env.GITHUB_CALLBACK_URL,
  },
};
// export configuration object (make it available for use in app.js)
module.exports = configurations;
