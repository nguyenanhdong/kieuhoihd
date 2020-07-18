import { Button, Icon, Text } from "native-base";
import React, { Component } from "react";
import { View } from "react-native";

import { NavigationScreenProp, NavigationScreenProps } from "react-navigation";
import BaseView from "../components/base/BaseView";
import ScanDocument from "../components/ScanDocument";
import style from "../styles/Scan";

export interface IScanScreenProps {
  navigation: NavigationScreenProp<any, any>;
}

export interface IScanScreenState {
  manual: boolean;
  flashEnabled: boolean;
  showScanner: boolean;
  loading: boolean;
}

export default class ScanScreen extends Component<
  IScanScreenProps,
  IScanScreenState
> {
  public static navigationOptions = ({
    navigation
  }: NavigationScreenProps) => ({
    headerRight: (
      <Button
        transparent={true}
        style={style.button_manual}
        onPress={navigation.getParam("onManual")}
      >
        <Text style={style.text_manual}>
          {navigation.getParam("isManual") ? "Auto" : "Manual"}
        </Text>
      </Button>
    )
  });

  // Var
  private detectionCountBeforeCapture = 6;
  private scanner: any;

  constructor(props: IScanScreenProps) {
    super(props);
    this.state = {
      flashEnabled: false,
      loading: false,
      manual: false,
      showScanner: true
    };
  }

  public componentDidMount() {
    this.props.navigation.setParams({
      isManual: false,
      onManual: this.onManual
    });
  }

  public render() {
    return (
      <BaseView loading={this.state.loading}>
        <View style={style.view_scanner}>
          {this.state.showScanner && (
            <ScanDocument
              refScanner={this.refScanner}
              onPictureTaken={this.onPictureTaken}
              flashEnabled={this.state.flashEnabled}
              onRectangleDetect={this.onRectangleDetect}
              detectionCountBeforeCapture={this.detectionCountBeforeCapture}
              manual={this.state.manual}
              style={style.view_scanner}
            />
          )}
        </View>
        {this.state.manual && (
          <Button style={style.button_capture} onPress={this.onCapture} />
        )}
        <Button
          transparent={true}
          style={style.button_flash}
          onPress={this.onFlash}
        >
          <Icon
            name={this.state.flashEnabled ? "flash" : "flash-off"}
            type="MaterialCommunityIcons"
            style={style.icon_flash}
          />
        </Button>
      </BaseView>
    );
  }

  // Action
  private onManual = () => {
    const newValue = !this.state.manual;
    this.setState({
      manual: newValue
    });
    this.props.navigation.setParams({ isManual: newValue });
  };

  private onFlash = () => {
    const newValue = !this.state.flashEnabled;
    this.setState({ flashEnabled: newValue });
    this.props.navigation.setParams({ flashEnabled: newValue });
  };

  private onCapture = () => {
    this.scanner.capture();
  };

  private onPictureTaken = (uri?: string) => {
    this.setState({
      loading: false,
      showScanner: false
    });
    if (uri) {
      this.props.navigation.state.params.scanSuccess(uri);
    }
    this.props.navigation.goBack();
  };

  // Func
  private refScanner = (ref: any) => {
    this.scanner = ref;
  };

  private onRectangleDetect = (data: {
    stableCounter: number;
    lastDetectionType: number;
  }) => {
    if (data.stableCounter === this.detectionCountBeforeCapture + 1) {
      this.setState({
        loading: true
      });
    }
  };
}
