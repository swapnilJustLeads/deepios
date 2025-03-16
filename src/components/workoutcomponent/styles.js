import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    width: 342,
    padding: 10,
    backgroundColor: '#000',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  flexItem: {
    flexGrow: 1,
    marginHorizontal: 5,
  },
  fullWidth: {
    width: '100%',
    marginBottom: 10,
  },
});

