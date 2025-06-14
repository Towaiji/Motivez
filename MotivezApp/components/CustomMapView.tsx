import React from 'react';
import { Platform, View, Text, StyleSheet } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, MapViewProps } from 'react-native-maps';

const Placeholder = ({ style }: { style?: MapViewProps['style'] }) => (
  <View style={[styles.placeholder, style]}>
    <Text>Map not available on web</Text>
  </View>
);

const CustomMapView: React.FC<MapViewProps> = (props) => {
  if (Platform.OS === 'web') {
    return <Placeholder style={props.style} />;
  }
  return <MapView {...props} />;
};

const styles = StyleSheet.create({
  placeholder: {
    backgroundColor: '#eee',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export { Marker, PROVIDER_GOOGLE };
export default CustomMapView;
