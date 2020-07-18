




export default class Receipt {
  private SFullName: string;
  private RFullName: string;
  private idNo: string;
  private Amount: string;
  private RAddress: string;
  private idNum: string;
  private RPhone: string;

  constructor(json: {
    SFullName: string;
    RFullName: string;
    idNo: string;
    Amount: string;
    RAddress: string;
    idNum: string;
    RPhone: string;
  }) {
    this.SFullName = json.SFullName;
    this.RFullName = json.RFullName;
    this.idNo = json.idNo;
    this.Amount = json.Amount;
    this.RAddress = json.RAddress;
    this.idNum = json.idNum;
    this.RPhone = json.RPhone;
  }
  public getRAddress(): string {
    return this.RAddress;
  }
  public getRPhone(): string {
    return this.RPhone;
  }
  public getidNum(): string {
    return this.idNum;
  }
  public getSFullName(): string {
    return this.SFullName;
  }
  public getRFullName(): string {
    return this.RFullName;
  }
  public getIdNo(): string {
    return this.idNo;
  }
  public getAmount(): string {
    return this.Amount;
  }
}
