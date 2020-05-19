const fs = require('fs');
const { mentionUtils } = require('../utils');

module.exports = {
	name: 'ordain',
	description: 'Welcome a fellow priest into the ranks of the enlightened',
	usage: 'ordain <@user>',
	permissionLevel: 'two',
	execute(message, args) {
		const con = fs.readFileSync('./resources/excommunicate/excommunicated.json');
		const excom = JSON.parse(con);

		if (!excom.ordained.includes(message.author.id)) {
			message.channel.send(`${message.author}, you dare try to speak for the church?`);
			return;
		}

		const user = mentionUtils.getUserFromMention(args[0], message.client);

		excom.ordained.push(user.id);

		message.channel.send(`${user}, we welcome you into the priesthood.`);

		fs.writeFileSync('./resources/excommunicate/excommunicated.json', JSON.stringify(excom, null, 4));
	},
};
