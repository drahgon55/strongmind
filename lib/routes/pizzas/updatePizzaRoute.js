"use strict"

const utilities = require("../../utilities/utilities")

function updatePizzaRoute (req, res, next) {
	this.validate(req, res, next)
	return
}

updatePizzaRoute.prototype.validate = function (req, res) {
	let str
	let status = 400

	const types = {
		required: {},
		optional: {
			name: "string",
			toppings: "array"
		}
	}

	str = utilities.checkFields(req.fields, types)

	if (str !== undefined) {
		return res.status(status).send(str)
	}

	this.action(req, res)
}

updatePizzaRoute.prototype.action = async function (req, res) {
	let pizzas = req.db.collection("pizzas")
	let updateObj = {
		$set: {name: req.fields.name, toppings: req.fields.toppings}
	}

	try {
		await pizzas.updateOne({name: req.params.id}, updateObj)
	} catch (err) {
		return res.status(500).send(err.message)
	}
	
	return res.status(200).send()
}

module.exports = function (req, res, next) {
	new updatePizzaRoute(req, res, next)
}
