import { StyleSheet } from "react-native";
import { APP_COLOR, SIZE } from "../constants";

export default StyleSheet.create({
  button_capture: {
    alignSelf: "center",
    backgroundColor: APP_COLOR.White,
    borderRadius: 25,
    bottom: 10,
    height: 50,
    position: "absolute",
    width: 50
  },
  button_flash: {
    alignSelf: "flex-end",
    marginRight: 10,
    position: "absolute",
    top: 10
  },
  button_manual: {
    height: "100%"
  },
  icon_flash: {
    color: APP_COLOR.Black,
    fontSize: SIZE.FONT_SIZE.ICON
  },
  text_manual: { color: APP_COLOR.Black },
  view_scanner: { flex: 1 }
});
