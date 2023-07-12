"use strict"

const server = require("./lib/server/server")

server.start().then(() => {
    console.log("Server started")
})


