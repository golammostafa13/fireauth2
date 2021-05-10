import firebase from "firebase/app";
import "firebase/auth";
import { useState } from "react";
import './App.css';
import firebaseConfig from './components/FirebaseConfig/FirebaseConfig';

firebase.initializeApp(firebaseConfig);

function App() {
  const googleProvider = new firebase.auth.GoogleAuthProvider();
  const fbProvider = new firebase.auth.FacebookAuthProvider();
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
    firebase.auth().signInWithPopup(googleProvider)
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

  const  handleFbSignIn = () => {
    firebase
    .auth()
    .signInWithPopup(fbProvider)
    .then((result) => {

      // The signed-in user info.
      var user = result.user;
      console.log(user);
      // ...
    })
    .catch((error) => {
      // Handle Errors here.
      var errorMessage = error.message;
      console.log(errorMessage);
      // ...
    });
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
        updateUserName(user.name);
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
    if(!newUser && user.email && user.password){
      firebase.auth().signInWithEmailAndPassword(user.email, user.password)
    .then((res) => {
      // Signed in 
      const newUserInfo = {...user};
      newUserInfo.success = true;
      newUserInfo.error = '';
      setUser(newUserInfo);
      console.log(res.user);
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
  const updateUserName = (name) =>{
    var user = firebase.auth().currentUser;

    user.updateProfile({
      displayName: name,
    }).then(function() {
      console.log("Updated user info: " + name);
    }).catch(function(error) {
      console.log(error);
    });
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
        <button onClick={handleSignOut}>Sign Out</button> : <button onClick={handleSignIn}>Sign In with google</button>
      } 
      {/* {user.isSignedIn && } */}
      <br></br>
      <button onClick={handleFbSignIn}>Sign in with facebook</button>
      <div>
        <input type="checkbox" onChange={()=>setNewUser(!newUser)}></input> 
        <label>New User Sign in</label>
        <form onSubmit={handleSubmit}>
          {newUser && <input onBlur={handleBlur} name="name" type="text" placeholder="Your name"></input>}<br></br>
          <input onBlur={handleBlur} name="email" type="email" placeholder="Enter email" required></input><br></br>
          <input onBlur={handleBlur} name="password" type="password" placeholder="password" required></input><br></br>
          <button type="submit">{newUser?'Sign Up':'Sign In'}</button>
        </form>
        <p style={{color: 'red'}}>{user.error}</p>
        {user.success && <p style={{color: 'green'}}>User created successfully</p>}
        
      </div>
    </div>
  );
}

export default App;