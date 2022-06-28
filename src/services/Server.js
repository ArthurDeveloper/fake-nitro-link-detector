import db from '../database.js';
import { defaultPrefix } from '../bot.js';
import { updateServerArray, addServerToServerArray } from '../bot.js';

const Server = {
    retrieveAll(callback) {
        db.all('SELECT * FROM servers', (err, rows) => {
            callback(err, rows);
        });
    },
    
    add(name) {
        console.log(defaultPrefix);
        const query = 'INSERT INTO servers (name, bot_prefix) VALUES (?, ?)';
        db.run(query, [name, defaultPrefix], (err) => {
            if (err) {
                console.log('Error while adding server: '+err);
            }
        });

        addServerToServerArray({
            name
        });
    },

    setPrefix({ server, prefix }, callback) {
        const query = 'UPDATE servers SET name = ?, bot_prefix = ? WHERE name = ?';

        db.run(query, [server, prefix, server], (err) => {
            callback(err);
        });

        updateServerArray({
            server,
            newPrefix: prefix
        });
    },

    setPunishment({ server, punishment }, callback) {
        const query = `UPDATE servers SET punishment = ? WHERE name = ?`;

        db.run(query, [punishment, server], (err) => {
            callback(err);
        });

        updateServerArray({
            server,
            newPunishment: punishment
        });
    }
}

export default Server;
