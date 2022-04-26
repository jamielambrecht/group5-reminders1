import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  Platform,
  StyleSheet,
} from 'react-native';

import colors from '../styles/colors';
import PushNotification from "react-native-push-notification";

interface AddReminderButtonProps {
  onSubmit: (description: string) => void;
}

function AddReminderButton({onSubmit}: AddReminderButtonProps) {
  const [description, setDescription] = useState('');

  const handleSubmit = () => {
    onSubmit(description);
    setDescription('');
    //scheduleNotification();
  };

  const scheduleNotification = () => {
    PushNotification.localNotificationSchedule({
      date: new Date(Date.now() + 900 * 1000),
      allowWhileIdle: true,
      repeatType: 'time',
      repeatTime: 30000,  
      channelId: "Notif-test-1",
      title: "Scheduled notification success",
      message: "This reminder will reappear every 30 seconds",
  });
  }

  return (
    <View style={styles.floatingButtonContainer}>
      <Pressable onPress={handleSubmit} style={styles.floatingButton}>
        <Text style={styles.icon}>＋</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  floatingButtonContainer: {
    alignItems: 'center',
    justifyContent: "center",
    height: 50,
    position: "absolute",
    bottom: 20,
    right: 20,
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
  // textInput: {
  //   flex: 1,
  //   paddingHorizontal: 15,
  //   paddingVertical: Platform.OS === 'ios' ? 15 : 0,
  //   borderRadius: 5,
  //   backgroundColor: colors.white,
  //   fontSize: 24,
  // },
  floatingButton: {
    // height: '100%',
    width: 60,  
    height: 60,   
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,            
    backgroundColor: '#ee6e73',                                    

  },
  icon: {
    color: colors.white,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default AddReminderButton;
