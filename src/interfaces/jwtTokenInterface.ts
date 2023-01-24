


class jwtTokenInterface {
  status: number;
  code: string;
  message: string;
  data: {
    token: {
      [key: string]: any;
    };
    [key: string]: any;
  };
}

export default jwtTokenInterface;
