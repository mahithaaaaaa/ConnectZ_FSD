import React from 'react';
import "./index.scss";
import { IoMdClose } from "react-icons/io";

export default function SearchUsers({ setIsSearch, setSearchInput }) {
  return (
    <div className='search-users'>
     
      <input type="text" className='search-input' placeholder='Search User...' onChange={(event) => setSearchInput(event.target.value)}/>
      <IoMdClose 
        size={20} 
        className='react-icon' 
        onClick={() => {
          setIsSearch(false);
          setSearchInput("");
        }} 
      />
    </div>
  );
}
