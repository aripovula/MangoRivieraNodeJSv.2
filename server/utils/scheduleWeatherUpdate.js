const Forecast = require('forecast.io-bluebird');
const moment = require('moment');

let evenTime = false;
let forecast = new Forecast({
  key: process.env.WEATHERAPIKEY,
  timeout: 10000
});

sendBackForecastTable = () => {
    console.log("IN FORECAST 11 evenTime = "+evenTime);
    return new Promise((resolve, reject)=>{
        return forecast.fetch(41.299968, 69.2707328) //'39.3469952,-84.4013568',  //'25.8102247,-80.2101822',
        .then( data => {
            return constructForecastTable(data);
        })
        .then( info => {
            //console.log('SERVER 2 detailed='+info.detailed);
            resolve(info);
        })
        .catch( error => {
            console.error("ERRRROR "+error);
            let  html = '<div class="boxed">... could not update the weather info ...</div> ';
            resolve(html);
        });

    });
}

constructForecastTable = (forecast) => {
    return new Promise((resolve, reject)=>{

        let context;
        let  html = '<div class="boxed">... updating weather info ...</div> ';
        
        //console.log("IN FORECAST 22 REQUEST evenTime = "+evenTime);

        let  open = "</span><i style='color:#FF69B4' class='wi ";
        let  close = "'></i><span>";
        
        let  forDetailed="";
        forDetailed = forDetailed + `Currently - &nbsp; &nbsp; &nbsp; ${forecast.currently.summary}&nbsp; &nbsp; &nbsp;  Temp.: ${forecast.currently.temperature} &nbsp; &nbsp; &nbsp;Feels like ${forecast.currently.apparentTemperature}&nbsp; &nbsp; &nbsp; Wind: ${forecast.currently.windSpeed} mph &nbsp; &nbsp; &nbsp;Humidity: ${forecast.currently.humidity} &nbsp; &nbsp; &nbsp;uv-Index: ${forecast.currently.uvIndex}\n`;  
        forDetailed = forDetailed + "\n";
          
        for(let  i = 1; i < 6; i++) {
            forDetailed = forDetailed + `In ${i} hour(s) - &nbsp; &nbsp; &nbsp; ${forecast.hourly.data[i].summary}&nbsp; &nbsp; &nbsp;  Temp.: ${forecast.hourly.data[i].temperature} &nbsp; &nbsp; &nbsp;Feels like ${forecast.hourly.data[i].apparentTemperature}&nbsp; &nbsp; &nbsp; Wind: ${forecast.hourly.data[i].windSpeed} mph&nbsp; &nbsp; &nbsp; Humidity: ${forecast.hourly.data[i].humidity}&nbsp; &nbsp; &nbsp; uv-Index: ${forecast.hourly.data[i].uvIndex}\n`;  
            forDetailed = forDetailed + "\n";
        }
          
        for(let  i = 1; i < 3; i++) {
            forDetailed = forDetailed + `In ${i} day(s) - &nbsp; &nbsp; &nbsp; ${forecast.daily.data[i].summary}&nbsp; &nbsp; &nbsp;  High: ${forecast.daily.data[i].temperatureHigh}&nbsp; &nbsp; &nbsp; Low ${forecast.daily.data[i].temperatureLow}&nbsp; &nbsp; &nbsp; Wind: ${forecast.daily.data[i].windSpeed} mph &nbsp; &nbsp; &nbsp;Humidity: ${forecast.daily.data[i].humidity}&nbsp; &nbsp; &nbsp;uv-Index: ${forecast.daily.data[i].uvIndex}\n`;  
            forDetailed = forDetailed + "\n";
        }

        let brief = `${open}wi-thermometer${close} ${forecast.currently.temperature}&deg;F &nbsp; ${open}wi-strong-wind${close} ${forecast.currently.windSpeed} mph  &nbsp; ${open}wi-humidity${close} ${forecast.currently.humidity}`;


        if (forDetailed != null && brief != null) {
            html="";
            let color = 'darkcyan';
            evenTime = !evenTime;
            if (evenTime) {color = 'green';} else {color='darkcyan';}
            let ctime = moment().format('h:mm a');
            let  l1 = `<div class="boxed" style="color:${color}" data-toggle="tooltip" data-placement="bottom" title=`;
            let l2 = `"Miami Beach, Florida, USA ( actual weather right now - uses real API )\n\n ${forDetailed}`;
            let  l3 = ` \nUpdated every 20 minutes. Last updated at ${ctime} &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; ( for demo purposes updated every minute )"`;
            let  l4 = ` >Weather:  &nbsp; ${brief}.\n\r( uses real API. Hover mouse here for details. Updates every minute )`;
            let  l5 = `</div>`;
      
            html = l1 + l2 + l3 + l4 + l5;
        }
        //console.log('FINAL html='+html);
        resolve(html);
    });
}

module.exports = {sendBackForecastTable};