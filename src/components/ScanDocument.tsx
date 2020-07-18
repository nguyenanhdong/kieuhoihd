// @ts-ignore
import ScanneriOS from "react-native-document-scanner";
// @ts-ignore
import ScannerAndroid from "react-native-documentscanner-android";

import React from "react";
import { Dimensions, LayoutRectangle, Platform, ViewStyle } from "react-native";
import ImagePicker, {
  Image as ImageInCrop
} from "react-native-image-crop-picker";

interface IScanDocumentProps {
  refScanner: (ref: any) => void;
  onPictureTaken: (uri?: string) => void;
  flashEnabled: boolean;
  onRectangleDetect: (data: {
    stableCounter: number;
    lastDetectionType: number;
  }) => void;
  detectionCountBeforeCapture: number;
  style: ViewStyle;
  manual?: boolean;
  sizeCrop?: LayoutRectangle;
}

export default class ScanDocument extends React.Component<IScanDocumentProps> {
  public render() {
    const { props } = this;
    const { manual } = props;
    let detectionRefreshRateInMS = 50;
    let color = "rgba(255, 0, 0, 0.6)";
    if (manual) {
      detectionRefreshRateInMS = Number.MAX_SAFE_INTEGER;
      color = "rgba(255, 255, 255, 0)";
    }
    if (Platform.OS === "ios") {
      return (
        <ScanneriOS
          ref={(ref: any) => {
            props.refScanner(ref);
          }}
          onPictureTaken={this.onPictureTakeniOS}
          overlayColor={color}
          enableTorch={props.flashEnabled}
          quality={1}
          onRectangleDetect={props.onRectangleDetect}
          detectionCountBeforeCapture={props.detectionCountBeforeCapture}
          detectionRefreshRateInMS={detectionRefreshRateInMS}
          captureMultiple={false}
          style={props.style}
        />
      );
    } else {
      return (
        <ScannerAndroid
          ref={(ref: any) => {
            props.refScanner(ref);
          }}
          noGrayScale={true}
          manualOnly={props.manual}
          onPictureTaken={this.onPictureTakenAndroid}
          enableTorch={props.flashEnabled}
          detectionCountBeforeCapture={props.detectionCountBeforeCapture}
          style={props.style}
        />
      );
    }
  }

  private onPictureTakeniOS = (data: {
    croppedImage: string;
    initialImage: string;
    rectangleCoordinates: Coordinates;
  }) => {
    if (this.props.manual) {
      this.props.onPictureTaken(data.initialImage);
    } else {
      this.props.onPictureTaken(data.croppedImage);
    }
  };

  private onPictureTakenAndroid = (data: { path: string }) => {
    const uri = `file://${data.path}`
    this.props.onPictureTaken(uri);
  };

  private cropImage = (path: string) => {
    const { sizeCrop } = this.props;
    let width = Dimensions.get("window").width;
    let height = (width / 16) * 9;
    if (sizeCrop) {
      width = sizeCrop.width;
      height = sizeCrop.height;
    }
    ImagePicker.openCropper({
      height,
      path,
      width
    })
      .then(image => {
        this.props.onPictureTaken((image as ImageInCrop).path);
      })
      .catch(() => this.props.onPictureTaken(undefined));
  };
}
