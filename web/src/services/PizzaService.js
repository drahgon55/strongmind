export async function getPizzas() {
    const response = await fetch("/pizzas");
    return response;
}

export async function addPizza(data) {
    const response = await fetch("/pizzas", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data)
    })

    return response;
}

export async function updatePizza(id, data) {
    const response = await fetch("/pizzas" + id, {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data)
    })

    return response;
}

export async function deletePizza(id) {
    const response = await fetch("/pizzas/" + id, {
        method: "DELETE"
    })

    return response;
}
