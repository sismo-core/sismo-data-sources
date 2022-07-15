import { utils } from "ethers";

export default class BigQueryHelper {
  public static excludeExchangeAddresses() {
    // select most used addresses from the exchange
    const addresses = [
      "0xfbb1b73c4f0bda4f67dca266ce6ef42f520fbb98", // Bittrex
      "0xe94b04a0fed112f3664e45adb2b8915693dd5ff3", // Bittrex 2
      "0x28c6c06298d514db089934071355e5743bf21d60", // Binance 14
      "0xc098b2a3aa256d2140208c3de6543aaef5cd3a94", // FTX Exchange 2
      "0xa7efae728d2936e78bda97dc267687568dd593f3", // OKEx 3
    ];
    return addresses
      .map((address) => `to_address <> '${address}'`)
      .join(" AND ");
  }

  public static excludeFunction(functionSignature: string) {
    return `SUBSTR(input, 3, 8) <> '${utils
      .id(functionSignature)
      .substring(2, 10)}'`;
  }

  public static excludeTransfer() {
    return `SUBSTR(input, 3, 8) <> ''`;
  }

  public static excludeReceiptStatusNull() {
    return "(receipt_status = 1 or receipt_status is null)";
  }
}
