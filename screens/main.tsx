import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  Alert,
  FlatList,
  Keyboard,
  Modal,
  Platform,
  Pressable,
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback
} from 'react-native';

import DateTimePickerModal from "react-native-modal-datetime-picker";
import Feather from 'react-native-vector-icons/Feather';
import Foundation from 'react-native-vector-icons/Foundation';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Octicons from 'react-native-vector-icons/Octicons';
import TaskContext, {Subtask} from '../app/models/Schemas';
import SubtaskListDefaultText from '../app/components/SubtaskListDefaultText';
import AddSubtaskButton from '../app/components/AddSubtaskButton';
import NewReminderHeaderBar from '../app/components/NewReminderHeaderBar';
import ReminderContent from '../app/components/ReminderContent';
import colors from '../app/styles/colors';
import SimpleNote from '../app/components/SimpleNote';
import NoteItem from '../app/components/sNoteItem';
import {Results} from 'realm';
import { globalStyles } from "../app/styles/global";

const {useRealm, useQuery, RealmProvider} = TaskContext;

function App() {
  const realm = useRealm();
  const result = useQuery(Subtask);

  const subtasks = useMemo(() => result, [result]);

  const [modalVisible, setModalVisible] = useState(false);
  const [inputTitle, setInputTitle] = useState('');
  const [inputFeature, setInputFeature] = useState('');
  const [inputValue, setInputValue] = useState('');
  
  const [modalOpen, setModalOpen] = useState(false);
  const [inputComplete, setInputComplete] = useState(false);
  const [inputDate, setInputDate] = useState(new Date());
  const [window, setWindow] = useState(true);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const [notes, setNotes] = useState([
    { title: 'Note 1', author: 'jack frost', body: 'semper ad meliora', date: new Date().toLocaleString(), prio: 0, key: '1' },
    { title: 'TOP SECRET', author: 'CIA', body: 'top secret files', date: new Date().toLocaleString(), prio: 7, key: '2' },
  
  ]);

  const handleSimpSwipe = (key: string) => {
    setNotes((prevNotes) => {
      return prevNotes.filter(note => note.key != key);
    })
  }
  const showDatePickerModal = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePickerModal = () => {
    setDatePickerVisibility(false);
  }

  const handleConfirm = (date: Date) => {
    Alert.alert( "A date has been picked: " + date.toLocaleString() );
    setInputDate(date);
    hideDatePickerModal();
  }

  const addNote = (note: any) => {
    note.key = Math.random().toString();
    setNotes((currentNotes) => {
      return [note, ...currentNotes];
    });
    setModalOpen(false);
  }

  const handleAddSubtask = useCallback(
    (_title: string, _feature: string, _value: string, _isComplete: boolean, _scheduledDateTime: Date): void => {
      // Everything in the function passed to "realm.write" is a transaction and will
      // hence succeed or fail together. A transcation is the smallest unit of transfer
      // in Realm so we want to be mindful of how much we put into one single transaction
      // and split them up if appropriate (more commonly seen server side). Since clients
      // may occasionally be online during short time spans we want to increase the probability
      // of sync participants to successfully sync everything in the transaction, otherwise
      // no changes propagate and the transaction needs to start over when connectivity allows.
      realm.write(() => {
        realm.create('Subtask', Subtask.generate(_title, _feature, _value, _isComplete, _scheduledDateTime));
      });
    },
    [realm],
  );

  const handleModifySubtask = useCallback(
    (
      subtask: Subtask,
      _title?: string,
      _feature?: string,
      _value?: string,
      _isComplete?: boolean,
      _scheduledDateTime?: Date,
    ): void => {
      realm.write(() => {
        // Normally when updating a record in a NoSQL or SQL database, we have to type
        // a statement that will later be interpreted and used as instructions for how
        // to update the record. But in RealmDB, the objects are "live" because they are
        // actually referencing the object's location in memory on the device (memory mapping).
        // So rather than typing a statement, we modify the object directly by changing
        // the property values. If the changes adhere to the schema, Realm will accept
        // this new version of the object and wherever this object is being referenced
        // locally will also see the changes "live".
        _title ? (subtask.title = _title) : {};
        _feature ? (subtask.feature = _feature) : {};
        _value ? (subtask.value = _value) : {};
        _isComplete ? (subtask.isComplete = _isComplete) : {};
        _scheduledDateTime ? (subtask.scheduledDatetime = _scheduledDateTime) : {};
        // setSubtasks(result);
      });

      // Alternatively if passing the ID as the argument to handleToggleTaskStatus:
      // realm?.write(() => {
      //   const task = realm?.objectForPrimaryKey('Task', id); // If the ID is passed as an ObjectId
      //   const task = realm?.objectForPrimaryKey('Task', Realm.BSON.ObjectId(id));  // If the ID is passed as a string
      //   task.isComplete = !task.isComplete;
      // });
    },
    [realm],
  );

  const handleDeleteSubtask = useCallback(
    (task: Subtask): void => {
      realm.write(() => {
        realm.delete(task);

        // Alternatively if passing the ID as the argument to handleDeleteTask:
        // realm?.delete(realm?.objectForPrimaryKey('Task', id));
      });
    },
    [realm],
  );

  const initializeSubtaskInput = () => {
    setInputTitle('');
    setInputFeature('');
    setInputValue('');
    setInputComplete(false);
    setInputDate(new Date());
  };

  const handleMarkCompleted = useCallback(
    (
      subtask: Subtask,
      _isComplete?: boolean,
    ): void => {
      realm.write(() => {
        // Normally when updating a record in a NoSQL or SQL database, we have to type
        // a statement that will later be interpreted and used as instructions for how
        // to update the record. But in RealmDB, the objects are "live" because they are
        // actually referencing the object's location in memory on the device (memory mapping).
        // So rather than typing a statement, we modify the object directly by changing
        // the property values. If the changes adhere to the schema, Realm will accept
        // this new version of the object and wherever this object is being referenced
        // locally will also see the changes "live".
        setInputComplete(!inputComplete);
        _isComplete ? (subtask.isComplete = !subtask.isComplete) : {};
        // setSubtasks(result);
      });

      // Alternatively if passing the ID as the argument to handleToggleTaskStatus:
      // realm?.write(() => {
      //   const task = realm?.objectForPrimaryKey('Task', id); // If the ID is passed as an ObjectId
      //   const task = realm?.objectForPrimaryKey('Task', Realm.BSON.ObjectId(id));  // If the ID is passed as a string
      //   task.isComplete = !task.isComplete;
      // });
    },
    [realm],
  );

  return (
    <SafeAreaView style={styles.screen}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.modalRow}>
              <Text style={styles.modalText}>Title: </Text>
              <TextInput
                value={inputTitle}
                onChangeText={setInputTitle}
                placeholder="Enter new task title"
                autoCorrect={false}
                autoCapitalize="none"
                style={styles.textInput}
              />
            </View>
            <View style={styles.modalRow}>
              <Text style={styles.modalText}>Feature: </Text>
              <TextInput
                value={inputFeature}
                onChangeText={setInputFeature}
                placeholder="Add a feature"
                autoCorrect={false}
                autoCapitalize="none"
                style={styles.textInput}
              />
            </View>
            <View style={styles.modalRow}>
              <Text style={styles.modalText}>Value: </Text>
              <TextInput
                value={inputValue}
                onChangeText={setInputValue}
                placeholder="Add a feature value"
                autoCorrect={false}
                autoCapitalize="none"
                style={styles.textInput}
              />
            </View>

            <Pressable onPress={showDatePickerModal}>
              <View style={[globalStyles.button, {backgroundColor: 'coral', flexDirection: 'row', marginTop: 5, marginVertical: 15}]}>
                <Text style={[{fontSize: 15}]}>
                    Set a Date and Time
                </Text>
              </View>
            </Pressable>

            <DateTimePickerModal
              isVisible={isDatePickerVisible}
              mode="datetime"
              onConfirm={handleConfirm}
              onCancel={hideDatePickerModal}
            />
            
            {/* TODO mark checkbox for completion */}

            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => {
                setModalVisible(!modalVisible);
                handleAddSubtask(inputTitle, inputFeature, inputValue, inputComplete, inputDate);
                initializeSubtaskInput();
              }}>
              <Text style={styles.textStyle}>Done ✓</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      <View style={[{flexDirection: 'row', justifyContent: 'space-around', padding: 10}]} >
      <Pressable
        style={[styles.button, styles.buttonClose]}
        onPress={() => {
          setWindow(false);
        }}
      >
          <Text style={styles.textStyle}>Notes</Text>
      </Pressable>
      <Pressable
        style={[styles.button, styles.buttonClose]}
        onPress={() => {
          setWindow(true);
        }}
      >
          <Text style={styles.textStyle}>Reminders</Text>
      </Pressable>
      </View>
      { window && (
      <View style={styles.content}>
        <NewReminderHeaderBar onSubmit={() => {}} />
        {subtasks.length === 0 ? (
          <SubtaskListDefaultText />
        ) : (
          <ReminderContent
            subtasks={subtasks}
            handleModifySubtask={handleModifySubtask}
            onDeleteSubtask={handleDeleteSubtask}
            onSwipeLeft={handleDeleteSubtask}
            onSwipeRight={handleMarkCompleted}
          />
        )}
        <AddSubtaskButton onSubmit={() => setModalVisible(true)} />
      </View>
      )}
      { !window && (
        <View style={styles.content}>
          <Text>Notes Tab</Text>
          <Modal visible={modalOpen} animationType='slide'>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={globalStyles.modalContent}>
              <View style={globalStyles.modalIcon}>
                <MaterialIcons
                  name='close'
                  size={24}
                  style={{ ...globalStyles.modalToggle, ...globalStyles.modalClose }}
                  onPress={() => setModalOpen(!modalOpen)}
                />
                <Foundation
                  name='check'
                  size={24}
                  style={{ ...globalStyles.modalToggle, ...globalStyles.modalClose }}
                  onPress={() => setModalOpen(!modalOpen)}
                />
              </View>
              <View style={[globalStyles.containerTitle, {paddingTop: 25}]}>
                <Text style={globalStyles.titleMain}>New Simple Note</Text>
              </View>
              <SimpleNote addNote={addNote} />
            </View>
          </TouchableWithoutFeedback>
        </Modal>
        <View style={[styles.centeredView, {marginTop: 0}]}>
          <Text>Create Simple Note</Text>
        </View>
          <View style={globalStyles.list}>
          <FlatList
            data={notes}
            renderItem={({ item }) => ( 
              <NoteItem item={item} handleSimpSwipe={handleSimpSwipe}/>
              // <Text>{item.title}</Text>
            )}
            // ItemSeparatorComponent={() => <View style={styles.separator} />}
            keyExtractor={(item, index) => index.toString()}
            extraData={notes}
          /> 
          </View>
        <MaterialIcons
          name='add'
          size={24}
          style={globalStyles.modalToggle}
          onPress={() => setModalOpen(!modalOpen)}
        />
        
        </View>
        
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalRow: {
    flex: 1,
    flexDirection: 'row',
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
  screen: {
    flex: 1,
    backgroundColor: colors.white,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonClose: {
    backgroundColor: '#ee6e73',
  },
  content: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  modalText: {
    marginBottom: 15,
    // textAlign: "center"
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
});

function AppWrapper() {
  if (!RealmProvider) {
    return null;
  }
  return (
    <RealmProvider>
      <App />
    </RealmProvider>
  );
}

export default AppWrapper;
