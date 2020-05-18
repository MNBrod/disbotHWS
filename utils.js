const config = require('./config.json');
const fs = require('fs');

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
	const con = fs.readFileSync('./config.json');
	const configJSON = JSON.parse(con);

	const permissions = configJSON.permissions;
	for (const level of Object.keys(permissions)) {
		if (permissions[level].users.includes(id)) {
			return level;
		}
	}

	return null;
}

function checkIfLevelExists(level) {
	return Object.keys(config.permissions).includes(level);
}

function setPermissionForUserID(id, level) {
	const con = fs.readFileSync('./config.json');
	const configJSON = JSON.parse(con);

	if (!checkIfLevelExists(level)) {
		return false;
	}

	// Remove the user from all other permission levels
	for (const permissionLevel of Object.keys(configJSON.permissions)) {
		if (configJSON.permissions[permissionLevel].users.includes(id)) {
			// remove the user
			const idx = configJSON.permissions[permissionLevel].users.indexOf(id);
			configJSON.permissions[permissionLevel].users.splice(idx, 1);
		}
	}
	configJSON.permissions[level].users.push(id);

	fs.writeFileSync('./config.json', JSON.stringify(configJSON, null, 4));
	return true;
}

function isUserAllowed(id, level) {
	// If no level is required, then anyone can use it
	if (!level) {
		return true;
	}

	const userLevel = checkPermissionsForUserID(id);
	const levels = config.permissions;

	if (levels[userLevel].rank <= levels[level].rank) {
		return true;
	}
	else {
		return false;
	}
}

// Organize exports
const mentionUtils = {
	getUserFromMention,
};

const permissionUtils = {
	checkPermissionsForUserID,
	checkIfLevelExists,
	setPermissionForUserID,
	isUserAllowed,
};

module.exports = {
	mentionUtils,
	permissionUtils,
};
