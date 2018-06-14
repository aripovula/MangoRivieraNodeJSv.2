var found1, found2, apikey1, apikey2, apiKey;

$(document).ready(function () {
    // reading API key from a local file is used as a temporary measure during the development stage.
    // to avoid storing API key in GitHub
    getApiKey();
});

function updateWeatherEvery20mins() {
    //var myPromise = updateWeatherInfo(apiKey);
    //applyWeatherInfo(myPromise);
    setTimeout(updateWeatherEvery20mins, 10*60*1000); // for demo purposes updates every minute
}

var getApiKey = function () {
    // depending on the current page path to APIKEY.txt file varies. 
    // It tries both paths     '../../api.txt'     AND      '../api.txt'

    var html = '<div class="boxed">... updating weather info ...</div> ';
    $("#weather_placeholder").html(html);

    Promise.race([getApiKey1, getApiKey2])
        .then(function (fulfilled) {
            if (found1) {apiKey = apikey1; updateWeatherEvery20mins();}
            if (found2) {apiKey = apikey2; updateWeatherEvery20mins();}
        })
};

var getApiKey1 = new Promise(
    function (resolve, reject) {
        found1 = false;
        jQuery.get('../api.txt', function(apiTemp, status) {
            if (status === 'success') {
                found1 = true;
                apikey1 = apiTemp;
                resolve('Success');
            }
        });

        setTimeout(function(){
            if (!found1 & !found2) reject("Failed!");
            resolve('Success');
        }, 2000);
    }
);

var getApiKey2 = new Promise(
    function (resolve, reject) {
        found2 = false;
        jQuery.get('../../api.txt', function(apiTemp, status) {
            if (status === 'success') {
                found1 = true;
                apikey1 = apiTemp;
                resolve('Success');
            }
        });

        setTimeout(function(){
            if (!found1 & !found2) reject("Failed!");
            resolve('Success');
        }, 2000);
    }
);