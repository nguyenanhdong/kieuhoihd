import { createAppContainer, createStackNavigator } from "react-navigation";

import { APP_COLOR } from "./src/constants/index";
import Login from "./src/screens/Login";
import QRCode from "./src/screens/QRCode";
import Receipt from "./src/screens/Receipt";
import ScanDocument from "./src/screens/Scan";

const AppNavigator = createStackNavigator(
  {
    Login,
    QRCode,
    Receipt,
    ScanDocument
  },
  {
    defaultNavigationOptions: {
      headerTintColor: APP_COLOR.Blue
    },
    initialRouteName: "Login"
  }
);

export default createAppContainer(AppNavigator);
