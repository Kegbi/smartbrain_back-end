const jwt = require("jsonwebtoken");
const redisClient = require("../db/redis").redisClient;

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

// Create JWT token and return user data
const createSessions = (user) => {
	const { email, id } = user;
	const token = signToken(email);
	return setToken(token, id)
			.then(() => {
				return { success: "true", userId: id, token: token };
			})
			.catch(console.log);
};

module.exports = {
	getAuthTokenId,
	createSessions,
}