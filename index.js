const Twitter = require("twit");
const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());

dotenv.config();

const client = new Twitter({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token: process.env.ACCESS_TOKEN_KEY,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET
});
const PORT = process.env.PORT || 3000;

const keywords = process.env.KEYWORDS ? process.env.KEYWORDS.split(",").map(i=>i.replace(/^\s+/, "").replace(/\s$/, "")) : require("./keywords.json");

let stream = client.stream("statuses/filter", {track: keywords});
let emojiCount = {};
let tweets = {};
let latestTweets = [];

stream.on("connect", event => {
  console.info("Trying to connect to Twitter...");
});

stream.on("connected", event => {
  console.info("Connected to twitter");
  console.info(`Tracking keywords: ${keywords}`);
});

stream.on("tweet", event => {
  console.info("Got one: ", event.text);
  latestTweets.push(event.text);
  if (latestTweets.length > 3) latestTweets.shift();
  let emojis = event.text.match(/\ud83d[\ude00-\ude4f]/g);
  console.log(emojis ? `Emojis: ${emojis}` : "No emoji found");
  if (emojis) {
    emojis.map(emoji => {
      emojiCount[emoji] ? emojiCount[emoji] = emojiCount[emoji] + 1 : emojiCount[emoji] = 1;
      tweets[emoji] ? tweets[emoji].push(event.text) : tweets[emoji] = [event.text];
      if(tweets[emoji].length > 3) {
        tweets[emoji].splice(0,1);
      }
    });
  }
});

app.get("/emojis", (req, res) => {
  res.status(200).send(emojiCount);
});

app.get("/tweets", (req, res) => {
  res.status(200).send(tweets);
});

app.get("/tweets/latest", (req, res) => {
  res.status(200).send(latestTweets);
});

app.get("/keywords", (req, res) => {
  res.status(200).send(keywords);
});

app.get("/emojis/top/:num?", (req, res) => {
  let num = req.params.num || 3;
  let sortable = [];
  for (let emoji in emojiCount) {
      sortable.push([emoji, emojiCount[emoji]]);
  }
  
  sortable.sort((a, b) => a[1] > b[1] ? -1 : 1);
  console.log(sortable);

  let total = 0;
  sortable.map(item => {
    total += item[1];
  });

  let result = "The top three emojis for your keywords are ";
  for (let i = 0; i < Math.min(sortable.length, num); i++) {
    console.log(sortable[i]);
    result += `${sortable[i][0]} (${Math.round(sortable[i][1]/total*100)}%) `;
  }
  result += String.fromCharCode(13) + String.fromCharCode(10);
  result += `Tracked keywords: ${keywords.join(", ")}`

  res.status(200).send(result);
});

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
