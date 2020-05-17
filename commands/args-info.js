module.exports = {
	name: 'args-info',
	args: true,
	cooldown: 5,
	description: 'Information about the arguments provided.',
	execute(message, args) {
		if (args[0] === 'foo') {
			return message.channel.send('bar');
		}

		message.channel.send(`Arguments: ${args}\nArguments length: ${args.length}`);
	},
};