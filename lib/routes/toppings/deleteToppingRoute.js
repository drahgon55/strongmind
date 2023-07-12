"use strict"

let ObjectID = require("mongodb").ObjectID

function deleteToppingRoute (req, res, next) {
	this.action(req, res)
	return
}

deleteToppingRoute.prototype.action = async function (req, res) {
	console.log("verbose", "delete")

	let toppings = req.db.collection("toppings")

	try {
		await toppings.deleteOne({name: req.params.id})
	} catch (err) {
		return res.status(500).send(err.message)
	}
	
	return res.status(204).send()
}

module.exports = function (req, res, next) {
	new deleteToppingRoute(req, res, next)
}
