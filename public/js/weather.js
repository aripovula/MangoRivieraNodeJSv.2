// $(document).ready(function () {
  
  var context;
  var apiReadTime;

  function updateWeatherInfo(apiKey) {
    return new Promise((resolve, reject) => {
      var html = '<div class="boxed">... updating weather info ...</div> ';
      $("#weather_placeholder").html(html);
      var updated = false;
      
      // Since I did not learn how to pass data from server to front end (may be using webpacks)
      // as a TEMPORARY measure I am reading API from local file to protect it from saving in github.com
      //var apiTemp;

      var url              = 'https://api.darksky.net/forecast/',
      locationData         = '41.299968,69.2707328', //'39.3469952,-84.4013568',  //'25.8102247,-80.2101822',
      api_call = url + apiKey + "/" + locationData + "?extend=hourly&callback=?";
  
      console.log("api_call="+api_call);

        $.getJSON(api_call, function(forecast) {
        
          console.log("IN FORECAST REQUEST");

          var open = "</span><i style='color:#FF69B4' class='wi ";
          var close = "'></i><span>";
        
          var forDetailed="";
          forDetailed = forDetailed + `Currently - &nbsp; &nbsp; &nbsp; ${forecast.currently.summary}&nbsp; &nbsp; &nbsp;  Temp.: ${forecast.currently.temperature} &nbsp; &nbsp; &nbsp;Feels like ${forecast.currently.apparentTemperature}&nbsp; &nbsp; &nbsp; Wind: ${forecast.currently.windSpeed} mph &nbsp; &nbsp; &nbsp;Humidity: ${forecast.currently.humidity} &nbsp; &nbsp; &nbsp;uv-Index: ${forecast.currently.uvIndex}\n`;  
          forDetailed = forDetailed + "\n";
          
          for(var i = 1; i < 6; i++) {
            forDetailed = forDetailed + `In ${i} hour(s) - &nbsp; &nbsp; &nbsp; ${forecast.hourly.data[i].summary}&nbsp; &nbsp; &nbsp;  Temp.: ${forecast.hourly.data[i].temperature} &nbsp; &nbsp; &nbsp;Feels like ${forecast.hourly.data[i].apparentTemperature}&nbsp; &nbsp; &nbsp; Wind: ${forecast.hourly.data[i].windSpeed} mph&nbsp; &nbsp; &nbsp; Humidity: ${forecast.hourly.data[i].humidity}&nbsp; &nbsp; &nbsp; uv-Index: ${forecast.hourly.data[i].uvIndex}\n`;  
            forDetailed = forDetailed + "\n";
          }
          
          for(var i = 1; i < 3; i++) {
            forDetailed = forDetailed + `In ${i} day(s) - &nbsp; &nbsp; &nbsp; ${forecast.daily.data[i].summary}&nbsp; &nbsp; &nbsp;  High: ${forecast.daily.data[i].temperatureHigh}&nbsp; &nbsp; &nbsp; Low ${forecast.daily.data[i].temperatureLow}&nbsp; &nbsp; &nbsp; Wind: ${forecast.daily.data[i].windSpeed} mph &nbsp; &nbsp; &nbsp;Humidity: ${forecast.daily.data[i].humidity}&nbsp; &nbsp; &nbsp;uv-Index: ${forecast.daily.data[i].uvIndex}\n`;  
            forDetailed = forDetailed + "\n";
          }

          context = {
            "detailed": forDetailed,
            "brief": `${open}wi-thermometer${close} ${forecast.currently.temperature}&deg;F &nbsp; ${open}wi-strong-wind${close} ${forecast.currently.windSpeed} mph  &nbsp; ${open}wi-humidity${close} ${forecast.currently.humidity}`
          }

          apiReadTime = moment().format('h:mm a');

          updated = true;
          console.log("updatedS = "+ updated);
          resolve("Success!");
            
        });

      

        setTimeout(function(){
          console.log("updatedF = "+ updated);
          if (!updated) reject("Failed!");     
        }, 10000); // 10 second timeout is added for possible slow connections
    });
  }

  function applyWeatherInfo(myPromise) {
    myPromise.then((successMessage) => {

      if (successMessage==="Success!") {
        var l1 = `<div class="boxed" data-toggle="tooltip" data-placement="bottom" title=`;
        var l2 = `"Miami Beach, Florida, USA\n\n ${context.detailed}`;
        var l3 = ` \nUpdated every 20 minutes. Last updated at ${apiReadTime} &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; ( for demo purposes updated every minute )"`;
        var l4 = ` >Weather:  &nbsp; ${context.brief}. &nbsp; more ...`;
        var l5 = `</div>`;

        var html = l1 + l2 + l3 + l4 + l5;
        $("#weather_placeholder").html(html);
        $('[data-toggle="tooltip"]').tooltip();
      }
    }).catch((e) => {
      console.log("Error = "+ e.message);
      var html = '<div class="boxed">... could not update the weather info ...</div> ';
      $("#weather_placeholder").html(html);
      

    });
  }
// });


