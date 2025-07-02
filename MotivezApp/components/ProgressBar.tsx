import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const pink = '#e91e63';
const grey = '#ccc';

const ProgressBar = ({ steps, currentStep }: { steps: string[]; currentStep: number }) => {
  return (
    <View style={styles.wrapper}>
      {/* Full Grey Line */}
      <View style={styles.fullLine} />
      {/* Filled Pink Line up to current step */}
      <View
        style={[
          styles.fullLine,
          styles.filledLine,
          { width: `${(currentStep / (steps.length - 1)) * 100}%` },
        ]}
      />
      {/* Circles */}
      <View style={styles.container}>
        {steps.map((_, index) => {
          const isCompleted = index < currentStep;
          const isActive = index === currentStep;

          return (
            <View key={index} style={styles.step}>
              <View
                style={[
                  styles.circle,
                  isCompleted && styles.completed,
                  isActive && styles.active,
                ]}
              >
                <Text
                  style={[
                    styles.number,
                    isCompleted && styles.completedText,
                    isActive && styles.activeText,
                  ]}
                >
                  {index + 1}
                </Text>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const CIRCLE_SIZE = 36; // Change this to make circles bigger/smaller
const LINE_THICKNESS = 3;

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
    height: CIRCLE_SIZE + 10,
    marginVertical: 30,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  fullLine: {
    position: 'absolute',
    top: CIRCLE_SIZE / 2,
    left: 24,
    right: 24,
    height: LINE_THICKNESS,
    backgroundColor: grey,
    borderRadius: LINE_THICKNESS / 2,
    zIndex: 0,
  },
  filledLine: {
    backgroundColor: pink,
    zIndex: 1,
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 2,
  },
  step: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  circle: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    backgroundColor: grey,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -7
  },
  number: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  completed: {
    backgroundColor: pink,
  },
  completedText: {
    color: '#fff',
  },
  active: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: pink,
  },
  activeText: {
    color: pink,
  },
});

export default ProgressBar;
