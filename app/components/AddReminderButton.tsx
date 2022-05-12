import React, {useState} from 'react';
import {
  Pressable,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import colors from '../styles/colors';

interface AddReminderButtonProps {
  onSubmit: (description: string) => void;
}

function AddReminderButton({onSubmit}: AddReminderButtonProps) {
  const [description, setDescription] = useState('');

  const handleSubmit = () => {
    onSubmit(description);
    setDescription('');
  };

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
    alignSelf: "center",
    height: 50,
    position: "absolute",
    bottom: 20,
    // right: 20,
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
    backgroundColor: colors.dark,                                    
    ...Platform.select({
      ios: {
        shadowColor: colors.black,
        shadowOffset: {
          width: 0,
          height: 4,
        },
        shadowOpacity: 0.7,
        shadowRadius: 5,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  icon: {
    color: colors.subtle,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
  },
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
});

export default AddReminderButton;
