const { from, of } = require("rxjs");
const { concatMap, delay } = require("rxjs/operators");
const axios = require("axios");

async function getUserData(id) {
  const response = await axios.get(
    `https://jsonplaceholder.typicode.com/users/${id}`
  );
  return response.data;
}

const userIds$ = from(Array.from({ length: 10 }, (_, index) => index + 1));
const subscription = userIds$
  .pipe(
    concatMap((userId) => of(userId).pipe(delay(3000))),
    concatMap((userId) => from(getUserData(userId)))
  )
  .subscribe(
    (userData) => {
      console.log("User data", userData);
    },
    (error) => {
      console.error("Erro:", error);
    },
    () => {
      console.log("Finished");
      subscription.unsubscribe(); // Encerra a assinatura após concluir todas as requisições
    }
  );
