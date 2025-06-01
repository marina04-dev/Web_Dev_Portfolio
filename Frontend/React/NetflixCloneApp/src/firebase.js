import { initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { addDoc, collection, getFirestore } from 'firebase/firestore'
import { toast } from "react-toastify";

const firebaseConfig = {
  apiKey: "AIzaSyCHjXrBZUMmk12YLuhALPUhdemw9IZ9ego",
  authDomain: "netflix-clone-55764.firebaseapp.com",
  projectId: "netflix-clone-55764",
  storageBucket: "netflix-clone-55764.firebasestorage.app",
  messagingSenderId: "211681399202",
  appId: "1:211681399202:web:7165b8654fb3ba00dd22fb"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const signup = async (name, email, password) => {
    try {
        const res = await createUserWithEmailAndPassword(auth, email, password);
        const user = res.user;
        await addDoc(collection(db, "user", {
            uid: user.uid,
            name,
            authProvider: 'local',
            email,
        }));
    } catch (error) {
        console.log(error);
        toast.error(error.code.split('/')[1].split('-').join(' '));
    }
}

const login = async (email, password) => {
    try {
        await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
        console.log(error);
        toast.error(error.code.split('/')[1].split('-').join(' '));
    }
}

const logout = () => {
    signOut(auth);
}

export {auth, db, login, signup, logout};