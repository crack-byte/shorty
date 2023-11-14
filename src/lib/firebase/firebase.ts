import {initializeApp} from "firebase/app";
import {
    addDoc,
    collection,
    doc, DocumentData,
    getDocs,
    getFirestore,
    query,
    QueryDocumentSnapshot,
    updateDoc,
    where
} from "firebase/firestore";

const apiKey = process.env.apiKey;
const authDomain = process.env.authDomain;
const projectId = process.env.projectId;
const storageBucket = process.env.storageBucket;
const messagingSenderId = process.env.messagingSenderId;
const appId = process.env.appId;
const measurementId = process.env.measurementId;

const firebaseConfig = {
    apiKey,
    authDomain,
    projectId,
    storageBucket,
    messagingSenderId,
    appId,
    measurementId
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const collection_name: string = "urls";

export async function writeData(urlMapping: any) {
    try {
        const document = await findMapping('originalUrl', urlMapping.originalUrl)
        if (document) {
            await updateDoc(document.ref, {shortUrl: urlMapping.shortUrl})
            return urlMapping.shortUrl;
        }
        await addDoc(collection(db, collection_name), urlMapping);
        return urlMapping.shortUrl;
    } catch (e) {
        console.error("Error adding document: ", e);
        return null;
    }
}

export async function findMapping(field: string, value: string) {
    console.log(field + ':' + value);
    const q = query(collection(db, 'urls'), where(field, "==", value));
    let validate: any = {};
    try {
        const querySnapshot = await getDocs(q);
        console.log(querySnapshot.size)
        querySnapshot.forEach(snap => {
            validate = snap;
        });
    } catch (e) {
        console.error(e);
    }
    return validate;
}
