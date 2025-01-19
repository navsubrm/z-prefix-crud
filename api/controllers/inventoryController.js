import * as Inventory from '../models/Inventory.js';

export const createInventoryItem = async (req, res) => {
	const errors = Inventory.validateCreateItemInputs({ ...req.body });

	try {
		const dup = await Inventory.getInventoryItemByNameAndUserId(req.body.name, req.body.userId);
		if (dup) errors.duplicate = true;
		if (Object.entries(errors).length > 0) {
			res.status(409);
			return res.json({ ...errors });
		}

		const result = await Inventory.createItem({ ...req.body });

		res.status(200);
		return res.json(result);
	} catch (err) {
		res.status(500);
		res.json({ catchError: true, message: err });
	}
};

export const editInventoryItem = async (req, res) => {
	const errors = Inventory.validateCreateItemInputs({ ...req.body });

	if (Object.entries(errors).length > 0) {
		res.status(409);
		return res.json({ ...errors });
	}

	try {
		const result = await Inventory.editItem({ ...req.body });

		if (result) {
			res.status(200);
			return res.send();
		}

		if (!result) {
			res.status(500);
			return res.json({ error: `Item failed to save for an unknown reason.` });
		}
	} catch (err) {
		res.status(500);
		return res.json(err);
	}
};

export const deleteInventoryItem = async (req, res) => {
	try {
		const result = await Inventory.deleteItem(req.body._id);

		if (result) return res.status(200).send();
		if (!result) return res.status(400).send();
	} catch (err) {
		res.status(500);
		return res.json(err);
	}
};

export const viewInventoryList = async (req, res) => {
	try {
		const result = await Inventory.getFullList();

		if (!result) return res.status(400).send();

		res.status(200);
		return res.json(result);
	} catch (err) {
		res.status(500);
		return res.json(err);
	}
};

export const viewInventoryByUserId = async (req, res) => {
	try {
		const result = await Inventory.getUserInventoryList(req.params.userId);

		if (!result) return res.status(400).send();

		res.status(200);
		res.json(result);
	} catch (err) {
		res.status(500);
		res.json(err);
	}
};
