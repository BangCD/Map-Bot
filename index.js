const Discord=require("discord.js");
const { MessageEmbed } = require('discord.js');
//const { Client, Intents } = require('discord.js');
const { Client,Intents, Collection, Events, GatewayIntentBits } = require('discord.js');
// const fs=require('fs');
const fs = require('node:fs');
const path = require('node:path');
//const fire2=require("sweetalert2")
const PORT = process.env.PORT;
const { SlashCommandBuilder } = require('discord.js');
// import { SlashCommandBuilder } from '@discordjs/builders';


console.log("Ready!")
const prefix='.';

const token=process.env.MAP_TOKEN;


const client = new Client({ intents: [GatewayIntentBits.Guilds] });


client.commands = new Collection();
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}
});


client.login(token);