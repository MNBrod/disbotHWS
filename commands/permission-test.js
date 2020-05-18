const { mentionUtils, permissionUtils } = require('../utils');
module.exports = {
	name: 'permission-test',
	aliases: ['permission', 'level', 'pt'],
	description: 'Adds/removes user from a permission level',
	usage: 'set-permission <@user> <level (one, two, three, four)>',
	args: true,
	execute(message, args) {
		const user = mentionUtils.getUserFromMention(args[0], message.client);

		let res = 'Arguments: ' + ', '.join(args);

		if (user) {
			res += ' with mention: ' + user.username + ' ID: ' + user.id;
		}
		const level = permissionUtils.checkPermissionsForUserID(user.id);

		if (level) {
			res += `\nThis user has a permission level of ${level}`;
		}
		else {
			res += '\nThis user has no permission level set';
		}
		message.channel.send(res);
	},
};