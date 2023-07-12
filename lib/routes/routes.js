"use strict"

const express = require("express")

//routes
const getToppingsRoute = require("./toppings/getToppingsRoute")
const getPizzasRoute = require("./pizzas/getPizzasRoute")
const addToppingRoute = require("./toppings/addToppingRoute")
const addPizzaRoute = require("./pizzas/addPizzaRoute")
const deleteToppingRoute = require("./toppings/deleteToppingRoute")
const deletePizzaRoute = require("./pizzas/deletePizzaRoute")
const updateToppingRoute = require("./toppings/updateToppingRoute")
const updatePizzaRoute = require("./pizzas/updatePizzaRoute")


//middleware
const validate = require("../middleware/validate")

function routes(app) {
	app.use("/", express.static("web/build"))

	app.get("/toppings", getToppingsRoute)
	app.get("/pizzas", getPizzasRoute)
	app.delete("/toppings/:id", deleteToppingRoute)
	app.delete("/pizzas/:id", deletePizzaRoute)

	app.use(validate)

	app.post("/toppings", addToppingRoute)
	app.post("/pizzas", addPizzaRoute)
	app.put("/toppings/:id", updateToppingRoute)
	app.put("/pizzas/:id", updatePizzaRoute)
}

module.exports = routes
