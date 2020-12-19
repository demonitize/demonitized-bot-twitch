const tmi = require("tmi.js");
require("dotenv").config();
const fs = require("fs");
const express = require("express");
const app = express();
const fetch = require('node-fetch')
// process.exit(0)
const opts = {
  options: { debug: true },
  connection: {
    reconnect: true,
    secure: true
  },
  identity: {
    username: process.env.USER_NAME,
    password: `oauth:${process.env.USER_PWD}`
  },
  channels: [
    "DEMONITIZED_BOI",
    "hen_zoid",
    "sporkerific",
    "Sohinki",
    "caaiity",
    "Emmyuh",
    "trollfarts__",
    "slimmythicccccccc",
    "ArtemisShadoweStorm",
    "bridgetgoes",
    "Ladydewinter02",
    "dinnerbone",
    "BASETRADETV",
    "Discord",
    "Aeywoo",
    "grandpoobear",
    "ConnorsLive",
    "phoenixsclive",
    "mrquestion11",
    "duckhunterone",
    "PastelsDarling",
    "bemz_mc",
    "nightbotuhc",
    "quimbly3",
    "ReportCardsMC",
    "moonshoook",
    "Moonzy_Cat",
    "KaraCorvus",
    "not_3than",
    "double0negative",
    "AntVenom",
    "heartashley",
    "Sethbling",
    "theanonymousrory",
    "billxcd",
    "volffbrian",
    "uidseaStream",
    "daddosaurus_",
    "Kirozeru",
    "thegrim_reaper7",
    "Tmob03",
    "connortron110",
    "rossmanngroup",
    "picard65",
    "dragonandthewolves",
    "ranger10700",
    "gaminglanelive",
    "OyasumiYuni",
    "Protroid",
    "dorb",
    "c_doug",
    "Lurxx",
    "drevery",
    "cubbity_first",
    "Chubbss_",
    "jano_gamer27",
    "jakeroper",
    "osteoporosis_x_anxiety",
    "vlsaria",
    "TheChoif",
    "sidefury",
    "fakebeanie",
    "elliespectacular",
    "ugyuu"
    // "primes__"
  ]
};

const client = new tmi.client(opts);

// Register our event handlers (defined below)
client.on("message", onMessageHandler);
client.on("connected", onConnectedHandler);

// Connect to Twitch:
client.connect();

