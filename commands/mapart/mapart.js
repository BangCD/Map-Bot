const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, AttachmentBuilder } = require('discord.js');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('mapart')
        .setDescription('Create entry for Map Archive')
        
        .addAttachmentOption(option=>
            option.setName('image')
            .setRequired(true)
            .setDescription('Ingame Image of MapArt'))

        .addStringOption(option =>
            option.setName('mapname')
                .setRequired(true)
                .setDescription('Enter name of MapArt: '))

        .addStringOption(option=>
            option.setName('mapsize')
                .setRequired(true)
                .setDescription('Enter size of MapArt, Eg:1x1,2x2: '))

        .addStringOption(option=>
            option.setName('by')
                .setRequired(true)
                .setDescription('Who made this Mapart? Type their in-game username:'))

        .addStringOption(option=>
            option.setName('warp')
                .setRequired(true)
                .setDescription('Which Warps is this MapArt sold at? N/A if not on sale')),

    async execute(interaction) {
        //channel=interaction.option.getChannel('channel')
        const mapName=interaction.options.getString('mapname') ?? "Unknown";
        //const mapImage=interaction.options.Attachment.proxyURL
        const attachment = interaction.options.getAttachment("image",)
        const madeby=interaction.options.getString('by') ?? "Unknown";
        const size=interaction.options.getString('mapsize') ?? "Unknown";
        const warp=interaction.options.getString('warp') ?? "Unknown";
        // console.log(madeby)
        // console.log(size)
        // console.log(warp)

        const attachmentBuild= new AttachmentBuilder(attachment.url, {name: 'image.png'})
        
        const mapEmbed1 = new EmbedBuilder()
        //const mapEmbed1 = new RichEmbed()
        .setColor('Random')
        .setAuthor({name: 'Altitude Map Art', iconURL: 'https://imgur.com/kP7wxp8.png'})
        .setTitle(mapName)
        .setThumbnail('https://imgur.com/kP7wxp8.png')
        .addFields(
                    {name:'Made by: ',value:madeby},
                    {name:'Size: ',value:size},
                    {name:'Sold At: ',value:warp}
                )
        .setImage('attachment://image.png')
        .setTimestamp()
        .setFooter({ text: `Posted by- ${interaction.user.username}`,
                    iconURL: `${interaction.user.displayAvatarURL()}`});
        
        //console.log(interaction.user.displayAvatarURL())

        
        //const input1=interaction.options.getString("input") ?? 'no input given'; 
        await interaction.guild.channels.cache.get('946517035301629952').send({embeds:[mapEmbed1],files: [attachmentBuild]})

        //await interaction.guild.channels.cache.get('1201607152599580833').send(`${mapName} - ${attachment.url}`)
        await interaction.guild.channels.cache.get('1201607152599580833').send({ content: `${mapName}`, files: [attachment] })
        //console.log(attachment.url)
        await interaction.reply({ content: 'Added to archive, Thank you   <:pepelove:785201288044085289>', ephemeral: true });
        //await interaction.reply(`u typed: ${input1}`)
    },
};