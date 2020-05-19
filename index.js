const { prefix, token } = require('./config.json');
const { permissionUtils } = require('./utils');

const fs = require('fs');
const Discord = require('discord.js');

const client = new Discord.Client();

client.commands = new Discord.Collection();

const cooldowns = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);

	// set a new item in the Collection
	// with the key as the command name and the value as the exported module
	client.commands.set(command.name, command);
}

const premessageHooks = [];

const hookFiles = fs.readdirSync('./pre-message-hooks').filter(file => file.endsWith('.js'));

for (const file of hookFiles) {
	const hook = require(`./pre-message-hooks/${file}`);
	premessageHooks.push(hook);
}

client.once('ready', () => {
	console.log('Ready!');
});

client.on('message', message => {

	// Check pre-message hooks
	for (const hook of premessageHooks) {
		// console.log(hook);
		try {
			hook.execute(message);
		}
		catch (error) {
			console.error(error);
		}
	}

	// If this isn't a command, or the message came from a bot, move on
	if (!message.content.startsWith(prefix) || message.author.bot) return;

	// Parse the command and arugments from the message
	const args = message.content.slice(prefix.length).split(/ +/);
	const commandName = args.shift().toLowerCase();

	// Get the command instance appropriate for this message
	const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

	// If there isn't a command or alias for this, move on
	if (!command) return;

	// Check Permissions

	// Check to see if the command has the required arguments (or lack thereof)
	if (command.args && !args.length) {
		let reply = `You didn't provide any arguments, ${message.author}!`;

		if (command.usage) {
			reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
		}

		return message.channel.send(reply);
	}

	// Checks if the command been registered as called recently
	// If not, adds it to the cooldowns list
	if (!cooldowns.has(command.name)) {
		cooldowns.set(command.name, new Discord.Collection());
	}

	// Get all relevant cooldowns for this command
	const timestamps = cooldowns.get(command.name);
	const now = Date.now();
	const cooldownAmount = (command.cooldown || 3) * 1000;

	// If the cooldowns have something from this author
	if (timestamps.has(message.author.id)) {
		const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

		// Move on if the cooldown hasn't been reached
		if (now < expirationTime) {
			const timeLeft = (expirationTime - now) / 1000;
			return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
		}
	}

	timestamps.set(message.author.id, now);
	setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

	if (!permissionUtils.isUserAllowed(message.author.id, command.permissionLevel)) {
		message.reply('You do not have sufficient permissions to execute this command');
		return;
	}

	try {
		command.execute(message, args);
	}
	catch (error) {
		console.error(error);
		message.reply('there was an error trying to execute that command!');
	}

});

process.on('unhandledRejection', error => console.error('Uncaught Promise Rejection', error));

client.login(token);