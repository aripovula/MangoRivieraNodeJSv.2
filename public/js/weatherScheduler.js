var found1, found2, apikey1, apikey2;

$(document).ready(function () {
    // reading API key from a local file is used as a temporary measure during the development stage.
    // if API is read 
    getApiKey();
});

function updateWeatherEvery20mins(apiTemp) {
    var myPromise = updateWeatherInfo(apiTemp);
    applyWeatherInfo(myPromise);
    setTimeout(updateWeatherEvery20mins, 10*60*1000); // for demo purposes updates every minute
}

var getApiKey = function () {
    // depending on the current page path to APIKEY.txt file varies. 
    // It tries both paths     '../../api.txt'     AND      '../api.txt'
    Promise.all([getApiKey1, getApiKey2])
        .then(function (fulfilled) {
            if (found1) updateWeatherEvery20mins(apikey1);
            if (found2) updateWeatherEvery20mins(apikey2);
        })
};

var getApiKey1 = new Promise(
    function (resolve, reject) {
        found1 = false;
        jQuery.get('../api.txt', function(apiTemp, status) {
            updateWeatherEvery20mins(apiTemp);
            found1 = true;
            apikey1 = apiTemp;
            resolve('Success');
        });

        setTimeout(function(){
            if (!found1 & !found2) reject("Failed!");
        }, 2000);
    }
);

var getApiKey2 = new Promise(
    function (resolve, reject) {
        found2 = false;
        jQuery.get('../../api.txt', function(apiTemp, status) {
            updateWeatherEvery20mins(apiTemp);
            found2 = true;
            apikey2 = apiTemp;
            resolve('Success');
        });

        setTimeout(function(){
            if (!found1 & !found2) reject("Failed!");
        }, 2000);
    }
);