import React from 'react';
// import { StatusBar } from 'react-native';
import { Container, Content, View } from 'native-base';

import { StatusBar } from 'react-native';
import styles from './styles';
import Loader from '../Loader';

export default class BaseView extends React.PureComponent {
  render() {
    return (
      <Container style={styles.container}>
        <StatusBar barStyle="default" />
        {this.props.header}
        <Loader loading={this.props.loading || false} />
        <Content bounces={false} contentContainerStyle={styles.contentContainer}>
          <View style={[this.props.viewStyle, styles.viewMain]}>{this.props.children}</View>
        </Content>
      </Container>
    );
  }
}
