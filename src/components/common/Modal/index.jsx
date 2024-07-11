import React, { useState } from 'react';
import "./index.scss"
import { AiOutlinePicture } from "react-icons/ai";
import { uploadPostImageApi } from '../../../api/ImageUpload';
import { Modal, Button, Flex, Progress } from 'antd';
import ReactQuill from 'react-quill';

const ModalComponent = ({ modalOpen, setModalOpen, setStatus, status, sendStatus, isEdit, updateStatus, postImage, setPostImage }) => {
  const [progress, setProgress] = useState(0);
  return (
    <>
      <Modal
        title="Create a post"
        centered
        open={modalOpen}
        onCancel={() => {
          setModalOpen(false);
          setStatus("");
          setPostImage("");
          setProgress(0);
        }}
        footer={[
            <Button 
                key="submit"   
                type="primary" 
                disabled = {status.length > 0 ? false : true}
                onClick={ isEdit ? updateStatus : sendStatus}
            >
                { isEdit ? "Update" : "Post" }
            </Button>
        ]}
      >
        <div className='post-inner'>
          <ReactQuill theme="snow" className='modal-input'  value={status} onChange={setStatus} />
          {progress === 0 || progress === 100 ? <></>
            :
            <div>
              <Flex gap="small" wrap="wrap">
                  <Progress type="circle" percent={progress} />
              </Flex>
            </div>
          }
          { postImage.length > 0 ?  <img src={postImage} alt="post Image" className='preview-image' /> : <></>}
          </div>
        <label htmlFor='pic-upload'> <AiOutlinePicture size={25} className='picture-icon'/> </label>
        <input type="file" id='pic-upload' hidden onChange={(event) => uploadPostImageApi(event.target.files[0],setPostImage,setProgress)}/>
      </Modal>
    </>
  );
};

export default ModalComponent;