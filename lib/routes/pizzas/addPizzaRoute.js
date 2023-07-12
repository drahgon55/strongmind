"use strict"

const utilities = require("../../utilities/utilities")

function addPizzaRoute (req, res, next) {
	this.validate(req, res, next)
	return
}

addPizzaRoute.prototype.validate = function (req, res) {
	let str
	let status = 400

	const types = {
		required: {
			name: "string",
			toppings: "array"
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

addPizzaRoute.prototype.action = async function (req, res) {
	let pizzas = req.db.collection("pizzas")
	let insertObj = {
		$setOnInsert: {
			name: req.fields.name.toUpperCase(),
			toppings: req.fields.toppings
		}
	}

	let docs
	try {
		docs = await pizzas.find({toppings: { $all : req.fields.toppings }}).toArray()
	} catch (err) {
		return res.status(500).send(err.message)
	}

	let hasDups = checkForDups(docs)

	if (hasDups) {
		return res.status(409).send("Duplicate pizza added, toppings are the same as an existing pizza")
	}

	let toppings = req.db.collection("toppings")
	
	try {
		docs = await toppings.find({name: {$in: req.fields.toppings }}).toArray()
	} catch (err) {
		return res.status(500).send(err.message)
	}

	if (docs.length !== req.fields.toppings.length) {
		return res.status(400).send("invalid list of toppings")
	}

	
	let result
	try {
		result = await pizzas.updateOne(insertObj.$setOnInsert, insertObj, {upsert: true})
	} catch (err) {
		if (err.code === 11000) {
			return res.status(409).send("Duplicate pizza added, check if an existing pizza has the same name")
		} 

		return res.status(500).send(err.message)
	}
	
	return res.status(201).send({id: req.fields.name.toUpperCase()})


	function checkForDups (docs) {
		if (docs.length === 0) {
			return false
		}

		for (let doc of docs) {
			if (doc.toppings.length === req.fields.toppings.length) {
				return true
			}
		}

		return false
	}
}

module.exports = function (req, res, next) {
	new addPizzaRoute(req, res, next)
}
