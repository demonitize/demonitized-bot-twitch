const tmi = require("tmi.js");
require("dotenv").config();
const fs = require("fs");
const express = require("express");
const os = require('os');
const app = express();
const fetch = require('node-fetch'); // depracated but i refuse to learn a new API
const escapeRegex = str => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const sql = require("sqlite3"); // no use but its here so, thats nice i guess
const prefix = "??";
const configuration = require('./config.json');
const packageJson = require('./package.json');
// var henzoidNightbot = 1; 
var quimSwear = 35;
var quimCrash = 2; // too lazy to set up SQL for swear counter and crash counter. manually change every week
let phasmoCode = `000000`; // Default to unset code.
var chnlLockdown = false; // Default to lockdown being disabled.

// Henzoid map command data. 

// "name": "Undertale but it's just the puzzles, and the puzzles are harder",
// "desc": "a puzzle map with the undertale puzzles, but the puzzles are harder and more painful"

// "desc":"a Binding of Isaac-inspired, pseudorandom dungeon-crawler roguelike with items and bossfights that is NOT multiplayer compatible"

// "desc":"a puzzle map where you have to switch between the color world and grey (gray) world and solve puzzles using light and color as a mechanic. Black Bastion is still on hold while Henzoid goes to therapy due to the emotional trauma it caused him. Also it's a collaboration with CrazyCowMM"

// "name": "CryptsNCreepers",
// "desc": "a modded SMP with a story but the SMP isn't regular minecraft, it's a turn-based RPG with teams."

const opts = {
	options: {
		debug: true,
		clientId: process.env.CLIENT_ID
	},
	connection: {
		reconnect: true,
		maxReconnectAttempts: 10,
		maxReconnectInterval: 30000,
		reconnectDecay: 1.5,
		reconnectInterval: 5000,
		secure: true
	},
	identity: {
		username: `demonitized_bot`,
		password: process.env.PASSWORD
	},
	channels: configuration.operation.channels
};

const client = new tmi.client(opts);



// Register our event handlers (defined below)
client.on("message", onMessageHandler);
client.on("connected", onConnectedHandler);
client.on("subscription", onSubHandler);
client.on("resub", onResubHandler);
client.on("cheer", onCheerHandler);
client.on("hosted", onHostedHandler);
// client.on(`subgift`, onGiftSubHandler);
client.on('submysterygift', onGiftSubMysteryHandler);
client.on('giftpaidupgrade', onGiftSubUpgradeHandler);
client.on("emotesets", (sets, obj) => {
	// Here are the emotes I can use:
	var emotesets = {
		sets: sets,
		obj: obj
	}
	console.log(`Unlocked Emote Sets: ${sets}`)
	// console.log(`Allowed Emotes: ${obj}`);
});
// Connect to Twitch:
client.connect();


