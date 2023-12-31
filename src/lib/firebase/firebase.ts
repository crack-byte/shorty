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
const collection_names: string[] = ["urls", "ips"];

export async function writeDataToUrls(urlMapping: any) {
    try {
        const document = await findMapping('originalUrl', urlMapping.originalUrl)
        if (document) {
            await updateDoc(document.ref, {shortUrl: urlMapping.shortUrl})
            return urlMapping.shortUrl;
        }
        await addDoc(collection(db, collection_names[0]), urlMapping);
        return urlMapping.shortUrl;
    } catch (e) {
        console.error("Error adding document: ", e);
        return null;
    }
}

export function writeDataToIps(options: any) {
    try {
        addDoc(collection(db, collection_names[1]), options)
    } catch (e) {
        console.error("Error writeDataToIps: ", e);
    }
}

export async function findMapping(field: string, value: string) {
    const q = query(collection(db, 'urls'), where(field, "==", value));
    let validate: any = null;
    try {
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach(snap => {
            validate = snap;
        });
    } catch (e) {
        console.error(e);
    }
    return validate;
}
