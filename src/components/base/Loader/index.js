import React from 'react';
import {
  Modal, Text, View, ActivityIndicator,
} from 'react-native';

import styles from './styles';

export default (props) => {
  const { loading, text } = props;

  return (
    <Modal transparent animationType="none" visible={loading} onRequestClose={() => {}}>
      <View style={styles.modalBackground}>
        <View style={styles.activityIndicatorWrapper}>
          <ActivityIndicator animating={loading} size="large" />
          {text && text.trim() !== '' && <Text style={styles.text}>{text}</Text>}
        </View>
      </View>
    </Modal>
  );
};
