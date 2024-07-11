import React, { useState } from "react";
import { editProfile } from "../../../api/FirestoreApi";
import { IoChevronBackCircleOutline } from "react-icons/io5";
import "./index.scss";

export default function ProfileEdit({ onEdit, currentUser }) {
	const [editInputs, setEditInputs] = useState({});
  const getInput = (event) => {
		let {name, value} = event.target;
		let input = {[name]: value};
		setEditInputs({...editInputs,...input})
	};
	
	const updateProfileData = async () => {
		await editProfile(currentUser?.userId,editInputs);
		await onEdit();
	};

  return (
    <div className="profile-card">
      <div className="edit-btn">
        <IoChevronBackCircleOutline  size={25} className='edit-icon' onClick={() => onEdit()} />
      </div>
      <div className="profile-edit-inputs">
        <label>Name</label>
        <input
          onChange={getInput}
          className="profile-edit-input"
          type="text"
          placeholder="Name"
					name="name"
					defaultValue={currentUser?.name}
        />
        <label>Headline</label>
        <input
          onChange={getInput}
          className="profile-edit-input"
          type="text"
          placeholder="Headline"
					name="headline"
					defaultValue={currentUser?.headline}
        />
        <label>Location</label>
        <input
          onChange={getInput}
          className="profile-edit-input"
          type="text"
          placeholder="Location"
					name="location"
					defaultValue={currentUser?.location}
        />
        <label>Company</label>
        <input
          onChange={getInput}
          className="profile-edit-input"
          type="text"
          placeholder="Company"
					name="company"
					defaultValue={currentUser?.company}
        />
        <label>Industry</label>
        <input
          onChange={getInput}
          className="profile-edit-input"
          type="text"
          placeholder="Industry"
					name="industry"
					defaultValue={currentUser?.industry}
        />
        <label>College</label>
        <input
          onChange={getInput}
          className="profile-edit-input"
          type="text"
          placeholder="College"
					name="college"
					defaultValue={currentUser?.college}
        />
        <label>Website Link</label>
        <input
          onChange={getInput}
          className="profile-edit-input"
          type="text"
          placeholder="Link"
					name="website"
					defaultValue={currentUser?.website}
        />
        <label>About you</label>
        <textarea
          onChange={getInput}
          className="profile-edit-textarea"
          type="text"
          placeholder="About you"
					name="about"
          rows={4}
					defaultValue={currentUser?.about}
        />
        <label>Skills</label>
        <input
          onChange={getInput}
          className="profile-edit-input"
          type="text"
          placeholder="Skills"
					name="skills"
					defaultValue={currentUser?.skills}
        />
        <label>Education</label>
        <input
          onChange={getInput}
          className="profile-edit-input"
          type="text"
          placeholder="Education"
					name="education"
					defaultValue={currentUser?.education}
        />
				<button onClick={updateProfileData} className='submit-btn'>
					Submit
				</button>
      </div>
    </div>
  );
}