// Called every time a message comes in
function onMessageHandler(target, userstate, msg, self, tags, user, context) {

	if (self) return; // Ignore messages from the bot;
	if (target == "#hen_zoid" && userstate["username"] == "nightbot") {
		client.say("#hen_zoid", "Thank you Nightbot");
	}

	if (target == "#thecasperofjacks" && configuration.commands["awoo-mode"] == true) {
		let randomizer = Math.floor(Math.random() * 9) + 1;
		switch (randomizer) {
			case 6:
			case 9:
				client.say(target, `Awooooo!!!`);
				break;
		}
	}

	// random code that does not work and im too lazy to fix - Demonitized

	// var msgID = userstate["target-msg-id"];

	// let channelClean = target.split("#");
	// channelClean = channelClean[1]	

	// var args = msg.split(" ")

	let rawargs = msg
		.trim()
		.split(/ +/);
	var uname = userstate["username"];

	// Debug for the auto-ban system

	// if (target == "#demonitized_boi") console.log(rawargs[9]);

	/*
			Scam bot message goes here for code refference 

 			Wanna become famous? Buy followers, primes and viewers on https://cutt.us/getfollows ( bigfollows . com )!

		*/

	if (rawargs[11] == "bigfollows" && rawargs[12] == "." && rawargs[13] == "com") {
		// Make this a switch statement because testing channel names like this is crap - Demonitize
		if (target == "#hen_zoid" || target == "#demonitized_boi" || target == "#peter_lgbt" || target == "#mrquestion11" || target == "#chubbss_" || target == "#trollfartsvt") {
			client.ban(target, uname, `Automaticly banned for bot. Trigger: Posting phishing link.`);
			client.say(target, `Banned ${uname} for posting phishing link.`);
		}
	}

	let prefixRegex = new RegExp(
		`^(${escapeRegex(prefix)})\\s*`
	);
	let matchedPrefix = msg.match(prefixRegex);

	var badges = JSON.stringify(userstate["badges"]);
	if (!prefixRegex.test(msg)) return;


	// var args = msg.split(" ");

	let args = msg
		.slice(matchedPrefix.length)
		.trim()
		.split(/ +/);

	const command = args.shift().toLowerCase();

	const permissions = {
		"broadcaster": badges["broadcaster"],
		"mod": badges["moderator"],
		"vip": badges["vip"],
		"subscriber": badges["subscriber"],
		"bits": badges["bits"],
		"admin": badges["admin"],
		"owner": uname == "demonitized_boi"
	}


	if (configuration.operation.blacklisted.includes(uname)) {
		client.say(target, `I'm sorry ${uname} but you are blacklisted from using the bot. Please contact DEMONITIZED BOI#6799 on Discord to appeal`);
	}


	switch (command) {
		case "ad":
		case "commercial":
			if (uname == "demonitized_boi" || uname == "pastelsdarling" || uname == "pandasdarling" || uname == "hen_zoid" || uname == "trollfartsvt") {
				client.commercial(target, 69);
				client.say(target, `Running ad / ads for 69 seconds. NGL thats kinda nice`);
			}
			break;
		case "verdux":
		case "server":
		case "ip":
			if (target == "#demonitized_boi") {
				client.say(target, `play.verdux.net`);
			}
			break;
		case "clip":
		case "create-clip":

			break;
		case "crash++":
			if (target == "#quimbly3") {
				++quimCrash;
				client.say(target, `NotLikeThis ANOTHER CRASH!? That brings the total to ${quimCrash} times the stream has crashed NotLikeThis`);
			}
			break;
		case "crash":
			if (target == "#quimbly3") {
				client.say(target, `NotLikeThis The stream has crashed ${quimCrash} times NotLikeThis`)
			}
			break;
		case "code":
			if (target == "#demonitized_boi") {
				client.say(target, `@${uname} -> The code for Phasmophobia is ${phasmoCode}. Please remember to follow Twitch ToS.`);
			}
			break;
		case "debug":
			if (uname == "demonitized_boi") {
				debugCommand(target, userstate, msg, self, tags, user, context);
			} else {
				client.say(target, `@${uname} -> You do not have the required permission to use this command.`)
			}
			break;
		case "rip":
			client.say(target, "!rip");
			break;
		case "language++":
		case "swear++":

			if (permissions.broadcaster || permissions.mod || permissions.vip || permissions.subscriber || uname == "demonitized_boi") {
				++quimSwear
				client.say(target, `NotLikeThis Somebody used their potty mouth a total of ${quimSwear} times while Quimbly3 was streaming. HOW RUDE! NotLikeThis`);
			} else {
				client.say(target, `@${uname} -> You do not have the required permission to use this command.`)
			}
			break;
		case "swear":
		case "language":
			client.say(target, `Current potty mouth violations: ${quimSwear}`);
			break;
		case "part":
		case "leave":
		case "dc":
			if (uname == "demonitized_boi" || uname == "quimbly3") {
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
			} else {
				client.say(target, `@${uname} -> You do not have the required permission to use this command. Please contact Demonitized_boi if you believe this is an error.`)
			}
			break;
		case "d20":
			const num = rollDice(command);
			client.say(target, `You rolled a ${num}.`);
			break;
		case "smoke":
			client.say(target, "ﱞﱞﱞﱞﱞﱞﱞﱞﱞﱞﱞﱞﱞﱞﱞﱞﱞﱞﱞﱞﱞﱞﱞﱞﱞﱞﱞﱞﱞﱞﱞﱞﱞ:");
			break;
		case "version":
			client.action(target, `Bot currently on version ${packageJson.version}`);
			break;
			// case "rickashley":
			//   client.say(
			//     target,
			//     "https://cdn.discordapp.com/attachments/624685352749105152/708480168464875520/rickashley.mp4"
			//   );
			//   break;
		case "help":
			client.say(
				target,
				"Please purchase the help DLC for $420.69 to use this command"
			);
			break;
		case "owner":
			client.say(target, "Bot owned by DEMONITIZED_BOI");
			break;
		case "howmuchpotdidyousmoke":
			client.say(target, "https://www.youtube.com/watch?v=Ieuy9SZaFrY");
			break;
		case "uptime":
			client.say(
				target,
				"Please purchase the uptime DLC for $420.69 to use this command"
			);
			break;
		case "squid":
			client.say(target, "The squid has come to scare");
			break;
		case "downtime":
			client.say(
				target,
				"The downtime is, well, it's complicated. The number is 340,282,366,920,938,463,463,374,607,431,768,211,455"
			);
			break;
		case "arson":
			client.say(target, `HypeFire HypeFire HypeFire BURN DA CHAT HypeFire HypeFire HypeFire`);
			break;
		case "stab":
			let message = args[0]; // The username of the person you are trying to stab.
			switch (message) {
				default:
					client.say(target, `${uname} stabbed ${message}. LUL Imagine not having a shield LUL`);
					if (permissions.broadcaster || permissions.mod || permissions.vip || uname == `demonitized_boi` /* This is only here for debugging. */ ) {
						client.timeout(target, message, 5, `Terminated by stabbing`);
					};
					break;
				case "walkernewton":
				case "WalkerNewton":
				case "Walker":
				case "walker":
					client.say(target, `${uname} tried to stab ${message} but he did not give you consent so...`);
					break;
				case "pastelsdarling":
				case "PastelsDarling":
				case "Pastel":
				case "pastel":
					client.say(target, `${uname} tried to stab ${message} but her Bisexual powers™ played an uno reverse card. BisexualPride`);
					break;
				case "sisterdarling":
				case "SisterDarling":
					client.say(target, `${uname} tried to stab ${message}, but YOU CAN'T STAB PASTEL'S SISTER because that would not be very poglin.`)
					break;
				case "quimbly3":
				case "Quimbly3":
				case "Quimbly":
				case "quimbly":
					client.say(target, `${uname} tried to stab ${message} but she already blew up the building game, so stabbing her won't end well.`);
					break;
				case "strawberys":
				case "Strawberys":
				case "Strawbs":
				case "strawbs":
					client.say(target, `${uname} tried to stab ${message} but she's already going to die since she can't survive a single stream, so there's really no need to stab her.`);
					break;
				case "demonitized_boi":
				case "DEMONITIZED_BOI":
				case "@DEMONITIZED_BOI":
				case "@demonitized_boi":
					client.say(target, `${uname} tried to stab ${message} but he created me so... no u`);
					break;
				case "corgibutts_darklorduwu":
				case "CorgiButts_DARKLORDUWU":
				case "Frosty":
				case "frosty":
					client.say(target, `${uname} tried to stab Frosty, but Frosty is smart and took your kneecaps! Also frosty stabbed ${uname}.`)
					break;
				case "elliespectacular":
				case "EllieSpectacular":
				case "Ellie":
				case "ellie":
					client.say(target, `${uname} tried to stab Ellie, but her YTP editing skills played an Uno Reverse card.`);
					break;
				case "bee":
				case "Bee":
					client.say(target, `${uname} tried to stab Bee, but that would be rude.`);
					break;
			};
			break;
		case "dark":
			client.say(target, `ducxhbcvuidgxvudgbvayuisbiugxauivgxibcausgdcaursgfigsicbiusdfvbyuv Thank you darksidegaming247 for scaring the crap out of me! I'm totally not having a forking heart attack.`);
			break;

		case "spoilers":
			if (target == "#hen_zoid" && configuration.commands["henzoid-custom"] == true) {
				if (configuration.commands["admin-commands"] == "true") {
					client.say(target, `Please remember to not post spoilers of the game. Any people who do post spoilers WILL BE PUNISHED!!! There is a reason followers only mode is on 10 minutes. Just enjoy the game, and join the Discord! discord.com/invite/Gtj6MeD`);
				};
			};
			break;

		case "spam":
			if (target == "#hen_zoid" && configuration.commands["henzoid-custom"] == true) {
				if (configuration.commands["admin-commands"] == "true") {

					client.say(target, "[SPOILER ABOVE] [SPOILER ABOVE] [SPOILER ABOVE] [SPOILER ABOVE] [SPOILER ABOVE] [SPOILER ABOVE] [SPOILER ABOVE] [SPOILER ABOVE] [SPOILER ABOVE] [SPOILER ABOVE] [SPOILER ABOVE] [SPOILER ABOVE] [SPOILER ABOVE] [SPOILER ABOVE] [SPOILER ABOVE] [SPOILER ABOVE] [SPOILER ABOVE] [SPOILER ABOVE] [SPOILER ABOVE] [SPOILER ABOVE] [SPOILER ABOVE] [SPOILER ABOVE] [SPOILER ABOVE] [SPOILER ABOVE] [SPOILER ABOVE] [SPOILER ABOVE] [SPOILER ABOVE] [SPOILER ABOVE] [SPOILER ABOVE] [SPOILER ABOVE] [SPOILER ABOVE] [SPOILER ABOVE] [SPOILER ABOVE] [SPOILER ABOVE] [SPOILER ABOVE] [SPOILER ABOVE] [SPOILER ABOVE] [SPOILER ABOVE] [SPOILER ABOVE] [SPOILER ABOVE] [SPOILER ABOVE] [SPOILER ABOVE] [SPOILER ABOVE] [SPOILER ABOVE] [SPOILER ABOVE] [SPOILER ABOVE] [SPOILER ABOVE] [SPOILER ABOVE] [SPOILER ABOVE] [SPOILER ABOVE] [SPOILER ABOVE] [SPOILER ABOVE] [SPOILER ABOVE] [SPOILER ABOVE] [SPOILER ABOVE] [SPOILER ABOVE] [SPOILER ABOVE] [SPOILER ABOVE] [SPOILER ABOVE] [SPOILER ABOVE] [SPOILER ABOVE] [SPOILER ABOVE]").then((result) => {
						setTimeout(() => {
							client.say(target, "[SPOILER ABOVE] [SPOILER ABOVE] [SPOILER ABOVE] [SPOILER ABOVE] [SPOILER ABOVE] [SPOILER ABOVE] [SPOILER ABOVE] [SPOILER ABOVE] [SPOILER ABOVE] [SPOILER ABOVE] [SPOILER ABOVE] [SPOILER ABOVE] [SPOILER ABOVE] [SPOILER ABOVE] [SPOILER ABOVE] [SPOILER ABOVE] [SPOILER ABOVE] [SPOILER ABOVE] [SPOILER ABOVE] [SPOILER ABOVE] [SPOILER ABOVE] [SPOILER ABOVE] [SPOILER ABOVE] [SPOILER ABOVE] [SPOILER ABOVE] [SPOILER ABOVE] [SPOILER ABOVE] [SPOILER ABOVE] [SPOILER ABOVE] [SPOILER ABOVE] [SPOILER ABOVE] [SPOILER ABOVE] [SPOILER ABOVE] [SPOILER ABOVE] [SPOILER ABOVE] [SPOILER ABOVE] [SPOILER ABOVE] [SPOILER ABOVE] [SPOILER ABOVE] [SPOILER ABOVE] [SPOILER ABOVE] [SPOILER ABOVE] [SPOILER ABOVE] [SPOILER ABOVE] [SPOILER ABOVE] [SPOILER ABOVE] [SPOILER ABOVE] [SPOILER ABOVE] [SPOILER ABOVE] [SPOILER ABOVE] [SPOILER ABOVE] [SPOILER ABOVE] [SPOILER ABOVE] [SPOILER ABOVE] [SPOILER ABOVE] [SPOILER ABOVE] [SPOILER ABOVE] [SPOILER ABOVE] [SPOILER ABOVE] [SPOILER ABOVE] [SPOILER ABOVE] [SPOILER ABOVE] ");
						}, 3000);
						setTimeout(() => {
							client.say(target, "[SPOILER ABOVE] [SPOILER ABOVE] [SPOILER ABOVE] [SPOILER ABOVE] [SPOILER ABOVE] [SPOILER ABOVE] [SPOILER ABOVE] [SPOILER ABOVE] [SPOILER ABOVE] [SPOILER ABOVE] [SPOILER ABOVE] [SPOILER ABOVE] [SPOILER ABOVE] [SPOILER ABOVE] [SPOILER ABOVE] [SPOILER ABOVE] [SPOILER ABOVE] [SPOILER ABOVE] [SPOILER ABOVE] [SPOILER ABOVE] [SPOILER ABOVE] [SPOILER ABOVE] [SPOILER ABOVE] [SPOILER ABOVE] [SPOILER ABOVE] [SPOILER ABOVE] [SPOILER ABOVE] [SPOILER ABOVE] [SPOILER ABOVE] [SPOILER ABOVE] [SPOILER ABOVE] [SPOILER ABOVE] [SPOILER ABOVE] [SPOILER ABOVE] [SPOILER ABOVE] [SPOILER ABOVE] [SPOILER ABOVE] [SPOILER ABOVE] [SPOILER ABOVE] [SPOILER ABOVE] [SPOILER ABOVE] [SPOILER ABOVE] [SPOILER ABOVE] [SPOILER ABOVE] [SPOILER ABOVE] [SPOILER ABOVE] [SPOILER ABOVE] [SPOILER ABOVE] [SPOILER ABOVE] [SPOILER ABOVE] [SPOILER ABOVE] [SPOILER ABOVE] [SPOILER ABOVE] [SPOILER ABOVE] [SPOILER ABOVE] [SPOILER ABOVE] [SPOILER ABOVE] [SPOILER ABOVE] [SPOILER ABOVE] [SPOILER ABOVE] [SPOILER ABOVE] [SPOILER ABOVE] ");
						}, 6000);
					});
				};
			};
			break;

		case "map":
			if (target == "#hen_zoid" && configuration.commands["henzoid-custom"] == true) {
				client.say(target,
					`Henzoid's current map is: ${configuration.operation.status.map.name}. ${configuration.operation.status.map.name} is ${configuration.operation.status.map.desc}. Make sure to join the Discord and follow for updates on this and future maps!`);
				// henzoidMapCommand(target, userstate, msg, self, tags, user, context, uname, args, rawargs)
			}
			break;

		case "hssp":
			if (target == "#hen_zoid" && configuration.commands["henzoid-custom"] == true) {
				client.say(
					target,
					"Do you like the stream music? If you do, then here is the link to the playlist! youtube.com/playlist?list=PLzRMuCNGroGv7yCuCP5BxYIpg9luF5U8b"
				);
			} else {
				return;
			}
			break;

		case "lmms":
			if (target == "#hen_zoid" && configuration.commands["henzoid-custom"] == true) {
				client.say(
					target,
					"Do you like the music that Henzoid makes? Do you want to make your own music? If you answered yes then you're in luck! Go to lmms.io and download LMMS to get started making your own music today!"
				);
			} else {
				return;
			}
			break;

		case "donate":
			if (target == "#hen_zoid" && configuration.commands["henzoid-custom"] == true) {
				client.say(
					target,
					`Do you want to donate to the "Get henzoid functional internet" fund? Here's the link! streamlabs.com/hen_zoid/tip`
				);
			} else {
				return
			}
			break;

		case "mcstacker":
			if (target == "#hen_zoid" && configuration.commands["henzoid-custom"] == true) {
				client.say(target, "Do you want to make your own Minecraft maps? Do you strugle with commands? Do you wish there was an easy way to get extremely fucking overpowered items? If you do, then mcstacker.net is for you!");
			} else {
				return;
			}
			break;

		case "pyxel":
			if (target == "#hen_zoid" && configuration.commands["henzoid-custom"] == true) {
				client.say(target, "Do you like the art henzoid makes? Do you want to make your own art? If you said yes, then check out Pyxel! If you said no, then still check out Pyxel! You can buy it at pyxeledit.com")
			} else {
				return;
			}
			break;

		case "discord":
			if (target == "#hen_zoid" && configuration.commands["henzoid-custom"] == true) {
				client.say(target, "Did you know that Henzoid has a Discord? Wait you did... Well he does, and it's free to join! Come on down and join The Henzone! discord.com/invite/Gtj6MeD");
			} else {
				return
			}
			break;

		case "music":
			if (target == "#hen_zoid" && configuration.commands["henzoid-custom"] == true) {
				client.say(target, `Do you like the music henzoid makes and wish there was an easy way to listen to it? Well wish no more! Apple Music: apple.co/3tPtxzB Spotify: spoti.fi/2Z6L7B5sp Amazon: amzn.to/3qgfgK1 YouTube: bit.ly/3d1gIw9`)
			}
			break;

		case "website":
			if (target == "#hen_zoid" && configuration.commands["henzoid-custom"] == true) {
				client.say(target, `Fun Fact: Henzoid has a website! henzoid.wixsite.com/website				I refuse to use the henzoid.com domain because that would imply henzoid is a professional, and we can't have that! wait fuck`)
			}
			break;

		case "ree":
		case "reee":
		case "reeee":
		case "autism":
			if (target == "#hen_zoid" && configuration.commands["henzoid-custom"] == true) {
				client.say(target, `Hey! Please don't use the phrase "REE" here. Henzoid does not like that phrase and will remove your kneecaps if you say it again. Read more about saying "REE" here -> twitter.com/stevenspohn/status/1326310781353340930`);
			}
			break;
		case "simps":
		case "simp":
			if (target == "#hen_zoid" && configuration.commands["henzoid-custom"] == true) {
				client.say(target, `S.I.M.P.S is an AI henzoid made totally not based on Portal 2's GLAdOS. SIMPS stands for: The Simulated Intelligence Multiple Personality System, which is an AI responsible for the development of advanced learning programs.`)
			}
			break;
		case "bit-wanderer":
		case "bitwanderer":
		case "album":
			if (target == "#hen_zoid" && configuration.commands["henzoid-custom"] == true) {
				client.say(target, `HENZOID HAS A NEW ALBUM AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA! You can check it out at the link that is so kindly placed right here -> youtube.com/watch?v=Apq-jgJtsVo`)
			}
			break;


		case "awoo-mode":
			if (target == "#thecasperofjacks") {
				if (uname == "thecasperofjacks" || uname == "demonitized_boi") {
					switch (args[0]) {
						case "true":
						case "enable":
						case "on":
							configuration.commands["awoo-mode"] = true;
							client.say(target, `@${uname} -> Module awoo-mode has been enabled.`);
							break;
						case "false":
						case "disable":
						case "off":
							configuration.commands["awoo-mode"] = false;
							client.say(target, `@${uname} -> Module awoo-mode has been disabled.`);
							break;
					}
				} else {
					client.say(target, `@${uname} -> You do not have the required permission to use this command.`)
				}
			}
			break;
		case "admin-commands":
			if (uname == "demonitized_boi" || uname == "hen_zoid") {
				let cmdState = args[0];
				configuration.commands["admin-commands"] = cmdState;
				client.say(target, `${uname} Module admin-commands is now set to ${cmdState}`);
			} else {
				client.say(target, `@${uname} -> You do not have the required permission to use this command.`);
			}
			break;
		case "henzoid-cmds":
			if (uname == "hen_zoid" || uname == "demonitized_boi") {
				switch (args[0]) {
					// case "true":
					// case "enable":
					// case "on":
					// 	configuration.commands["henzoid-custom"] = true;
					// 	client.say(target, `@${uname} -> Module henzoid-custom has been enabled.`);
					// 	break;
					case "false":
					case "disable":
					case "off":
						configuration.commands["henzoid-custom"] = false;
						client.say(target, `@${uname} -> Module henzoid-custom has been disabled.`);
						break;
				}
			} else {
				client.say(target, `@${uname} -> You do not have the required permission to use this command.`);
			}
			break;
		case `prime`:
		case `prime-gaming`:
		case `subscribe`:
		case `free-sub`:
			client.say(target, `PrimeMe Psst. Hey, did you know you can subscribe to one Twitch streamer for free every month!? Well you can with Prime Gaming!! Why not use your free sub on ${target}? PrimeMe`);
			break;
		case `lockdown`:
		case `ld`:
		case `bot`:
		case `lock`:
			if (uname == "demonitized_boi" || uname == "peter_lgbt") {
				channelLockdownHandler(target, userstate, msg, self, tags, user, context);
			} else {
				client.say(target, `@${uname} -> You do not have the required permission to use this command.`);
			}
			break;
		case `2trucks`:
		case `twotrucks`:
			client.say(target, `Two trucks having sex!`)
			break;

	}
}

