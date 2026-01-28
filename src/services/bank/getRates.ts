import crypto from "node:crypto";
import { ratesApi } from "./setup.bank";

export type Rates = {
  data: {
    rates: {
      USDTNGN: number,
      USDTUSD: number
    },
    time: number
  },
  signature: string
}

async function getRates(){
  let rates: {[key:string]: number};

  try{
    const data = (
      await ratesApi.get("/?currency=NGN&assets=USDT")
    ).data.data;

    rates = {
      USDTNGN: data.USDT.NGN,
      USDTUSD: 1
    };
  }catch(err){
    console.log(`rateFetch_Failed: ${err.message}`);
    throw Error(err);
  }
    
  // sign rates with a timestamp to ensure the client sends back correct rates
  // they are within a specific timeframe
  const data = {
    rates, time: new Date().getTime()
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const signature = crypto.sign("SHA256", JSON.stringify(data), process.env.PRIVATE_KEY)
    .toString("hex");

  return {data, signature}
}

export default getRates;
