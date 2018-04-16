
$(document).ready(function () {
    updateWeatherEvery20mins();
});

function updateWeatherEvery20mins() {
    var myPromise = updateWeatherInfo();
    applyWeatherInfo(myPromise);
    setTimeout(updateWeatherEvery20mins, 10*60*1000); // for demo purposes updates every minute
}