function debugCommand(target, userstate, msg, self, tags, user, context) {

	let prefixRegex = new RegExp(
		`^(${escapeRegex(prefix)})\\s*`
	);
	let matchedPrefix = msg.match(prefixRegex);
	let args = msg
		.slice(matchedPrefix.length)
		.trim()
		.split(/ +/);
	let subCommand = args[1];

	var badges = JSON.stringify(userstate["badges"]);
	var uname = userstate["username"];
	let message = args.splice(0, 2);
	let chnl = args[0];

	switch (subCommand) {
		default:
			client.say(target, `${uname} You need to use a valid sub-command!`);
			break;
		case "emote-set":
			client.say(target, `I have the following Emote sets unlocked: ${sets}`);
			break;
		case "joined-channels":
			client.say(target, `I am currently lurking in ${configuration.operation.channels.length} channels`);
			break;
		case "ping":
			client.ping();
			responseChannel = target;
			break;
		case "sudo":
			message = args.join(" ");
			client.say(target, `${message}`);
			break;
		case "action":
			message = args.join(" ");
			client.action(target, `${message}`);
			break;
		case "kill":
			let user = args[0]
			client.say(target, `${uname} killed ${user}. LUL`);
			break;
		case "set-phasmo-code":
			let code = args[0];
			phasmoCode = code;
			client.say(target, `Set the Phasmophobia join code to ${code}`);
			break;
			// This exists because I managed to used the wrong account when appling for mod on a channel, so for now, this will allow me to moderate. I know it's bad but shut up.
		case "timeout":
			client.timeout(target, chnl, 300, `Automated moderation system.`);
			client.action(target, `${uname} -> Timed out ${chnl} for 300 seconds.`);
			break;
		case "ban":
			client.ban(target, chnl, `Automated moderation system.`);
			client.action(target, `${uname} -> Banned ${chnl} from channel.`);
			break;
		case "unban":
		case "untimeout":
			client.unban(target, chnl);
			client.action(target, `${uname} -> Unbanned ${chnl} from channel.`);
			break;
		case "host":
		case "h":
			if (args[0] == "-f") {
				client.host("demonitized_boi", target);
				client.host(opts.identity.username, target);
				client.say(target, `Now dual hosting ${target}`);

			} else {
				client.host(opts.identity.username, target);
				client.say(target, `Now hosting ${target}`);
			}
			break;
		case "reboot":
		case "restart":
			client.say(target, "Rebooting system. Please wait...");
			client.disconnect();
			process.exit(0)
			break;
		case "join":
			let channelJoin = args[0];
			client.join(channelJoin)
				.then((data) => {
					client.say(target, `Joined channel ${data}`);
				}).catch((err) => {
					client.say(target, `Error while joining channel: ${err}`)
					console.warn(`Error while joining channel. ${err}`)
				});
			break;
	}
}

