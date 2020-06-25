const redisClient = require("../db/redis").redisClient;

const requireAuth = (req, res, next) => {
	const { authorization } = req.headers;
	if (!authorization) {
		return res.status(401).json("Unauthorized");
	}
	return redisClient.get(authorization, (err, reply) => {
		if (err || !reply) {
			return res.status(401).json("Unauthorized");
		}
		console.log("YOU SHALL NOT... Ah, wrong case, go on");
		return next();
	});
};

module.exports = {
	requireAuth,
};
