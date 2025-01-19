//External imports
import mongoose from 'mongoose';
mongoose.Promise = global.Promise;

//Internal Imports:
import { mongoInit } from '../db.js';

mongoInit();

const sessionSchema = new mongoose.Schema({
	userId: {
		type: String,
		required: true
	},
	createdAt: {
		type: Date,
		default: () => Date.now(),
		immutable: true
	},
	expiresAt: {
		type: Date,
		default: () => Date.now(),
		required: true,
		index: { expires: 60 * 60 * 24 }
	}
});

sessionSchema.pre('save', function (next) {
	this.set({ expiresAt: new Date() });
	next();
});

sessionSchema.pre('updateOne', function (next) {
	this.set({ expiresAt: new Date() });
	next();
});

const SessionCollection =
	mongoose.models.SessionCollection || mongoose.model('SessionCollection', sessionSchema);

export default SessionCollection;

export async function setSession(user) {
	try {
		const response = await SessionCollection.findOne({ userId: user._id });

		if (!response) {
			const session = new SessionCollection({
				userId: user._id
			});
			return await session.save();
		}

		return await SessionCollection.findOneAndUpdate(
			{ userId: user._id },
			{ expiresAt: new Date() }
		);
	} catch (err) {
		throw Error(`Database failure trying to setup the session. ${err}`);
	}
}

export async function getSessionById(id) {
	try {
		const session = await SessionCollection.findOne({ _id: id }).lean();

		if (!session) return false;

		return { ...session };
	} catch (err) {
		throw Error(`Database failed to find session in get session by id. ${err}`);
	}
}

export async function deleteSession(id) {
	try {
		await SessionCollection.findOneAndDelete({ _id: id }).lean();

		return true;
	} catch (err) {
		throw Error(`Database failed to delete session correctly. ${err}`);
	}
}
