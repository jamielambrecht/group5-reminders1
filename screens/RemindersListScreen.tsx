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
  TouchableWithoutFeedback,
} from 'react-native';
import colors from '../app/styles/colors';
import ReminderListDefaultText from '../app/components/ReminderListDefaultText';
import RemindersListContent from '../app/components/RemindersListContent';
import AddReminderButton from '../app/components/AddReminderButton';
import RealmContext, {Reminder, Subtask} from '../app/models/Schemas';

import DateTimePickerModal from "react-native-modal-datetime-picker";
import SimpleNote from '../app/components/SimpleNote';
import NoteItem from '../app/components/sNoteItem';
import Feather from 'react-native-vector-icons/Feather';
import Foundation from 'react-native-vector-icons/Foundation';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Octicons from 'react-native-vector-icons/Octicons';
import {globalStyles } from '../app/styles/global';

const {useRealm, useQuery, RealmProvider} = RealmContext;

  const RemindersListScreen = ({navigation}: any) => {

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
  
  const realm = useRealm();
  const [result, setResult] = useState(useQuery(Reminder));

  useEffect(() => {
    try {
      result.addListener(() => {
        // update state of tasks to the updated value
        setResult(result);
      });
    } catch (error) {
      console.error(
        `Unable to update the result state, an exception was thrown within the change listener: ${error}`
      );
    }
  });

  const reminders = useMemo(() => result, [result]);

  const handleAddReminder = useCallback(
    (_title: string): void => {
      realm.write(() => {
        realm.create('Reminder', Reminder.generate(_title));
      });
    },
    [realm],
  );

  const navigateToReminderEditPage = useCallback(
    (reminder: Reminder): void => {
      navigation.navigate("ReminderSubtasksScreen", {reminder: reminder} );
    },
    [realm],
  );

  const handleModifyReminder = useCallback(
    (
      reminder: Reminder,
      _title?: string,
      _subtasks?: Subtask[]
    ): void => {
      realm.write(() => {
        _title ? (reminder.title = _title) : {};
        _subtasks ? (reminder.subtasks = _subtasks) : {};
        // setSubtasks(result);
      });
    },
    [realm],
  );

  const handleDeleteReminder = useCallback(
    (reminder: Reminder): void => {
      realm.write(() => {
        realm.delete(reminder);
      });
    },
    [realm],
  );

  return (
    <SafeAreaView style={styles.screen}>
      {/* <NewReminderHeaderBar onSubmit={() => {}} /> */}
      <View style={[{flexDirection: 'row', justifyContent: 'space-around', padding: 10}]} >
      <Pressable
        style={[styles.button, styles.buttonClose, {backgroundColor: (window ? '#ee6e73' : '#22E734')}]}
        onPress={() => {
          setWindow(false);
        }}
      >
          <Text style={styles.textStyle}>Notes</Text>
      </Pressable>
      <Pressable
        style={[styles.button, styles.buttonClose, {backgroundColor: (window ? '#22E734' : '#ee6e73')}]}
        onPress={() => {
          setWindow(true);
        }}
      >
          <Text style={styles.textStyle}>Reminders</Text>
      </Pressable>
      </View>
      
      {/* <View style={styles.content}>
        {reminders.length === 0 ? (
          <ReminderListDefaultText />
        ) : (
          <RemindersListContent
            reminders={reminders}
            handleModifyReminder={handleModifyReminder}
            onDeleteReminder={handleDeleteReminder}
            handleNavigation={navigateToReminderEditPage}
          />
        )}
        <AddReminderButton onSubmit={() => handleAddReminder("New Reminder")} />
      </View> */}
      { window && (
      <View style={styles.content}>
        {reminders.length === 0 ? (
          <ReminderListDefaultText />
        ) : (
          <RemindersListContent
            reminders={reminders}
            handleModifyReminder={handleModifyReminder}
            onDeleteReminder={handleDeleteReminder}
            onSwipeLeft={handleDeleteReminder}
            handleNavigation={navigateToReminderEditPage}
          />
        )}
        <AddReminderButton onSubmit={() => handleAddReminder("New Reminder")} />
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
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  content: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  screen: {
    flex: 1,
    backgroundColor: colors.white,
  },
  textStyle: {
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonClose: {
    backgroundColor: '#ee6e73',
  },
});

export default RemindersListScreen;