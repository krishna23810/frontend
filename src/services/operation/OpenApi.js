import { endpoints } from '../apis';
import { apiConnector } from '../apiconnector';
import { toast } from 'react-hot-toast';


const {
     CONTACT_US_API,
}= endpoints

export function contactUs(firstName, lastName, mphone, email, message, setLoading) {
    console.log("mphone", mphone);
    return async (dispatch) => {
        const toastId = toast.loading("Sending message...");
        setLoading(true)
        try {
            const response = await apiConnector("POST", CONTACT_US_API,
                {
                    firstName,
                    lastName,
                    mphone,
                    email,
                    message
                }
            )
            console.log('Contact Us response:', response);
            if (!response.data.success) {
                throw new Error("Failed to send message.");
            }

            toast.success("Message sent successfully!");
        } catch (error) {
            toast.error("Error sending message");
            console.error('Error sending message:', error);
        } finally {
            toast.dismiss(toastId);
            setLoading(false);
        }
    }
}