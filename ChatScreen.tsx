import React, { useState, useEffect } from 'react';
import { GiftedChat } from 'react-native-gifted-chat';
import { View , Text, StyleSheet} from 'react-native';
import { StatusBar } from 'expo-status-bar';
//import meloniAvatar from './meloni.jpg'; // Adjust the path as necessary



const ChatScreen = ({ route }) => {
  const { chatPersonId } = route.params;
  console.log(chatPersonId);
  const [messages, setMessages] = useState([]);
  const [conversation, setConversation] = useState([]); // This will track the entire conversation history for the API payload
  const [isTyping, setIsTyping] = useState(false);
  const [messageNo, setMessageNo] = useState(1);
  const [canSend, setCanSend] = useState(true);

  useEffect(() => {
    // Initial message setup if necessary
  }, []);

  const onSend = (newMessages = []) => {
   // if (!canSend) return; need to find another way since doing this erases user message
    setIsTyping(true); // Show typing indicator
    setCanSend(false);
    setTimeout(() => {
        setCanSend(true);
      }, 60000);
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

    const isAfter10PMorBefore4AM = () => {
        const now = new Date();
        const hours = now.getHours();
      
        // Check if time is after 10 PM (22) or before 4 AM (4)
        return hours >= 22 || hours < 4;
      };
    const payload = {
      chatMessageList: updatedConversation,
      emailId: "fg",
      messageNo: newMessageNo,
      chatPersonId:chatPersonId,
      userCurrentTime: new Date().toLocaleString(),
      isNight: isAfter10PMorBefore4AM()
    };

    fetch('http://ec2-3-109-211-75.ap-south-1.compute.amazonaws.com:8085/api/v1/chat/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    })
    .then(response => {
        if (response.ok) { // Check if response status is 200
          return response.json();
        } else {
          throw new Error('Non-200 response'); // Throw error to be caught by .catch()
        }
      })
    .then(data => {
      setIsTyping(false); // Hide typing indicator after response

      if (data.choices && data.choices.length > 0) {
        const apiResponse = data.choices[0].message;
        const assistantMessage = {
          role: "assistant",
          content: apiResponse.content.trim()
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
            //avatar: meloniAvatar,
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
        text: "I'm busy. Bye",
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'Assistant',
          avatar: 'https://placeimg.com/140/140/any',
        },
      };
      //const errorAssistantMessagePayload = {"role": "assistant", "content": "I'm busy."}
      //setConversation(current => [...current, errorAssistantMessagePayload]);
      setMessages(previousMessages => GiftedChat.append(previousMessages, [errorAssistantMessage]));
    });

    // Also append the new user message to the chat UI
    setMessages(previousMessages => GiftedChat.append(previousMessages, newMessages));
  };

  const renderFooter = () => {
    if (isTyping) {
      return (
        <Text style={{ padding: 10, textAlign: 'center', fontSize: 14 }}>
          Meloni is typing...
        </Text>
      );
    }
    return null;
  };
  
  return (
    <View style={styles.container}>
    <GiftedChat
      messages={messages}
      onSend={messages => onSend(messages)}
      user={{ _id: 1 }}
      isTyping={isTyping}
      renderFooter={renderFooter}
    />
    <StatusBar style="auto" />
    </View>
  );
};
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#FFC0CB', // Set your desired background color here
      // Other styling properties as needed
    },
    // Your existing styles (if any)
  });

export default ChatScreen;
