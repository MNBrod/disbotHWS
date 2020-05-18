const { mentionUtils, permissionUtils } = require('../utils');
module.exports = {
	name: 'permission-test',
	aliases: ['permission', 'level', 'pt'],
	description: 'Prints input arguments and then the user mentioned. Checks if there are permissions set',
	usage: 'permission <@user>',
	args: true,
	execute(message, args) {
		const user = mentionUtils.getUserFromMention(args[0], message.client);

		let res = '';

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