const express = require("express");
const bodyParser = require("body-parser");
const qraphqlHttp = require("express-graphql");
const mongoose = require("mongoose");

const mySchema = require('./graphql/schema');
const myResolvers = require('./graphql/resolvers');
const isAuth = require('./middleware/is-auth');

const app = express();

app.use(bodyParser.json());

app.use(isAuth);

app.use(
  "/graphql",
  qraphqlHttp({
    schema: mySchema,
    rootValue: myResolvers,
    graphiql: true
  })
);

mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_USER}:${
      process.env.MONGO_PASSWORD
    }@project0-ld84z.mongodb.net/${process.env.MONGO_DB}?retryWrites=true`,
    { useNewUrlParser: true }
  )
  .then(() => {
    app.listen(3000);
  })
  .catch(err => {
    console.log(err);
  });
