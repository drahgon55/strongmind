// const host = "http://localhost:3001"
const host = ""

export async function getPizzas() {
    const response = await fetch(host+"/pizzas");
    return response;
}

export async function addPizza(data) {
    const response = await fetch(host+"/pizzas", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data)
    })

    return response;
}

export async function updatePizza(id, data) {
    const response = await fetch(host+"/pizzas/" + id, {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data)
    })

    return response;
}

export async function deletePizza(id) {
    const response = await fetch(host+"/pizzas/" + id, {
        method: "DELETE"
    })

    return response;
}
