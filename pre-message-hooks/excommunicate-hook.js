const fs = require('fs');
const os = require('os');
const config = require('../config.json');

function checkPlacesForUserID(id, places) {
	for (const place of places) {
		if (Object.keys(place)[0] == id) {
			place[id]++;
			return place[id];
		}
	}
	return null;
}

module.exports = {
	name: 'excommunicate',
	execute(message) {
		if (message.content.startsWith(config.prefix)) {
			return;
		}
		const con = fs.readFileSync('./resources/excommunicate/excommunicated.json');
		const excom = JSON.parse(con);

		if (excom.excommunicated.includes(message.author.id)) {
			fs.readFile('./resources/excommunicate/bible.txt', 'utf8', (err, data) => {
				if (err) {
					console.error(err);
				}
				else {
					var verses = data.split(os.EOL + os.EOL);
					let idx = checkPlacesForUserID(message.author.id, excom.places);
					if (!idx) {
						idx = Math.floor(Math.random() * verses.length);
						const place = new Object();
						place[`${message.author.id}`] = idx;
						excom.places.push(place);
					}
					message.channel.send(verses[idx]);
					message.delete()
						.catch(console.error);
					fs.writeFile('./resources/excommunicate/excommunicated.json', JSON.stringify(excom, null, 4), (err) => {
						if (err) {
							console.error(err);
						}
					});
				}
			});
		}
	},
};
