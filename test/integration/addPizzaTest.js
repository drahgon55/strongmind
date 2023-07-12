"use strict"

const supertest = require("supertest")
const config = require("../files/configTest")
const bootstrap = require("../../bootstrap")
const configServer = require("../../config")
configServer.dbNamespace = config.dbNamespace
const server = require("../../lib/server/server")


describe("addPizzaTest", describeCB)


function describeCB () {

	this.timeout(80000)
	console.log("verbose")

	let request
	let baseUrl = "http://" + config.host + ":" + config.port

	before(startCB)
	afterEach(afterEachCB)
	after(finishCB)

	it("should return 201 when pizza with one topping is added successfully", test1CB)
	it("should return 400 when name only spaces", test3CB)
	it("should return 400 when no name parameter in json", test4CB)
	it("should return 400 when name is not of type string", test5CB)
	it("should return 400 when request body is not json", test6CB)
	it("should return 409 when different name but duplicate topping is added", test7CB)
	it("should return 409 when duplicate name is added", test8CB)
	it("should return 400 when no toppings are specificed", test9CB)
	it("should return 400 when unknown topping is used", test10CB)
	it("should return 400 when name is empty string", test11CB)
	it("should return 200 when pizza is deleted successfully", test12CB)
	it("should return 204 when pizza is updated successfully", test13CB)
	it("should return 200 when list of pizzas is retrieved successfully", test14CB)


	async function startCB () {
		request = supertest.agent(baseUrl)

		await server.start()
		return await bootstrap()
	}

	async function afterEachCB () {
		
		return await bootstrap()
	}

	async function finishCB () {
		console.log("Stopping server")

		return await server.close().catch((err) => console.log(err)) 
	}



	function test1CB (done) {
		let obj = {
			name: "Green Pepper",
			toppings: ["green pepper"]
		}

		request
			.post("/pizzas")
			.send(obj)
			.type("application/json")
			.expect(201)
			.end(done)
	}

	function test3CB (done) {
		let obj = {
			name: "  "
		}

		request
			.post("/pizzas")
			.send(obj)
			.type("application/json")
			.expect(400)
			.end(done)
	}

	function test4CB (done) {
		let obj = {
			
		}

		request
			.post("/pizzas")
			.send(obj)
			.type("application/json")
			.expect(400, "No parameters given in request")
			.end(done)
	}

	function test5CB (done) {
		let obj = {
			name: 654
		}

		request
			.post("/pizzas")
			.send(obj)
			.type("application/json")
			.expect(400, "name should be of type string, but is of type number instead")
			.end(done)
	}

	function test6CB (done) {
		let obj = "not json"

		request
			.post("/pizzas")
			.send(obj)
			.type("application/json")
			.expect(400)
			.end(done)
	}

	function test7CB (done) {
		let obj = {
			name: "roni",
			toppings: ["pepperoni"]
		}

		request
			.post("/pizzas")
			.send(obj)
			.type("application/json")
			.expect(409)
			.end(done)
	}

	function test8CB (done) {
		let obj = {
			name: "pepperoni",
			toppings: ["green pepper"]
		}

		request
			.post("/pizzas")
			.send(obj)
			.type("application/json")
			.expect(409)
			.end(done)
	}

	function test9CB (done) {
		let obj = {
			name: "test9CB",
		}

		request
			.post("/pizzas")
			.send(obj)
			.type("application/json")
			.expect(400)
			.end(done)
	}

	function test10CB (done) {
		let obj = {
			name: "test10CB",
			toppings: ["unknown"]
		}

		request
			.post("/pizzas")
			.send(obj)
			.type("application/json")
			.expect(400)
			.end(done)
	}

	function test11CB (done) {
		let obj = {
			name: "",
			toppings: ["green pepper"]
		}

		request
			.post("/pizzas")
			.send(obj)
			.type("application/json")
			.expect(400)
			.end(done)
	}

	function test12CB (done) {
		request
			.delete("/pizzas/pepperoni")
			.type("application/json")
			.expect(204)
			.end(done)
	}

	function test13CB (done) {
		let obj = {
			name: "Pepperoni Only"
		}

		request
			.put("/pizzas/pepperoni")
			.send(obj)
			.type("application/json")
			.expect(200)
			.end(done)
	}

	function test14CB (done) {
		request
			.get("/pizzas")
			.type("application/json")
			.expect(200)
			.end(done)
	}
}