import React, { useState, useEffect } from 'react';
import { GiftedChat } from 'react-native-gifted-chat';
import { Text } from 'react-native';


const ChatScreen = () => {
  const [messages, setMessages] = useState([]);
  const [conversation, setConversation] = useState([]); // This will track the entire conversation history for the API payload
  const [isTyping, setIsTyping] = useState(false);
  const [messageNo, setMessageNo] = useState(1);

  useEffect(() => {
    // Initial message setup if necessary
  }, []);

  const onSend = (newMessages = []) => {
    setIsTyping(true); // Show typing indicator

    const userMessage = {
      role: "user",
      content: newMessages[0].text
    };

    // Update conversation history to include the new user message
    let updatedConversation = [...conversation, userMessage];
    if (updatedConversation.length > 20) {
        updatedConversation = updatedConversation.slice(-20); // Keep only the last 20 items
      }
    setConversation(updatedConversation);

    // Determine the message number, resetting if necessary
    const newMessageNo = messageNo;

    const payload = {
      chatMessageList: updatedConversation,
      emailId: "fg",
      messageNo: newMessageNo
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
      setIsTyping(false); // Hide typing indicator after response

      if (data.choices && data.choices.length > 0) {
        const apiResponse = data.choices[0].message;
        const assistantMessage = {
          role: "assistant",
          content: apiResponse.content
        };

        // Include the assistant's response in the conversation history
        setConversation(current => [...current, assistantMessage]);

        // Append the assistant message to the chat UI
        const newAssistantMessage = {
          _id: Math.round(Math.random() * 1000000),
          text: apiResponse.content,
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'Assistant',
            avatar: 'https://placeimg.com/140/140/any',
          },
        };
        setMessages(previousMessages => GiftedChat.append(previousMessages, [newAssistantMessage]));

        // Update the message number for the next round
        setMessageNo(currentNo => (currentNo));
      }
    })
    .catch((error) => {
      setIsTyping(false); // Ensure to hide typing indicator in case of an error
      console.error('Error:', error);
      const errorAssistantMessage = {
        _id: Math.round(Math.random() * 1000000),
        text: "I'm busy.",
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'Assistant',
          avatar: 'https://placeimg.com/140/140/any',
        },
      };
      setMessages(previousMessages => GiftedChat.append(previousMessages, [errorAssistantMessage]));
    });

    // Also append the new user message to the chat UI
    setMessages(previousMessages => GiftedChat.append(previousMessages, newMessages));
  };

  const renderFooter = () => {
    if (isTyping) {
      return (
        <Text style={{ padding: 10, textAlign: 'center', fontSize: 14 }}>
          Assistant is typing...
        </Text>
      );
    }
    return null;
  };
  
  return (
    <GiftedChat
      messages={messages}
      onSend={messages => onSend(messages)}
      user={{ _id: 1 }}
      isTyping={isTyping}
      renderFooter={renderFooter}
    />
  );
};

export default ChatScreen;
