import axios from "axios";
import Receipt from "../model/Receipt";
import User from "../model/User";

const BASE_URL = "http://hdbankmoneytransfer.tk/apifinal.aspx";
enum FUNC_PATH {
  LOGIN = "login",
  SEARCH = "search",
  CHECK_SESSION = "checksession",
  SEND_ID_NO = "sendidno",
  UPLOAD = "upload"
}

export default class APIClient {
  public static login = (username: string, password: string): Promise<User> => {
    return new Promise((resolve, reject) => {
      const body = { username, password };
      APIClient.callAPI(FUNC_PATH.LOGIN, body)
        .then(dataResponse => {
          const { data } = dataResponse;
          if (JSON.parse(data.login)) {
            resolve(new User(data.name));
          } else {
            reject("Login failure");
          }
        })
        .catch(error => {
          reject("Login failure");
        });
    });
  };

  public static searchQRCode = (qrCode: string): Promise<Receipt> => {
    return new Promise((resolve, reject) => {
      const body = { qrCode };
      APIClient.callAPI(FUNC_PATH.SEARCH, body)
        .then(dataResponse => {
          const { data } = dataResponse;
          if (JSON.parse(data.searchResult)) {
            const receipt = new Receipt(data);
            resolve(receipt);
          } else {
            reject("No result");
          }
        })
        .catch(error => {
          reject("No result");
        });
    });
  };

  public static checkSession = (): Promise<any> => {
    return new Promise((resolve, reject) => {
      APIClient.callAPI(FUNC_PATH.CHECK_SESSION, {})
        .then(dataResponse => {
          const { data } = dataResponse;
          if (JSON.parse(data.loginSession) && JSON.parse(data.timeout)) {
            resolve();
          } else {
            reject("Session's timeout. Login again!");
          }
        })
        .catch(error => {
          reject("Session's timeout. Login again!");
        });
    });
  };

  public static sendIdNo = (idNo: string, qrCode: string): Promise<any> => {
    return new Promise((resolve, reject) => {
      const body = { idNo, qrCode };
      APIClient.callAPI(FUNC_PATH.SEND_ID_NO, body)
        .then(dataResponse => {
          const { data } = dataResponse;
          if (!JSON.parse(data.loginSession)) {
            reject("Session's timeout. Login again!");
          } else if (!JSON.parse(data.idNo)) {
            reject("Send IdNo fail! Try again.");
          } else {
            resolve();
          }
        })
        .catch(error => {
          reject("Send IdNo fail! Try again.");
        });
    });
  };

  public static uploadImage = (formData: FormData): Promise<any> => {
    return new Promise((resolve, reject) => {
      APIClient.callAPI(FUNC_PATH.UPLOAD, formData)
        .then(dataResponse => {
          const { data } = dataResponse;
          if (!JSON.parse(data.uploaded)) {
            reject("Upload failure");
          } else {
            resolve();
          }
        })
        .catch(error => {
          reject("Upload failure");
        });
    });
  };

  private static callAPI = (f: FUNC_PATH, data: any): Promise<any> => {
    return new Promise((resolve, reject) => {
      axios
        .post(BASE_URL, data, {
          params: {
            f
          }
        })
        .then(response => {
          resolve(response.data);
        })
        .catch(error => {
          console.warn(error);
          reject(error);
        });
    });
  };
}
