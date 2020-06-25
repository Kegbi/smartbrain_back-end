const jwt = require("jsonwebtoken");
const redisClient = require("../db/redis").redisClient;
const { promisify } = require("util");

const handleSignIn = (db, bcrypt, req, res) => {
	const { email, password } = req.body;
	if (!email || !password) {
		return Promise.reject("Incorrect form submission");
	}
	return db
		.select("email", "hash")
		.from("login")
		.where("email", "=", email)
		.then((data) => {
			const isValid = bcrypt.compareSync(password, data[0].hash);
			if (isValid) {
				return db
					.select("*")
					.from("users")
					.where("email", "=", email)
					.then((user) => user[0])
					.catch((err) => Promise.reject("Unable to get user"));
			} else {
				Promise.reject("Wrong credentials");
			}
		})
		.catch((err) => Promise.reject("Wrong credentials"));
};

const getAuthTokenId = (req, res) => {
	const { authorization } = req.headers;
	return redisClient.get(authorization, (err, reply) => {
		if (err || !reply) {
			return res.status(400).json("Unauthorized");
		}
		return res.json({ id: reply });
	});
};

const signToken = (email) => {
	const jwtPayload = { email };
	return jwt.sign(jwtPayload, process.env.JWT_SECRET, {
		expiresIn: "2 days",
		// algorithm: "RS512",
	});
};

// Saving token to Redis
const setToken = (key, value) => {
	const setData = async function () {
		try {
			const res = await redisClient.set(key, value);
			return res;
		} catch (e) {
			console.log("Whooops, problems");
		}
	};
	return setData();
};

const createSessions = (user) => {
	// Create JWT token and return user data
	const { email, id } = user;
	const token = signToken(email);
	return setToken(token, id)
		.then(() => {
			return { success: "true", userId: id, token: token };
		})
		.catch(console.log);
};

const signInAuthentication = (db, bcrypt) => (req, res) => {
	const { authorization } = req.headers;
	return authorization
		? getAuthTokenId(req, res)
		: handleSignIn(db, bcrypt, req, res)
				.then((data) => {
					return data.id && data.email
						? createSessions(data)
						: Promise.reject(data);
				})
				.then((session) => res.json(session))
				.catch((err) => res.status(400).json(err));
};

module.exports = {
	handleSignIn,
	signInAuthentication,
};
