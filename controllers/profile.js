const handleProfileGet = (req, res, db) => {
	const { id } = req.params;
	db.select("*")
		.from("users")
		.where({ id })
		.then((user) => {
			if (user.length) {
				res.json(user[0]);
			} else {
				res.status(400).json("Not found");
			}
		})
		.catch((err) => res.status(400).json("Error getting user"));
};

const handleProfileUpdate = (req, res, db) => {
	console.log(req.params.id);
	const { id } = req.params;
	const { name, age, pet } = req.body.formInput;
	db("users")
		.where({ id: id })
		.update({ name: name, age: age, pet: pet })
		.then((resp) => {
			if (resp) {
				res.json("Success");
			} else {
				res.status(400).json("Unable to update");
			}
		})
		.catch((err) => res.status(400).json("Error updating profile"));
};

module.exports = {
	handleProfileGet,
	handleProfileUpdate,
};
