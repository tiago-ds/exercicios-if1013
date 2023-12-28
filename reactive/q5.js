const { interval } = require('rxjs');
const { switchMap, catchError } = require('rxjs/operators');
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

const randomProductId$ = interval(10000).pipe(
  switchMap(() => {
    const productId = generateRandomProductId();
    return fetchProductData(productId).then(data => [data]);
  }),
  catchError((error) => {
    console.error(error.message);
    return [];
  })
);

const subscription = randomProductId$.subscribe(
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

// this is probably something to do with scan, but I couldn't do it. 