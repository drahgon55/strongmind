export async function getToppings() {
    const response = await fetch("/toppings");
    return response;
}

export async function addTopping(data) {
    const response = await fetch("/toppings", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data)
    })

    return response;
}

export async function deleteTopping(id) {
    const response = await fetch("/toppings/" + id, {
        method: "DELETE"
    })

    return response;
}