// Called every time a message comes in
function onMessageHandler(target, context, msg, self, tags, user, userstate) {
  if (self) {
    return;
  } // Ignore messages from the bot

  // Remove whitespace from chat message
  const hk = msg.split(" ");
  const args = hk.splice(0, 2);
  args.join(" ");

  const command = msg.trim();

  switch (command) {
    case "??titty-map":
      client.say(
        target,
        "https://cdn.discordapp.com/attachments/723656279729504259/732324830233362452/Titty_Map.mp4"
      );
      break;
    case "??action":
      client.action(
        target,
        "This is an action. IDK what it does but lets find out"
      );
      break;
    case "??eval":
      client.say(target, "No. I don't think I will");
      break;
    case "??reboot":
      client.say(target, "Rebooting system. Please wait...");
      client.disconnect();
      break;
    case "??d20":
      const num = rollDice(command);
      client.say(target, `You rolled a ${num}.`);
      break;
    case "??smoke":
      client.say(target, "ﱞﱞﱞﱞﱞﱞﱞﱞﱞﱞﱞﱞﱞﱞﱞﱞﱞﱞﱞﱞﱞﱞﱞﱞﱞﱞﱞﱞﱞﱞﱞﱞﱞ:");
      break;
    case "??version":
      client.say(target, "Bot currently on version 0.7.3 [DELTA]");
      break;
    case "??rickashley":
      client.say(
        target,
        "https://cdn.discordapp.com/attachments/624685352749105152/708480168464875520/rickashley.mp4"
      );
      break;
    case "??help":
      client.say(
        target,
        "Please purchase the help DLC for $420.69 to use this command"
      );
      break;
    case "??minehut":
      client.say(target, "https://discord.com/invite/minehut");
      break;
    case "??slg":
      client.say(target, "https://discord.com/invite/joinsuperleague");
      break;
    case "??host" || "??h":
      client.say(target, `Now hosting ${target}`);
      client.host(opts.identity.username, target);
      break;
    case "??owner":
      client.say(target, "Bot owned by DEMONITIZED_BOI");
      break;
    case "??ok":
      client.say(target, "https://www.youtube.com/watch?v=Ieuy9SZaFrY");
      break;
    case "??uptime":
      client.say(
        target,
        "Please purchase the uptime DLC for $420.69 to use this command"
      );
      break;
    case "??mods":
      client
        .mods(target)
        .then(data => {
          client.say(target, `${data}`);
        })
        .catch(err => {
          console.log(err);
        });
      break;
    case "??forcecrash":
      client.say(target, "Crashing bot");
      client.disconnect();
      break;
    case "??follow":
      client.say(target, `Now following ${target}`);
      break;
    case "??pog":
      client.say(target, "henzoiPoglin henzoiPoglin henzoiPoglin");
      break;
    case "??tea":
      client.say(target, "henzoiTeaTime henzoiTeaTime henzoiTeaTime");
      break;
    case "??cringe":
      client.say(target, "henzoiCringe henzoiCringe henzoiCringe");
      break;
    case "??pastel":
      client.say(
        target,
        "Shhhh! Don't tell anyone but PastelsDarling is really cool and you should follow them"
      );
      break;
    case "??squid":
      client.say(target, "The Squid has come to scare");
      break;
    case "??downtime":
      client.say(
        target,
        "The downtime is, well, it's complicated. The number is 340,282,366,920,938,463,463,374,607,431,768,211,455"
      );
      break;
    case "??minecraft" || "??mc":
      client.say(target, "https://discord.com/invite/minecraft");
      break;
    case "??part" || "??leave":
      client
        .say(
          target,
          "Disconnecting from channel. Please contact Demonitized_Boi to be permanently removed from the list"
        )
        .then(() => {
          client.part(target);
          console.log(
            `A request was sent to disconnect from ${target}. I have left the channel.`
          );
        });
      break;
    case "??hssp":
      if (target == "#hen_zoid" || target == "hen_zoid") {
        client.say(
          target,
          "Do you like the stream music? If you do, then here is the link to the playlist! youtube.com/playlist?list=PLzRMuCNGroGv7yCuCP5BxYIpg9luF5U8b"
        );
        } else {
          return;
        }
      break;
    case "??lmms":
      if (target == "#hen_zoid" || target == "hen_zoid") {
        client.say(
          target,
          "Do you like the music that Henzoid makes? Do you want to make your own music? If you answered yes then you're in luck! Go to lmms.io and download LMMS to get started making your own music today!"
        );
      } else {
        return;
      }
      break;
    case "??donate":
      if (target == "#hen_zoid" || target == "hen_zoid") {
        client.say(
          target,
          "Do you want to donate to my 'get a computer that doesn't fucking lag during every stream' fund? Wait you do! Here's the link! ko-fi.com/henzoid"
        );
      } else {
        return
      }
      break;
      case "??mcstacker":
        if (target == "#hen_zoid" || target == "hen_zoid") {
          client.say(target, "Do you want to make your own Minecraft maps? Do you strugle with commands? Do you wish there was an easy way to get extremely fucking overpowered items? If you do, then mcstacker.net is for you!");
        } else {
          return;
        }
        break;
        case "??pyxel":
          if (target == "#hen_zoid" || target == "hen_zoid") {
            client.say(target, "Do you like the art henzoid makes? Do you want to make your own art? If you said yes, then check out Pyxel! You can buy it at pyxeledit.com")
          } else {
            return;
          }
          break;
  }
}

function followUser(user, account) {}

// Function called when the "dice" command is issued
function rollDice() {
  const sides = 20;
  return Math.floor(Math.random() * sides) + 1;
}

// Called every time the bot connects to Twitch chat
function onConnectedHandler(addr, port) {
  console.log(`* Connected to ${addr}:${port}`);
}

var session = require("express-session");
var passport = require("passport");
var OAuth2 = require("passport-oauth").OAuth2Strategy;
var request = require("request");
var handlebars = require("handlebars");
const Database = require("better-sqlite3");

const db = new Database('storage.db', {verbose: console.log });