function henzoidMapCommand(target, userstate, msg, self, tags, user, context, uname, args, rawargs) {
	let searchTerm = args.join(" ");
	searchTerm = searchTerm.toLowerCase();
	switch(searchTerm) {
		default:
		case "current":
			client.say(target,
				`Henzoid's current map is: ${configuration.operation.status.map.name}. ${configuration.operation.status.map.name} is ${configuration.operation.status.map.desc}. Make sure to join the Discord and follow for updates on this and future maps!`)
		break;
		case "tm3":
		case "twitch makes a minecraft map":
			client.say(target, `Henzoid's map "Twitch Makes a Minecraft Map" can be downloaded`);
			break;
		case "miscommunications":

		break;
		case "squared":
		case "16squared":
		case "15squared":
		case "14squared":
		case "12squared":
		case "10squared":

		break;
		case "bee":
		case "bees":
		
		break;
		case "grayscale":
		case "greyscale":
		
		break;
		case "the building game":
		case "tbg":

		break;
		case "idkwmtm":
		case "i dont know what map to make":
		case "i don't know what map to make":
		
		break;
		case "blackbastion":
		case "black bastion":

		break;
		case "titty map":
			client.say(target, `${uname} -> Titty map never will be a real map. For the love of god please stop asking about it!`);
		break;

	}
}

