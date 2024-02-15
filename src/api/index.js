import { doc, onSnapshot, setDoc } from "firebase/firestore"
import { auth, db } from "../config/firebase.config"

export const getUserDetail = () => {
    return new Promise((resolve, reject) => {
        const unsubscribe = auth.onAuthStateChanged((userCredentials) => {
            if (userCredentials) {
                const userData = userCredentials.providerData[0]
                const unsubscribe = onSnapshot(
                    doc(db, "users", userData?.uid),
                    (_doc) => {
                        if (_doc.exists()) {
                            resolve(_doc.data())
                        } else {
                            setDoc(
                                doc(db, "users", userData?.uid),
                                userData
                            ).then(() => {
                                resolve(userData)
                            })
                        }
                    }
                )
                return unsubscribe
            } else {
                reject(new Error("User is not authenticated"))
            }
            unsubscribe()
        })
    })
}
