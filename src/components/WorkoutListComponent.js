import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Modal, TextInput} from 'react-native';
import {Card} from '@rneui/themed';
import Copy from '../assets/images/copy.svg';
import Edit from '../assets/images/edit.svg';
import Delete from '../assets/images/delete.svg';

const WorkoutListComponent = () => {
  const [EditModal, setEditModal] = React.useState(false)
  const [CopyModal, setCopyModal] = React.useState(false)
  const [inputValue, setInputValue] = React.useState('');
  const workouts = [
    {name: 'Barbell Bench Press', sets: ['1|3 × 1kg', '2|1', '3|1']},
    {name: 'Barbell Russian Twists', sets: ['1|1 × 0.5kg', '2|1', '3|1']},
    {name: 'Annie', sets: ['1|3 × 1.5kg']},
  ];
const onClose = () => {
  setEditModal(false)
}

const onCopy = () => {
  setCopyModal(false)
}
  return (
    <>
    <Card containerStyle={styles.card}>
      <View style={styles.header}>
        <Text style={styles.workoutText}>WORKOUT</Text>
        <Text style={styles.time}>12:10 pm</Text>
        <View style={styles.icons}>
          <TouchableOpacity onPress={()=> setEditModal(true) } >
          <Edit />
          </TouchableOpacity>
          <TouchableOpacity onPress={()=> setCopyModal(true) } >
        
          <Copy style={styles.iconSpacing} />
          </TouchableOpacity>
          <Delete style={styles.iconSpacing} />
        </View>
      </View>
      <View style={{height:9}} />

      {workouts.map((workout, index) => (
        <View key={index}  >
          <Text style={styles.workoutName}>{workout.name}</Text>
          <View style={[styles.setRow,]}>
            {workout.sets.map((set, setIndex) => {
              const parts = set.split('|'); // Split at '|'

              return (
                <View key={setIndex} style={styles.setItem}>
                  <Text style={styles.setText}>{parts[0]}</Text>
                  <Text style={styles.separatorText}> | </Text>
                  <Text style={styles.setText}>{parts[1]}</Text>
                </View>
              );
            })}
          </View>
          {index < workouts.length - 1 && <View style={styles.separator} />}
        </View>
      ))}
    </Card>
    <Modal
    style={{height:'auto', width:'auto'}}
    visible={EditModal}
    // transparent
    animationType="fade"
    onRequestClose={onClose}
  >
    <View style={styles.overlay}>
      <View style={styles.modalContainer}>
        {/* Input Field */}
        <TextInput
          style={styles.input}
          placeholder="Name"
          placeholderTextColor="#A0A0A0"
          value={inputValue}
          onChangeText={setInputValue}
        />

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelText}>CANCEL</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.saveButton} onPress={() => onSave(inputValue)}>
            <Text style={styles.saveText}>SAVE</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </Modal>
  <Modal
      visible={CopyModal}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* Title */}
          <Text style={styles.title}>Date</Text>

          {/* Message */}
          <Text style={styles.message}>Choose Date</Text>

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelText}>CANCEL</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.copyButton} onPress={onCopy}>
              <Text style={styles.copyText}>COPY</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
    </>
  );
};

export default WorkoutListComponent;

const styles = StyleSheet.create({
  card: {
    borderRadius: 24,
    padding: 7,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: 'black',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop:-2
  },
  workoutText: {
    fontSize: 20,
    fontWeight: '400',
    fontFamily: 'Stomic',
    marginLeft: 5,
  },
  time: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Inter',
    alignSelf: 'center',
    verticalAlign: 'middle',
    // backgroundColor: 'red',
  },
  icons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconSpacing: {
    marginLeft: 8,
    marginRight: 3,
  },
  workoutName: {
    fontSize: 14,
    fontFamily: 'Inter',
    fontWeight: '700',
    marginLeft: 4,
  },
  setRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginLeft: 6,
  },
  setItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  setText: {
    fontSize: 14,
    fontFamily: 'Inter',
    fontWeight: '400',
    marginRight: 4,
  },
  separatorText: {
    fontSize: 14,
    fontFamily: 'Inter',
    fontWeight: '700',
    color: 'black', // Different styling for '|'
    marginHorizontal: 2,
  },
  separator: {
    borderBottomWidth: 0.9,
    borderBottomColor: '#000',
    marginVertical: 8,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: 280,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 10,
  },
  input: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderColor: '#D3D3D3',
    borderRadius: 10,
    paddingHorizontal: 10,
    fontSize: 16,
    color: '#000',
    marginBottom: 15,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#FFF',
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#000',
    marginRight: 5,
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#00E5FF',
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
    marginLeft: 5,
  },
  cancelText: {
    fontSize: 14,
    color: '#000',
    fontFamily:'Inter',
    fontWeight:900,
  },
  saveText: {
    fontSize: 14,
    color: '#000',
    fontFamily:'Inter',
    fontWeight:900
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#FFF',
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#000',
    marginRight: 5,
  },
  copyButton: {
    flex: 1,
    backgroundColor: '#00E5FF',
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
    marginLeft: 5,
  },
  cancelText: {
    fontSize: 14,
    
    color: '#000',
    fontFamily:'Inter',
    fontWeight:900
  },
  copyText: {
    fontSize: 14,
 
    color: '#000',
    fontFamily:'Inter',
    fontWeight:900
  },
  title: {
    fontSize: 18,
  
    color: '#333',
    marginBottom: 10,
    fontFamily:'Inter',
    fontWeight:900
  },
  message: {
    fontSize: 14,
    color: '#000',
    marginBottom: 20,
   
  },
  
});
