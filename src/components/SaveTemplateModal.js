import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { Button } from '@rneui/themed';

const SaveTemplateModal = ({ onSave = () => {}, onClose = () => {} }) => {
  const [templateName, setTemplateName] = useState('');

  const handleSave = () => {
    if (templateName.trim()) {
      onSave(templateName);
      setTemplateName('');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.modal}>
        <Text style={styles.title}>NAME YOUR TEMPLATE</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={templateName}
            onChangeText={setTemplateName}
            placeholder=""
          />
          <View style={styles.line} />
        </View>
        <Button
          buttonStyle={styles.saveButton}
          onPress={handleSave}
          title="SAVE"
          titleStyle={styles.saveText}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    width: 199,
    height: 120, // Increased height for better layout
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#000000',
    padding: 10,
    alignItems: 'center',
    justifyContent: 'space-between', // Ensure even spacing
  },
  title: {
    fontFamily: 'Inter',
    fontSize: 14,
    fontWeight: '700',
    color: '#000000',
    textAlign: 'center',
    marginTop: 8,
  },
  inputContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
  },
  input: {
    width: '100%',
    height: 20,
    textAlign: 'center',
  },
  line: {
    width: 90,
    height: 1,
    backgroundColor: '#000000',
    marginTop: 2,
  },
  saveButton: {
    marginTop: 10,
    backgroundColor: 'transparent',
  },
  saveText: {
    fontFamily: 'Inter',
    fontSize: 10,
    fontWeight: '700',
    color: '#000000',
    textAlign: 'center',
  },
});

export default SaveTemplateModal;
