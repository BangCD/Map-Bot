
const Discord=require("discord.js");
const { MessageEmbed } = require('discord.js');
const { Client, Intents } = require('discord.js');
const fs=require('fs');

const PORT = process.env.PORT;


const prefix='.';

const token=process.env.MAP_TOKEN;

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS] });

global.sendID='946517035301629952';
global.maparthelp='null';
client.once('ready',async()=>{
    console.log('Ready');
});

client.on("guildMemberAdd", (member) =>   {
    console.log(member);

    const channelId = "755460564742045711";
    const artistChannel = "759343648469942272"
    const archivebot= "946517138389221436"
    const message = `Welcome <@${member.id}> pick up your artist role in ${member.guild.channels.cache.get(artistChannel).toString()} and you can archive your mapart using ${member.guild.channels.cache.get(archivebot).toString()}`;


    const channel = member.guild.channels.cache.get(channelId);
    channel.send(message);
});

client.on('message',async(message)=>{
    if(!message.content.startsWith(prefix)||message.author.bot)return;
    const args=message.content.slice(prefix.length).trim().split(' ');
    const cmd=args.shift().toLowerCase();



if(cmd==`exit`){

}


if(cmd==`help`){
    
   const helpembed=new MessageEmbed()
   .setColor('#FF0000')
   .setTitle('Help')
   .setAuthor({name: 'Altitude Map Art', iconURL: 'https://imgur.com/kP7wxp8.png'})
   .setThumbnail('https://imgur.com/kP7wxp8.png')
   .addFields(
       {name:'Prefix: ',value:'``.``'},
       { name: '\u200B', value: '\u200B' },
       {name:'Mapart',value:'Use .mapart with an image attached to start up the command.\n The bot will then ask a couple questions regarding the map, answer them accordingly.\n The bot will then post the map and the entered information in the archive channel.'},
       {name:'Change',value:'Can only be used by Staff to change the output channel'},
   )
   .setTimestamp()
   message.channel.send({embeds:[helpembed]})
}



if (cmd==`change`){
    if(message.member.roles.cache.some(role => role.name === 'Staff')){
        global.sendID=args;
        message.channel.send(`Send channel has been changed to id ${global.sendID}`)
    }
    else{message.channel.send("You dont have the required permission to use this command "),
        message.channel.send("https://tenor.com/view/kekwtf-gif-18599263 ")}
}



if (cmd == `mapart`) {
    var collectorstop;
   if(sendID=='null') return message.channel.send("No output channel set");
   if(message.attachments.size<=0) return message.channel.send("No image found \n Resend with the command and a image");
    const items={
        name:"",
        size:"",
        By:"",
        Warp:"",
        Server:"",
        get getname(){
            return this.name;
        },
        
        set setname(x){
            this.name=x;
        },
        get getsize(){
            return this.size;
        },
        
        set setsize(x){
            this.size=x;
        },
        set setBy(x){
            this.By=x;
        },
        set setServer(x){
            this.Server=x;
        },
        set setWarp(x){
            this.Warp=x;
        }

    
    };
    // Create a message collector
    let filter = m => m.author == message.author;
    const channel = message.channel;
    
    const collector = channel.createMessageCollector({ filter, max: 5 });
    console.log("collector started");



    message.channel.send("What is the name of this Mapart? Reply with 'Untitled' if it has no name: ");
    collector.on('collect', msg => {

    if(msg.content==`.exit`){
        collectorstop=true;
       collector.stop();
    }

    else if (items.name== "")
    {
        items.setname=msg.content
        message.channel.send("What is the size of the Map art, its Width x Height dimensions? AKA 1x1, 2x1, width x height etc. ")
    }

    else if(items.size=="")
    {
        items.setsize=msg.content
        message.channel.send("Who made this Mapart? Type their in-game username:")
    }
    else if(items.By=="")
    {
        items.setBy=msg.content
        message.channel.send("At what warps is this Mapart sold? Type N/A if it isn't sold at any warps, and separate multiple warps with commas:")
    }
    else if(items.Warp=="")
    {
        items.setWarp=msg.content
        message.channel.send("On which servers are these warps where this Mapart is sold? Again, type N/A if it isn't sold at any warps, and separate multiple servers with commas: ")    
    }
    else if(items.Server=="")
    {
        items.setServer=msg.content
    }
    else
    {
        collector.stop
    }
    }
    );
     

    collector.on('end', collected => { 
    if(collectorstop==true){message.channel.send("Stopped the Command")}

    else{
    const [attachments]=message.attachments.values();
    const mapEmbed = new MessageEmbed()
    .setColor('RANDOM')
    .setAuthor({name: 'Altitude Map Art', iconURL: 'https://imgur.com/kP7wxp8.png'})
    .setTitle(items.name)
    .setThumbnail('https://imgur.com/kP7wxp8.png')
    .addFields(
        //{name:'Map art: ',value:items.name},
        {name:'Made by: ',value:items.By},
        {name:'Size: ',value:items.size},
        {name:'Sold At: ',value:`${items.Warp} (${items.Server})`}
    )
    .setImage(message.attachments.first().url)
    .setTimestamp()
    .setFooter(`Posted by- ${message.author.username}`);

   client.channels.cache.get(`${global.sendID}`).send({embeds:[mapEmbed]})
        }
    });
  }
})//clinet closed

client.login(token);