function channelLockdownHandler(target, userstate, msg, self, tags, user, context) {
	var uname = userstate["username"];
	if (chnlLockdown == false) {
		client.say(target, `${uname} -> The channel is now locked down.`);
		chnlLockdown = true;
		client.subscribers(target);
		client.clear(target);
	} else if (chnlLockdown == true) {
		client.say(target, `${uname} -> The channel is no longer locked down. Happy Chatting!`);
		chnlLockdown = false;
		client.subscribersoff(target);
	}
}

function followUser(user, account) {

}

function onFollowHandler() {

}

function onGiftSubUpgradeHandler(target, username, sender, userstate) {
	if (target == "#hen_zoid" || target == "#pastelsdarling" || target == "#reportcardsmc" || target == "#quimbly3" || target == "#demonitized_boi" || target == "#trollfartsvt" || target == "#walkernewton" || target == "#duckhunterone" || target == "#peter_lgbt") {
		client.say(target, `${username} is continuing the gift sub they got from ${sender}!`)
	}
}



function onCheerHandler(target, userstate, message) {
	let sender = userstate["username"];
	let bits = userstate["bits"];
	if (target == "#hen_zoid" || target == "#pastelsdarling" || target == "#reportcardsmc" || target == "#quimbly3" || target == "#demonitized_boi" || target == "#trollfartsvt" || target == "#walkernewton" || target == "#duckhunterone" || target == "#peter_lgbt") {
		if (bits == "69") {
			client.say(target, `${sender} just cheered ${bits} bits! ngl thats pretty nice`);
		} else if (bits == "420") {
			client.say(target, `${sender} just cheered ${bits} bits! ngl thats pretty nice. Not as nice as 69, but still nice.`);
		} else if (bits == "69420" || bits == "42069") {
			client.say(target, `${sender} just cheered ${bits} bits! That's so nice amirite`);
		} else {
			client.say(target, `Thank you ${sender} for cheering ${bits} bits! That's SWICK!`);
		};
		// Disabled as it's broken
		// if (target == `#quimbly3`) {
		// 	switch (bits) {
		// 		default:
		// 			client.say(target, `${userstate["username"]} just cheered ${userstate["bits"]}`);
		// 			break;
		// 		case configuration["verdux-info"].bits.boop.includes(bits):
		// 			client.say(target, `${sender} just booped ${target}`);
		// 			break;
		// 		case configuration["verdux-info"].bits.creeper.includes(bits):
		// 			client.say(target, `${sender} would like to warn ${target} about the Creeper behind them`);
		// 			break;
		// 		case configuration["verdux-info"].bits.fly.includes(bits):
		// 			client.say(target, `${sender} is welcoming ${target} aboard Flight ${bits}`);
		// 			break;
		// 		case configuration["verdux-info"].bits.launch.includes(bits):
		// 			client.say(target, `${target} is sending ${target} TO THE MOOOOOON`);
		// 			break;
		// 		case configuration["verdux-info"].bits.teleport.includes(bits):
		// 			client.say(target, `${sender} is going to send ${target} to their own personal hell!`);
		// 			break;
		// 	}
		// 	}
	}
}

