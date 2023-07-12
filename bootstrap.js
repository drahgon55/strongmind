"use strict"

const bson = require("bson")
const mongo = require("mongodb")
const MongoClient = mongo.MongoClient
const config = require("./config.json")
const toppingInfo = require("./toppings.json")
const pizzaInfo = require("./pizzas.json")
const privateConfig = require("./package.json").strongmind


async function bootstrap() {
	for (let key in toppingInfo) {
		toppingInfo[key] = bson.EJSON.parse(JSON.stringify(toppingInfo[key]))
	}

	for (let key in pizzaInfo) {
		pizzaInfo[key] = bson.EJSON.parse(JSON.stringify(pizzaInfo[key]))
	}

	let url = "mongodb://" + config.dbHost + ":" + config.dbPort + "/" + config.dbNamespace
	let options = {
		connectTimeoutMS: privateConfig.mongoConnectionTimeout
	}

	const client = new MongoClient(url, options)

	await client.connect()

	const db = client.db()

	let toppings = db.collection("toppings")

	await toppings.drop().catch(err => console.log("toppings doesn't exist"))
	await db.createCollection("toppings", { collation: { locale: 'en_US', strength: 2 } })
	toppings = db.collection("toppings")
	await toppings.createIndex({ name: 1, toppings: 1}, {unique:true})
	await toppings.insertMany(toppingInfo)
	
	console.log("toppings inserted successfully")

	let pizzas = db.collection("pizzas")

	await pizzas.drop().catch(err => console.log("pizzas doesn't exist"))
	await db.createCollection("pizzas", { collation: { locale: 'en_US', strength: 2 } })
	pizzas = db.collection("pizzas")
	await pizzas.createIndex({ name: 1,  }, {unique:true})
	await pizzas.insertMany(pizzaInfo)

	console.log("pizzas inserted successfully")

	await client.close()

}

module.exports = bootstrap
