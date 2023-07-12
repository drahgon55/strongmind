"use strict"

process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0

const http = require("http")
const express = require("express")
const app = express()
const routes = require("../routes/routes")
const bodyParser = require("body-parser")
const mongo = require("mongodb")
const MongoClient = mongo.MongoClient
const privateConfig = require("../../package.json").strongmind
const config = require("../../config.json")
const cors = require("cors")


function server () {
	this.Server = http.Server(app)

	app.disable("x-powered-by")
	app.use(cors())
	//express middleware
	app.use(addDatabase.bind(this))
	app.use(bodyParser.json()) // for parsing application/json mimetype

	//create routes
	new routes(app)


	//Middleware functions

	function addDatabase (req, res, next) {
		console.log("trace")

		if (this.db !== undefined) {
			req.db = this.db
			
			return next()
		}

		return next(new Error("database not found"))
	}

} // end of server constructor



server.prototype.start = async function (cb) {
	cb = cb || function (err) {
		if (err) {
			throw new Error(err)
		}
	}

	this.host = privateConfig.host
	this.port = privateConfig.port
	let options = {
		connectTimeoutMS: privateConfig.mongoConnectionTimeout
	}

	if (this.db === undefined) {
		console.log("connecting to database")

		let url = "mongodb://" + config.dbHost + ":" + config.dbPort + "/" + config.dbNamespace

		console.log(url)

		const client = new MongoClient(url, options)
		this.client = client

		await client.connect()
		await client.db("admin").command({ ping: 1 });

		this.mongoClient = client
		this.db = client.db()

		client.on("reconnect", reconnectCB)
		client.on("close", closeCB.bind(this))
		client.on("error", errorCB)
		client.on("timeout", timeoutCB)

		await this.Server.listen(this.port, this.host)
		
	} else {
		console.log("database connected already, starting server")

		await this.Server.listen(this.port, this.host)
	}
	return



	function reconnectCB () {
		console.log("reconnected to database")
	}

	function closeCB () {
		console.log("closing")
		process.exit(1)
	}

	function errorCB (err) {
		console.log(err)
	}

	function timeoutCB (err) {
		console.log(err.message)
	}
}

 server.prototype.close = async function () {
	if (this.Server) {
		console.log("found a server closing it")
		await this.Server.close()
	} else {
		console.log("server not found")
	}

	if (this.client) {
		console.log("found a db connection closing it")
		await this.client.close()
		this.db = undefined
	} else {
		console.log("db connection not found")
	}

	return
}


module.exports = new server()
