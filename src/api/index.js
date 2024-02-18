import { arrayRemove, arrayUnion, collection, doc, onSnapshot, orderBy, query, setDoc, updateDoc } from "firebase/firestore"
import { auth, db } from "../config/firebase.config"
import { toast } from "react-toastify"

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

export const getTemplates = () => {
    return new Promise((resolve, reject) => {
        const templateQuery = query(
            collection(db, "templates"),
            orderBy("timeStamp", "desc")
        )
        const unsubscribe = onSnapshot(templateQuery, (_querySnapshot) => {
            const templates = _querySnapshot.docs.map((_doc) => _doc.data())
            resolve(templates)
        })
        return unsubscribe
    })
}

export const saveToCollections = async (user, data) => {
    const docRef = doc(db, "users", user.uid)
    if (!user?.collection?.includes(data._id)) {
        await updateDoc(docRef, {
            collection: arrayUnion(data._id)
        }).then(() => toast.success("Template added to collection successfully")).catch((err) => toast.error(err.message || "Something went wrong"))
    } else {
        await updateDoc(docRef, {
            collection: arrayRemove(data._id)
        }).then(() => toast.success("Template removed from collection")).catch((err) => toast.error(err.message || "Something went wrong"))
    }
}

export const saveToFavourites = async (user, data) => {
    const docRef = doc(db, "templates", data._id)
    if (!data?.favourites?.includes(user.uid)) {
        await updateDoc(docRef, {
            favourites: arrayUnion(user?.uid)
        }).then(() => toast.success("Template added to favourites successfully")).catch((err) => toast.error(err.message || "Something went wrong"))
    } else {
        await updateDoc(docRef, {
            favourites: arrayRemove(user?.uid)
        }).then(() => toast.success("Template removed from favourites")).catch((err) => toast.error(err.message || "Something went wrong"))
    }
}

export const getTemplateDetail = async (templateId) => {
    return new Promise((resolve, reject) => {
        const templateQuery = doc(db, 'templates', templateId)
        const unsubscribe = onSnapshot(templateQuery, (doc) => {
            resolve(doc.data())
        })
        return unsubscribe
    })
}

export const getTemplateDetailEditByUser = (uid, id) => {
    return new Promise((resolve, reject) => {
        const unsubscribe = onSnapshot(
            doc(db, "users", uid, "resumes", id),
            (doc) => {
                resolve(doc.data());
            }
        );

        return unsubscribe;
    });
};

export const getSavedResumes = (uid) => {
    return new Promise((resolve, reject) => {
        if (uid) {
            const templateQuery = query(
                collection(db, "users", uid, "resumes"),
                orderBy("timeStamp", "desc")
            )
            const unsubscribe = onSnapshot(templateQuery, (_querySnapshot) => {
                const resumes = _querySnapshot.docs.map((_doc) => _doc.data())
                resolve(resumes)
            })
            return unsubscribe
        }
        reject("No user Id provided")
    })
}