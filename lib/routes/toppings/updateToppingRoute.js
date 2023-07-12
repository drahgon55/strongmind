"use strict"

const utilities = require("../../utilities/utilities")

function updateToppingRoute (req, res, next) {
	this.validate(req, res, next)
	return
}

updateToppingRoute.prototype.validate = function (req, res) {
	let str
	let status = 400

	const types = {
		required: {},
		optional: {
			name: "string"
		}
	}

	str = utilities.checkFields(req.fields, types)

	if (str !== undefined) {
		return res.status(status).send(str)
	}

	this.action(req, res)
}

updateToppingRoute.prototype.action = async function (req, res) {
	let toppings = req.db.collection("toppings")

	let updateObj = {
		$set: {name: req.fields.name}
	}

	try {
		await toppings.updateOne({name: req.params.id}, updateObj)
	} catch (err) {
		return res.status(500).send(err.message)
	}
	
	return res.status(200).send()
}

module.exports = function (req, res, next) {
	new updateToppingRoute(req, res, next)
}
