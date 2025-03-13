import React, {useState} from 'react';
import {
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {
  useUserCardioContext,
  useUserRecoveryContext,
  useUserSupplementContext,
  useUserWorkoutContext,
} from '../context/UserContexts';
import {useDetails} from '../context/DeatailsContext';

const EditModal = ({visible, onClose, onSave, id, parent, name = ''}) => {
  console.log(id, parent, name, " ")
  const [inputValue, setInputValue] = useState(name);
  const {parentIds} = useDetails();
  const {handleWorkoutUpdateName} = useUserWorkoutContext();
  const {handleCardioUpdateName} = useUserCardioContext();
  const {handleRecoveryUpdateName} = useUserRecoveryContext();
  const {handleSupplementUpdateName} = useUserSupplementContext();

  const handleSaveName = async () => {
    console.log('Saving, updating', parent);
    try {
      switch (parent) {
        case parentIds.Workout:
          await handleWorkoutUpdateName(id, inputValue);
          break;
        case parentIds.Cardio:
          await handleCardioUpdateName(id, inputValue);
          break;
        case parentIds.Recovery:
          await handleRecoveryUpdateName(id, inputValue);
          break;
        case parentIds.Supplement:
          await handleSupplementUpdateName(id, inputValue);
        default:
          break;
      }
      onSave();
      
    } catch {
      console.log('Error updating name');
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}>
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

            <TouchableOpacity
              disabled={!inputValue}
              style={styles.saveButton}
              onPress={() => handleSaveName()}>
              <Text style={styles.saveText}>SAVE</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default EditModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: 280,
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
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
    fontWeight: 'bold',
    color: '#000',
  },
  saveText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
  },
});
