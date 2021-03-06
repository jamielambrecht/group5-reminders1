
import React, {useCallback, useState, useEffect} from 'react';
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Foundation from 'react-native-vector-icons/Foundation';
import { globalStyles } from "../styles/global";
import RealmContext, {Note} from '../models/Schemas';
import colors from '../styles/colors';

const {useRealm} = RealmContext;

function SimpleNote({route, navigation} : any) {

  const {noteId, isNew} = route.params;
  const realm = useRealm();
  const note : (Note & Realm.Object) | undefined = realm?.objectForPrimaryKey("Note", new Realm.BSON.ObjectId(noteId))!;

  const modifyNote = useCallback(
    (
      note: Note & Realm.Object,
      title?: string,
      author?: string,
      body?: string,
      prio?: number,
      category?: string,
      _addTag?: string,
      _removeTag?: string,
      ): void => {
        realm.write(() => {
          title?  note.title    = title : {};
          author? note.author   = author : {};
          body?   note.body     = body : {};
          prio?   note.priority = prio : {};
          body?   note.size     = body.length : {};
          category? note.category = category : {};
          _addTag? note.tags.add(_addTag) : {};
          _removeTag? (note.tags.has(_removeTag) ? deleteTag(_removeTag) : Alert.alert("Error removing tag: #"+_removeTag+" does not exist!")) : {};
          note.dateModified = new Date(Date.now());
          note.dateAccessed = new Date(Date.now());
          //realm.objects(Note).sorted('priority', true);
          //console.log(realm.objects(Note));
        });
      },
      [realm],
  );

  const [inputTitle, setInputTitle] = useState(note.title);
  const [inputAuthor, setInputAuthor] = useState(note.author);
  const [inputBody, setInputBody] = useState(note.body);
  const [inputPrio, setInputPrio] = useState(note.priority);
  const [inputCategory, setInputCategory] = useState(note.category);
  const [newTag, setNewTag] = useState("");
  const [remTag, setRemTag] = useState("");
  const prioButtonColors = ['#84FFEB', 'cyan', '#3666E9', '#0400FF', '#22E734', '#FBFF00', '#FFBB00', 'coral', '#E9443E', '#C5184C', '#992323'];

  const renderButtons = () => {
    for (let i = 0; i <= 10; i++)
    {
      <Pressable
      onPress ={() => 
        setInputPrio(i)} 
      style={[globalStyles.buttonprio, {backgroundColor: prioButtonColors[i]}]} 
      />
    }
  }

  const deleteTag = (tag = remTag) => {
    note.tags.delete(tag);
    Alert.alert("Successfully removed tag: #"+tag);
  }

  return(
    <View style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={globalStyles.modalContent}>
            <View style={globalStyles.modalIcon}>
              <FontAwesome
                name='close'
                size={24}
                style={{ ...globalStyles.modalToggle, color: colors.dark}}
                onPress={() => navigation.goBack()}
              />
              <View style={[globalStyles.containerTitle]}>
                <Text style={globalStyles.titleMain}>{isNew? "New" : "Edit"} Note</Text>
              </View>
              <Foundation
                name='check'
                size={24}
                  style={{
                    ...globalStyles.modalToggle,
                    ...globalStyles.modalClose,
                    color: colors.dark
                  }}
                onPress={() => {
                  
                  let b = true;
                  do {
                    note.tags.forEach((tag) => {
                    if(tag === newTag)
                    {
                      Alert.alert("Error adding #"+newTag+": Duplicate tags are not allowed.");
                      setNewTag("");
                      b = false;
                    }
                    });
                    b ? b = !b : {};
                  } while (b);
                  modifyNote(note, inputTitle, inputAuthor, inputBody, inputPrio, inputCategory, newTag, remTag);
                  navigation.goBack();
                }}
              />
            </View>
            <View>
              <TextInput
                style={styles.item}
                placeholder='Title'
                onChangeText={setInputTitle}
                value={inputTitle}
              />
              <View style={[globalStyles.separatorV, {marginVertical: 5}]}/>
              <TextInput
                style={styles.item}
                placeholder='Subject'
                onChangeText={setInputAuthor}
                value={inputAuthor}
              />
              <View style={[globalStyles.separatorV, {marginVertical: 7.5}]}/>
              <TextInput
                style={styles.item}
                multiline
                numberOfLines={5}
                // mode="outlined"
                placeholder='Body'
                maxLength={10000}
                onChangeText={setInputBody}
                value={inputBody}
              />
              <View style={[globalStyles.separatorV, {marginVertical: 7.5}]}/>

              <View>
                <TextInput
                  style={styles.item}
                  placeholder='Category'
                  onChangeText={setInputCategory}
                  value={inputCategory}
                />
                <View style={[globalStyles.separatorV, {marginVertical: 5}]}/>
                <TextInput
                  style={styles.item}
                  placeholder='Add Tag (dont include "#")'
                  onChangeText={setNewTag}
                  onEndEditing={() => setNewTag}
                  value={newTag}
                />
              </View>
              <View style={[globalStyles.separatorV, {marginVertical: 5}]}/>
              <View style={globalStyles.multibutton}>
                <Text style={{paddingRight: 20}}>Priority</Text>
                <Pressable onPress ={() => setInputPrio(1)} style={[globalStyles.buttonprio, {borderWidth: (inputPrio == 1 ? 1.5 : 0), opacity: (inputPrio == 1 ? 1 : 0.3),backgroundColor: 'cyan'}]} />
                <Pressable onPress ={() => setInputPrio(2)} style={[globalStyles.buttonprio, {borderWidth: (inputPrio == 2 ? 1.5 : 0), opacity: (inputPrio == 2 ? 1 : 0.3),backgroundColor: '#3666E9'}]} />
                <Pressable onPress ={() => setInputPrio(3)} style={[globalStyles.buttonprio, {borderWidth: (inputPrio == 3 ? 1.5 : 0), opacity: (inputPrio == 3 ? 1 : 0.3),backgroundColor: '#0400FF'}]} />
                <Pressable onPress ={() => setInputPrio(4)} style={[globalStyles.buttonprio, {borderWidth: (inputPrio == 4 ? 1.5 : 0), opacity: (inputPrio == 4 ? 1 : 0.3),backgroundColor: '#22E734'}]} />
                <Pressable onPress ={() => setInputPrio(5)} style={[globalStyles.buttonprio, {borderWidth: (inputPrio == 5 ? 1.5 : 0), opacity: (inputPrio == 5 ? 1 : 0.35),backgroundColor: '#FBFF00'}]} />
                <Pressable onPress ={() => setInputPrio(6)} style={[globalStyles.buttonprio, {borderWidth: (inputPrio == 6 ? 1.5 : 0), opacity: (inputPrio == 6 ? 1 : 0.35),backgroundColor: '#FFBB00'}]} />
                <Pressable onPress ={() => setInputPrio(7)} style={[globalStyles.buttonprio, {borderWidth: (inputPrio == 7 ? 1.5 : 0), opacity: (inputPrio == 7 ? 1 : 0.35),backgroundColor: 'coral'}]} />
                <Pressable onPress ={() => setInputPrio(8)} style={[globalStyles.buttonprio, {borderWidth: (inputPrio == 8 ? 1.5 : 0), opacity: (inputPrio == 8 ? 1 : 0.35),backgroundColor: '#E9443E'}]} />
                <Pressable onPress ={() => setInputPrio(9)} style={[globalStyles.buttonprio, {borderWidth: (inputPrio == 9 ? 1.5 : 0), opacity: (inputPrio == 9 ? 1 : 0.35),backgroundColor: '#C5184C'}]} />
                <Pressable onPress ={() => setInputPrio(10)} style={[globalStyles.buttonprio, {borderWidth: (inputPrio == 10 ? 1.5 : 0), opacity: (inputPrio == 10 ? 1 : 0.35),backgroundColor: '#992323'}]} />
              </View>

              <View style={[globalStyles.separatorV, {marginVertical: 5}]}/>
                <TextInput
                  style={styles.item}
                  placeholder='Delete Tag (dont include "#")'
                  onChangeText={setRemTag}
                  onEndEditing={() => setRemTag}
                  value={remTag}
                />

            </View>
            
          </View>
        </TouchableWithoutFeedback>       
      </KeyboardAvoidingView>
    </View>
  )
}

  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.white,
      flex: 1,
      // paddingTop: StatusBar.currentHeight,
      paddingHorizontal: 20,
    },
    item: {
      // textAlign: "center",
      paddingHorizontal: 8,
      paddingVertical: Platform.OS === 'ios' ? 8 : 0,
      backgroundColor: colors.white,
      fontSize: 16,
      borderRadius: 10,
      borderWidth: 1
    },
  });
  
  export default SimpleNote;