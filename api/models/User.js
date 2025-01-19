//External imports
import mongoose from 'mongoose';
mongoose.Promise = global.Promise;
import { mongoInit } from '../db.js';
import CryptoJS from 'crypto-js';

mongoInit();

const userSchema = new mongoose.Schema({
	firstName: {
		type: String,
		required: true
	},
	lastName: {
		type: String,
		required: true
	},
	username: {
		type: String,
		required: true
	},
	password: {
		type: String,
		required: true
	},
	createdAt: {
		type: Date,
		default: () => Date.now(),
		immutable: true
	},
	updatedAt: {
		type: Date,
		default: () => Date.now()
	}
});

userSchema.pre('save', function (next) {
	this.set({ updatedAt: new Date() });
	next();
});

//This calls a function before the criteria you select, for example, this will run before save.
userSchema.pre('updateOne', function (next) {
	this.set({ updatedAt: new Date() });
	next();
});

export const UserCollection =
	mongoose.models.UserCollection || mongoose.model('UserCollection', userSchema);

export function validateUsername(username) {
	if (username == '') return true;
	return false;
}

export function validateFirstName(firstName) {
	if (firstName == '') return true;
	return false;
}

export function validateLastName(lastName) {
	if (lastName == '') return true;
	return false;
}

export function validatePassword(password) {
	if (password == '') return true;
	return false;
}

/** @param {string} password */
export const testPasswordComplexity = (password) => {
	const regEx =
		/^(?=.*\d)(?=.*[a-z].*[a-z])(?=.*[A-Z].*[A-Z])(?=.*[a-zA-Z])(?=.*[!@#$%&*()_+].*[!@#$%&*()_+]).{14,}$/g;

	if (password.match(regEx) == null) return true;
	return false;
};

export function validateCreateUserInputs({
	firstName,
	lastName,
	username,
	password,
	confirmPassword
}) {
	let errors = {};
	if (password !== confirmPassword) errors.pwMisMatch = true;
	if (validateFirstName(firstName)) errors.firstNameMissing = true;
	if (validateLastName(lastName)) errors.lastNameMissing = true;
	if (validateUsername(username)) errors.usernameMissing = true;
	if (validatePassword(password)) errors.passwordMissing = true;
	//if(testPasswordComplexity(password)) errors.passwordFail = true;

	return errors;
}

export async function createUser({ firstName, lastName, username, password }) {
	let hash = CryptoJS.SHA512(password).toString(CryptoJS.enc.Base64);
	const user = new UserCollection({ firstName, lastName, username, password: hash });

	try {
		const response = await user.save();
		const newUser = response._doc;
		delete newUser.password;
		delete newUser.createdAt;
		delete newUser.updatedAt;
		delete newUser.__v;
		newUser._id = newUser._id.toString();

		return { ...newUser };
	} catch (err) {
		throw Error(`Error from catch in db user save: ${err}`);
	}
}

export async function getUserByUsername(username) {
	try {
		const user = await UserCollection.find({ username });

		if (user.length > 0) return { ...user[0] };

		return false;
	} catch (err) {
		throw Error(`Database failure in duplicate Check: ${err}`);
	}
}

export async function getUserById(id) {
	try {
		const user = await UserCollection.findById(
			{ _id: id },
			{ username: 1, firstName: 1, lastName: 1 }
		).lean();

		if (!user) return false;

		return { ...user };
	} catch (err) {
		throw Error(`Error from catch in fetch for user by id: ${err}`);
	}
}

export async function login({ username, password }) {
	const hashPW = CryptoJS.SHA512(password).toString(CryptoJS.enc.Base64);

	try {
		const user = await UserCollection.findOne(
			{ username },
			{ username: 1, firstName: 1, lastName: 1, password: 1 }
		).lean();

		if (!user || user.password !== hashPW) return false;
		delete user.password;

		return { ...user };
	} catch (err) {
		throw Error(`Error from catch in user login: ${err}`);
	}
}
