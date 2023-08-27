import { FirebaseApp, initializeApp } from "firebase/app";
import { Database, child, get, getDatabase, ref, set } from "firebase/database";
import { conf } from "../../config.js";
import { getAuth } from "firebase/auth";
import { signInWithEmailAndPassword } from "firebase/auth";

class DatabaseService {
    app: FirebaseApp;
    db: Database;

    constructor() {
        try {
            this.app = initializeApp({
                ...conf.firebase
            })

            const auth = getAuth()
            signInWithEmailAndPassword(auth, conf.authFirebase.email, conf.authFirebase.password).catch((error) => {
                const {code, message} = error;
                console.log(`${code} - ${message}`);
            })

            this.db = getDatabase(this.app)
            console.log('initialazed');
        } catch {
            console.error('App works witchout database');
            
        }
    }

    getSavedAds(): Promise<Collection<Ad>> {
        return new Promise((resolve, reject) => {
            get(child(ref(this.db), 'ads')).then((snapshot) => {
                if(snapshot.exists()){
                    resolve(snapshot.val() || {})
                }else {
                    reject("No data available ")
                }
            }).catch((error) => {
                reject(error)
            })
        })
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setNewAd(ad: Ad): Promise<any> {
        return new Promise((resolve, reject) => {
            set(ref(this.db, 'ads' + '/' + ad.id), ad).then(() => resolve(''))
            .catch(err => {
                reject(err)
            })
        })
    }
}

const db = new DatabaseService()
export default db
export interface Collection<T> {
    [key: string]: T
}

export interface Ad {
    id: string,
    title: string,
    url: string
}