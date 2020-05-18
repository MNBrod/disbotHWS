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

function checkIfLevelExists(level) {
	return Object.keys(config.permissions).includes(level);
}

function setPermissionForUserID(id, level) {
	const permissions = config.permissions;

	if (!checkIfLevelExists(level)) {
		return false;
	}

	// Remove the user from all other permission levels
	for (const permissionLevel of Object.keys(permissions)) {
		if (permissions[permissionLevel].includes(id)) {
			// remove the user
			const idx = permissions[permissionLevel].indexOf(id);
			permissions[permissionLevel].splice(idx, 1);
		}
	}
	permissions[level].push(id);

	return true;
}

// Organize exports
const mentionUtils = {
	getUserFromMention,
};

const permissionUtils = {
	checkPermissionsForUserID,
	checkIfLevelExists,
	setPermissionForUserID,
};

module.exports = {
	mentionUtils,
	permissionUtils,
};
