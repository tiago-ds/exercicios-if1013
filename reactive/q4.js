const { interval, timer } = require('rxjs');
const { switchMap, catchError, takeUntil } = require('rxjs/operators');
const axios = require('axios');

async function fetchProductData(productId) {
  try {
    const response = await axios.get(`https://dummyjson.com/products/${productId}`);
    return response.data;
  } catch (error) {
    throw new Error(`Erro ao obter dados para o produto com ID ${productId}: ${error.message}`);
  }
};

const generateRandomProductId = () => Math.floor(Math.random() * 100) + 1;

const generateRandomNumber = () => Math.floor(Math.random() * 5) + 1;

const randomProductId$ = interval(generateRandomNumber() * 1000).pipe(
  switchMap(() => {
    const productId = generateRandomProductId();
    return fetchProductData(productId).then(data => [data]);
  }),
  catchError((error) => {
    console.error(error.message);
    return [];
  }),
);

const timer$ = timer(15000);

const subscription = randomProductId$.pipe(
  takeUntil(timer$)
).subscribe(
  (productData) => {
    console.log('Product Data:', productData);
  },
  (error) => {
    console.error('Error:', error);
  },
  () => {
    console.log('End of stream');
  }
);
