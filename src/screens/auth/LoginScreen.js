import React from 'react';
import { View, TextInput, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { Button, Text } from '@rneui/themed';

const LoginScreen = () => {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.logoContainer}>
        <Text style={styles.logo}>DEEPA</Text>
        <Text style={styles.subtitle}>DAILY EXERCISE, ENDURANCE AND PROGRESS</Text>
      </View>

      <View style={styles.inputContainer}>
        <TextInput placeholder="eMail" placeholderTextColor="#999" style={styles.input} />
        <TextInput
          placeholder="Password"
          placeholderTextColor="#999"
          secureTextEntry
          style={styles.input}
        />
      </View>

      <Button title="LOGIN" buttonStyle={styles.loginButton} titleStyle={styles.loginText} />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 50,
  },
  logo: {
    fontSize: 50,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitle: {
    fontSize: 12,
    color: '#fff',
    textTransform: 'uppercase',
    fontWeight: '600',
    textAlign: 'center',
  },
  inputContainer: {
    width: '100%',
    marginBottom: 30,
  },
  input: {
    backgroundColor: 'transparent',
    color: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#777',
    fontSize: 16,
    paddingVertical: 10,
    marginBottom: 20,
  },
  loginButton: {
    backgroundColor: '#5ED4FF',
    borderRadius: 5,
    paddingVertical: 12,
    width: '100%',
  },
  loginText: {
    fontWeight: 'bold',
    color: '#000',
  },
});

export default LoginScreen;
