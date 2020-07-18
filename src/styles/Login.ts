import { StyleSheet } from "react-native";
import { APP_COLOR, SIZE } from "../constants";

export default StyleSheet.create({
  button: {
    backgroundColor: APP_COLOR.Blue,
    borderRadius: SIZE.BORDER.RADIUS,
    height: SIZE.BUTTON_HEIGHT,
    justifyContent: "center",
    marginTop: 20,
    width: "100%"
  },
  form: { marginLeft: "15%", marginRight: "15%" },
  image: {
    height: 200,
    marginLeft: "5%",
    marginTop: "10%",
    width: "90%"
  },
  input: { textAlign: "center" },
  item_password: {
    borderRadius: SIZE.BORDER.RADIUS,
    height: SIZE.INPUT_HEIGHT,
    marginTop: 10
  },
  item_username: {
    borderRadius: SIZE.BORDER.RADIUS,
    height: SIZE.INPUT_HEIGHT
  },
  main: { flex: 1, justifyContent: "center" },
  switch: {
    marginLeft: 10
  },
  view_remember: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10
  }
});
