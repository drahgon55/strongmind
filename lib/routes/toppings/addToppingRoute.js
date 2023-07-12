"use strict"

const utilities = require("../../utilities/utilities")

function addToppingRoute (req, res, next) {
	this.validate(req, res, next)
	return
}

addToppingRoute.prototype.validate = function (req, res) {
	let str
	let status = 400

	const types = {
		required: {
			name: "string"
		}
	}

	str = utilities.checkFields(req.fields, types)

	if (str !== undefined) {
		console.log(str)

		console.log(JSON.stringify(req.fields, 0, 2))

		return res.status(status).send(str)
	}

	this.action(req, res)
}

addToppingRoute.prototype.action = async function (req, res) {
	let toppings = req.db.collection("toppings")
	let insertObj = {
		$setOnInsert: {
			name: req.fields.name.toLowerCase()
		}
	}

	let result
	try {
		result = await toppings.updateOne(insertObj.$setOnInsert, insertObj, {upsert: true})
	} catch (err) {
		return res.status(500).send(err.message)
	}
	
	if (result.upsertedId === null) {
		return res.status(409).send("Duplicate topping added")
	}

	return res.status(201).send({id: req.fields.name.toLowerCase()})
}

module.exports = function (req, res, next) {
	new addToppingRoute(req, res, next)
}
