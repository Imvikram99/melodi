import React, { useState, useEffect } from 'react';
import { GiftedChat } from 'react-native-gifted-chat';

const ChatScreen = () => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: 'Hello developer',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'React Native',
        },
      },
    ]);
  }, []);

  const onSend = (newMessages = []) => {
    setMessages(previousMessages => GiftedChat.append(previousMessages, newMessages));
    const message = newMessages[0].text;

    fetch('http://localhost:8085/api/v1/chat/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chatMessageList: [
          { role: "user", content: message }
        ],
        emailId: "fg",
        messageNo: 2 // This should be dynamically updated based on your application logic
      })
    })
    .then(response => response.json())
    .then(data => {
      if (data.choices && data.choices.length > 0) {
        const apiResponse = data.choices[0].message;
        let newMessage = {
          _id: Math.round(Math.random() * 1000000),
          text: apiResponse.content,
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'Assistant',
            avatar: 'https://placeimg.com/140/140/any',
          },
        };
        setMessages(previousMessages => GiftedChat.append(previousMessages, [newMessage]));
      }
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  };

  return (
    <GiftedChat
      messages={messages}
      onSend={messages => onSend(messages)}
      user={{
        _id: 1,
      }}
    />
  );
};

export default ChatScreen;
