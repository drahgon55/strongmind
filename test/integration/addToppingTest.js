"use strict"

const supertest = require("supertest")
const config = require("../files/configTest")
const bootstrap = require("../../bootstrap")
const configServer = require("../../config")
configServer.dbNamespace = config.dbNamespace
const server = require("../../lib/server/server")


describe("addToppingTest", describeCB)


function describeCB () {

	this.timeout(80000)
	console.log("verbose")

	let request
	let baseUrl = "http://" + config.host + ":" + config.port

	before(startCB)
	afterEach(afterEachCB)
	after(finishCB)

	it("should return 201 when topping is added successfully", test1CB)
	it("should return 400 when name is empty string", test2CB)
	it("should return 400 when name only spaces", test3CB)
	it("should return 400 when no name parameter in json", test4CB)
	it("should return 400 when name is not of type string", test5CB)
	it("should return 400 when request body is not json", test6CB)
	it("should return 409 when duplicate topping is added", test7CB)
	it("should return 200 when topping is deleted successfully", test8CB)
	it("should return 204 when topping is updated successfully", test9CB)
	it("should return 200 when list of toppings is retrieved successfully", test10CB)


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
			name: "olives"
		}

		request
			.post("/toppings")
			.send(obj)
			.type("application/json")
			.expect(201)
			.end(done)
	}

	function test2CB (done) {
		let obj = {
			name: ""
		}

		request
			.post("/toppings")
			.send(obj)
			.type("application/json")
			.expect(400)
			.end(done)
	}

	function test3CB (done) {
		let obj = {
			name: "  "
		}

		request
			.post("/toppings")
			.send(obj)
			.type("application/json")
			.expect(400)
			.end(done)
	}

	function test4CB (done) {
		let obj = {
			
		}

		request
			.post("/toppings")
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
			.post("/toppings")
			.send(obj)
			.type("application/json")
			.expect(400, "name should be of type string, but is of type number instead")
			.end(done)
	}

	function test6CB (done) {
		let obj = "not json"

		request
			.post("/toppings")
			.send(obj)
			.type("application/json")
			.expect(400)
			.end(done)
	}

	async function test7CB () {
		let obj = {
			name: "pepperoni"
		}

		await request
			.post("/toppings")
			.send(obj)
			.type("application/json")
			.expect(409, "Duplicate topping added")
	}

	function test8CB (done) {
		request
			.delete("/toppings/pepperoni")
			.type("application/json")
			.expect(204)
			.end(done)
	}

	function test9CB (done) {
		let obj = {
			name: "replaced pepperoni"
		}

		request
			.put("/toppings/pepperoni")
			.send(obj)
			.type("application/json")
			.expect(200)
			.end(done)
	}

	function test10CB (done) {
		request
			.get("/toppings")
			.type("application/json")
			.expect(200)
			.end(done)
	}
}