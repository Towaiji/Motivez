import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../app/context/ThemeContext';
import { lightColors } from '../constants/colors';

const { width } = Dimensions.get('window');

const ProgressBar = ({ steps, currentStep }: { steps: string[]; currentStep: number }) => {
  const progressAnim = useRef(new Animated.Value(0)).current;
  const { colors } = useTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);

  useEffect(() => {
    const stepFraction = currentStep / (steps.length - 1);
    const LINE_WIDTH = width - 48; // 24 padding on each side
    Animated.timing(progressAnim, {
      toValue: LINE_WIDTH * stepFraction,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [currentStep, steps.length]);

  return (
    <View style={styles.wrapper}>
      {/* Full Grey Line */}
      <View style={styles.fullLine} />
      {/* Filled gradient line up to current step */}
      <Animated.View style={[styles.fullLine, styles.filledLine, { width: progressAnim }]}
        pointerEvents="none"
      >
        <LinearGradient
          colors={["#ff8a65", colors.primary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>
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

const createStyles = (c: typeof lightColors) => StyleSheet.create({
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
    backgroundColor: c.grey,
    borderRadius: LINE_THICKNESS / 2,
    zIndex: 0,
  },
  filledLine: {
    backgroundColor: c.primary,
    overflow: 'hidden',
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
    backgroundColor: c.grey,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -7
  },
  number: {
    color: c.white,
    fontSize: 12,
    fontWeight: '600',
  },
  completed: {
    backgroundColor: c.primary,
  },
  completedText: {
    color: c.white,
  },
  active: {
    backgroundColor: c.white,
    borderWidth: 2,
    borderColor: c.primary,
  },
  activeText: {
    color: c.primary,
  },
});

export default ProgressBar;
