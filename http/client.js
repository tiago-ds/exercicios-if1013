const http = require("http");

var options = Object();
var noScaleURL = "http://localhost:8585/temperature";
var scaleURL = "http://localhost:8585/temperature?scale=F";

options.headers = { Accept: "application/json" };

http
  .get(noScaleURL, options, (resp) => {
    let data = "";

    resp.on("data", (chunk) => {
      data += chunk;
    });

    resp.on("end", () => {
      console.log(JSON.parse(data));
    });
  })
  .on("error", (err) => {
    console.log("Error: " + err.message);
  });

http
  .get(scaleURL, options, (resp) => {
    let data = "";

    resp.on("data", (chunk) => {
      data += chunk;
    });

    resp.on("end", () => {
      console.log(JSON.parse(data));
    });
  })
  .on("error", (err) => {
    console.log("Error: " + err.message);
  });
