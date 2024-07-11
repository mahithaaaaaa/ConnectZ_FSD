import React from 'react';
import "./index.scss";
import { useUserStore } from '../../../../ZusStores/UserStore';

function UserInfo() {
  const {currentUserstore} = useUserStore();
  return (
    <div className='user-info'>
        <div className='user'>
            <img src={currentUserstore.imageLink} alt="" />
            <h2>{currentUserstore.name}</h2>
        </div>
        <div className='icons'>
            {/* <img src="src/assets/more.png" alt="" />
            <img src="src/assets/video.png" alt="" />
            <img src="src/assets/edit.png" alt="" /> */}
        </div>
    </div>
  );
}

export default UserInfo;
