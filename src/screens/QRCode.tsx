import { Button, Form, Input, Item, Text, View } from "native-base";
import React from "react";
import { BarCodeType, Point, RNCamera, Size } from "react-native-camera";

import APIClient from "../api";
import BaseView from "../components/base/BaseView";
import style from "../styles/QRCode";
import BaseScreen, { IBaseScreenProps, IBaseScreenState } from "./Base";

export interface IQRCodeScreenState extends IBaseScreenState {
  isShowScaner: boolean;
  qrCode: string;
}

export default class QRCodeScreen extends BaseScreen<IQRCodeScreenState> {
  public static navigationOptions = {
    title: "QR Code"
  };

  constructor(props: IBaseScreenProps) {
    super(props);
    this.state = {
      isShowScaner: false,
      qrCode: ""
    };
  }
  public render() {
    return (
      <BaseView loading={this.state.loading}>
        <View style={style.view_scaner}>
          {this.state.isShowScaner && (
            <RNCamera
              captureAudio={false}
              style={style.camera}
              // onGoogleVisionBarcodesDetected={this.barcodeRecognized}
              onBarCodeRead={this.onBarCodeRead}
            />
          )}
        </View>
        <Form style={style.form}>
          <Item regular={true} style={style.item_input}>
            <Input
              placeholder="QR Code here"
              style={style.input}
              value={this.state.qrCode}
              onChangeText={this.onChangeTextQRCode}
            />
          </Item>
          <View style={style.view_buttons}>
            <Button style={style.button} onPress={this.onScanStop}>
              <Text style={style.button_text}>
                {this.state.isShowScaner ? "Stop" : "Scan QR"}
              </Text>
            </Button>
            <View style={style.view_space_buttons} />
            <Button style={style.button} onPress={this.onSearch}>
              <Text style={style.button_text}>Search</Text>
            </Button>
          </View>
        </Form>
        <Text style={style.text_login_as}>
          Logged in as {this.props.navigation.getParam("user").name}
        </Text>
      </BaseView>
    );
  }

  // Action
  private onScanStop = () => {
    this.setState(prev => ({
      isShowScaner: !prev.isShowScaner
    }));
  };

  private onSearch = () => {
    this.handleBarcode(this.state.qrCode);
  };

  private onChangeTextQRCode = (text: string) => {
    this.setState({
      qrCode: text
    });
  };

  // private barcodeRecognized = (event: { barcodes: Barcode[] }) => {
  //   const barcodes = event.barcodes;
  //   if (barcodes.length > 0) {
  //     this.handleBarcode(barcodes[0].data);
  //   }
  // };

  private onBarCodeRead = (event: {
    data: string;
    rawData?: string;
    type: keyof BarCodeType;
    bounds:
      | [Point<string>, Point<string>]
      | { origin: Point<string>; size: Size<string> };
  }) => {
    const barcode = event.data;
    this.handleBarcode(barcode);
  };

  // Func
  private handleBarcode = (barcode: string) => {
    this.setState({
      isShowScaner: false,
      qrCode: barcode
    });

    if (barcode.trim().length === 0) {
      this.showOKAlert("QRCode blank");
      return;
    }

    // const user = this.props.navigation.getParam("user");
    // const receipt = new Receipt({
    //   SFullName: "a",
    //   RFullName: "a",
    //   idNo: "3",
    //   Amount: "1"
    // });
    // this.props.navigation.navigate("Receipt", {
    //   barcode,
    //   receipt,
    //   user
    // });

    this.showLoading();
    APIClient.searchQRCode(barcode)
      .then(receipt => {
        receipt.idNo = barcode;
        this.hideLoading(() => {
          const user = this.props.navigation.getParam("user");
          this.props.navigation.navigate("Receipt", {
            barcode,
            receipt,
            user
          });
        });
      })
      .catch(error => {
        this.hideLoading(() => {
          this.showOKAlert(error);
        });
      });
  };
}
