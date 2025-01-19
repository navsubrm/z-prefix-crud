import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';

/** @type {MongooseDBClient} */
let client = null;

/** @type {MongooseDB} */
let db = null;

export async function mongoInit() {
	if (!client) {
		client = await mongoose.connect(process.env.CONNECTION_STRING);
		db = mongoose.connection;
		db.on('error', (error) => console.error(error)); //Start db
		db.once('open', () => console.log('Connected to Database.')); //On open...
	}
	return { client, db };
}

export default mongoInit;