function onSubHandler(target, username, method, message, userstate) {
	console.log(target);
	if (target == "#hen_zoid" || target == "#pastelsdarling" || target == "#reportcardsmc" || target == "#quimbly3" || target == "#demonitized_boi" || target == "#trollfartsvt" || target == "#walkernewton" || target == "#duckhunterone" || target == "#peter_lgbt") {
		switch (method.plan) {
			case "Prime":
				client.say(`${target}`, `PrimeMe ${username} just subscribed with Prime Gaming! PrimeMe`);
				break;
			case "1000":
				client.say(`${target}`, `${username} just subscribed at Tier 1!`);
				break;
			case "2000":
				client.say(`${target}`, `${username} just subscribed at Tier 2!`);
				break;
			case "3000":
				client.say(`${target}`, `${username} just subscribed at Tier 3!`);
				break;
			default:
				client.say(`${target}`, `${username} just subscribed!`);
				break;
		}
	}
}

function onHostedHandler(target, username, viewers, autohost) {
	console.log(`${username} just hosted ${target} with ${viewers} viewers!`)
	if (target == "Mrquestion11" || target == "#hen_zoid" || target == "#pastelsdarling" || target == "#reportcardsmc" || target == "#quimbly3" || target == "#demonitized_boi" || target == "#trollfartsvt" || target == "#walkernewton" || target == "#duckhunterone" || target == "#peter_lgbt") {
		client.say(target, `${username} just hosted us with ${viewers} viewers!`);
	}
}

