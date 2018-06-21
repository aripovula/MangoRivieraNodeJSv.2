
    let for_buyform2 = getBuyJson();
    
    /*console.log("Price parsed = "+for_buyform2);
    let a1 = for_buyform2[1];
    console.log("Price2 = "+a2);
    let a2 = a1[0];
    console.log("Price2 = "+a2);*/
    let sel_id = for_buyform2[0].sel_id;
    let sid;
    let subname;
    let loop_id;
    let qnty=1;
    let price;

    console.log("sel_id = " + sel_id);
    console.log("sel_id0 = " + for_buyform2[0]);
    console.log("sel_id1 = " + for_buyform2[1]);

    let html = "";
    let subtype = 0; 
    for_buyform2[1].forEach(function(entry) {
        //html += "<p>Next sub-type:</p>"
        subtype++;
        console.log("entry len "+entry.length);
        console.log("entry 0 "+entry[0]);
        console.log("entry null "+entry != null);
        //if (entry[0] != null) {
            //entry.forEach(function(entry2) {
                console.log("");
                console.log("");
                console.log("entry._id="+entry._id+"'");
                //console.log("items[2]="+sel_id+"'");
                if (entry._id == sel_id) {
                    
                    loop_id = subtype-1;

                    console.log("WE DID THIIIIIIIS loop_id = "+loop_id);
                    /*html += "<label>" + escape(entry.subname) + " - " + escape(entry.actionmsg) + "</label><br/><br/>";
                    if (entry.price != null) html += '<label for="dtp_input2" class="col-md-2 control-label">Price:</label>'
                    if (entry.price != null) html += '<div class="input-group spinner col-md-10"><p>'+escape(entry.price)+'$ per unit</p></div>';
                    console.log("html = "+html);*/

                    displayBuyData(entry);
                    return;
                }
            //});
        //}
    });

    function getBuyJson(){
        let for_buyform = '{{for_buyform}}';
        console.log("for_buyform = "+for_buyform);
        for_buyform = for_buyform.replace(/(\r\n\t|\n|\r\t)/gm,"");
        for_buyform = for_buyform.replace(/&quot;/g, '"');
        console.log("Price1 = "+for_buyform);
        return JSON.parse(for_buyform);
    }

    function displayBuyData(entry){
        sid = entry._id;
        price = entry.price;
        subname = entry.subname;
        $("#title").html("<label>" + subname + " - " +entry.actionmsg + "</label>"); 
        $("#priceperunit").html(price); 
        $("#pricetotal").html(qnty*price);
    }

    function showNext() {
        loop_id++;
        qnty = 1;  $('.spinner input').val(1);
        let for_buyform2 = getBuyJson();
        let entries = for_buyform2[1];
        if (loop_id >= entries.length) loop_id = 0;
        let entry = entries[loop_id];
        console.log("loop_id = "+loop_id);
        console.log("entry = "+entry);
        displayBuyData(entry);
    }

    function formSubmit() {

        idel = document.getElementById('bid');
        idel.setAttribute('value', sid);

        nameel = document.getElementById('bname');
        nameel.setAttribute('value', subname);

        priceel = document.getElementById('bprice');
        priceel.setAttribute('value', price);

        qntyel = document.getElementById('bqnty');
        qntyel.setAttribute('value', qnty[0]);

        console.log("namefromCont="+nameel.value);
        
        let act = "/users/userbuy/save";

        //alert("act = "+act);
        let formsubm = document.getElementById('userBuyForm');
        formsubm.setAttribute('action',act).submit();
        formsubm.reset();
        //resetForm($('#universalForm'));
        return false;
    };