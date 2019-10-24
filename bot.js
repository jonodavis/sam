const Discord = require("discord.js");
const client = new Discord.Client();
const auth = require("./auth.json");
const config = require("./config.json");
const getParking = require("./commands/getParking");
const getInstagram = require("./commands/getInstagram");
const f1next = require("./commands/f1next");
const music = require("./commands/music");
const chalk = require("chalk");

const log = console.log;

const commands = {
  ping: "Gets the current latency.",
  mitchell: "My thoughts about Mitchell.",
  parking: "Gets the number of available spaces in Auckland parking garages.",
  followers:
    "Gets the number of Instagram followers for the specified username.",
  f1: "Gets information about the next Formula 1 Grand Prix.",
  addrole: "Adds the specified role to the user."
};

client.on("ready", () => {
  log(chalk.cyan(`Sam is ready!`));
  log(`Logged in as ${client.user.tag}!`);
});

client.on("message", async message => {
  if (message.author.bot) {
    return;
  }
  if (message.content.indexOf(config.prefix) !== 0) {
    return;
  }

  const args = message.content
    .slice(config.prefix.length)
    .trim()
    .split(/ +/g);
  const command = args.shift().toLowerCase();

  if (command === "ping") {
    const reply = await message.channel.send("Ping?");
    reply.edit(
      `Pong! Latency is ${reply.createdTimestamp -
        message.createdTimestamp}ms. API Latency is ${Math.round(
        client.ping
      )}ms`
    );
    return;
  }

  if (command === "help") {
    message.channel.send(
      Object.entries(commands).map(([name, desc]) => `**${name}**: ${desc}`)
    );
    return;
  }

  if (command === "mitchell") {
    message.channel.send("Thinks he's a good guy but he's not.");
    return;
  }

  // gets the number of parks available in AT parking buildings
  if (command === "parking") {
    getParking(p => {
      message.channel.send({
        embed: {
          color: 3447003,
          title: "AT Parking:",
          fields: [
            {
              name: "Location",
              value: `Civic\nDowntown\nVictoria St`,
              inline: true
            },
            {
              name: "Free Parks",
              value: `${p.civic}\n${p.downtown}\n${p.victoriast}`,
              inline: true
            }
          ]
        }
      });
    });
    return;
  }

  // gets the number of instagram followers for the specified instagram account
  if (command === "followers") {
    getInstagram(args[0], f => {
      message.channel.send(`${args[0]} has ${f} followers on Instagram.`);
    });
    return;
  }

  // gets information about the next f1 race
  if (command === "f1") {
    f1next(race => {
      date = new Date(race.date + " " + race.time);
      message.channel.send(
        `Next race is the ${race.raceName} and starts on ${date}.`
      );
    });
    return;
  }

  // used for users to add roles to themselves
  if (command === "addrole") {
    const roles = {
      "he/him": "636502639332294656",
      "she/her": "636502829250510880",
      "they/them": "636502851224469504",
      ask: "636502890562846720"
    };

    if (args[0] in roles) {
      message.member.addRole(roles[args[0]]);
      log(`Adding role ${args[0]} to user ${message.author.tag}`);
      message.channel.send(`Role ${args[0]} added!`);
    } else {
      message.channel.send(`Sorry, I can't find that role.`);
    }
  }

  // MUSIC BOT COMMANDS
  if (music) {
    if (command === "play") {
      music.execute(message);
      return;
    }

    if (command === "skip") {
      music.skip(message);
      return;
    }

    if (command === "stop") {
      music.stop(message);
      return;
    }
  } else {
    message.channel.send("Command not found.");
    return;
  }
});

// start the bot
client.login(auth.token);
