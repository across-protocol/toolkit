export class DepositRevert extends Error {
  constructor(message?: string) {
    super(message);
    this.name = "Deposit Reverted";
  }
}
