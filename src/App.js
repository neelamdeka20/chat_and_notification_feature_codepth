import React, { useState, useEffect } from 'react';
import Auth from './components/Auth';
import Chat from './components/Chat';
import './App.css';
import { auth } from './firebase';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div>
      <h1>Welcome to Real-time Chat Box</h1>
      <hr className='horizontal-line' />
      <div className="app-container">
        <Auth className="auth-container" />
        {user && (
          <div className="chat-container">
            <Chat />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
