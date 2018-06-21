const hbs = require('hbs');

let getSubname = (items) => {

  let html = "";
  let subtype = 0; 
  items[1].forEach(function(entry) {
    //html += "<p>Next sub-type:</p>"
    subtype++;
    //console.log("entry"+entry[0]);
    entry.forEach(function(entry2) {
      console.log("");
      console.log("");
      console.log("entry2._id="+entry2._id+"'");
      console.log("items[2]="+items[2]+"'");
      if (entry2._id == items[2]) {
      console.log("WE DID THIIIIIIIS");
        
        html += "<label>" + hbs.Utils.escapeExpression(entry2.subname) + " - " + hbs.Utils.escapeExpression(entry2.actionmsg) + "</label><br/><br/>";
        if (entry2.price != null) html += '<label for="dtp_input2" class="col-md-2 control-label">Price:</label>'
        if (entry2.price != null) html += '<div class="input-group spinner col-md-10"><p>'+hbs.Utils.escapeExpression(entry2.price)+'$ per unit</p></div>';
      }
    });
  });
  return html;
}

module.exports = {getSubname};