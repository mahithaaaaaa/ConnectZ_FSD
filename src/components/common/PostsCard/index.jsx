import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LikeButton from "../LikeButton";
import { BsTrash } from "react-icons/bs";
import { HiOutlinePencilSquare } from "react-icons/hi2";
import { getCurrentUser, getAllUsers, deletePost, getConnections } from "../../../api/FirestoreApi";
import { Modal } from 'antd';
import "./index.scss";

export default function PostsCard({ posts, id, getEditData }) {
  let navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState({});
  const [allUsers, setAllusers] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [imageModal, setImageModal] = useState(false);

  useMemo(() => {
    getCurrentUser(setCurrentUser);
    getAllUsers(setAllusers);
  }, []);

  useEffect(() => {
    getConnections(currentUser.userId, posts.userID, setIsConnected);
  }, [currentUser.userId, posts.userID]);

  //console.log(isConnected);

  return (
    isConnected || currentUser.userId === posts.userID ? 
    <div className="posts-card" key={id}>
      <div className="post-info-outer">
        <img
          alt="profile-picture"
          className="profile-image"
          src={
            allUsers
              .filter((item) => item.id === posts.userID)
              .map((item) => item.imageLink)[0]
          }
        />
        <div>
          <p
            className="name"
            onClick={() =>
              navigate("/profile", {
                state: { id: posts.userID, email: posts.userEmail },
              })
            }
          >
            {allUsers.filter((user) => user.id === posts.userID).map((item) => item.name)[0]}
          </p>
          <p className="time-stamp">{posts.timeStamp}</p>
        </div>

        {currentUser.userId === posts.userID ? 
          <div className="action-container">
            <HiOutlinePencilSquare size={15} className="action-icon" onClick={() => getEditData(posts)}/>
            <BsTrash size={15} className="action-icon" onClick={() => deletePost(posts,posts.id) } />
          </div> 
          : 
          <></>
        }
      </div>
      <div className="post-image-outer">
        { posts.postImage ?  <img src={posts.postImage} alt="" className="post-image" onClick={() => setImageModal(true)}/> : <></>}
      </div>
      <div className="status" dangerouslySetInnerHTML={{__html: posts.status}}></div>
      <Modal
        centered = {true}
        open={imageModal}
        onCancel={() => setImageModal(false)}
        footer={[]}
      >
        <img src={posts.postImage} style={{ width: "100%" }} />
      </Modal>
      <LikeButton
        userId={currentUser?.userId}
        post={posts}
        currentUser={currentUser}
      />
    </div>
    :
    <></>
  );
}
