import {
  Button,
  Form,
  Input,
  Item,
  Label,
  Switch,
  Text,
  View
} from "native-base";
import React from "react";
import { AsyncStorage, Image } from "react-native";

import APIClient from "../api";
import BaseView from "../components/base/BaseView";
import { APP_COLOR } from "../constants";
import style from "../styles/Login";
import BaseScreen, { IBaseScreenProps, IBaseScreenState } from "./Base";

export interface ILoginScreenState extends IBaseScreenState {
  username: string;
  password: string;
  isRemember: boolean;
}

export default class LoginScreen extends BaseScreen<ILoginScreenState> {
  public static navigationOptions = {
    title: "Login"
  };

  private inputPassword: any;

  constructor(props: IBaseScreenProps) {
    super(props);
    this.state = {
      isRemember: false,
      password: "",
      username: ""
    };

    AsyncStorage.multiGet(["DP@u", "DP@p"], (_, stores) => {
      if (stores && stores.length >= 2) {
        const username = stores[0][1];
        const password = stores[1][1];
        if (username != null && password != null) {
          this.setState({
            isRemember: true,
            password,
            username
          });
        } else {
          this.setState({
            isRemember: false,
            password: "",
            username: ""
          });
        }
      }
    });
  }

  public render() {
    return (
      <BaseView loading={this.state.loading}>
        <Image
          resizeMode="contain"
          style={style.image}
          source={require("../resources/images/logo.png")}
        />
        <Form style={style.form}>
          <Item regular={true} style={style.item_username}>
            <Input
              style={style.input}
              placeholder="Username"
              autoCapitalize="none"
              value={this.state.username}
              autoCorrect={false}
              returnKeyType="next"
              onChangeText={this.onChangeUsername}
              onSubmitEditing={this.onSubmitUsername}
            />
          </Item>
          <Item regular={true} style={style.item_password}>
            <Input
              ref={input => {
                if (input != null) {
                  this.inputPassword = input;
                }
              }}
              style={style.input}
              placeholder="Password"
              autoCapitalize="none"
              value={this.state.password}
              autoCorrect={false}
              secureTextEntry={true}
              returnKeyType="go"
              onChangeText={this.onChangePassword}
              onSubmitEditing={this.onLogin}
            />
          </Item>
          <View style={style.view_remember}>
            <Label>Remember</Label>
            <Switch
              style={style.switch}
              value={this.state.isRemember}
              onValueChange={this.onRemember}
              trackColor={{ false: "", true: APP_COLOR.Blue }}
            />
          </View>
          <Button style={style.button} onPress={this.onLogin}>
            <Text style={{ fontWeight: "bold" }}>Login</Text>
          </Button>
        </Form>
      </BaseView>
    );
  }

  // Action
  private onChangeUsername = (text: string) => {
    this.setState({
      username: text
    });
  };

  private onChangePassword = (text: string) => {
    this.setState({
      password: text
    });
  };

  private onSubmitUsername = () => {
    if (this.inputPassword != null && this.inputPassword._root != null) {
      this.inputPassword._root.focus();
    }
  };

  private onRemember = (value: boolean) => {
    this.setState({
      isRemember: value
    });
  };

  private onLogin = () => {
    const { username, password } = this.state;
    if (username.trim().length < 1 || password.trim().length < 1) {
      this.showOKAlert("Username or Password blank");
      return;
    }

    // this.props.navigation.navigate("QRCode", { user: new User("a") });
    this.showLoading();
    APIClient.login(username, password)
      .then(user => {
        this.hideLoading(() => {
          if (this.state.isRemember) {
            this.saveInfoLogin();
          } else {
            this.removeInfoLogin();
          }
          this.props.navigation.navigate("QRCode", { user });
        });
      })
      .catch(error => {
        this.hideLoading(() => {
          this.showOKAlert(error);
        });
      });
  };

  private saveInfoLogin = () => {
    const { username, password } = this.state;
    AsyncStorage.multiSet([["DP@u", username], ["DP@p", password]]);
  };

  private removeInfoLogin = () => {
    AsyncStorage.clear();
    this.setState({
      password: "",
      username: ""
    });
  };
}
