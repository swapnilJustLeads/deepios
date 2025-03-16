import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    minWidth: 282,
    marginBottom: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 5,
    fontFamily: 'Inter',
  },
  weightsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  weightContainer: {
    width: 46,
    height: 30,
  },
  dropdown: {
    width: '100%',
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
  dropdownText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#000000',
    fontFamily: 'Inter',
    lineHeight: 15,
  },
  dropdownContainer: {
    borderRadius: 6,
  },
  dropdownIcon: {
    width: 10,
    height: 6,
  },
});

