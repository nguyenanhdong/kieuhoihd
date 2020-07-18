import React, { Component } from "react";
import { Alert } from "react-native";
import { NavigationScreenProp } from "react-navigation";

export interface IBaseScreenProps {
  navigation: NavigationScreenProp<any, any>;
}

export interface IBaseScreenState {
  loading?: boolean;
}

export default class BaseScreen<
  S extends IBaseScreenState = {},
  SS = any
> extends Component<IBaseScreenProps, S, SS> {
  public showOKAlert = (msg: string) => {
    Alert.alert(
      msg,
      undefined,
      [
        {
          text: "OK"
        }
      ],
      { cancelable: false }
    );
  };

  public showLoading = () => {
    this.setState({
      loading: true
    });
  };

  public hideLoading = (completed?: () => void) => {
    this.setState({
      loading: false
    });
    setTimeout(() => {
      if (completed) {
        completed();
      }
    }, 500);
  };
}
