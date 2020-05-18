const { mentionUtils, permissionUtils } = require('../utils');
module.exports = {
	name: 'set-permission',
	aliases: ['sp', 'set'],
	permissionLevel: 'one',
	description: 'Prints input arguments and then the user mentioned. Checks if there are permissions set',
	usage: 'set-permission <@user> <level (one, two, three, four)>',
	args: true,
	execute(message, args) {
		const user = mentionUtils.getUserFromMention(args[0], message.client);
		const targetLevel = args[1];

		if (!permissionUtils.checkIfLevelExists(targetLevel)) {
			message.channel.send(`No level with name ${args[1]} found.`);
			return;
		}

		if (user) {
			let ret = '';
			const level = permissionUtils.checkPermissionsForUserID(user.id);

			if (level) {
				ret += `${user.username} currently has a permission level of ${level}. `;
			}

			ret += `Setting ${user.username} to permission level ${targetLevel} `;
			message.channel.send(ret);

			permissionUtils.setPermissionForUserID(user.id, targetLevel);

			return;
		}
		else {
			message.channel.send(`No user with name ${args[0]} found.`);
			return;
		}
	},
};