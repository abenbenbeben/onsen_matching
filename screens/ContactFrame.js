import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';

const ContactScreen = () => {
  const openGoogleForm = () => {
    const url = 'https://docs.google.com/forms/d/e/1FAIpQLSfi_PeZwHhEKXyDWbEXwcAd4qCAHgBCAsR2YtqzG5j9dY5ugw/viewform?usp=sf_link'; // GoogleフォームのURLに置き換えてください
    Linking.canOpenURL(url).then((supported) => {
      if (supported) {
        Linking.openURL(url);
      } else {
        console.log("Don't know how to open URI: " + url);
      }
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>開発者に連絡</Text>
      <Text style={styles.content}>
        ご意見やご質問があれば、以下のボタンからGoogleフォームを通してお知らせください。
      </Text>
      <TouchableOpacity style={styles.button} onPress={openGoogleForm}>
        <Text style={styles.buttonText}>Googleフォームを開く</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  content: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default ContactScreen;
