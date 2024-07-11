import React, { useEffect, useState } from 'react';
import { getNotifications, addConnection, removeNotification, removeRequest, rejectRequest, getSinglePostById } from "../api/FirestoreApi";
import "../Sass/NotificationsComponent.scss";
import { useNavigate } from 'react-router-dom';
import { BsTrash } from "react-icons/bs";
import { Modal } from 'antd';
import PostsCard from "./common/PostsCard";

export default function NotificationsComponent({ currentUser }) {

  const [notifications, setNotifications] = useState();
  const [modal2Open, setModal2Open] = useState(false);
  const [post,setPost] = useState();

  const navigate = useNavigate();

  const removeReq = (req) => {
    removeRequest(currentUser.userId,req.targetId);
  }

  const handleAccept = (req) => {
    addConnection(currentUser.userId,req.targetId);
  };

  const handleReject = (req) => {
    rejectRequest(currentUser.userId,req.targetId);
    //removeRequest(currentUser.userId,req.targetId);
  }

  const removeNoti = (noti) => {
    removeNotification(currentUser.userId,noti.notiID);
  };
 
  const openPost = async (noti) => {
    await getSinglePostById(noti.postID,setPost);
    setModal2Open(true);
  }

  useEffect(() => {
    getNotifications(currentUser.userId,setNotifications);
  }, [currentUser.userId]);


  return (
    <div className='notifications-outer'>
        <div className='notifications-main'>
            <div className='requests'>
                <div className='title'>
                  <h2>Your Requests.</h2>
                </div>
                {notifications?.requests.map((req) => {
                    return ( 
                        <div key={req.targetId} className='request-outer' >
                          {req.received ? 
                            <div>
                              {req.accepted !== "pending" && <BsTrash size={15} className="action-icon" onClick={() => removeReq(req) } />}
                              <p>
                                <span 
                                  onClick={() =>{
                                    navigate("/profile", {
                                      state: { id: req.targetId, email: req.targetEmail },
                                    })
                                  }
                                  }>{req?.targetName}
                                  </span> has sent a connection request.
                              </p>

                              {req.accepted ==="pending" && <div className='btns'>
                                    <button onClick={()=>handleAccept(req)} className='btn'>Accept</button>
                                    <button onClick={() => handleReject(req)} className='btn'>Reject</button>
                              </div>}
                              {req.accepted === "accepted" && <p>
                                You have accepted the request. Now you both are connected.
                              </p>}
                              {req.accepted === "rejected" && <p>
                                You have rejected the request.
                              </p>}
                              
                            </div>
                            :
                            <div>
                              {req.accepted!=="pending" && <BsTrash size={15} className="action-icon" onClick={() => removeReq(req) } />}
                              <p>
                                You have sent a connection request to <span 
                                  onClick={() =>{
                                    navigate("/profile", {
                                      state: { id: req.targetId, email: req.targetEmail },
                                    })
                                  }
                                  }>{req?.targetName}
                                  </span>.
                              </p>
                              <p><b>Status :</b> {req?.accepted}</p>
                            </div>
                          }
                        </div>
                    );
                })}
            </div>
            <div className='requests'>
              <div className='title'>
                <h2>Your Notifications.</h2>
              </div>
                {notifications?.notifications.map((noti) => {
                return ( 
                    <div key={noti.id} className='request-outer'>
                      <BsTrash size={15} className="action-icon" onClick={() => removeNoti(noti) } />
                      {noti.actionType === "Liked" && 
                        <p>
                          <span className={noti.targetName===currentUser.name ? "you" : ""}
                            onClick={() =>{
                              navigate("/profile", {
                                state: { id: noti.targetId, email: noti.targetEmail },
                              })
                            }}
                          >{noti.targetName===currentUser.name ? "You" : noti.targetName}</span> {noti.targetName===currentUser.name ? "have" : "has"} Liked your post. <span onClick={()=>openPost(noti)}>View Post.</span>
                        </p>
                      }
                      {noti.actionType === "Commented" && 
                        <p>
                          <span className={noti.targetName===currentUser.name ? "you" : ""}
                            onClick={() =>{
                              navigate("/profile", {
                                state: { id: noti.targetId, email: noti.targetEmail },
                              })
                            }}
                          >{noti.targetName===currentUser.name ? "You" : noti.targetName}</span> {noti.targetName===currentUser.name ? "have" : "has"} commented <b><i>{noti.text}</i></b> on your post. <span onClick={()=>openPost(noti)}>View Post.</span>
                        </p>
                      }
                    </div>
                );
                })}
            </div>
            <Modal
              title="The Post."
              centered
              open={modal2Open}
              onCancel={() => setModal2Open(false)}
              footer={[]}
              width={615}
            >
              <PostsCard posts = {post}/>
            </Modal>
        </div>
    </div>
  );
}
