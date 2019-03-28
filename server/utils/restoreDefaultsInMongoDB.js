const util = require('util');
const moment = require('moment');

const stringify = require('json-stringify');

const HeaderType = require('../../models/headertype');
const Booking_SubType = require('../../models/booking_subtype');
const Sell_SubType = require('../../models/sell_subtype');
const Info_SubType = require('../../models/info_subtype');
const Users_Booking = require('../../models/users_booking');
const Users_Buy = require('../../models/users_buy');
const All_Chats = require('../../models/all_chats');


let HeadersData;

const headingData4Table = [
    { name: "Activities", sequence: 1}, 
    { name: "Meals", sequence: 2}, 
    { name:"Services", sequence: 3}, 
    { name: "Miscellaneous", sequence: 4}
];

const bookingsData4Table = [
    { parentID: 0, subname: "crossFit `ManGo`", infotype: 'occupancy',
         message: '', infowebpage: '', actionmsg: 'book your spot'}, 
    { parentID: 1, subname: "Italian à la carte", infotype: 'themessage',
         message: 'book & discuss menu', infowebpage: '', actionmsg: 'book now'},
    { parentID: 1, subname: "SeaSide Garden lounge", infotype: 'occupancy',
         message: '', infowebpage: '', actionmsg: 'book a table'},
    { parentID: 1, subname: "restaurant Madeira", infotype: 'occupancy',
         message: '', infowebpage: '', actionmsg: 'book a table'},
    { parentID: 2, subname: "dry cleaning services", infotype: 'themessage',
         message: 'we pick up & deliver back', infowebpage: '', actionmsg: 'pick up time period'},
    { parentID: 2, subname: "room make up", infotype: 'themessage',
         message: 'need unplanned make up?', infowebpage: '', actionmsg: 'timeframe you need it'}
];

const sellData4Table = [
    { parentID: 0, subname: "cirque du ciel", infotype: 'availability',
         message: '', infowebpage: '', actionmsg: 'buy your ticket', price: 50},
    { parentID: 0, subname: "motor show", infotype: 'availability',
         message: '', infowebpage: '', actionmsg: 'buy now', price: 40},
    { parentID: 0, subname: "dolphin show", infotype: 'webpage',
         message: 'more info', 
         infowebpage: 'www.miamiseaquarium.com', 
         actionmsg: 'buy ticket', price: 46}
];

const infoData4Table = [
    { parentID: 0, subname: "sports fun games", infotype: 'themessage',
        message: 'starts today at 11:00', infowebpage: '', actionmsg: 'location: beach area'},
    { parentID: 0, subname: "visit ancient artefacts", infotype: 'themessage',
        message: 'organized every day', infowebpage: '', actionmsg: 'tour agent by the front desk'},
    { parentID: 3, subname: "order a taxi", infotype: 'themessage',
        message: 'ordering number changed', infowebpage: '', actionmsg: 'call 422 from now on'},
    { parentID: 3, subname: "HBO is now available", infotype: 'themessage',
        message: 'new channel is added', infowebpage: '', actionmsg: 'switch to channel 346'}

];

const defaultChatsData = [
    {roomN:'C228',
    timeAgo: 1000 * 60 * 60 * 24 * 2.2,
    text: 'Hey. We tried learning surfing with few instructors. But we recommend Mike C. - he is a great surfing teacher',
    intGr:2},
    {roomN:'A443', 
    timeAgo: 1000 * 60 * 60 * 24 * 1.83,
    text: 'Yes I agree Mike is really good in teaching surfing',
    intGr:2},
    {roomN:'B415', 
    timeAgo: 1000 * 60 * 60 * 24 * 1.45,
    text: 'John F. coached me - he is great, I can surf now',
    intGr:2},
    {roomN:'D439', 
    timeAgo: 1000 * 60 * 60 * 24 * 1.81,
    text: 'We visited a small hook shaped island (they call it J-island) - really recommend going there. It is beautiful',
    intGr:4},
    {roomN:'B432', 
    timeAgo: 1000 * 60 * 60 * 24 * 1.65,
    text: 'Also try taking trip to Miami Bay - it is a beautiful bay boat trip',
    intGr:4},
    {roomN:'C232',
    timeAgo: 1000 * 60 * 60 * 24 * 1.83,
    text: 'Did anyone go to the dolphin show ? Are you really permitted to swim with dolphines ?',
    intGr:1},
    {roomN:'A443', 
    timeAgo: 1000 * 60 * 60 * 24 * 1.56,
    text: 'Yes, you indeed can do that after the show. It is amazing.',
    intGr:1},
    {roomN:'C323', 
    timeAgo: 1000 * 60 * 60 * 24 * 1.43,
    text: 'All guests interested in diving - diving instructors are available in the beach - just by the Orange bar',
    intGr:3},
    {roomN:'B336', 
    timeAgo: 1000 * 60 * 60 * 24 * 1.63,
    text: 'We have a team playing polo starting at 10 a.m. tomorrow - feel free to join us in S pool',
    intGr:6},
    {roomN:'A443', 
    timeAgo: 1000 * 60 * 60 * 24 * 1.83,
    text: 'OMG, I loved it. Views are amazing. Just try it',
    intGr:5},
];

