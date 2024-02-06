import React, { useState, useEffect } from 'react';
import { GiftedChat } from 'react-native-gifted-chat';

const ChatScreen = () => {
  const [messages, setMessages] = useState([]);
  const [conversation, setConversation] = useState([]);
  const [isTyping, setIsTyping] = useState(false); // State to manage typing indicator
      // Track the entire conversation


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
    // Append new user message to the conversation state
    const userMessage = {
      role: "user",
      content: newMessages[0].text
    };
    setConversation(prevConversation => [...prevConversation, userMessage]);
    const messageNo = conversation.length % 21 + 1;
    // Construct the chatMessageList payload including the entire conversation
    const payload = {
      chatMessageList: conversation,
      emailId: "fg",
      messageNo: conversation.length + 1 // Adjust message number based on conversation length
    };

    fetch('http://localhost:8085/api/v1/chat/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    })
    .then(response => response.json())
    .then(data => {
        setIsTyping(false);
      if (data.choices && data.choices.length > 0) {
        const apiResponse = data.choices[0].message;
        let newMessage = {
          _id: Math.round(Math.random() * 1000000),
          text: apiResponse.content,
          createdAt: new Date(),
          user: {
            _id: 2, // ID for the assistant
            name: 'Assistant',
            avatar: 'https://placeimg.com/140/140/any',
          },
        };
        
        // Update both the messages displayed and the conversation state
        setMessages(previousMessages => GiftedChat.append(previousMessages, [newMessage]));
        setConversation(prevConversation => [...prevConversation, { role: "assistant", content: apiResponse.content }]);
      }
    })
    .catch((error) => {
        setIsTyping(false);
      console.error('Error:', error);
    });
  };

  return (
    <GiftedChat
      messages={messages}
      onSend={messages => onSend(messages)}
      user={{
        _id: 1, // ID for the user
      }}
    />
  );
};


export default ChatScreen;
