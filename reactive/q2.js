const { from, interval, EMPTY } = require('rxjs');
const { concatMap, delay, retryWhen, scan, catchError, take } = require('rxjs/operators');
const axios = require('axios');

async function fetchDataWithRetry(url, maxRetries = 3) {
  let currentRetry = 0;

  async function fetchData() {
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      if (currentRetry < maxRetries) {
        currentRetry++;
        throw error;
      } else {
        throw new Error(`Max retries reached for "${url}".`);
      }
    }
  };

  return fetchData();
};

const statusCodes$ = from(Array.from({ length: 10 }, (_, index) => 401 + index));

const interval$ = interval(3000);

const maxRetries = 3;

const subscription = statusCodes$
  .pipe(
    concatMap((statusCode) =>
      from(fetchDataWithRetry(`https://httpbin.org/status/${statusCode}`, maxRetries)).pipe(
        retryWhen(errors =>
          errors.pipe(
            scan((retryCount, error) => {
              if (retryCount < maxRetries) {
                return retryCount + 1;
              } else {
                throw error;
              }
            }, 0),
            concatMap(retryCount => {
              console.error(`Error for https://httpbin.org/status/${statusCode} (retry count: ${retryCount})`);
              return interval$.pipe(take(1));
            })
          )
        ),
        catchError((error) => {
          console.error(error.message);
          return EMPTY;
        })
      )
    ),
    delay(3000)
  )
  .subscribe(
    (responseData) => {
      console.log('Response data:', responseData);
    },
  );
