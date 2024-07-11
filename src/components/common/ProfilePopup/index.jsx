import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { onLogout } from '../../../api/AuthApi';
import { getCurrentUser } from "../../../api/FirestoreApi";
import Button from '../Button';
import "./index.scss";

export default function ProfilePopup() {
  let navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState({});
  useMemo(() => {
    getCurrentUser(setCurrentUser);
  },[]);
  return (
    <div className='popup-card'>
      <p className='name'>{currentUser.name}</p>
      <p className='role'>{currentUser?.headline}</p>
      <Button title="View Profile" onClick={()=>navigate('/profile', {
            state:{
              id: currentUser?.userId,
            },
        })}
      />
      <Button title="Log out" onClick={onLogout}/>
        
    </div>
  )
}
