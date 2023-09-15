import React, { useState, useEffect, useRef } from 'react';
import { auth, firestore } from '../firebase';
import './Chat.css';

function Chat() {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const messagesRef = firestore.collection('messages').orderBy('timestamp', 'desc');

    const unsubscribe = messagesRef.onSnapshot(
      (snapshot) => {
        const newMessages = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMessages(newMessages.reverse()); // Reverse the order to show the latest message at the bottom
      },
      (error) => {
        setError(error.message);
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  const inputRef = useRef(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    scrollToBottom(); // Scroll to the bottom whenever new messages are received
  }, [messages]); 

  const handleSendMessage = () => {
    setError(null);

    if (text.trim() !== '') {
      firestore
        .collection('messages')
        .add({
          text,
          userId: user ? user.email : null,
          timestamp: new Date(),
        })
        .then(() => {
          setText('');
          inputRef.current.focus(); // Focus on the input field after sending a message
        })
        .catch((error) => {
          setError(error.message);
        });
    }
  };

  const handleSignOut = () => {
    auth.signOut();
  };

  return (
    <div className="ch-container">
      <div className="message-list">
        {messages.map((message) => (
          <div
            className={`message ${message.userId === user?.email ? 'right' : 'left'}`}
            key={message.id}
          >
            <strong>{message.userId || 'Anonymous'}:</strong> {message.text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="input-container">
        <input
          className="input2"
          type="text"
          placeholder="Enter your message"
          value={text}
          onChange={(e) => setText(e.target.value)}
          ref={inputRef}
        />
        <button className="send-button" onClick={handleSendMessage}>
          Send
        </button>
      </div>
      {!user && <p>Please sign in to chat.</p>}
      {error && <p className="error">{error}</p>}
    </div>
  );
}

export default Chat;
