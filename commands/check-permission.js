const { mentionUtils, permissionUtils } = require('../utils');
module.exports = {
	name: 'check-permission',
	aliases: ['check'],
	description: 'Returns what permission level is set for this user',
	usage: 'permission <@user>',
	args: true,
	execute(message, args) {
		const user = mentionUtils.getUserFromMention(args[0], message.client);

		let res = '';

		const level = permissionUtils.checkPermissionsForUserID(user.id);

		if (level) {
			res += `\n${user.username} has a permission level of ${level}`;
		}
		else {
			res += `\n${user.username} has no permission level set`;
		}
		message.channel.send(res);
	},
};