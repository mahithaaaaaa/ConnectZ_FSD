import React, { useEffect, useState } from 'react'
import NotificationsComponent from "../components/NotificationsComponent"
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { useNavigate } from 'react-router-dom';
import Loader from '../components/common/Loader/index';

export default function Notifications({ currentUser }) {
    let navigate = useNavigate();
    const [loading, setLoader] = useState(true);

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
  return loading ? <Loader /> : <NotificationsComponent currentUser = {currentUser}/>;
}
