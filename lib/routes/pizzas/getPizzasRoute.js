"use strict"

function getPizzasRoute (req, res, next) {
	this.action(req, res)
	return
}

getPizzasRoute.prototype.action = async function (req, res) {
	let pizzas = req.db.collection("pizzas")

	let docs
	try {
		docs = await pizzas.find({}).toArray()
	} catch (err) {
		return res.status(500).send(err.message)
	}
	
	return res.send(docs)
}

module.exports = function (req, res, next) {
	new getPizzasRoute(req, res, next)
}
