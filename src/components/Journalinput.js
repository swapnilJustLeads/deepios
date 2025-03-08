import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
} from 'react-native';
import React, {useState} from 'react';
import {Button, Input, Card, Icon} from '@rneui/themed';
import Delete from '../assets/images/delete.svg';
const Journalinput = (props) => {
  const [journalText, setjournalText] = useState('');
  const [showjournal, setshowjournal] = useState(false);
  const [title, settitle] = useState('');
  const [subtitle, setsubtitle] = useState('');
  const [content, setcontent] = useState('');

  const setJournalText = text => {
    setjournalText(text);
  };
  const saveJournal = () => {
    setshowjournal(true);
  };
  const onPress = () => {
    console.log('Press');
  };
  return (
    <View style={{flex: 1}}>
      {showjournal ? (
        <>
          <>
            <View style={styles.container}>
              <View
                style={{
                  padding: 15,
                  backgroundColor: 'white',
                  borderTopLeftRadius: 17,
                  borderTopRightRadius: 17,
                }}>
                <Text
                  style={{
                    color: 'black',
                    fontFamily: 'Inter',
                    fontSize: 21,
                    fontWeight: '800',
                  }}>
                  How was your day??
                </Text>
              </View>
              <View
                style={{
                  backgroundColor: '#D7D7D7',
                  borderBottomLeftRadius: 17,
                  borderBottomRightRadius: 17,
                }}>
                <TextInput
                  style={styles.textInput}
                  multiline
                  numberOfLines={3}
                  value={journalText}
                  onChangeText={setJournalText}
                  placeholder={'Write Your Thoughts here ...'}
                  placeholderTextColor="#888"
                />
              </View>
            </View>
            <Button
              containerStyle={styles.buttonConatiner}
              onPress={props.saveJournal}
              buttonStyle={[styles.buttonStyle]}
              title="Save Journal"
              titleStyle={styles.buttonTextStyle}
            />
            <View>
              <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
                <Card containerStyle={styles.card}>
                  <View style={styles.headerContainer}>
                    <Text style={styles.time}>{title || '01:47 pm'}</Text>
                    <Delete style={styles.headerIcon} />
                  </View>
                  <Text style={styles.content}>{content || 'sss'}</Text>
                </Card>
              </TouchableOpacity>
            </View>
          </>
        </>
      ) : (
        <View>
          <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
            <Card containerStyle={styles.card}>
              <View style={styles.headerContainer}>
                <Text style={styles.time}>{title || '01:47 pm'}</Text>
                <Delete style={styles.headerIcon} />
              </View>
              <Text style={styles.content}>{content || 'sss'}</Text>
            </Card>
          </TouchableOpacity>
        </View>
      )}
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          alignSelf: 'center',
          bottom: 9,
        }}>
        <Button
          containerStyle={[
            styles.buttonConatiner,
            {
              alignSelf: 'center',
            },
          ]}
          onPress={saveJournal}
          buttonStyle={[styles.buttonStyle]}
          title="New Journal"
          titleStyle={styles.buttonTextStyle}
        />
      </View>
    </View>
  );
};

export default Journalinput;

const styles = StyleSheet.create({
  container: {
    paddingTop: 16,
    borderRadius: 30,
    marginTop: 16,
    width: '93%',
    alignSelf: 'center',
  },
  containerStyle: {
    borderWidth: 0,
    // backgroundColor: 'red',
  },
  textTitle: {
    fontFamily: 'Inter',
    fontSize: 20,
    fontWeight: '900',
    marginBottom: 10,
    color: '#000',
    marginTop: 12,
    marginLeft: 18,
  },
  textInput: {
    width: '100%',
    backgroundColor: '#D7D7D7',
    padding: 8,
    borderRadius: 30,
    color: 'black',
    textAlignVertical: 'top',
    minHeight: 90,
    fontSize: 18,
    // fontWeight:'bold',
    marginTop: 2,
  },
  buttonStyle: {
    width: 103,
    backgroundColor: '#00E5FF',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonTextStyle: {
    fontFamily: 'Inter',
    fontSize: 9,
    fontWeight: '900',
    color: '#000000',
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  buttonConatiner: {
    alignSelf: 'flex-end',
    marginRight: 15,
    marginTop: 9,
  },
  card: {
    borderRadius: 20,
    padding: 16,
    margin: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  time: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  iconContainer: {
    padding: 5,
  },
  content: {
    fontSize: 16,
    color: '#000',
    marginBottom: 5,
  },
});
