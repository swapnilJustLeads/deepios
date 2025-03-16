import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Edit from '../assets/images/edit.svg';
import EditModal from './EditModal';
import { 
  useUserWorkoutContext, 
  useUserRecoveryContext, 
  useUserCardioContext 
} from '../context/UserContexts';

const EditOverlay = ({ type, itemId }) => {
  const [editVisible, setEditVisible] = useState(false);
  
  const { handleWorkoutUpdateName, setRefresh: setWorkoutRefresh } = useUserWorkoutContext();
  const { handleRecoveryUpdateName, setRefresh: setRecoveryRefresh } = useUserRecoveryContext();
  const { handleCardioUpdateName, setRefresh: setCardioRefresh } = useUserCardioContext();
  
  const editName = (name) => {
    console.log(itemId, name);
    
    // Call the appropriate update function based on type
    switch(type) {
      case 'recovery':
        handleRecoveryUpdateName(itemId, name);
        setRecoveryRefresh(prev => !prev);
        break;
      case 'cardio':
        handleCardioUpdateName(itemId, name);
        setCardioRefresh(prev => !prev);
        break;
      case 'workout':
      default:
        handleWorkoutUpdateName(itemId, name);
        setWorkoutRefresh(prev => !prev);
        break;
    }
    
    setEditVisible(false);
  };
  
  return (
    <>
      <TouchableOpacity
        style={styles.editButton}
        onPress={() => setEditVisible(true)}
      >
        <Edit width={18} height={18} />
      </TouchableOpacity>
      
      <EditModal visible={editVisible} onSave={editName} />
    </>
  );
};

const styles = StyleSheet.create({
  editButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 100,
    padding: 5,
  }
});

export default EditOverlay;