import { Button, Form, Input, Item, Text, View } from "native-base";
import React from "react";
import {
  Image,
  ImageBackground,
  LayoutChangeEvent,
  LayoutRectangle,
  PermissionsAndroid,
  PixelRatio,
  Platform
} from "react-native";
import ImagePicker, {
  Image as ImageInCrop
} from "react-native-image-crop-picker";

import APIClient from "../api";
import BaseView from "../components/base/BaseView";
import Receipt from "../model/Receipt";
import User from "../model/User";
import style from "../styles/Receipt";
import BaseScreen, { IBaseScreenProps, IBaseScreenState } from "./Base";

export interface IReceiptState extends IBaseScreenState {
  uri: string | undefined;
  isReceipt: boolean;
  sizeImageView?: LayoutRectangle;
  idNo: string;
  rotate: number;
  scale: number;
}

export default class ReceiptScreen extends BaseScreen<IReceiptState> {
  public static navigationOptions = {
    title: "Upload Image"
  };
  constructor(props: IBaseScreenProps) {
    super(props);
    this.state = {
      idNo: "",
      isReceipt: true,
      rotate: 0,
      scale: 1,
      uri: undefined
    };
  }

  public render() {
    const receipt: Receipt = this.props.navigation.getParam("receipt");
    const user: User = this.props.navigation.getParam("user");
    const { isReceipt } = this.state;
    return (
      <BaseView>
        <ImageBackground
          onLayout={this.onLayoutImageBackground}
          style={style.image_background}
          imageStyle={{
            transform: [
              { rotate: `${this.state.rotate}deg` },
              { scale: this.state.scale }
            ]
          }}
          source={this.state.uri ? { uri: this.state.uri } : {}}
          resizeMode="contain"
        >
          <Form style={style.form}>
            <Text style={style.text}>Logged in as {user.getName()}</Text>
            <View style={style.form_row}>
              <Text style={style.text}>Trans Id: </Text>
              <Text style={style.text}>{receipt.getIdNo()}</Text>
            </View>
            <View style={style.form_row}>
              <Text style={style.text}>Sender: </Text>
              <Text style={style.text}>{receipt.getSFullName()}</Text>
            </View>
            <View style={style.form_row}>
              <Text style={style.text}>Receiver: </Text>
              <Text style={style.text}>{receipt.getRFullName()}</Text>
            </View>
            <View style={style.form_row}>
            <Text style={style.text}>Địa chỉ: </Text>
            <Text style={style.text}>{receipt.getRAddress()}</Text>
          </View>
            <View style={style.form_row}>
              <Text style={style.text}>Amount: </Text>
              <Text style={style.text}>{receipt.getAmount()}</Text>
            </View>
            <View style={style.form_row}>
              <Text style={style.text}>ID/PP: </Text>
              <Item regular={true} style={style.item_input}>
                <Input
                  autoCapitalize="none"
                  autoCorrect={false}
                  returnKeyType="go"
                  onChangeText={this.onChangeTextIdNo}
                  placeholder="Nhập CMND"
                  defaultValue={receipt.getidNum()}
                />
              </Item>
            </View>
          </Form>
        </ImageBackground>
        <View style={{ marginTop: 50, marginLeft: "5%", marginRight: "5%" }}>
          <View style={{ flexDirection: "row", flex: 1 }}>
            <Button style={style.button} onPress={this.onSelectImage}>
              <Text style={style.text_button}>
                Select {isReceipt ? "Receipt" : "Receiver"}
              </Text>
            </Button>
            <View style={{ width: 20 }} />
            <Button style={style.button} onPress={this.onTakeReceipt}>
              <Text style={style.text_button}>
                Take {isReceipt ? "Receipt" : "Receiver"}
              </Text>
            </Button>
          </View>
          <View style={{ flexDirection: "row", flex: 1, marginTop: 5 }}>
            <Button style={style.button} onPress={this.onChangePhoto}>
              <Text style={style.text_button}>Change Photo</Text>
            </Button>
            <View style={{ width: 20 }} />
            <Button style={style.button} onPress={this.onUpload}>
              <Text style={style.text_button}>
                Upload {isReceipt ? "Receipt" : "Receiver"}
              </Text>
            </Button>
          </View>
        </View>
      </BaseView>
    );
  }

  // Action
  private onChangeTextIdNo = (text: string) => {
    this.setState({
      idNo: text
    });
  };

  private onLayoutImageBackground = (event: LayoutChangeEvent) => {
    this.setState({
      sizeImageView: event.nativeEvent.layout
    });
  };

  private onChangePhoto = () => {
    this.setState(prev => ({
      isReceipt: !prev.isReceipt,
      uri: ""
    }));
  };

  private onSelectImage = () => {
    const { sizeImageView } = this.state;
    let width = 300;
    let height = 260;
    if (sizeImageView) {
      width = sizeImageView.width;
      height = sizeImageView.height;
    }
    setTimeout(() => {
      ImagePicker.openPicker({
        cropping: true,
        height,
        multiple: false,
        width
      }).then(image => {
        this.setState({
          uri: (image as ImageInCrop).path
        });
      });
    }, 5);
  };

  private onTakeReceipt = () => {
    this.checkPermission().then(_ => {
      this.props.navigation.navigate("ScanDocument", {
        scanSuccess: this.scanSuccess
      });
    });
  };

  private checkPermission = (): Promise<any> => {
    return new Promise((resolve, reject) => {
      if (Platform.OS === "android") {
        PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.CAMERA,
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
        ])
          .then(value => {
            if (
              value[PermissionsAndroid.PERMISSIONS.CAMERA] ===
                PermissionsAndroid.RESULTS.GRANTED &&
              value[PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE] ===
                PermissionsAndroid.RESULTS.GRANTED
            ) {
              resolve();
            }
          })
          .catch(error => {
            reject(error);
          });
      } else {
        resolve();
      }
    });
  };

  private scanSuccess = (uri: string) => {
    Image.getSize(
      uri,
      (width, height) => {
        const rotate = width / height < 1 ? -90 : 0;
        const scale =
          width / height < 1
            ? height /
              PixelRatio.getPixelSizeForLayoutSize(
                this.state.sizeImageView!.width
              ) /
              PixelRatio.get()
            : 1;
        this.setState({
          rotate,
          scale
        });
      },
      error => {
        console.log(error);
      }
    );
    this.setState({
      uri
    });
  };

  private onUpload = () => {
    setTimeout(() => {
      this.showLoading();
    }, 500);
    // Step 1: Check session
    APIClient.checkSession()
      .then(_ =>
        // Step 2: send id no
        APIClient.sendIdNo(
          this.state.idNo,
          this.props.navigation.getParam("barcode")
        )
      )
      .then(_ => {
        // Step 3: upload image
        const barcode = this.props.navigation.getParam("barcode");
        const fileName = (this.state.isReceipt ? "" : "Re_") + barcode + ".jpg";
        const data = new FormData();
        data.append("name", "userfile");
        data.append("filename", fileName);
        data.append("files", {
          // @ts-ignore
          name: fileName,
          type: "image/jpeg",
          uri: this.state.uri
        });
        return APIClient.uploadImage(data);
      })
      .then(_ => {
        this.hideLoading(() => {
          this.showOKAlert(
            `Uploaded  ${
              this.state.isReceipt ? "Receipt" : "Receiver"
            } completed!`
          );
          this.setState(prev => ({
            isReceipt: !prev.isReceipt
          }));
        });
      })
      .catch(error => {
        this.hideLoading(() => {
          this.showOKAlert(error);
        });
      });
  };
}
