import {firestore} from "../firebaseConfig"
import { doc, getDoc } from 'firebase/firestore';
import { create } from 'zustand';

export const useUserStore = create((set) => ({
  currentUserstore: null,
  isLoading: true,
  fetchUserInfo: async (uid) => {

    if(!uid) return set({currentUserstore: null,isLoading: false});
    try{
        const docRef = doc(firestore,"users",uid);
        const docSnap = await getDoc(docRef);

        if(docSnap.exists()){
            set({currentUserstore: docSnap.data(),isLoading: false});
        }
        else{
            set({currentUserstore: null, isLoading: false});
        }
    }
    catch(error){
        console.log(error);
        return set({currentUserstore: null,isLoading: false});
    }
  }
}))