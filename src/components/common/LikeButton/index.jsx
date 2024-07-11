import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AiOutlineLike, AiFillLike, AiOutlineComment  } from "react-icons/ai";
import { FaCircleArrowRight } from "react-icons/fa6";
import { likePost, getLikeByUser, postComment, getComments } from '../../../api/FirestoreApi';
import "./index.scss";
import { getCurrentTimeStamp } from '../../../helpers/useMoment';

export default function LikeButton({ userId, post, currentUser }) {

    let navigate = useNavigate();
    const [likesCount, setLikesCount] = useState(0);
    const [liked, setLiked] = useState(false);
    const [showCommentBox, setShowCommentBox] = useState(false);
    const [comment, setComment] = useState('');
    const [comments, setComments] = useState([]);

    const handelLike = () => {
        likePost(currentUser, post, liked);
    };

    const getCommentText = (event) => {
        setComment(event.target.value);
    };

    const addComment = () => {
        postComment(post, comment, getCurrentTimeStamp('LLL'), currentUser);
        setComment('');
    }

    useMemo(() => {
        getLikeByUser(userId, post.id, setLiked, setLikesCount);
        getComments(post.id,setComments);
    },[userId,post.id]);

    return (
        <div className='like-container'>
            <p className='likes-count'>{likesCount} people liked this post</p>
            
            <div className='hr-outer'>
                <hr />
            </div>
            <div className='likes-comments'>
                <div onClick={handelLike} className='like-comments-outer' >
                    <span className={liked ? "liked" : "not-liked"}>Like</span>
                    { liked ? <AiFillLike className='like-icon-clicked' size={20} /> : <AiOutlineLike className='like-icon' size={20} /> }
                </div>
                <div onClick={() => setShowCommentBox(!showCommentBox)} className='like-comments-outer' >
                    <span className={showCommentBox ? "liked" : "not-liked"}>Comment</span>
                    <AiOutlineComment className={showCommentBox ? "liked" : "not-liked"} size={20} />
                </div>
            </div>
            {showCommentBox ?
                <>
                    <div className='comment-outer'>
                        <input onChange={getCommentText} placeholder='Add a Comment' className='comment-input' name='comment' value={comment}/>
                        <FaCircleArrowRight size={22} className='comment-send-icon' onClick={addComment}/>
                    </div>
                    {comments.length > 0 ? comments.map((comment) => {
                        return (
                            <div key={comment.id} className='all-comments'>
                                <p 
                                    className='comment-name'
                                    onClick={() => navigate('/profile',{
                                        state: {id: comment.userID, email: comment.userEmail},
                                    })}
                                >
                                    {comment.name}
                                </p>
                                <p className='comment-time'>{comment.timeStamp}</p>
                                <p className='comment-value'>{comment.comment}</p>
                            </div>
                        );
                    }) : <></>}
                </> 
                
                :
                <></>
            }
            
        </div>
    )
}
