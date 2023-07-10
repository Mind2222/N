const {EmbedBuilder} = require("discord.js");
const Discord = require("discord.js")
const ms = require("ms")
const db = require("croxydb")
exports.run = async (client, message, args) => {
 let kanal = message.channel;
  let time = args[0];
  let insan = args[1];
  let odul = args.slice(2).join(" ");

  if (!time)
    return message.reply(
      "LÃ¼tfen bir sÃ¼re belirt!"
    );
  if (!insan)
    return message.reply(
      "LÃ¼tfen kaÃ§ kiÅŸi kazanacaÄŸÄ±nÄ± yaz!"
    );
  if (!odul)
    return message.reply(
      "LÃ¼tfen Ã¶dÃ¼lÃ¼ yaz!"
    );

  let x = message.content;
  let ise = x
    .split(" ")
    .filter(val => val.match(/\d+/))
    .map(x =>
      x
        .split("")
        .filter(val => val.match(/\d+/))
        .join("")
    );

  let sures;
  let raven = ise[0];
  let insans = ise[1];
  if (time.includes("s")) sures = raven * 1000;
  if (time.includes("m")) sures = raven * 60 * 1000;
  if (time.includes("h")) sures = raven * 60 * 60 * 1000;
  if (time.includes("d")) sures = raven * 24 * 60 * 60 * 1000;

  let zaman = Date.now();

  let sure;
  let data
  try {
 data = ms(sures)
  } catch(err){
   message.reply("GirdiÄŸin sÃ¼re geÃ§erli bir sÃ¼re deÄŸil!")
  }
  if(data){
  let s = data.seconds;
  let m = data.minutes;
  let h = data.hours;
  let d = data.days;
  if (s) {
    sure = `${s} Seconds`;
  }
  if (m) {
    sure = `${m} Minutes`;
  }
  if (h) {
    sure = `${h} Hours`;
  }
  if (d) {
    sure = `${d} Days`;
  }
  let vars = await db.get(`cekilis.${message.guild.id}_${message.channel.id}`);
  if (!vars) {
    let embed = new Discord.EmbedBuilder()
      .setColor("#5865f2")
      .setTitle(odul)
      .setTimestamp()
.setDescription(`
SÃ¼re: <t:${Math.floor(Date.now() /1000) + Math.floor(sures/1000)}:R> (<t:${Math.floor(Date.now() /1000) + Math.floor(sures/1000)}:f>)
DÃ¼zenleyen: ${message.author}
Kazanan: ${insan}`);
    kanal.send({embeds: [embed]}).then(mesaj => {
      mesaj.react("ðŸŽ‰");
      
      db.set(`cekilis.${message.guild.id}_${mesaj.id}`, message.author.id)
       db.set(`reroll_${message.guild.id}`, { channelID: message.channel.id, messageID: mesaj.id })
      db.set(`cekilis.${message.guild.id}_${kanal.id}`, {
        kanalid: kanal.id,
        mesajid: mesaj.id,
        hosted: message.author.id,
        sure: sures,
        zaman: zaman,
        toplam: insan,
        odul: odul
      });
    });
   
  } else {
    message.reply("Zaten Bu Kanalda Aktif Bir Ã‡ekilis Var!");
  }
  }
};

exports.conf = {
  aliases: []
};

exports.help = {
  name: "baÅŸlat"
};
