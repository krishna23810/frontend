import toast from "react-hot-toast";
import { apiConnector } from "../apiconnector";
import image from '../../assets/comman/logo-full-white.png'
import { setPaymentLoading } from "../../slice/courseSlice";
import { resetCart } from "../../slice/cartSlice";
import { setFromCart } from "../../slice/cartSlice";
import { useSelector } from "react-redux";

const { paymentApi } = require("../apis");



const { CAPTURE_PAYMENT_API,SEND_CONFIRMATION_EMAIL_API, VERIFY_PAYMENT_API } = paymentApi;


function loadPaymentScript(src) {
    return new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = src;
        script.onload = () => resolve(true);
        script.onerror = () => reject(false, new Error("Failed to load Stripe.js"));
        document.body.appendChild(script);
    });
}

export async function buyCourse(courses, token,userDetail,navigate,dispatch ,fromCart) {
    const toastId = toast.loading("Redirecting to payment gateway...", {
        duration: 5000
    });
    try {
        const stripe = await loadPaymentScript("https://checkout.razorpay.com/v1/checkout.js");
        if (!stripe) {
            throw new Error(" failed to load razorpay sdk.");
        }
        //initiate the order
        const orderResponse = await apiConnector("POST", CAPTURE_PAYMENT_API, { courses },
            {
                Authorization: `Bearer ${token}`
            }
        )
        if (orderResponse.error) {
            throw new Error(orderResponse.error);
        }
        console.log("Order response:", orderResponse);
        const options = {
            "key": process.env.RAZORPAY_KEY_ID || "rzp_test_doGT3JACNPOQ3k", // Public Token
            "amount": orderResponse.data.amount, // Amount is in currency subunits. Default currency is INR. 
            "currency": orderResponse.data.currency,
            "name": "KK tech solution", //your business name
            description:"Thank You to purchasing the Course" ,
            "order_id": orderResponse.data.orderId, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
            "image": image, //Image URL
            "callback_url": "https://eneqd3r9zrjok.x.pipedream.net/",
            "prefill": { //We recommend using the prefill parameter to auto-fill customer's contact information especially their phone number
                "name": userDetail.firstName, //your customer's name
                "email": userDetail.email,
                "contact": userDetail.contact //Provide the customer's phone number for better conversion rates
            },
            handler : function (response) {
                // Handle the successful payment response
                console.log("Payment successful:", response);
                sendConfirmationEmail(response , orderResponse.data.amount,token);
                // You can dispatch an action or perform any other logic here
                verifyPayment({...response,courses},token,navigate,dispatch ,fromCart);
            },
            "notes": {
                "address": "Razorpay Corporate Office"
            },
            "theme": {
                "color": "#3399cc"
            }
        }
        const payment = new window.Razorpay(options);
        payment.open();

    } catch (error) {
        console.error("Error buying course:", error);
    }
    toast.dismiss(toastId);
}

async function sendConfirmationEmail(paymentResponse, amount, token) {
    try {
         await apiConnector("POST", SEND_CONFIRMATION_EMAIL_API, {
            orderId:paymentResponse.razorpay_order_id ,
            paymentId:paymentResponse.razorpay_payment_id,
            amount,
        }, {
            Authorization: `Bearer ${token}`
        });
        // console.log("Confirmation email sent successfully:", emailResponse.data);
    } catch (error) {
        console.error("Error sending confirmation email:", error);
    }
}

async function verifyPayment(paymentData, token, navigate, dispatch ,fromCart) {
    console.log("verifyPayment function called with data:", paymentData);
    const toastId = toast.loading("Verifying payment...", {
        duration: 5000
    });
    try {
    dispatch(setPaymentLoading(true));
        const response = await apiConnector("POST", VERIFY_PAYMENT_API, paymentData, {
            Authorization: `Bearer ${token}`
        });
        if (response.error) {
            throw new Error(response.error);
        }
        toast.success("Payment verified successfully!", {
            id: toastId,
            duration: 3000
        });
        navigate("/dashboard/enrolled-courses");
        if (fromCart) {
            dispatch(resetCart());
            dispatch(setFromCart(false));
        }
        console.log("Payment verified successfully:", response.data);
        // You can dispatch an action or perform any other logic here
    } catch (error) {
        console.error("Error verifying payment:", error);
        toast.error("Payment verification failed. Please try again.", {
            id: toastId,
            duration: 3000
        });
    }
    finally {
        toast.dismiss(toastId);
        dispatch(setPaymentLoading(false));
    }
}   