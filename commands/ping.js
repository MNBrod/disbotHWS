module.exports = {
	name: 'ping',
	aliases: ['p'],
	description: 'Ping!',
	execute(message) {
		message.channel.send('Pong');
	},
};