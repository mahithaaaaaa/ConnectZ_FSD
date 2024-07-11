import React, { useEffect, useState } from 'react';
import ProfileComponent from "../components/ProfileComponent";
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { useNavigate } from 'react-router-dom';
import Loader from '../components/common/Loader/index';

export default function Profile({ currentUser }) {

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
  return loading ? <Loader /> : <ProfileComponent currentUser = {currentUser}/>
}
