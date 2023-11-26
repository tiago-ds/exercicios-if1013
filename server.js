var http = require("http");
var o2x = require("object-to-xml");

const port = "8585";

function randomInt(low, high) {
    return Math.floor(Math.random() * (high - low) + low);
}

function toFahrenheit(temperature) {
    return (temperature * 9 / 5) + 32;
}

function params(url) {
    let params = url.split("?") || [];
    let result = {};
    if (params.length >= 2) {
        params[1].split("&").forEach((item) => {
            result[item.split("=")[0]] = item.split("=")[1];
        });
    }
    return result;
}

console.log("Server started!");
http
    .createServer(function (req, res) {
        const path = req.url.split("?")[0] || req.url;
        const paramsMap = params(req.url);

        console.log("New incoming client request for " + path);

        const format = req.headers["accept"]?.includes("xml") ? "application/xml" : "application/json";

        res.writeHeader(200, { "Content-Type": format });
        
        let data = {};
        
        switch (path) {
            case "/temperature":
                let temperature = randomInt(1, 40);
                let scale = paramsMap.scale || "C";

                if(scale == "F") {
                    temperature = toFahrenheit(temperature);
                }

                data = { temperature, scale };
                break;

            case "/light":
                data = { light: randomInt(1, 100) };
                break;

            default:
                data = { hello: "world" };
        }

        res.write(format === ("application/xml") ? o2x(data) : JSON.stringify(data));

        res.end();
    })
    .listen(port);
