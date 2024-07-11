import React, { useState } from 'react';
import { Button, Modal, Flex, Progress } from 'antd';
import "./index.scss";

export default function ImageUploadModal({ modalOpen, setModalOpen, getImage, uploadImage, currentImage, progress }) {
    
    return (
      <>
        <Modal
            title="Upload profile image"
            centered
            open={modalOpen}
            onOk={() => setModalOpen(false)}
            onCancel={() => setModalOpen(false)}
            footer={[
                <Button disabled={currentImage.name ? false : true} key="submit" type="primary" onClick={uploadImage}>
                    Upload
                </Button>,
            ]}
        >   
            <div className='upload-main'>
                <div hidden={currentImage.name ? false : true}>
                    <Flex gap="small" wrap="wrap">
                        <Progress type="circle" percent={progress} />
                    </Flex>
                </div>
                <p>{currentImage.name}</p>
                <label className='upload-btn' htmlFor='image-upload' >Add your picture here</label>
                <input hidden id='image-upload' type="file" onChange={getImage}/>
            </div>
        </Modal>
      </>
    );
}
