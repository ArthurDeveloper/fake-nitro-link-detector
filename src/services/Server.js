import db from '../database.js';
import { defaultPrefix } from '../bot.js';

const Server = {
    retrieveAll(callback) {
        db.all('SELECT * FROM servers', (err, rows) => {
            callback(err, rows);
        });
    },
    
    add(name) {
        const query = 'INSERT INTO servers VALUES (?, ?)';
        db.run(query, [name, defaultPrefix], (err) => {
            if (err) {
                console.log('Error while adding server: '+err);
            }
        });
    },

    setPrefix({ server, prefix }, callback) {
        const query = 'UPDATE servers SET name = ?, bot_prefix = ? WHERE name = ?';

        db.run(query, [server, prefix, server], (err) => {
            callback(err);
        });
    }
}

export default Server;