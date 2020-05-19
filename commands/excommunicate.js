const fs = require('fs');
const { mentionUtils } = require('../utils');

module.exports = {
	name: 'excommunicate',
	aliases: ['excom'],
	description: 'Banish a heretic from civilized society',
	permissionLevel: 'two',
	usage: 'excommunicate <@user>',
	execute(message, args) {
		const con = fs.readFileSync('./resources/excommunicate/excommunicated.json');
		const excom = JSON.parse(con);

		if (!excom.ordained.includes(message.author.id)) {
			message.channel.send(`${message.author}, you dare try to speak for the church?`);
			return;
		}

		const user = mentionUtils.getUserFromMention(args[0], message.client);

		if (excom.excommunicated.includes(user.id)) {
			message.channel.send('We already excommunicated this one, sir.');
			return;
		}

		excom.excommunicated.push(user.id);

		message.channel.send(`${user}, you are hereby banished from society.`);

		fs.writeFileSync('./resources/excommunicate/excommunicated.json', JSON.stringify(excom, null, 4));
	},
};