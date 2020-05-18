const config = require('./config.json');

function getUserFromMention(mention, client) {
	if (!mention) return;

	if (mention.startsWith('<@') && mention.endsWith('>')) {
		mention = mention.slice(2, -1);

		if (mention.startsWith('!')) {
			mention = mention.slice(1);
		}

		return client.users.cache.get(mention);
	}
}

function checkPermissionsForUserID(id) {
	const permissions = config.permissions;
	for (const level of Object.keys(permissions)) {
		if (permissions[level].includes(id)) {
			return level;
		}
	}

	return null;
}

const mentionUtils = {
	getUserFromMention,
};

const permissionUtils = {
	checkPermissionsForUserID,
};

module.exports = {
	mentionUtils,
	permissionUtils,
};
