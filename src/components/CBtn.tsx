import React, {useRef} from 'react';
import {Text, StyleSheet, Pressable, Animated} from 'react-native';

export default function Button(props) {
  const {onPress, title} = props;
  const scaleValue = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 1.2,
      useNativeDriver: false,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      useNativeDriver: false,
    }).start();
  };
  return (
    <Pressable
      onPressIn={handlePressIn}
      onPress={onPress}
      onPressOut={handlePressOut}>
      <Animated.View
        style={[
          styles.button,
          {
            transform: [{scale: scaleValue}],
          },
        ]}>
        <Text style={styles.text}>{title}</Text>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  touchButton: {
    height: 40,
    width: 100,
    borderRadius: 20,
    backgroundColor: '#fa1faa',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  touchButtonText: {
    color: 'white',
    textAlign: 'center',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    elevation: 5,
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 4,
    marginVertical: 10,
    backgroundColor: '#DD5ACC',
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'white',
  },
});
