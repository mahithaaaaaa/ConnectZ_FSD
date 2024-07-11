import React, { useEffect, useState } from 'react'
import HomeComponent from "../components/HomeComponent"
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { useNavigate } from 'react-router-dom';
import Loader from '../components/common/Loader/index';

export default function Home({ currentUser }) {
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
  return loading ? <Loader /> : <HomeComponent currentUser = {currentUser}/>;
}
