export class Result {
  code: number;
  info: string;
  data: any;
  constructor(code: number, info: string, data: any) {
    this.code = code;
    this.info = info;
    this.data = data;
  }
  // success
  static success(data: any) {
    return new Result(200, "success", data);
  }
  // error
  static error(code: number, info: string) {
    return new Result(code, info, null);
  }
}

class ModelClass<T extends Record<string, any>> {
  toObject(): Partial<T> {
    return Object.assign({}, this);
  }
}
