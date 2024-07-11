import React, { useEffect, useState } from 'react';
import MessagesComponent from "../components/MessagesComponent";
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { useNavigate } from 'react-router-dom';
import Loader from '../components/common/Loader/index';
import { useUserStore } from '../ZusStores/UserStore';

export default function Messages({ currentUser }) {

  let navigate = useNavigate();
    const [loading, setLoader] = useState(true);
    const {isLoading} = useUserStore();

    useEffect(() => {
        onAuthStateChanged(auth, res => {
            if(!res?.accessToken){
                navigate('/');
            }
            else{
                setLoader(false);
            }
        });
    }, []);
  return loading&&isLoading ? <Loader /> : <MessagesComponent currentUser = {currentUser}/>
}
