import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from "react-router-dom";
import { router } from  "./Routes";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'react-quill/dist/quill.snow.css';
import { useUserStore } from './ZusStores/UserStore';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebaseConfig';
import Loader from './components/common/Loader';

function App() {

    const {isLoading,fetchUserInfo} = useUserStore();

    useEffect(() => {
        const unSub = onAuthStateChanged(auth,(user) => {
            fetchUserInfo(user?.uid);
        });

        return () => {
            unSub();
        };
    } ,[fetchUserInfo]);

  return ( isLoading ? <Loader/> : 
    <div>
    <RouterProvider router={router} />
    <ToastContainer />
    </div>
  );
}
export default App;
