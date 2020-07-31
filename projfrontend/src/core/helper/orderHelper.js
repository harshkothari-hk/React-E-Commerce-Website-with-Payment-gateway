import { API } from "../../backend";

export const createOrder = (userId, token, orderdata) => {
    return fetch(`${API}/order/create/${userId}`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({order: orderdata})
    })
    .then(response => {
        return Response.json();
    })
    .catch(err => console.log(err));
};