"use strict"

let ObjectID = require("mongodb").ObjectID

function deletePizzaRoute (req, res, next) {
	this.action(req, res)
	return
}

deletePizzaRoute.prototype.action = async function (req, res) {
	let pizzas = req.db.collection("pizzas")

	try {
		pizzas.deleteOne({name: req.params.id})
	} catch (err) {
		return res.status(500).send(err.message)
	}
	
	return res.status(204).send()
}

module.exports = function (req, res, next) {
	new deletePizzaRoute(req, res, next)
}
