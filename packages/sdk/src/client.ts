type ConstructorArgs = {
  apiUrl: string;
  useTestnet: boolean;
  // ....
};

export class AcrossClient {
  apiUrl: string;
  useTestnet: boolean;

  constructor(args: ConstructorArgs) {
    this.apiUrl = args.apiUrl;
    this.useTestnet = args.useTestnet;
  }
}
