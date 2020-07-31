import React, {useState, useEffect, createContext} from "react";
import { isAutheticated } from "../auth/helper";
import { cartEmpty, loadCart } from "./helper/cartHelper";
import { Link } from "react-router-dom";
import StripeCheckoutButton from "react-stripe-checkout";
import { API } from "../backend";
import { createOrder } from "./helper/orderHelper";

const StripeCheckout = ({
    products, 
    setReload = f => f, 
    reload = undefined
}) => {

    const [data, setData] = useState({
        loading: false,
        success: false,
        error: "",
        address: ""
    });

    const token = isAutheticated() && isAutheticated().token
    const userId = isAutheticated() && isAutheticated().user._id

    const getFinalAmount = () => {
       let amount = 0 
       products.map(p => {
           amount = amount + p.price
       })
       return amount;
    };

    const makePayment = token => {
        const body = {
            token,
            products
        }
        const headers = {
            "Content-Type": "application/json"
        }
        return fetch(`${API}/stripepayment`, {
            method: "POST",
            headers,
            body: JSON.stringify(body)
        })
        .then(response => {
            console.log(response)
            //call further methods
            const { status } = response;
            console.log("STATUS", status);
        })
        .catch(error => console.log(error))
    };

    const showStripeButton = () => {
        return isAutheticated() ? (
            <StripeCheckoutButton
            stripeKey="pk_test_51HAqy6C38eZnigQMjKlClb3Cb2NEvZKx1TJbIsYCk7t14gA7oQwKzBbfEsUKlLjlOH00J0tuUGXJ6DSSNC0yqbqL00f60605CW"
            token={makePayment}
            amount={getFinalAmount() * 100}
            name="Buy Tshirts"
            shippingAddress
            billingAddress
            >
            <button className="btn btn-success">Pay with stripe</button>
            </StripeCheckoutButton>
        ) : (
            <Link to="/signin">
                <button className="btn btn-success btn-lg">Signin</button>
            </Link>
        )
    }

    return (
        <div>
            <h3 className="text-white">Stripe Checkout: Total $ {getFinalAmount()}</h3>
            {showStripeButton()}
        </div>
    );
};

export default StripeCheckout;
