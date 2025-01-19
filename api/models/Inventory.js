//External imports
import mongoose from 'mongoose';
mongoose.Promise = global.Promise;
import { mongoInit } from '../db.js';

mongoInit();

const inventorySchema = new mongoose.Schema({
	userId: {
		type: String,
		required: true
	},
	name: {
		type: String,
		required: true
	},
	description: {
		type: String,
		required: true
	},
	quantity: {
		type: Number,
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

inventorySchema.pre('save', function (next) {
	this.set({ updatedAt: new Date() });
	next();
});

inventorySchema.pre('updateOne', function (next) {
	this.set({ updatedAt: new Date() });
	next();
});

export const InventoryCollection =
	mongoose.models.InventoryCollection || mongoose.model('InventoryCollection', inventorySchema);

export function validateName(name) {
	if (name == '') return true;
	return false;
}

export function validateQuantity(quantity) {
	if (quantity == '') return true;
	if (isNaN(quantity)) return true;
	return false;
}

export function validateDescription(description) {
	if (description == '') return true;
	return false;
}

export function validateUserId(userId) {
	if (userId == '') return true;
	//Could also validate userId is valid ObjectID

	return false;
}

export const validateCreateItemInputs = ({ userId, name, description, quantity }) => {
	let errors = {};
	if (validateUserId(userId)) errors.userIdMissing = true;
	if (validateName(name)) errors.nameMissing = true;
	if (validateDescription(description)) errors.descriptionMissing = true;
	if (validateQuantity(quantity)) errors.quantityMissing = true;

	return errors;
};

export async function createItem({ name, description, quantity, userId }) {
	const item = new InventoryCollection({ name, description, quantity, userId });

	try {
		const response = await item.save();
		const newItem = response._doc;
		delete newItem.createdAt;
		delete newItem.updatedAt;
		delete newItem.__v;
		newItem._id = newItem._id.toString();

		return { ...newItem };
	} catch (err) {
		throw Error(`Error from inventory model create item catch. ${err}`);
	}
}

export async function getInventoryItemByNameAndUserId(name, userId) {
	try {
		const item = await InventoryCollection.find({ name: { $regex: name, $options: 'i' }, userId });

		if (item.length > 0) return { ...item[0] };

		return false;
	} catch (err) {
		throw new Error(`Database failure in get inventory by name and user ID. ${err}`);
	}
}

export async function editItem({ _id, name, description, quantity }) {
	try {
		const response = await InventoryCollection.findByIdAndUpdate(
			{ _id },
			{ name, description, quantity }
		).lean();

		if (!response) return false;

		return true;
	} catch (err) {
		throw Error(`Error from edit item model: ${err}`);
	}
}

export async function deleteItem(_id) {
	try {
		const response = await InventoryCollection.findByIdAndDelete({ _id }).lean();

		if (!response) return false;
		return true;
	} catch (err) {
		throw Error(`Inventory item delete failed. ${err}`);
	}
}

export async function getFullList() {
	try {
		const list = await InventoryCollection.find().lean();

		if (!list) return false;
		return list;
	} catch (err) {
		throw Error(`Error from full list model. ${err}`);
	}
}

export async function getUserInventoryList(userId) {
	try {
		const list = await InventoryCollection.find({ userId }).lean();

		if (!list) return false;
		return list;
	} catch (err) {
		throw Error(`Error from user list model. ${err}`);
	}
}
