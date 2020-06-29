const redisClient = require("../db/redis").redisClient;

const deleteToken = (req, res) => {
	const { authorization } = req.headers;
	const delData = async function () {
		try {
			const res = await redisClient.del(authorization);
			return res;
		} catch (e) {
			console.log("Whooops, problems");
		}
	};
	return delData();
}

const handleLogout = (req, res) => {
	return deleteToken(req, res)
			.then((response) => {
				res.json(response)
			})
			.catch(console.log)
}

module.exports = {
	handleLogout
}