const util = require('util');

const stringify = require('json-stringify');

const HeaderType = require('../../models/headertype');
const Booking_SubType = require('../../models/booking_subtype');
const Sell_SubType = require('../../models/sell_subtype');
const Info_SubType = require('../../models/info_subtype');

let HeadersData;

const headingData4Table = [{ name: "Activities" }, { name: "Meals"}, {name:"Services"}, {name: "Miscellaneous"}];

const bookingsData4Table = [
    { parentID: 0, subname: "fitness `ManGo`", infotype: 'occupancy',
         message: '', infowebpage: '', actionmsg: 'book your spot'}, 
    { parentID: 1, subname: "French à la carte", infotype: 'themessage',
         message: 'book & discuss menu', infowebpage: '', actionmsg: 'book now'}
];

const sellData4Table = [
    { parentID: 0, subname: "cirque du ciel", infotype: 'availability',
         message: '', infowebpage: '', actionmsg: 'buy your ticket', price: 50}, 
    { parentID: 0, subname: "motor show", infotype: 'availability',
         message: '', infowebpage: '', actionmsg: 'buy now', price: 40},
    { parentID: 0, subname: "dolphin show", infotype: 'webpage',
         message: 'more info', 
         infowebpage: 'https://www.miamiseaquarium.com/things-to-do/experiences/flipper-dolphin-show', 
         actionmsg: 'buy ticket', price: 46}
];

const infoData4Table = [];

// cirque du ciel, motor show, dolphin show, restaurant à la carte discuss menu	request booking, 

// MANY OTHER PROMISES (DEFINED BELOW THIS FUNCTION) ARE USED INSIDE OF NEWLY DEFINED PROMISE. 
// THIS PROMISE IS USED IN SERVER.JS
// I.E. PROMISES USED INSIDE OF ANOTHER PROMISE

let ReConstructTableData = () => {
    return new Promise ( (resolve, reject)=> {
        return wipeOffAllHeaderTypePromise()
        .then(() => {
            return wipeOffAllBookingSubTypePromise();
        })
        .then(() => {
            return wipeOffAllSellSubTypePromise();
        })
        .then(() => {
            return wipeOffAllInfoSubTypePromise();
        })
        .then(() => {
            return addAllDefaultHeaderTypes();
        })
        .then(() => {
            return readHeadersPromise();
        })
        .then((data) => {
            return addAllDefaultBookingSubTypes(data);
        })
        .then((data) => {
            return addAllDefaultSellSubTypes(data);
        })
        .then((data) => {
            return addAllDefaultInfoSubTypes(data);
        })
        // WHEN OTHER PROMISES ARE RESOLVED THEN RESOLVE THIS PROMISE
        .then(() => resolve())
        .catch(err => console.log(err.message));
    });
}


wipeOffAllHeaderTypePromise = () => {
    return new Promise ( (resolve, reject)=> {
        HeaderType.deleteMany({ }, function(err) {
            if (err) reject();
            console.log('wipeOffAllHeaderTypePromise done');
            resolve();  
        });
    });
}

wipeOffAllBookingSubTypePromise = () => {
    return new Promise ( (resolve, reject)=> {
        Booking_SubType.deleteMany({ }, function(err) {
            if (err) reject();
            console.log('wipeOffAllBookingSubTypePromise done');
            resolve();  
        });
    });
}

wipeOffAllSellSubTypePromise = () => {
    return new Promise ( (resolve, reject)=> {
        Sell_SubType.deleteMany({ }, function(err) {
            if (err) reject();
            console.log('wipeOffAllSellSubTypePromise done');
            resolve();  
        });
    });
}

wipeOffAllInfoSubTypePromise = () => {
    return new Promise ( (resolve, reject)=> {
        Info_SubType.deleteMany({ }, function(err) {
            if (err) reject();
            console.log('wipeOffAllInfoSubTypePromise done');
            resolve();  
        });
    });
}

