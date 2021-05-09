import firebase from "firebase/app";
import "firebase/auth";
import { useState } from "react";
import './App.css';
import firebaseConfig from './components/FirebaseConfig/FirebaseConfig';

firebase.initializeApp(firebaseConfig);

function App() {
  const provider = new firebase.auth.GoogleAuthProvider();
  const [user, setUser] = useState({
    name: '',
    email: '',
    photoURL: '',
    password: '',
    isSignedIn: false,
    error: '',
    success: false,
  })
  const [newUser, setNewUser] = useState(false);
  const handleSignIn = () =>{
    firebase.auth().signInWithPopup(provider)
    .then((res)=>{
      const {displayName, photoURL, email} = res.user;
      const newUser = {
        name: displayName,
        email,
        photoURL,
        password: '',
        isSignedIn: true,
        error:'',
      }
      setUser(newUser);
    })
    .catch((err)=>{
      console.log(err.message);
    })
  }
  const handleSignOut = () =>{
    const newUser = {
      name: '',
      email: '',
      password: '',
      photoURL: '',
      isSignedIn: false,
      error: '',
      success: true
    };
    setUser(newUser);
  }
  const handleSubmit = (e)=>{
    // console.log('hello');
    if(newUser && user.email && user.password){
      firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
      .then((res) => {
        // Signed in 
        const newUserInfo = {...user};
        newUserInfo.success = true;
        newUserInfo.error = '';
        setUser(newUserInfo);
        // ...
      })
      .catch((error) => {
        // var errorCode = error.code;
        var errorMessage = error.message;
        const newUserInfo = {...user};
        newUserInfo.error = errorMessage;
        newUserInfo.success = false;
        setUser(newUserInfo);
      });
    }
    e.preventDefault();
  }
  const handleBlur = (e) =>{
    // console.log(e.target.name, e.target.value);
    let isFieldValid=true;
    if(e.target.name==="email"){
       let isEmailValid = /\S+@\S+\.\S/.test(e.target.value);
       isFieldValid = isEmailValid;
    }if(e.target.name === "password"){
        const checkLength = e.target.value.length > 6;
        const numberCheck = /\d{1}/.test(e.target.value);
        isFieldValid = checkLength && numberCheck;
      }
    if(isFieldValid){
      const newUserInfo = {...user};
      newUserInfo[e?.target?.name] = e?.target?.value;
      // console.log(newUserInfo);
      setUser(newUserInfo);
    }
  }
 
  return (
    <div className="App">
      { user.isSignedIn ?
        <button onClick={handleSignOut}>Sign Out</button> : <button onClick={handleSignIn}>Sign In</button>
      } 
      {/* {user.isSignedIn &&  */}
      <div>
        <input type="checkbox" onChange={()=>setNewUser(!newUser)}></input> 
        <label>New User Sign in</label>
        <form onSubmit={handleSubmit}>
          {newUser && <input onBlur={handleBlur} name="name" type="text" placeholder="Your name" required></input>}<br></br>
          <input onBlur={handleBlur} name="email" type="email" placeholder="Enter email" required></input><br></br>
          <input onBlur={handleBlur} name="password" type="password" placeholder="password" required></input><br></br>
          <button type="submit">Submit</button>
        </form>
        <p style={{color: 'red'}}>{user.error}</p>

      </div>
      {/* } */}
    </div>
  );
}

export default App;