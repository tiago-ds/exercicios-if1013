const http = require("http");

function getTemperature() {
    return new Promise((resolve, reject) => {
        var options = {
          headers: {
            Accept: "application/json",
          },
        };
        var temperatureUrl = "http://devices.webofthings.io/pi/sensors/temperature/";
    
        http
            .get(temperatureUrl, options, (res) => {
                let data = "";
        
                res.on("data", (chunk) => {
                data += chunk;
                });
        
                res.on("end", () => {
                    try {
                        resolve(JSON.parse(data));
                    } catch (err) {
                        reject(err);
                    }
                });
            }
        ).on("error", (err) => {
            reject(err);
        });
    });
}

exports.getTemperature = getTemperature;