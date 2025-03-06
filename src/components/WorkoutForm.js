import {Button} from '@rneui/themed';
import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';

const WorkoutForm = () => {
  // State for selected values
  const [category, setCategory] = useState('Back');
  const [exercise, setExercise] = useState('Barbell Deadlift');
  const [sets, setSets] = useState('5');
  const [time, setTime] = useState('07');
  const [timeMinutes, setTimeMinutes] = useState('19');
  const [reps, setReps] = useState(['3', '5', '10', '11', '7']);
  const [weights, setWeights] = useState(['5', '5', '4.5', '4', '4.5']);

  // Function to render dropdown selector
  const Dropdown = ({value, onPress, width = 'auto'}) => (
    <TouchableOpacity style={[styles.dropdown, {width}]} onPress={onPress}>
      <Text style={styles.dropdownText}>{value}</Text>
      <Text style={styles.chevron}>▼</Text>
    </TouchableOpacity>
  );

  // Function to render multiple dropdowns in a row
  const DropdownRow = ({values, onPressHandlers, widths}) => (
    <View style={styles.dropdownRow}>
      {values.map((value, index) => (
        <Dropdown
          key={index}
          value={value}
          onPress={onPressHandlers[index]}
          width={widths ? widths[index] : 'auto'}
        />
      ))}
    </View>
  );

  // Section title component to ensure equal width
  const SectionTitles = ({titles}) => (
    <View style={styles.sectionTitleContainer}>
      {titles.map((title, index) => (
        <View key={index} style={styles.sectionTitleWrapper}>
          <Text style={styles.sectionTitle}>{title}</Text>
        </View>
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Category & Exercise Section */}
      <SectionTitles titles={['Category', 'Exercise']} />
      <View style={styles.section}>
        <Dropdown
          value={category}
          onPress={() => console.log('Category dropdown pressed')}
          width="48%"
        />
        <Dropdown
          value={exercise}
          onPress={() => console.log('Exercise dropdown pressed')}
          width="48%"
        />
      </View>

      {/* Sets & Time Section */}
      <SectionTitles titles={['Sets', 'Time']} />
      <View style={styles.section}>
        <View style={[styles.timeContainer, {width: '42%'}]}>
          <Dropdown
            value={sets}
            onPress={() => console.log('Sets dropdown pressed')}
            width="42%"
          />
          <Dropdown
            value={time}
            onPress={() => console.log('Hours dropdown pressed')}
            width="42%"
          />
          <Dropdown
            value={timeMinutes}
            onPress={() => console.log('Minutes dropdown pressed')}
            width="42%"
          />
        </View>
      </View>

      {/* Reps Section */}
      <Text style={styles.sectionTitle}>Reps</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <DropdownRow
          values={reps}
          onPressHandlers={reps.map(
            (_, i) => () => console.log(`Reps ${i + 1} dropdown pressed`),
          )}
          widths={reps.map(() => 60)}
        />
      </ScrollView>

      {/* Weights Section */}
      <Text style={styles.sectionTitle}>Weights</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <DropdownRow
          values={weights}
          onPressHandlers={weights.map(
            (_, i) => () => console.log(`Weight ${i + 1} dropdown pressed`),
          )}
          widths={weights.map(() => 60)}
        />
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.actionContainer}>
        <Button
          title="Add Template"
          buttonStyle={styles.templateButton}
          titleStyle={{color: 'black'}}
        />
        <Button
          title="Save Template"
          buttonStyle={styles.templateButton}
          titleStyle={{color: 'black'}}
        />
        <Button
          title="Add"
          buttonStyle={styles.addButton}
          titleStyle={styles.addButtonText}
        />
        {/* <TouchableOpacity style={styles.templateButton} onPress={() => console.log('Add template')}>
          <Text style={styles.templateButtonText}>ADD TEMPLATE</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.templateButton} onPress={() => console.log('Save template')}>
          <Text style={styles.templateButtonText}>SAVE TEMPLATE</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.addButton} onPress={() => console.log('Add workout')}>
          <Text style={styles.addButtonText}>ADD</Text>
        </TouchableOpacity> */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#b0b0b0',
    padding: 16,
    borderRadius: 8,
  },
  section: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sectionTitleWrapper: {
    width: '42%', // Each takes up half the space minus a bit of margin
  },
  sectionTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  dropdown: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    marginRight: 9,
  },
  dropdownText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  chevron: {
    fontSize: 12,
    marginLeft: 10,
  },
  dropdownRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  templateButton: {
    backgroundColor: 'white',
    marginRight: 12,
    borderRadius: 8,
    // alignItems: 'center',
    // width: '31%',
  },
  templateButtonText: {
    fontWeight: 'bold',
    fontSize: 12,
  },
  addButton: {
    backgroundColor: '#5acef7',
    margin: 12,
    borderRadius: 8,
    // alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default WorkoutForm;
