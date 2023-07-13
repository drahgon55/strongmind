// const host = "http://localhost:3001"
const host = ""

export async function getToppings() {
    const response = await fetch(host+"/toppings");
    return response;
}

export async function addTopping(data) {
    const response = await fetch(host+"/toppings", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data)
    })

    return response;
}

export async function deleteTopping(id) {
    const response = await fetch(host+"/toppings/" + id, {
        method: "DELETE"
    })

    return response;
}

export async function updateTopping(id, data) {
    const response = await fetch(host+"/toppings/" + id, {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data)
    })

    return response;
}

