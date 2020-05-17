module.exports = {
	name: 'reload',
	description: 'Reloads a command',
	execute(message, args) {
		// Get the command to be reloaded
		const commandName = args[0].toLowerCase();
		const command = message.client.commands.get(commandName) || message.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

		// If no such command exists, exit
		if (!command) return message.channel.send(`There is no command with name or alias \`${commandName}\`, ${message.author}!`);

		// Delete the cached copy of the command from require
		delete require.cache[require.resolve(`./${command.name}.js`)];

		try {
			// Reload the command
			const newCommand = require(`./${command.name}.js`);
			message.client.commands.set(newCommand.name, newCommand);
		}
		catch (error) {
			console.log(error);
			message.channel.send(`There was an error while reloading a command \`${command.name}\`:\n\`${error.message}\``);
		}
		message.channel.send(`Command \`${command.name}\` was reloaded!`);


	},
};