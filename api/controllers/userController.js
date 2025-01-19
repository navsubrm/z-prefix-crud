import * as User from '../models/User.js';
import * as Session from '../models/Session.js';

export const createUser = async (req, res) => {
	const errors = User.validateCreateUserInputs({ ...req.body });

	try {
		const dup = await User.getUserByUsername(req.body.username);
		if (dup) errors.duplicate = true;
		if (Object.entries(errors).length > 0) {
			res.status(409);
			return res.json({ ...errors });
		}

		const result = await User.createUser({ ...req.body });
		res.status(200);
		return res.json(result);
	} catch (err) {
		res.status(500);
		res.json(err);
	}
};

export const login = async (req, res) => {
	if (User.validateUsername(req.body.username) || User.validatePassword(req.body.password)) {
		res.status(409);
		return res.json({ invalidCredentials: true });
	}

	try {
		const user = await User.login({ ...req.body });
		if (!user) {
			res.status(409);
			return res.json({ invalidCredentials: true });
		}

		const session = await Session.setSession(user);

		if (!session) throw Error('Failed to set session.  Please try logging in again.');

		res.set('Access-Control-Allow-Origin', req.headers.origin);
		res.set('Access-Control-Allow-Credentials', 'true');
		res.set(
			'Access-Control-Expose-Headers',
			'date, etag, access-control-allow-origin, access-control-allow-credentials'
		);
		res.cookie('session', `${session._id}`, {
			maxAge: 86400000,
			httpOnly: true
		});

		res.status(200);
		return res.json({ ...user });
	} catch (err) {
		console.log(err);
		res.status(500);
		res.json(err);
	}
};

export const authenticate = async (req, res) => {
	const cookies = req.cookies.session;

	if (!cookies) {
		res.status(200);
		return res.json({});
	}

	try {
		const session = await Session.getSessionById(cookies);

		if (!session?.userId) {
			console.log('no user id 1.');
			res.status(200);
			return res.json({});
		}

		const user = await User.getUserById(session.userId);

		if (!user?._id) {
			console.log('No use ID 2.');
			res.status(200);
			res.json({});
		}

		res.set({
			'Access-Control-Allow-Origin': req.headers.origin,
			'Access-Control-Allow-Credentials': 'true',
			'Access-Control-Expose-Headers':
				'date, etag, access-control-allow-origin, access-control-allow-credentials'
		});

		res.cookie('session', `${session._id}`, {
			maxAge: 86400000,
			httpOnly: true
		});

		res.status(200);
		return res.json({ ...user });
	} catch (err) {
		console.log('Error from authenticate. ', err);
		res.status(500);
		res.json(err);
	}
};

export const setTheme = async (req, res) => {
	res.cookie('theme', `${JSON.stringify(req.body)}`, {
		maxAge: 86400000 * 300,
		httpOnly: true
	});
	res.send();
};

export const getTheme = async (req, res) => {
	const theme = req.cookies.theme;
	res.json(theme);
};

export const logout = async (req, res) => {
	const cookies = req.cookies.session;

	if (!cookies) {
		res.status(200);
		return res.send();
	}

	try {
		await Session.deleteSession(cookies);
		res.status(200);
	} catch (err) {
		res.status(500);
		res.json(err);
	} finally {
		res.set({
			'Access-Control-Allow-Origin': req.headers.origin,
			'Access-Control-Allow-Credentials': 'true',
			'Access-Control-Expose-Headers':
				'date, etag, access-control-allow-origin, access-control-allow-credentials'
		});
		res.cookie('session', `${cookies}`, {
			maxAge: 0,
			httpOnly: true
		});
		res.send();
	}
};
