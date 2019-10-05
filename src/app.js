import yargs from "yargs";
import request from "request";

function mapBoxUrl (){
    return (mapBoxBaseUrl + mapBoxPlace + "?access_token=" + mapBoxToken);
};

let index = undefined;

const darkSkyBaseUrl = "https://api.darksky.net/";
const darkSkyToken = "13f0c0d2cc2caff1391cfe0f8d4e5e1a/";
const darkSkyEndPoint = darkSkyBaseUrl + "forecast/" + darkSkyToken;

const mapBoxBaseUrl = "https://api.mapbox.com/geocoding/v5/mapbox.places/";
const mapBoxToken = "pk.eyJ1IjoiZGppbWVuZXpmIiwiYSI6ImNrMWFvMmFpcTE5ZjAzY2xsZjJuYjcyYmEifQ.J4j791w3sonSkoHti8GI-A";
let mapBoxPlace = "";

const callback = (error, response) => {
    (response.body.features).forEach((elem, i) => {
        if(index === undefined || index === i){
            request({url: darkSkyEndPoint + response.body.features[i].center[1] + "," + response.body.features[i].center[0] + "?units=si", json: true}, (error, response2) =>{
                console.log("Tiempo en " + response.body.features[i].place_name);
                console.log("Temperatura: " + response2.body.currently.temperature + "°C");
                console.log("Probabilidad de esprecipitación: " + response2.body.currently.precipProbability + "%\n");
            }); 
        }
    });
}

yargs.command({
    command: "localization",
    define: "search the localization",
    builder: {
        name: {
            define: "the name of the place",
            demmandOption: true,
            type: "string",
        },
        index: {
            define: "the index of the places",
            demmandOption : false,
            type: "int",
        },
    },
    handler: (args) => {
        index = args.index;
        mapBoxPlace = args.name + ".json";
        request({url: mapBoxUrl(), json: true}, callback);
    },
});

yargs.parse();
