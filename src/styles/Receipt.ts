import { StyleSheet } from "react-native";
import { APP_COLOR, SIZE } from "../constants";

export default StyleSheet.create({
  button: {
    backgroundColor: APP_COLOR.Blue,
    flex: 1,
    justifyContent: "center"
  },
  form: {
    marginBottom: "10%",
    marginLeft: "5%",
    marginRight: "5%",
    marginTop: "10%"
  },
  form_row: {
    alignItems: "center",
    flexDirection: "row",
    marginTop: 5
  },
  image_background: {
    width: "100%"
  },
  item_input: {
    borderRadius: SIZE.BORDER.RADIUS,
    flex: 1,
    height: SIZE.INPUT_HEIGHT
  },
  text: {
    color: APP_COLOR.Blue,
    fontWeight: "bold"
  },
  text_button: {
    color: APP_COLOR.White,
    fontWeight: "bold"
  }
});
