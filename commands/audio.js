module.exports = {
	name: 'audio',
	cooldown: 5,
	description: 'Information about the arguments provided.',
	async execute(message) {
		if (message.member.voice.channel) {
			const connection = await message.member.voice.channel.join();

			// Create a dispatcher
			const dispatcher = connection.play('https://www.learningcontainer.com/wp-content/uploads/2020/02/Kalimba.mp3');

			// const dispatcher = connection.play(fs.createReadStream('./deadlines.mp3'));
			dispatcher.on('start', () => {
				console.log('audio.mp3 is now playing!');
			});

			dispatcher.on('finish', () => {
				console.log('audio.mp3 has finished playing!');
				connection.disconnect();
			});

			// Always remember to handle errors appropriately!
			dispatcher.on('error', console.error);
		}
	},
};