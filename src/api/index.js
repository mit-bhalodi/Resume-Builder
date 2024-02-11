import { auth } from "../config/firebase.config"

export const getUserDetail = () => {
    return new Promise((resolve, reject) => {
        const unsubscribe = auth.onAuthStateChanged((userCredentials) => {
            if (userCredentials) {
                const userData = userCredentials.providerData[0]
                console.log(userData)
            } else {
                reject(new Error("User is not authenticated"))
            }
        })
    })
}
