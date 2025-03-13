import React, {useState} from 'react';
import {View, StyleSheet, Text, FlatList, TouchableOpacity} from 'react-native';
import {useUserSupplementContext} from '../context/UserContexts';
import {useDetails} from '../context/DeatailsContext';
import moment from 'moment';
import MainContainer_Header_ExerciseSupplement from './MainContainer_Header_ExerciseSupplement';
import SupplementLayoutComponent from './SupplementLayoutComponent';
import SupplementCard from './SupplementCard';
import Copy from '../assets/images/copy.svg';
import Edit from '../assets/images/edit.svg';
import Delete from '../assets/images/delete.svg';
import EditModal from './EditModal';

const SupplementLayout = props => {
  const {
    supplementData,
    handleSupplementUpdateName,
    refresh: refreshSupplement,
    setRefresh: setRefreshSupplement,
  } = useUserSupplementContext();
  const {subCategories, parentIds} = useDetails();
  const [editVisible, seteditVisible] = useState(false);
  const [editId, seteditId] = useState(0);

  // Filter data for the selected date
  const selectedDate = props.selectedDate || moment().format('YYYY-MM-DD');

  const filteredData = supplementData.filter(item => {
    if (item.createdAt) {
      const itemDate = moment(new Date(item.createdAt.seconds * 1000)).format(
        'YYYY-MM-DD',
      );
      return itemDate === selectedDate;
    }
    return false;
  });

  // Helper function to get supplement name from subCategory ID
  function getSupplementName(subCategoryId, supplementName) {
    if (supplementName) return supplementName;
    if (!subCategoryId || !subCategories) return 'Unknown Supplement';

    const subCategory = subCategories.find(sc => sc.id === subCategoryId);
    return subCategory ? subCategory.name : 'Unknown Supplement';
  }

  // Transform data into format expected by MainContainer_Header_ExerciseItem
  const transformData = () => {
    const transformedData = [];

    filteredData.forEach(item => {
      if (!item.data || !Array.isArray(item.data)) return;

      item.data.forEach(supplement => {
        // const supplementName = getSupplementName(supplement.subCategory, supplement.name);
        transformedData.push({
          name: supplement.timing,
          // item:supplement.amount
        });
      });
    });

    return transformedData;
  };

  // Function to convert Unix timestamp to formatted time
  function formatTimeFromTimestamp(timestamp) {
    // Create a new Date object from the timestamp (in milliseconds)
    const date = new Date(timestamp * 1000);

    // Format the hours and minutes
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');

    // Determine AM or PM
    const ampm = hours >= 12 ? 'PM' : 'AM';

    // Convert 24-hour format to 12-hour format
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'

    // Format as "hh:mm AM/PM"
    return `${String(hours).padStart(2, '0')}:${minutes} ${ampm}`;
  }
  // Update the editName function to uncomment the handleSupplementUpdateName call
  const editName = name => {
    console.log(editId, name);
    handleSupplementUpdateName(editId, name); // Uncommented this line
    seteditVisible(false);
    setRefreshSupplement(!refreshSupplement);
  };

  // Function to handle item click
  const handleItemClick = item => {
    // Extract time from timestamp
    const date = new Date(item.createdAt.seconds * 1000);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    // Prepare the item data for form
    const supplementItemData = {
      id: item.id,
      data: item.data,
      hours: hours,
      minutes: minutes,
      timing: item.data && item.data.length > 0 ? item.data[0].timing : null,
    };

    // Call the onSelectSupplement function passed from the parent component
    if (props.onSelectSupplement) {
      props.onSelectSupplement(supplementItemData);
    }
  };

  // Example usage
  const timestamp = 1741282860;
  const formattedTime = formatTimeFromTimestamp(timestamp);
  // console.log(formattedTime);
  const supplementItems = transformData();
  // console.log(supplementItems,);

  const renderItem = ({item}) => {
    return (
      <TouchableOpacity
        style={styles.containerrenderItem}
        onPress={() => handleItemClick(item)}>
        <View style={styles.header}>
          <Text style={styles.title}> {item.name || 'SUPPLEMENT'} </Text>
          <Text style={styles.time}>
            {formatTimeFromTimestamp(item.createdAt.seconds)}
          </Text>
          <View style={styles.icons}>
            <TouchableOpacity
              onPress={() => {
                seteditVisible(true);
                seteditId(item.id);
                console.log(item);
              }}>
              <Edit style={styles.headerIcon} />
            </TouchableOpacity>
            <Copy style={styles.headerIcon} />
            <Delete style={styles.headerIcon} />
          </View>
        </View>
        <SupplementCard data={item} />
        <EditModal
          id={item.id}
          name={item.name}
          parent={parentIds.Supplement}
          visible={editVisible}
          onSave={() => seteditVisible(false)}
        />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        contentContainerStyle={{gap: 16}}
        data={filteredData}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    width: '100%',
    marginBottom: 60,
    // backgroundColor:'red'
  },
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  noDataText: {
    fontSize: 16,
    color: '#555',
  },
  containerrenderItem: {
    width: 342,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#000',
    backgroundColor: '#fff',
    // padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // marginBottom: 16,
  },
  title: {
    fontFamily: 'Stomic',
    fontSize: 18,
    fontWeight: '400',
    textTransform: 'uppercase',
    lineHeight: 27,
    paddingLeft: 16,
    paddingTop: 9,
  },
  time: {
    fontFamily: 'Inter',
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 16,
  },
  icons: {
    flexDirection: 'row',
    marginRight: 16,
    gap: 7,
  },
  icon: {
    width: 20,
    height: 20,
    marginLeft: 8,
  },
});

export default SupplementLayout;
