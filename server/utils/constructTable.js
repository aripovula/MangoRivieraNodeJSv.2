const hbs = require('hbs');


var constructTable = (items) => {
    //safeItems = hbs.Utils.escapeExpression(items);  
    //console.log('headers='+items);

    let nextbooking = 0;
    let nextbuy = 0;

    let bookingIDs2simulate = [];
    let buyIDs2simulate = [];
    let html = "<ul>";
    headername = ''; 
    items[0].forEach(function(entry) {
      // escape all entries that will be made by users
      html += "<li>" + hbs.Utils.escapeExpression(entry.name) + "</li>";
      headername = entry.name;
    html += "<table><tbody>";
    //console.log('item 0 subname='+item1[0].subname);
    let subtype = 0; 
    items[1].forEach(function(entry) {
      //html += "<p>Next sub-type:</p>"
      subtype++;
      entry.forEach(function(entry2) {

        //console.log("entry2a="+entry2.parent.name);
        //console.log("entry2b="+headername);
        if (entry2.parent.name === headername) {
          //console.log("entry2="+entry2);
          // escape all entries that will be made by users
          html += "<tr>";
          html += "<td>" + hbs.Utils.escapeExpression(entry2.parent.name) + "</td>";
          html += "<td>" + hbs.Utils.escapeExpression(entry2.infotype) + "</td>";
          html += "<td>" + hbs.Utils.escapeExpression(entry2.subname) + "</td>";
          if (entry2.infotype == "occupancy") {
              html += "<td id='"+entry2._id+"'>? updating... </td>";
              bookingIDs2simulate[nextbooking] = entry2._id;
              //console.log("book"+nextbooking+' = '+bookingIDs2simulate[nextbooking]);
              nextbooking++;
            }
        if (entry2.infotype == "availability") {
            html += "<td id='"+entry2._id+"'>? updating... </td>";
            buyIDs2simulate[nextbuy] = entry2._id;
            //console.log("buy"+nextbuy+' = '+buyIDs2simulate[nextbuy]);
            nextbuy++;
        }
  
          if (entry2.infotype == "themessage") html += "<td>" + hbs.Utils.escapeExpression(entry2.message) + "</td>";
          if (subtype == 3 && entry2.infotype == "webpage") html += "<td>" + hbs.Utils.escapeExpression(entry2.message) + "</td>";
          if (subtype == 1 || subtype == 2) {
            if (entry2.infotype == "webpage") html += "<td><a onclick=\"window.open('http://" + hbs.Utils.escapeExpression(entry2.infowebpage) + "', '_blank', 'toolbar=yes,scrollbars=yes,resizable=yes,top=200,left=300,width=600,height=400');\">" + hbs.Utils.escapeExpression(entry2.message) + "</a></td>";
          }
          if (subtype == 1) html += "<td><a href='/users/bookform/" + hbs.Utils.escapeExpression(entry2._id) + "'>"+hbs.Utils.escapeExpression(entry2.actionmsg)+"</a></td>";
          if (subtype == 2) html += "<td><a href='/users/buyform/" + hbs.Utils.escapeExpression(entry2._id) + "'>"+hbs.Utils.escapeExpression(entry2.actionmsg)+"</a></td>";
          if (subtype == 3) html += "<td><a href='/users/infoform/" + hbs.Utils.escapeExpression(entry2._id) + "'>"+hbs.Utils.escapeExpression(entry2.actionmsg)+"</a></td>";
          //html += "<td><a href=`/booking/${hbs.Utils.escapeExpression(entry2)`>{{bookNow}}</a></td>";
          html += "</tr>";
        }
        //html += "<li>" + hbs.Utils.escapeExpression(entry2) + "</li><br/>";
      });
    });
    html += "</tbody></table>";
     
    
    });
    html += "</ul>";

    let package = {
        view : html,
        bookingIDs : bookingIDs2simulate,
        buyIDs : buyIDs2simulate
    }

    return package;
};

module.exports = {constructTable};