addAllDefaultHeaderTypes = () => {
    return new Promise((resolve, reject) => {
        let count = 0;
        if (headingData4Table.length == 0) resolve();
        for (let i = 0, len = headingData4Table.length; i < len; i++) {
            let bt = new HeaderType(
                { name: headingData4Table[i].name }
            );
            bt.save(function (err) {
                if (err) reject();
                count++;
                console.log('addAllDefaultHeaderTypes done i='+i+'  count = '+count);
                if (count == headingData4Table.length) {
                    console.log('addAllDefaultHeaderTypes done');
                    resolve();
                }                        
            });
        }
    });
}

readHeadersPromise = () => {
    return new Promise ((resolve, reject) => {
        HeaderType
        .find({})
        .sort([['dateTime', 'ascending']])
        .exec(function (err, data){
            if (err) reject();
            console.log('readHeadersPromise done');
            resolve(data);
        });            
    });
}

addAllDefaultBookingSubTypes = (HeadersData) => {
    return new Promise ( (resolve, reject) => {
        let count = 0;
        if (bookingsData4Table.length == 0) resolve();
        for (let i = 0, len = bookingsData4Table.length; i < len; i++) {

            let bt = new Booking_SubType({ 
                parent : HeadersData[bookingsData4Table[i].parentID]._id,
                subname : bookingsData4Table[i].subname,
                infotype : bookingsData4Table[i].infotype,
                message : bookingsData4Table[i].message,
                infowebpage : bookingsData4Table[i].infowebpage,
                actionmsg : bookingsData4Table[i].actionmsg
            });
            
            bt.save(function (err) {
                if (err) reject();
                count++;
                console.log('addAllDefaultBookingSubTypes done i='+i+'  count = '+count);
                if (count == bookingsData4Table.length) {
                    console.log('addAllDefaultBookingSubTypes done');
                    resolve(HeadersData);
                }    
            });
        }
    });
}

addAllDefaultSellSubTypes = (HeadersData) => {
    return new Promise ( (resolve, reject) => {
        let count = 0;
        if (sellData4Table.length == 0) resolve();
        for (let i = 0, len = sellData4Table.length; i < len; i++) {
            let bt = new Sell_SubType({ 
                parent : HeadersData[sellData4Table[i].parentID]._id,
                subname : sellData4Table[i].subname,
                infotype : sellData4Table[i].infotype,
                message : sellData4Table[i].message,
                infowebpage : sellData4Table[i].infowebpage,
                actionmsg : sellData4Table[i].actionmsg,
                price : sellData4Table[i].price 
            });
            
            bt.save(function (err) {
                if (err) reject();
                count++;
                console.log('addAllDefaultSellSubTypes done i='+i+'  count = '+count);
                if (count == sellData4Table.length) {
                    console.log('addAllDefaultSellSubTypes done');
                    resolve(HeadersData);
                }    
            });
        }
    });
}

addAllDefaultInfoSubTypes = (HeadersData) => {
    return new Promise ( (resolve, reject) => {
        let count = 0;
        console.log('IN IN INFO');
        if (infoData4Table.length == 0) resolve();
        for (let i = 0, len = infoData4Table.length; i < len; i++) {

            let bt = new Info_SubType({ 
                parent : HeadersData[infoData4Table[i].parentID]._id,
                subname : infoData4Table[i].subname,
                infotype : infoData4Table[i].infotype,
                message : infoData4Table[i].message,
                infowebpage : infoData4Table[i].infowebpage,
                actionmsg : infoData4Table[i].actionmsg
            });
            
            bt.save(function (err) {
                if (err) reject();
                count++;
                console.log('addAllDefaultInfoSubTypes done i='+i+'  count = '+count);
                if (count == infoData4Table.length) {
                    console.log('addAllDefaultInfoSubTypes done');
                    resolve();
                }    
            });
        }
    });
}

module.exports = {ReConstructTableData};