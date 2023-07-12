"use strict"

function getToppingsRoute (req, res, next) {
	this.action(req, res)
	return
}

getToppingsRoute.prototype.action = async function (req, res) {
	let toppings = req.db.collection("toppings")
	let docs
	try {
		docs = await toppings.find({}).toArray()
	} catch (err) {
		return res.status(500).send(err.message)
	}
	
	docs = docs.map((x) => x.name)

	return res.send(docs)
}

module.exports = function (req, res, next) {
	new getToppingsRoute(req, res, next)
}
