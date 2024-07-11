import React, { useMemo,useState } from 'react';
import Topbar from '../components/common/Topbar'
import Connections from "../Pages/Connections"
import { getCurrentUser } from '../api/FirestoreApi';

export default function ConnectionsLayout() {
  const [currentUser,setCurrentUser] = useState({});

  useMemo(() => {
    getCurrentUser(setCurrentUser);
  },[])
  return (
    <div>
        <Topbar currentUser = {currentUser} />
        <Connections currentUser = {currentUser} />
    </div>
  )
}
