import {    signInWithEmailAndPassword,
            createUserWithEmailAndPassword,
            GoogleAuthProvider,
            signInWithPopup,
            signOut} from "firebase/auth";
import { auth } from "../firebaseConfig";

export const LoginApi = (email, password) => {
    try{
        let response = signInWithEmailAndPassword(auth, email, password);
        return response;
    }
    catch(err){
        return err;
    }
};

export const RegisterApi = (email, password) => {
    try{
        let response = createUserWithEmailAndPassword(auth, email, password);
        return response;
    }
    catch(err){
        return err;
    }
};

export const GoogleSigninApi = () => {
    try{
        let GoogleProvider = new GoogleAuthProvider();
        let res = signInWithPopup(auth,GoogleProvider);
        return res;
    }
    catch(err){
        return err;
    }
};

export const onLogout = () => {
    try{
        signOut(auth);
    }
    catch(err){
        return err;
    }
};