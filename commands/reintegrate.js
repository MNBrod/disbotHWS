const fs = require('fs');
const { mentionUtils } = require('../utils');

module.exports = {
	name: 'reintegrate',
	aliases: ['integrate', 'accept', 'admit'],
	description: 'Welcome a banished barbarian into our loving arms',
	permissionLevel: 'two',
	usage: 'reintegrate <@user>',
	execute(message, args) {
		const con = fs.readFileSync('./resources/excommunicate/excommunicated.json');
		const excom = JSON.parse(con);

		if (!excom.ordained.includes(message.author.id)) {
			message.channel.send(`${message.author}, you dare try to speak for the church?`);
			return;
		}

		const user = mentionUtils.getUserFromMention(args[0], message.client);

		const idx = excom.excommunicated.indexOf(user.id);
		excom.excommunicated.splice(idx, 1);

		console.log('excom\n' + excom.excommunicated);

		fs.writeFile('./resources/excommunicate/excommunicated.json', JSON.stringify(excom, null, 4), (err) => {
			if (err) {
				console.error(err);
			}
			else {
				console.log('saved reintegration');
			}
		});

		message.channel.send(`${user}, we welcome you back into society.`);
	},
};