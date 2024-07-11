import React, {useEffect, useState} from 'react';
import "./index.scss";
import Logo from "../../../assets/LogoZ.png";
import { useNavigate } from 'react-router-dom';
import { AiOutlineHome, AiOutlineMessage } from "react-icons/ai";
import { HiOutlineUsers } from "react-icons/hi2";
import { HiOutlineBriefcase } from "react-icons/hi";
import { RiSearchLine } from "react-icons/ri";
import { MdOutlineNotifications } from "react-icons/md";
import { getAllUsers } from '../../../api/FirestoreApi';
import SearchUsers from '../SearchUsers';
import ProfilePopup from '../ProfilePopup';

export default function Topbar({ currentUser }) {
  let navigate = useNavigate();
  const [popupVisible, setPopupVisible] = useState(false);
  const [isSearch, setIsSearch] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [allUsers,setAllUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);

  const goToRoute = (route) => {
    navigate(route);
  };

  const displayPopup = () => {
    setPopupVisible(!popupVisible);
  };

  const openUser = (user) => {
    navigate('/profile/', { state: { id: user.id, email: user.email }, });
  };

  const  searchFunctionality = ()=>{
    if (searchInput !== ''){
      let res = allUsers.filter((user) => {
        return Object.values(user).join('').toLowerCase().includes(searchInput.toLowerCase());
      });
      setFilteredUsers(res);
    }
    else{
      setFilteredUsers(allUsers);
    }
  };

  useEffect(() =>{
    let debounced = setTimeout(() => {
      searchFunctionality();
    },500);
    return () => clearTimeout(debounced);
  }, [searchInput])

  useEffect(()=>{
    getAllUsers(setAllUsers);
    console.log(allUsers);
  }, []);

  return (
    <div className='topbar-main'>
      {popupVisible ? (
        <div className="popup-position">
          <ProfilePopup />
        </div>
      ) : (
        <></>
      )}
      <img src={Logo} alt="linkedin logo" className='LinkedinLogo'/>
      {isSearch ?  <SearchUsers setIsSearch={setIsSearch} setSearchInput={setSearchInput} /> :
        <div className='reactIcons'>
            <RiSearchLine size={25} className='react-icon' onClick={() => setIsSearch(!isSearch)} />
            <AiOutlineHome size={25} className='react-icon' onClick={()=>goToRoute('/home')} />
            <HiOutlineUsers size={25} className='react-icon' onClick={()=>goToRoute('/connections')} />
            {/* <HiOutlineBriefcase size={25} className='react-icon' onClick={()=>goToRoute('/jobs')}/> */}
            <AiOutlineMessage size={25} className='react-icon' onClick={()=>goToRoute('/messages')}/>
            <MdOutlineNotifications size={25} className='react-icon' onClick={()=>goToRoute('/notifications')}/>
        </div>
      }  
      <img src={currentUser.imageLink} alt="dummy user icon" className='user-icon' onClick={displayPopup}/>
      {searchInput.length ===0 ? (<></>) :
        <div className='search-results'>
          {filteredUsers.length === 0 ? (<div className='search-result'>No results found!!!</div>) 
            :
            filteredUsers.map((user) => (
              <div  key={user.id} className='search-result' onClick={() => openUser(user)}>
                <img src={user.imageLink} alt="profile pic" className='search-profile-pic'/>
                <p>{user.name}</p>
              </div>
            ))
          }
        </div>
      }
    </div>
  )
}
