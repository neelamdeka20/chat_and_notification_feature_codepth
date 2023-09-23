import React, { useState, useEffect } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import { auth, firestore } from '../firebase';
import './Auth.css';

function Auth() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setIsLoggedIn(!!user);
    });

    return () => unsubscribe();
  }, []);

  const getUsernameFromEmail = (email) => {
    return email.split('@')[0];
  };

  const handleSignIn = async () => {
    try {
      setError(null);
      await auth.signInWithEmailAndPassword(email, password);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleSignUp = async () => {
    try {
      setError(null);
      const userCredential = await auth.createUserWithEmailAndPassword(email, password);
      const newUser = userCredential.user;
      const username = getUsernameFromEmail(newUser.email);

      await firestore.collection('users').doc(newUser.uid).set({
        email: newUser.email,
        uid: newUser.uid,
        username,
      });

      setEmail('');
      setPassword('');
    } catch (error) {
      setError(error.message);
    }
  };

  const handleSignOut = () => {
    auth.signOut();
  };

  const googleAuthProvider = new firebase.auth.GoogleAuthProvider();

  const handleGoogleSignIn = async () => {
    try {
      setError(null);
      await auth.signInWithPopup(googleAuthProvider);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="aut-container">
      {user ? (
        <div>
          <h2>Welcome, {getUsernameFromEmail(user.email)}</h2>
          <button className="button" onClick={handleSignOut}>Sign Out</button>
        </div>
      ) : (
        <div className='inputs'>
          <div className='heading'>
            <h4>Signup or Login using Email and Password or by using Gmail</h4>
          </div>
          <input
            className="input1"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="input1"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <br />
          <button className="button" onClick={handleSignUp}>Sign Up</button>
          <button className="button" onClick={handleSignIn}>Sign In</button>
          <button className="button google-button" onClick={handleGoogleSignIn}>
            Sign In with Google
          </button>
          {error && <p className="error">{error}</p>}
        </div>
      )}
    </div>
  );
}

export default Auth;
