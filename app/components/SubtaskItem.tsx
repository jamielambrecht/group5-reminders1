import React, {memo, useDebugValue, useCallback, useState} from 'react';
import {
  Image,
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Platform,
  Pressable,
  StyleSheet,
  _Text,
} from 'react-native';

import RoundCheckbox from 'rn-round-checkbox';
import { useSwipe } from '../hooks/useSwipe';
import SubtaskContext, {Subtask} from '../models/Schemas';
import SubtaskModal from '../components/SubtaskModal';
import colors from '../styles/colors';
import DateTimePicker from '@react-native-community/datetimepicker';
const {useRealm, useQuery, RealmProvider} = SubtaskContext;

interface SubtaskItemProps {
  subtask: Subtask;
  handleModifySubtask: (
    subtask: Subtask,
    _title?: string,
    _feature?: string,
    _value?: string,
    _scheduledDatetime?: Date,
    _isComplete?: boolean,
  ) => void;
  onDelete: () => void;
  onSwipeLeft: () => void
}

function SubtaskItem({
  subtask: subtask,
  handleModifySubtask,
  onDelete,
  onSwipeLeft,
}: SubtaskItemProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const [date, setDate] = useState(subtask.scheduledDatetime);
  const [isChecked, setIsChecked] = useState(subtask.isComplete);

  const closeModal = () => {
    if (modalVisible) {
      setModalVisible(previousState => !previousState);
    }
  }

  const openModal = () => {
    if (!modalVisible) {
      setModalVisible(previousState => !previousState);
    }
  }

  // const initializeSubtaskInput = () => {
  //   setInputTitle(title); setInputFeature(feature); setInputValue(value);
  // }

  const realm = useRealm();
  const { onTouchStart, onTouchEnd } = useSwipe(onSwipeLeft, onSwipeRt, 12);

  function onSwipeRt() {
    /* flag or complete function goes here */

    // setInputComplete(!inputComplete);
    // onSwipeRight()
    // console.log('right Swipe performed');
  }

  const updateIsCompleted = useCallback(
    (
      subtask: Subtask,
      _isComplete: boolean,
    ): void => {
      realm.write(() => {
        subtask.isComplete = _isComplete;
      });
    },
    [realm],
  );

  return (
    <Pressable
      onLongPress={openModal}
      onTouchStart={onTouchStart} 
      onTouchEnd={onTouchEnd}
      hitSlop={{ top: 0, bottom: 0, right: 0, left: 0}}
      android_ripple={{color:'#00f'}}
    >
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <SubtaskModal 
          onSubmit={() => {}}
          handleAddSubtask={() => {}}
          handleModifySubtask={handleModifySubtask}
          isNew={false}
          closeModal={closeModal}
          subtask={subtask}
        />
      </Modal>
      <View style={styles.dateTimeContainer}>
        <View>
          <Text>{date.toLocaleTimeString('en-US')}</Text>
        </View>
        <View>
          <Text>{date.toLocaleDateString('en-US')}</Text>
        </View>        
      </View>
      <View style={styles.task}>
        <View style={styles.content}>
          <View style={styles.titleInputContainer}>
            <View/>
            <Text style={styles.textTitle}>{subtask.title}</Text>
            <RoundCheckbox
              backgroundColor='#3CB043'
              size={20}
              checked={isChecked}
              onValueChange={(newValue) => {
                setIsChecked(previousState => !previousState);
                updateIsCompleted(subtask, newValue);
                // console.log("isChecked (local state): " + isChecked + ", subtask.isChecked: " + subtask.isComplete);
              }}
            />
          </View>
          <View style={styles.featureInputContainer}>
            <Text style={styles.textFeature}>{subtask.feature}</Text>
            <Text style={styles.textValue}>{subtask.value}</Text>
          </View>
        </View>
        {/* <Pressable onPress={onDelete} style={styles.deleteButton}>
          <Text style={styles.deleteText}>Delete</Text>
        </Pressable> */}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  timeanddatestyle:{
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonClose: {
    backgroundColor: '#ee6e73',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  container: {
    resizeMode: 'center',
    height: 30,
    width: 50,
  },
  dateTimeContainer: {
    marginTop: 8,
    flexDirection : "row",
    justifyContent : "space-between"
    
  },
  task: {
    marginVertical: 8,
    backgroundColor: colors.white,
    borderRadius: 10,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: colors.black,
        shadowOffset: {
          width: 0,
          height: 4,
        },
        shadowOpacity: 0.7,
        shadowRadius: 3,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    color: colors.black,
    fontSize: 16,
    marginBottom: 8,
  },
  textInput: {
    flex: 1,
    // textAlign: "center",
    paddingHorizontal: 8,
    paddingVertical: Platform.OS === 'ios' ? 8 : 0,
    backgroundColor: colors.white,
    fontSize: 24,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  featureInputContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  textFeature: {
    flex: 1,
    textAlign: 'center',
    paddingHorizontal: 8,
    paddingVertical: Platform.OS === 'ios' ? 8 : 0,
    backgroundColor: colors.white,
    fontSize: 24,
  },
  textTitle: {
    flex: 1,
    textAlign: 'center',
    paddingHorizontal: 8,
    paddingVertical: Platform.OS === 'ios' ? 8 : 0,
    backgroundColor: colors.white,
    fontSize: 24,
  },
  textValue: {
    flex: 1,
    textAlign: 'center',
    paddingHorizontal: 8,
    paddingVertical: Platform.OS === 'ios' ? 8 : 0,
    backgroundColor: colors.white,
    fontSize: 24,
  },
  titleInputContainer: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row',
    alignContent: "space-between",
    alignItems: 'center',
    marginHorizontal: 8,
    marginVertical: 8,
  },
  // status: {
  //   width: 50,
  //   height: '100%',
  //   justifyContent: 'center',
  //   borderTopLeftRadius: 5,
  //   borderBottomLeftRadius: 5,
  //   backgroundColor: colors.gray,
  // },
  // completed: {
  //   backgroundColor: colors.purple,
  // },
  deleteButton: {
    justifyContent: 'center',
  },
  deleteText: {
    marginVertical: 10,
    color: colors.gray,
    fontSize: 16,
  },
  // icon: {
  //   color: colors.white,
  //   textAlign: 'center',
  //   fontSize: 17,
  //   fontWeight: 'bold',
  // },
  modalRow: {
    flex: 1,
    flexDirection: 'row',
  },
  modalText: {
    marginBottom: 15,
    // textAlign: "center"
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});

// We want to make sure only tasks that change are rerendered
const shouldNotRerender = (
  prevProps: SubtaskItemProps,
  nextProps: SubtaskItemProps,
) =>
  prevProps.subtask.title === nextProps.subtask.title &&
  prevProps.subtask.feature === nextProps.subtask.feature &&
  prevProps.subtask.value === nextProps.subtask.value;

export default memo(SubtaskItem, shouldNotRerender);
