import React, { useState, useMemo } from "react";
import {
  PostStatustoDB,
  getStatus,
  updatePost,
} from "../../../api/FirestoreApi";
import ModalComponent from "../Modal/index";
import PostsCard from "../PostsCard/index";
import { getCurrentTimeStamp } from "../../../helpers/useMoment";
import { getUniqueId } from "../../../helpers/getUniqueId";
import "./index.scss";

export default function PostStatus({ currentUser }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [status, setStatus] = useState("");
  const [allStatus, setAllStatus] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [currentPost, setCurrentPost] = useState({});
  const [postImage, setPostImage] = useState('');

  const sendStatus = async () => {
    let object = {
      status: status,
      timeStamp: getCurrentTimeStamp("LLL"),
      userEmail: currentUser.email,
      userName: currentUser.name,
      userID: currentUser.userId,
      postId: getUniqueId(),
      postImage: postImage,
    };
    await PostStatustoDB(object);
    await setModalOpen(false);
    await setIsEdit(false);
    await setStatus("");
    await setPostImage("");
  };

  const getEditData = (posts) => {
    console.log(posts);
    setModalOpen(true);
    setStatus(posts?.status);
    setPostImage(posts?.postImage);
    setCurrentPost(posts);
    setIsEdit(true);
  };

  const updateStatus = () => {
    console.log(currentPost);
    updatePost(currentPost.id, status, postImage);
    setStatus("");
    setPostImage("");
    setModalOpen(false);
  };

  useMemo(() => {
    getStatus(setAllStatus);
  }, []);

  //console.log(allStatus);

  return (
    <div className="post-status-main">
      <div className="user-details">
        <img src={currentUser.imageLink} alt="" className="profile-pic" />
        <p className="name">{currentUser.name}</p>
        <p className="headline">{currentUser.headline}</p>
      </div>
      <div className="post-status">
        <img src={currentUser.imageLink} alt="" className="post-create-pic" />
        <button
          className="open-post-window"
          onClick={() => {
            setModalOpen(true);
            setIsEdit(false);
          }}
        >
          Create a post
        </button>
      </div>
      <ModalComponent
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
        setStatus={setStatus}
        status={status}
        sendStatus={sendStatus}
        isEdit={isEdit}
        updateStatus={updateStatus}
        postImage={postImage}
        setPostImage={setPostImage}
      />
      <div>
        {allStatus.map((posts) => {
          return (
            <div key={posts.id}>
              <PostsCard posts={posts} getEditData={getEditData} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
