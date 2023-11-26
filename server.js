var http = require("http");
var o2x = require("object-to-xml");

const port = "8585";

function randomInt(low, high) {
  return Math.floor(Math.random() * (high - low) + low);
}

console.log("Server started!");
http
  .createServer(function (req, res) {
    console.log("New incoming client request for " + req.url);

    const format = req.headers["accept"] || "application/json";

    res.writeHeader(200, { "Content-Type": format });

    let data = undefined;

    switch (req.url) {
      case "/temperature":
        data = { temperature: randomInt(1, 40) };
        break;

      case "/light":
        data = { light: randomInt(1, 100) };
        break;

      default:
        data = { hello: "world" };
    }

    res.write(format.includes("xml") ? o2x(data) : JSON.stringify(data));

    res.end();
  })
  .listen(port);