function onResubHandler(target, username, months, message, userstate, method) {
	console.log(target);
	if (target == "#hen_zoid" || target == "#pastelsdarling" || target == "#reportcardsmc" || target == "#quimbly3" || target == "#demonitized_boi" || target == "#trollfartsvt" || target == "#walkernewton" || target == "#duckhunterone" || target == "#peter_lgbt") {

		let limelinzmHatesTheSubStreak = ~~userstate["msg-param-cumulative-months"];
		switch (method.plan) {
			case "Prime":
				client.say(`${target}`, `PrimeMe ${username} just resubscribed with Prime Gaming! They have subscribed for a total of ${limelinzmHatesTheSubStreak} months! PrimeMe`);
				break;
			case "1000":
				client.say(`${target}`, `${username} just resubscribed at Tier 1! They have subscribed for a total of ${limelinzmHatesTheSubStreak} months!`);
				break;
			case "2000":
				client.say(`${target}`, `${username} just resubscribed at Tier 2! They have subscribed for a total of ${limelinzmHatesTheSubStreak} months!`);
				break;
			case "3000":
				client.say(`${target}`, `${username} just resubscribed at Tier 3! They have subscribed for a total of ${limelinzmHatesTheSubStreak} months!`);
				break;
			default:
				client.say(`${target}`, `${username} just resubscribed!`);
				break;
		}
	}
}

