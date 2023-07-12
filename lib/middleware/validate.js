"use strict"

const utilities = require("../utilities/utilities")

function validate (req, res, next) {

	let str
	let status = 400


	console.log("debug2", "params:", req.params, "body:", req.body, "query:", req.query)

	if (utilities.isEmpty(req.body) && utilities.isEmpty(req.params)) {
		str = "No parameters given in request"

		console.log("verbose", str)

		return res.status(status).send(str)
	}

	if (Object.keys(req.body).length > 0) {
		console.log("verbose", "fields found as JSON in body")

		req.fields = req.body
	} else if (Object.keys(req.query).length > 0) {
		console.log("verbose", "fields found in a query string")

		req.fields = req.query
	}


	if (str) {
		console.log("verbose", str)

		return res.status(status).send(str)
	}



	return next()
}

module.exports = function (req, res, next) {
	new validate(req, res, next)
}
