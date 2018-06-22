const {RestoreDefaultDataInMongoDB} = require('./restoreDefaultsInMongoDB');

// THIS FUNCTION RESTORES DEFAULTS EVERY NIGHT BETWEEN 3 A.M. AND 4 A.M.
function scheduleRestoreDefaults() {
    let d = new Date();
    let currentHour = d.getHours();
    console.log('currentHour = '+currentHour);
    if (currentHour == 3) {
        RestoreDefaultDataInMongoDB()
        .then(() => {
          console.log('RESTORED DEFAULTS 11122');
        });      
    }
    console.log('BEFORE TIMEOUT');
    setTimeout(scheduleRestoreDefaults, 60 * 60 * 1000); // for demo purposes updates every minute
}

module.exports = {scheduleRestoreDefaults};