import sqlite from 'sqlite3';

const { Database } = sqlite;

const databasePath = './database.db';

function createDatabase() {
    let db = new Database(databasePath, (err) => {
        if (err) {
            console.log('Couldn\'t create database file: ' + err);
            process.exit(1);
        }
    });

    return db;
}

function setup(db) {
    const script = `
CREATE TABLE IF NOT EXISTS servers (
    name TEXT NOT NULL PRIMARY KEY,
    bot_prefix TEXT NOT NULL,
    punishment TEXT
);
`;
    db.run(script, (err) => {
        if (err) {
            console.log('Error on database setup: ', err);
        } else {
            console.log('Database setup ran succesfully');
        }
    });
}

const db = new Database(databasePath, sqlite.OPEN_READWRITE, (err) => {
    if (err) {
        if (err.code === 'SQLITE_CANTOPEN') {
            const newDb = createDatabase();
            setup(newDb);
            return;
        } else {
            console.log('Couldn\'t connect to database: ' + err)
        }
    }
});

export default db;