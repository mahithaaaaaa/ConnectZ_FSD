import React, { useMemo,useState } from 'react';
import Topbar from '../components/common/Topbar'
import Home from "../Pages/Home";
import { getCurrentUser } from '../api/FirestoreApi';

export default function HomeLayout() {
  const [currentUser,setCurrentUser] = useState({});

  useMemo(() => {
    getCurrentUser(setCurrentUser);
  },[])
  return (
    <div>
        <Topbar currentUser = {currentUser} />
        <Home currentUser = {currentUser} />
    </div>
  )
}