// Define our constants, you will change these with your own
const TWITCH_CLIENT_ID = process.env.CLIENT_ID;
const TWITCH_SECRET = process.env.TWITCH_SECRET;
const SESSION_SECRET = process.env.SESSION_SECRET;
const CALLBACK_URL = process.env.CALLBACK_URL;

// Initialize Express and middlewares
app.use(
  session({ secret: SESSION_SECRET, resave: false, saveUninitialized: false })
);
app.use(express.static("public"));
app.use(passport.initialize());
app.use(passport.session());



// Override passport profile function to get user profile from Twitch API
OAuth2.prototype.userProfile = function(accessToken, done) {
  var options = {
    url: "https://api.twitch.tv/helix/users",
    method: "GET",
    headers: {
      "Client-ID": TWITCH_CLIENT_ID,
      Accept: "application/vnd.twitchtv.v5+json",
      Authorization: "Bearer " + accessToken
    }
  };

  request(options, function(error, response, body) {
    if (response && response.statusCode == 200) {
      done(null, JSON.parse(body));
    } else {
      done(JSON.parse(body));
    }
  });
};

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

passport.use(
  "twitch",
  new OAuth2(
    {
      authorizationURL: "https://id.twitch.tv/oauth2/authorize",
      tokenURL: "https://id.twitch.tv/oauth2/token",
      clientID: TWITCH_CLIENT_ID,
      clientSecret: TWITCH_SECRET,
      callbackURL: CALLBACK_URL,
      state: true
    },
    function(accessToken, refreshToken, profile, done) {
      profile.accessToken = accessToken;
      profile.refreshToken = refreshToken;

      db.prepare(`INSERT INTO users (profile, accessToken, refreshToken) VALUES (${profile}, ${accessToken}, ${refreshToken})`);

      // Securely store user profile in your DB
      //User.findOrCreate(..., function(err, user) {
      //  done(err, user);
      //});

      done(null, profile);
    }
  )
);

// Set route to start OAuth link, this is where you define scopes to request
app.get(
  "/auth/twitch",
  passport.authenticate("twitch", { scope: "user_read" })
);

app.get("/auth/discord", (request, response) => {
  
});

app.post("/auth/twitch/update", (request, response) => {
  let params = {
    "code": request.params.code,
    "scope": request.params.scope,
    "state": requset.params.state
  }



});

app.post("/auth/twitch/fetch", (request, response) => {

});

app.post("/auth/discord/update", (request, response) => {
  let params = {
    "code": request.params.code,
    "scope": request.params.scope,
    "state": requset.params.state
  }

  
});

app.post("/auth/discord/fetch", (request, response) => {

})
// Set route for OAuth redirect
app.get(
  "/auth/twitch/callback",
  passport.authenticate("twitch", {
    successRedirect: "/",
    failureRedirect: "/"
  })
);

function discordAuth(accessToken, done) {
  OAuth2.prototype.userProfile = function() {
    var options = {
      url: "https://api.twitch.tv/helix/users",
      method: "GET",
      headers: {
        "Client-ID": TWITCH_CLIENT_ID,
        Accept: "application/vnd.twitchtv.v5+json",
        Authorization: "Bearer " + accessToken
      }
    };

    
  
    request(options, function(error, response, body) {
      if (response && response.statusCode == 200) {
        done(null, JSON.parse(body));
      } else {
        done(JSON.parse(body));
      }
    });
  };
}

// Define a simple template to safely generate HTML with values from user's profile
var template = handlebars.compile(`
<html><head><title>Twitch Account Link</title></head>
<table>
    <tr><th>Access Token</th><td>{{accessToken}}</td></tr>
    <tr><th>Refresh Token</th><td>{{refreshToken}}</td></tr>
    <tr><th>Display Name</th><td>{{display_name}}</td></tr>
    <tr><th>Bio</th><td>{{bio}}</td></tr>
    <tr><th>Image</th><td>{{logo}}</td></tr>
</table></html>`);

// If user has an authenticated session, display it, otherwise display link to authenticate
app.get("/", function(req, res) {
  if (req.session && req.session.passport && req.session.passport.user) {
    res.send(template(req.session.passport.user));
  } else {
    res.sendFile(__dirname + "/views/index.html");
  }
});

app.listen(3000, function() {
  console.log("Twitch auth sample listening on port 3000!");
});