// cirque du ciel, motor show, dolphin show, restaurant à la carte discuss menu	request booking, 

// MANY OTHER PROMISES (DEFINED BELOW THIS FUNCTION) ARE USED INSIDE OF NEWLY DEFINED PROMISE. 
// THIS PROMISE IS USED IN SERVER.JS
// I.E. PROMISES USED INSIDE OF ANOTHER PROMISE

let RestoreDefaultDataInMongoDB = () => {
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
        .then(() => {
            return wipeOffAllChatsPromise();
        })
        .then(()=> {
            return addAllDefaultChats();
        })
        .then(()=> {
            return wipeOffAllUsersBookingsPromise();
        })
        .then(()=> {
            return wipeOffAllUsersBuysPromise();
        })
        // WHEN OTHER PROMISES ARE RESOLVED THEN RESOLVE THIS PROMISE
        .then(() => resolve())
        .catch(err => console.log('at end of chained promises-, err-', err));
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
                { 
                    name: headingData4Table[i].name, 
                    sequence: headingData4Table[i].sequence 
                 }
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
        .sort([['sequence', 'ascending']])
        .exec(function (err, data){
            if (err) reject();
            console.log('readHeadersPromise done. Data ='+stringify(data));
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

wipeOffAllChatsPromise = () => {
    return new Promise ( (resolve, reject)=> {
        All_Chats.deleteMany({ }, function(err) {
            if (err) reject();
            console.log('wipeOffAllChatsPromise done');
            resolve();  
        });
    });
}

addAllDefaultChats = () => {
    return new Promise ( (resolve, reject) => {
        let count = 0;
        console.log('ADD CHATS');
        if (defaultChatsData.length == 0) resolve();
        for (let i = 0, len = defaultChatsData.length; i < len; i++) {

            var jsDate = new Date() - defaultChatsData[i].timeAgo;
            var momentDate = moment(jsDate).format('DD MMM YYYY HH:mm:ss');
        
            var bt = new All_Chats({
                room_n: defaultChatsData[i].roomN,
                dateTime: jsDate,
                dateTimeStr: momentDate,
                text: defaultChatsData[i].text,
                intGr : defaultChatsData[i].intGr
            });
                                    
            bt.save(function (err) {
                if (err) reject();
                count++;
                console.log('addAllDefaultChats done i='+i+'  count = '+count);
                if (count == defaultChatsData.length) {
                    console.log('addAllDefaultChats done');
                    resolve();
                }    
            });
        }
    });
}

wipeOffAllUsersBookingsPromise = () => {
    return new Promise ( (resolve, reject)=> {
        Users_Booking.deleteMany({ }, function(err) {
            if (err) reject();
            console.log('wipeOffAllUsersBookingsPromise done');
            resolve();  
        });
    });
}

wipeOffAllUsersBuysPromise = () => {
    return new Promise ( (resolve, reject)=> {
        Users_Buy.deleteMany({ }, function(err) {
            if (err) reject();
            console.log('wipeOffAllUsersBuysPromise done');
            resolve();  
        });
    });
}


module.exports = {RestoreDefaultDataInMongoDB};