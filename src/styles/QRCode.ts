import { StyleSheet } from "react-native";
import { APP_COLOR, SIZE } from "../constants";

export default StyleSheet.create({
  button: {
    backgroundColor: APP_COLOR.Blue,
    justifyContent: "center",
    paddingLeft: 10,
    paddingRight: 10
  },
  button_text: { color: APP_COLOR.White, fontWeight: "bold" },
  camera: {
    flex: 1,
    overflow: "hidden"
  },
  form: {
    marginLeft: "15%",
    marginRight: "15%",
    marginTop: 10
  },
  input: { textAlign: "center" },
  item_input: { borderRadius: SIZE.BORDER.RADIUS, height: SIZE.INPUT_HEIGHT },
  text_login_as: {
    alignSelf: "center",
    bottom: 20,
    color: APP_COLOR.Red,
    fontSize: 16,
    position: "absolute"
  },
  view_buttons: { marginTop: 10, flexDirection: "row" },
  view_scaner: {
    height: "30%",
    width: "100%"
  },
  view_space_buttons: { flex: 1 }
});
