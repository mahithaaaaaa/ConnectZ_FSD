import React, { useEffect, useState } from 'react';
import RegisterComponent from "../components/RegisterComponent"
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { useNavigate } from 'react-router-dom';
import Loader from '../components/common/Loader/index';

export default function Login() {
  let navigate = useNavigate();
  const [loading, setLoader] = useState(true);
  useEffect(() => {
    onAuthStateChanged(auth, res => {
        if(res?.accessToken){
          navigate('/home');
        }
        else{
          setLoader(false);
        }
    });
}, []);
  return loading ? <Loader /> : <RegisterComponent />;
}
