import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView } from 'react-native';
import CalendarUI from './CalendarUI';

const CopyDateModal = ({ visible, onClose, onCopy }) => {
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDates, setSelectedDates] = useState([]);
  
  const handleDateSelections = (dates) => {
    // For multi-select, we receive an array of dates
    setSelectedDates(dates);
  };
  
  const handleCopyPress = () => {
    if (selectedDates.length > 0) {
      onCopy(selectedDates);
    }
    onClose();
  };
  
  const handleClose = () => {
    setShowCalendar(false);
    setSelectedDates([]);
    onClose();
  };
  
  const formatDate = (date) => {
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };
  
  const removeDate = (index) => {
    const newDates = [...selectedDates];
    newDates.splice(index, 1);
    setSelectedDates(newDates);
  };
  
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.chooseDateContainer}>
            <TouchableOpacity 
              onPress={() => setShowCalendar(true)}
              activeOpacity={0.7}
              style={styles.chooseDateButton}
            >
              <Text style={styles.chooseDateText}>Choose Dates</Text>
            </TouchableOpacity>
            
            {selectedDates.length > 0 && (
              <View style={styles.selectedDatesContainer}>
                <Text style={styles.selectedDatesTitle}>
                  Selected Dates ({selectedDates.length}):
                </Text>
                <ScrollView 
                  style={selectedDates.length > 3 ? styles.dateScrollContainer : null}
                  contentContainerStyle={styles.dateChipsContainer}
                >
                  {selectedDates.map((date, index) => (
                    <View key={index} style={styles.dateChip}>
                      <Text style={styles.dateChipText}>
                        {formatDate(date)}
                      </Text>
                      <TouchableOpacity
                        style={styles.removeChipButton}
                        onPress={() => removeDate(index)}
                      >
                        <Text style={styles.removeChipText}>✕</Text>
                      </TouchableOpacity>
                    </View>
                  ))}
                </ScrollView>
              </View>
            )}
          </View>
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={styles.cancelButton} 
              onPress={handleClose}
            >
              <Text style={styles.cancelText}>CANCEL</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[
                styles.copyButton,
                selectedDates.length === 0 && styles.disabledButton
              ]}
              onPress={handleCopyPress}
              disabled={selectedDates.length === 0}
            >
              <Text style={styles.copyText}>COPY</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Calendar Modal (separate from the main modal) */}
      <Modal
        visible={showCalendar}
        transparent
        animationType="fade"
        onRequestClose={() => setShowCalendar(false)}
      >
        <View style={styles.calendarOverlay}>
          <View style={styles.calendarModalContainer}>
            
            
            <View style={styles.calendarContainer}>
              <CalendarUI 
                onSelectDate={handleDateSelections}
                multiSelect={true}
              />
            </View>
            
            <View style={styles.calendarButtonContainer}>
              <TouchableOpacity 
                style={styles.doneButton} 
                onPress={() => setShowCalendar(false)}
              >
                <Text style={styles.doneButtonText}>DONE</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: 320,
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
  chooseDateContainer: {
    width: '100%',
    alignItems: 'center',
    marginVertical: 10,
  },
  chooseDateButton: {
    padding: 8,
  },
  chooseDateText: {
    fontSize: 16,
    color: '#000',
    textDecorationLine: 'underline',
  },
  selectedDatesContainer: {
    width: '100%',
    marginTop: 15,
    alignItems: 'center',
  },
  selectedDatesTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  dateScrollContainer: {
    maxHeight: 120,
    width: '100%',
  },
  dateChipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  dateChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e6f7ff',
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
    margin: 4,
    borderWidth: 1,
    borderColor: '#7dd3fa',
  },
  dateChipText: {
    fontSize: 12,
    color: '#333',
    marginRight: 6,
  },
  removeChipButton: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#DDDDDD',
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeChipText: {
    fontSize: 10,
    color: '#666',
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 15,
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
  cancelText: {
    color: '#000',
    fontWeight: '600',
  },
  copyButton: {
    flex: 1,
    backgroundColor: '#000',
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
    marginLeft: 5,
  },
  disabledButton: {
    backgroundColor: '#cccccc',
  },
  copyText: {
    color: '#FFF',
    fontWeight: '600',
  },
  // Calendar Modal Styles
  calendarOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  calendarModalContainer: {
    width: 340,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 12,
  },
  calendarHeader: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  calendarTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  calendarContainer: {
    width: '100%',
  },
  closeCalendarButton: {
    padding: 5,
  },
  closeButtonText: {
    fontSize: 20,
    color: '#333',
    fontWeight: '500',
  },
  calendarButtonContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
  },
  doneButton: {
    backgroundColor: '#000',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  doneButtonText: {
    color: '#FFF',
    fontWeight: '600',
  }
});

export default CopyDateModal;