import React, { useState, useEffect } from 'react';
import { GiftedChat } from 'react-native-gifted-chat';
import { Text } from 'react-native';


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
    setIsTyping(true);
    const userMessage = {
      role: "user",
      content: newMessages[0].text
    };
    setConversation(prevConversation => [...prevConversation, userMessage]);
    const messageNo = conversation.length % 21 + 1;
    // Construct the chatMessageList payload including the entire conversation
    const payload = {
        chatMessageList: [
            ...messages.map(msg => ({ role: "user", content: msg.text })), // Convert current messages to expected payload format
            { role: "user", content: newMessages[0].text } // Include new message
          ],
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

  const renderFooter = () => {
    if (isTyping) {
      return (
        <Text style={{ padding: 10, textAlign: 'center' }}>Meloni is typing...</Text>
      );
    }
    return null;
  };

  return (
    <GiftedChat
      messages={messages}
      onSend={messages => onSend(messages)}
      user={{
        _id: 1, // ID for the user
      }}
      renderFooter={renderFooter}
    />
  );
};


export default ChatScreen;