function onGiftSubHandler(target, username, streakMonths, recipient, methods, userstate) {
	if (target == "#hen_zoid" || target == "#pastelsdarling" || target == "#reportcardsmc" || target == "#quimbly3" || target == "#demonitized_boi" || target == "#trollfartsvt" || target == "#walkernewton" || target == "#duckhunterone" || target == "#peter_lgbt") {
		let senderCount = ~~userstate["msg-param-sender-count"];
		let recievedUser = userstate["msg-param-recipient-user-name"];
		client.say(target, `HOLY MOLY! Thank you ${username} for gifting a sub to ${recipient}!`);
	}
}

function onGiftSubMysteryHandler(target, username, numbOfSubs, methods, userstate) {
	if (target == "#hen_zoid" || target == "#pastelsdarling" || target == "#reportcardsmc" || target == "#quimbly3" || target == "#demonitized_boi" || target == "#trollfartsvt" || target == "#walkernewton" || target == "#duckhunterone" || target == "#peter_lgbt") {
		client.say(target, `HOLY MOLY! Thank you ${username} for gifting ${numbOfSubs} subs to ${target}!`);
	}
}

function onModerationHandler(channel, user, reason, userstate, time) {

}

// Function called when the "dice" command is issued
function rollDice() {
	const sides = 20;
	return Math.floor(Math.random() * sides) + 1;
}

// Called every time the bot connects to Twitch chat
function onConnectedHandler(addr, port) {
	console.log(`* Connected to ${addr}:${port}`);
	console.log(`* Platform:  ${os.platform()}`);
	console.log(`* Architecture: ${os.arch()}`);
	console.log(`* Type: ${os.type()}`);
	console.log(`* Memory: ${os.freemem()} free of ${os.totalmem()} total`);
	console.log(`* Uptime: ${os.uptime()}`);
}

var session = require("express-session");
var passport = require("passport");
var OAuth2 = require("passport-oauth").OAuth2Strategy;
var request = require("request");
var handlebars = require("handlebars");
const e = require("express");
const {
	Module
} = require("module");
const {
	send
} = require("process");

const TWITCH_CLIENT_ID = `x12ea2y7tdpl3bxysv9si4emtxzcen`;
const TWITCH_SECRET = process.env.CLIENT_SECRET;
const SESSION_SECRET = `i[?'Xidk2ik/kR`;
const CALLBACK_URL = `https://demonitized-api.glitch.me`;

// Initialize Express and middlewares AKA fucking hell
app.use(
	session({
		secret: SESSION_SECRET,
		resave: false,
		saveUninitialized: false
	})
);
app.use(express.static("public"));
app.use(passport.initialize());
app.use(passport.session());



// Bypass passport profile function to get user profile from Twitch API, then eventually store it with SQL
OAuth2.prototype.userProfile = function (accessToken, done) {
	var options = {
		url: "https://api.twitch.tv/helix/users", // when Helix is depricated, update this part ASAP.
		method: "GET",
		headers: {
			"Client-ID": TWITCH_CLIENT_ID,
			Accept: "application/vnd.twitchtv.v5+json",
			Authorization: "Bearer " + accessToken
		}
	};

	request(options, function (error, response, body) {
		if (response && response.statusCode == 200) {
			done(null, JSON.parse(body));
		} else {
			done(JSON.parse(body));
		}
	});
};

passport.serializeUser(function (user, done) {
	done(null, user);
});

passport.deserializeUser(function (user, done) {
	done(null, user);
});


// Database start. does nothing yet as I am too lazy to learn SQL -Demon
// lmfao its so fucking easy -noah427

passport.use(
	"twitch",
	new OAuth2({
			authorizationURL: "https://id.twitch.tv/oauth2/authorize",
			tokenURL: "https://id.twitch.tv/oauth2/token",
			clientID: TWITCH_CLIENT_ID,
			clientSecret: TWITCH_SECRET,
			callbackURL: CALLBACK_URL,
			state: true
		},
		function (accessToken, refreshToken, profile, done) {
			//   profile.accessToken = accessToken;
			//   profile.refreshToken = refreshToken;

			//   db.prepare(`INSERT INTO users (profile, accessToken, refreshToken) VALUES (${profile}, ${accessToken}, ${refreshToken})`);

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
	passport.authenticate("twitch", {
		scope: "user_read"
	})
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
	OAuth2.prototype.userProfile = function () {
		var options = {
			url: "https://api.twitch.tv/helix/users",
			method: "GET",
			headers: {
				"Client-ID": TWITCH_CLIENT_ID,
				Accept: "application/vnd.twitchtv.v5+json",
				Authorization: "Bearer " + accessToken
			}
		};



		request(options, function (error, response, body) {
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
app.get("/", function (req, res) {
	if (req.session && req.session.passport && req.session.passport.user) {
		res.send(template(req.session.passport.user));
	} else {
		res.sendFile(__dirname + "/views/index.html");
	}
});

app.listen(3000, function () {
	console.log("Twitch auth listening on port 3000!");
});
