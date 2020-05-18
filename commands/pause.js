module.exports = {
	name: 'pause',
	cooldown: 5,
	description: 'Information about the arguments provided.',
	async execute(message) {
		if (message.member.voice.channel) {
			const connection = await message.member.voice.channel.join();

			// Create a dispatcher
			const dispatcher = connection.dispatcher;
			if (dispatcher) {
				dispatcher.pause();

				dispatcher.on('error', console.error);
			}
			// Always remember to handle errors appropriately!
		}
	},
};