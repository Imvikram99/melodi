// ShareButton.js

import React from 'react';
import { Button, View } from 'react-native';
import { shareMessageWhatsApp } from './ShareService'; // Adjust the path as necessary

const ShareButton = () => {
  return (
    <View style={{ margin: 10 }}>
      <Button
        title="Share on WhatsApp"
        onPress={() => shareMessageWhatsApp('Check out this awesome content!')}
      />
      {/* Add more buttons for other sharing services as needed */}
    </View>
  );
};

export default ShareButton;
