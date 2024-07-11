import { useState } from 'react';
import Logo from "../assets/LogoZ.png"
import GoogleButton from 'react-google-button';
import { RegisterApi, GoogleSigninApi } from "../api/AuthApi";
import { postUserData } from '../api/FirestoreApi';
import { useNavigate } from 'react-router-dom';
import "../Sass/LoginComponent.scss"; 
import { toast } from 'react-toastify';

export default function RegisterComponent() {
  let navigate = useNavigate();
  const [credentials, setCredentials] = useState({});
  
  const register = async () => {
    try{
      let res = await RegisterApi(credentials.email,credentials.password);
      toast.success('Account created successfully!');
      localStorage.setItem('userEmail', res.user.email);
      await postUserData(
        {
          userID: res.user.uid,
          name: credentials.name,
          email: credentials.email,
          imageLink: "https://www.pikpng.com/pngl/m/80-805068_my-profile-icon-blank-profile-picture-circle-clipart.png",
          blocked: [],
        }
      );
      navigate('/home');
    }catch(err){ 
      toast.error("Coud'nt create your account!!!");
    }
  };
  const  googleSignIn = async ()=>{
    let response = await GoogleSigninApi();
    toast.success('Account created successfully!');
    localStorage.setItem('userEmail', response.user.email);
    let name = response.user.email.split("@")[0];
    await postUserData(
      {
        userID: response.user.uid,
        name: name, 
        email: response.user.email,
        imageLink: "https://www.pikpng.com/pngl/m/80-805068_my-profile-icon-blank-profile-picture-circle-clipart.png",
        blocked: [],
      }  
    );
    
    navigate('/home');
  };
  return (
    <div className='login-wrapper'>
      <div className='welcome'>
        <img src={Logo} className='LinkedinLogo'/>
        <h2>Welcome to ConnectZ</h2>
      </div>
      <div className='login-wrapper-inner'>
        <h1 className='heading'>Join us</h1>
        <p className='subheading'>Join us into our proffessional world.</p>
        <div className='auth-inputs'>
        <input 
            onChange={(event) => 
              setCredentials({...credentials, name: event.target.value, })
            }
            type='text'
            className='common-input'
            placeholder='Your Name'
          />
          <input 
            onChange={(event) => 
              setCredentials({...credentials, email: event.target.value, })
            }
            type='email'
            className='common-input'
            placeholder='Email'
          />
          <input 
            onChange={(event) => 
              setCredentials({...credentials, password: event.target.value, })
            }
            type='password'
            className='common-input'
            placeholder='Password (6 or more characters)'
          />
        </div>
        <button onClick={register} className='login-btn'>
          Agree & Join
        </button>
        <hr className="hr-text" data-content="or"></hr>
        <GoogleButton 
          className='google-btn'
          onClick={googleSignIn}
        />
        <p className='new-linkedin'>
          Already on ConnectZ ! <span className='join-now' onClick={() => navigate('/')}>Sign in</span>
        </p>
      </div>

    </div>
  )
}
