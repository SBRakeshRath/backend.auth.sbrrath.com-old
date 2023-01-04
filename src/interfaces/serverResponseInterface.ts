type successCode = "SUCCESS";

class serverSuccessMessage {
  status: number = 200;
  code: successCode = "SUCCESS";
  message: string = "success";
  data: object = {};

  constructor(
    data?: object,
    status?: number,
    code?: successCode,
    message?: string
  ) {
    if (data) {
      this.data = data;
    }
    if (status) {
      this.status = status;
    }
    if (code) {
      this.code = code;
    }
    if (message) {
      this.message = message;
    }

    // 👇️ because we are extending a built-in class
    Object.setPrototypeOf(this, serverSuccessMessage.prototype);
  }

  getResponse() {
    return {
      status: this.status,
      code: this.code,
      message: this.message,
      data:this.data
    };
  }
}

export default serverSuccessMessage;
