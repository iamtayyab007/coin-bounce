import axios from "axios";
const NEWS_API_KEY = import.meta.env.VITE_API_KEY;
const NEWS_API_ENDPOINT = `https://newsapi.org/v2/everything?q=business AND blockchain&sortBy=publishedAt&language=en&apiKey=${NEWS_API_KEY}`;

const proxyUrl = "https://cors-anywhere.herokuapp.com/";
const CRYPTO_API_ENDPOINT =
  "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false";
export const getNews = async () => {
  try {
    const response = await axios.get(NEWS_API_ENDPOINT);
    const result = response.data.articles.slice(0, 15);
    return result;
  } catch (error) {
    return error;
  }
};

export const getCrypto = async () => {
  try {
    const response = await axios.get(CRYPTO_API_ENDPOINT + proxyUrl);
    const result = response.data;
    return result;
  } catch (error) {
    return error;
  }
};
