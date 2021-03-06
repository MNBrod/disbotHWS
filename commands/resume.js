module.exports = {
	name: 'resume',
	cooldown: 5,
	description: 'Information about the arguments provided.',
	async execute(message) {
		if (message.member.voice.channel) {
			const connection = await message.member.voice.channel.join();

			// Create a dispatcher
			const dispatcher = connection.dispatcher;
			if (dispatcher) {
				dispatcher.resume();

				// Always remember to handle errors appropriately!
				dispatcher.on('error', console.error);
			}
		}
	},
};