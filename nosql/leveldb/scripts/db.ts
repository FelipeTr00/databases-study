import * as level from 'level';

// LevelDB = db
export const db = new level.Level('./db', { valueEncoding: 'json' });