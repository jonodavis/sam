const Discord = require('discord.js')
const client = new Discord.Client()
const auth = require('./auth.json')
const config = require('./config.json')
const getParking = require('./commands/getParking')
const getInstagram = require('./commands/getInstagram')
const f1next = require('./commands/f1next')
const music = require('./commands/music')
const chalk = require('chalk')

const log = console.log

client.on('ready', () => {
  log(chalk.cyan(`                                                      
    SSSSSSSSSSSSSSS                                           
  SS:::::::::::::::S                                          
 S:::::SSSSSS::::::S                                          
 S:::::S     SSSSSSS                                          
 S:::::S              aaaaaaaaaaaaa      mmmmmmm    mmmmmmm   
 S:::::S              a::::::::::::a   mm:::::::m  m:::::::mm 
  S::::SSSS           aaaaaaaaa:::::a m::::::::::mm::::::::::m
   SS::::::SSSSS               a::::a m::::::::::::::::::::::m
     SSS::::::::SS      aaaaaaa:::::a m:::::mmm::::::mmm:::::m
        SSSSSS::::S   aa::::::::::::a m::::m   m::::m   m::::m
             S:::::S a::::aaaa::::::a m::::m   m::::m   m::::m
             S:::::Sa::::a    a:::::a m::::m   m::::m   m::::m
 SSSSSSS     S:::::Sa::::a    a:::::a m::::m   m::::m   m::::m
 S::::::SSSSSS:::::Sa:::::aaaa::::::a m::::m   m::::m   m::::m
 S:::::::::::::::SS  a::::::::::aa:::am::::m   m::::m   m::::m
  SSSSSSSSSSSSSSS     aaaaaaaaaa  aaaammmmmm   mmmmmm   mmmmmm                                                        
    `))
  log(`Logged in as ${client.user.tag}!`)
});

client.on('message', async message => {

  if(message.author.bot) { return }
  if(message.content.indexOf(config.prefix) !== 0) { return }

  const args = message.content.slice(config.prefix.length).trim().split(/ +/g)
  const command = args.shift().toLowerCase()

  if (command === 'ping') {
    const reply = await message.channel.send("Ping?");
    reply.edit(`Pong! Latency is ${reply.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ping)}ms`)
    return
  }

  if (command === 'mitchell') {
    message.channel.send("Thinks he's a good guy but he's not.")
    return
  }

  // gets the number of parks available in AT parking buildings
  if (command === 'parking') {
    getParking( (p) => {
      message.channel.send({embed: {
        color: 3447003,
        title: "AT Parking:",
        fields: [
          { name: "Location", value: `Civic\nDowntown\nVictoria St`, inline: true},
          { name: "Free Parks", value: `${p.civic}\n${p.downtown}\n${p.victoriast}`, inline: true}
        ]
      }});
    })
    return 
  }

  // gets the number of instagram followers for the specified instagram account
  if (command === 'followers') {
    getInstagram(args[0], (f) => { message.channel.send(`${args[0]} has ${f} followers on Instagram.`) })
    return 
  }

  // gets information about the next f1 race
  if (command === 'f1') {
    f1next(race => {
      date = new Date(race.date + ' ' + race.time)
      message.channel.send(`Next race is the ${race.raceName} and starts on ${date}.`)
    })
    return 
  }

  // MUSIC BOT COMMANDS
  if (command === 'play') {
		music.execute(message);
		return;
  } 
  
  if (command === 'skip') {
		music.skip(message);
		return;
  } 
  
  if (command === 'stop') {
		music.stop(message);
    return;
  }

  else {
    message.channel.send("Command not found.")
    return 
  }
})

// start the bot
client.login(auth.token)