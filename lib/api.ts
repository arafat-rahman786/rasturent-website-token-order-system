import axios from "axios";

const api = axios.create({
  baseURL: "https://rasturent-website-token-order-system.onrender.com",
  timeout: 5000,
  headers: { "content-type": "application/json" },
});

export default api;

const ONE_HOUR =60* 60 * 1000;

async function cleanexpaireData() {
  try {
    const res = await api.get('/customerTokenInfomation')
    const tokens = res.data
    const currentTime = Date.now()
    for (const token of tokens){
      const tokenAge = currentTime - Number(token.orderCreatedAt)
      if(tokenAge >= ONE_HOUR){
         await api.delete(
          `/customerTokenInfomation/${token.id}`
        );

        console.log(`Token ${token.tokenNumber} deleted`);
      }
      console.log("Token cleanup completed");
    }
  } catch (error) {
     console.error("Token cleanup failed:", error);
  }
}
cleanexpaireData()
setInterval(cleanexpaireData, ONE_HOUR);

