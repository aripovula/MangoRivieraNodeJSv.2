
// Get the modal
var modal = document.getElementById('myModal');

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];



// When the user clicks the button, open the modal 
//( 11, '{{id}}', '{{name}}','sub-name','message',0, 'Edit the header type name:', '')
function showModal(type, idn, parent_id, name, subname, msg, price, maintext, infotype, url, actionmsg, price) {
    console.log("IDN1="+idn);
    console.log("NAME1="+name);
    console.log("message="+msg);
    console.log("infotype="+infotype);
    console.log("price="+price);

    modal.style.display = "block";

    var fe = getElementVars();

    fe.type.setAttribute('value',type);
    fe.idn.setAttribute('value',idn);
    fe.parent_id.setAttribute('value',parent_id);
    fe.dname.setAttribute('value',name);
    fe.dsubname.setAttribute('value',subname);
    console.log("message2="+msg);
    fe.dmsg.setAttribute('value', msg);
    fe.durl.setAttribute('value',url);
    fe.dactionmsg.setAttribute('value',actionmsg);
    fe.dprice.setAttribute('value',price);
    fe.dtext.innerHTML = name;
    fe.dmaintext.innerHTML = maintext;

    fe.rad3.checked = true; fe.dmsg.style.display = 'block'; fe.durl.style.display = 'block';
    if (infotype === 'occupancy') {fe.rad1.checked = true; fe.dmsg.style.display = 'none'; fe.durl.style.display = 'none';}
    if (infotype === 'themessage') { fe.rad2.checked = true; fe.dmsg.style.display = 'block'; fe.durl.style.display = 'none'; }
    if (type == 30 || type == 31) {fe.radl1.style.display = 'none';fe.radl4.style.display = 'block';} else {fe.radl1.style.display = 'block';fe.radl4.style.display = 'none';}
    if (type > 34) {fe.radl1.style.display = 'none';fe.radl4.style.display = 'none';}

    fe.dtext.style.display = 'block'; if ( type == 10 || type == 11 ) fe.dtext.style.display = 'none';    
    fe.dname.style.display = 'none'; if ( type == 10 || type == 11 ) fe.dname.style.display = 'block';

    if ( type < 14 || type == 22 || type == 32 || type == 42 ) fe.dradio.style.display = 'none'; else fe.dradio.style.display = 'block';
    if ( type < 14 || type == 22 || type == 32 || type == 42 ) fe.dactionmsg.style.display = 'none';  else fe.dactionmsg.style.display = 'block';
    if ( type < 14 || type == 22 || type == 32 || type == 42 ) fe.dmsg.style.display = 'none';  else fe.dmsg.style.display = 'block';
    if ( type < 14 || type == 22 || type == 32 || type == 42 ) fe.durl.style.display = 'none';  else fe.durl.style.display = 'block';

    if ( type < 14 ) fe.dsubname.style.display = 'none'; 
      else fe.dsubname.style.display = 'block'; 
    fe.dprice.style.display = 'none'; if ( type == 30 || type == 31 ) fe.dprice.style.display = 'block';
    fe.dplab.style.display = 'none'; if ( type == 30 || type == 31 ) fe.dplab.style.display = 'block';

}

//function showModalByTypes(subtypes) {
//  console.log('modalbytpes = '+subtypes);
//      modal.style.display = "block";
//    var fe = getElementVars();
//    fe.type.setAttribute('value',subtypes);
//}

function getElementVars(){
  var fe = new Object();
    fe.type = document.getElementById('bttype');
    fe.idn = document.getElementById('btid');    
    fe.parent_id = document.getElementById('btparent_id');
    fe.dname = document.getElementById('btname');        
    fe.dsubname = document.getElementById('btsubname');
    fe.dradio = document.getElementById('btradio');
    fe.dmsg = document.getElementById('btmsg');
    fe.durl = document.getElementById('bturl');
    fe.dprice = document.getElementById('btprice');
    fe.dactionmsg = document.getElementById('btactionmsg');  
    fe.dtext = document.getElementById('bttext');  
    fe.dmaintext = document.getElementById('maintext');
    fe.dplab = document.getElementById('btplab');
    fe.labl = document.getElementById('labl');
    fe.rad1 = document.getElementById('btrad1');
    fe.rad2 = document.getElementById('btrad2');
    fe.rad3 = document.getElementById('btrad3');
    fe.radl1 = document.getElementById('btradl1');
    fe.radl4 = document.getElementById('btradl4');
    return fe;
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

function formSubmit() {
      var fe = getElementVars();
      console.log("message22="+fe.dmsg.value);
      var idn = fe.idn.value;
      var parent_id = fe.parent_id.value;
      //fe.name.value = fe.name.value.replace("'", "`");
      //fe.subname.value = fe.subname.value.replace("'", "`");
      //var name = fe.dname.value;
      var type = fe.type.value;
      //var subname = fe.dsubname.value;
      var infotype = $("input:radio[name='displaytype']:checked").val();
      console.log("infotype - "+infotype);
      if ( type == 10 ) var act = "/admin/headertype/save";
      if ( type == 11 ) var act = "/admin/headertype/"+idn+"/update";
      if ( type == 12 ) var act = "/admin/headertype/"+idn+"/delete";
      if ( type == 20 ) var act = "/admin/booking_subtype/"+parent_id+"/"+infotype+"/save";
      if ( type == 21 ) var act = "/admin/booking_subtype/"+idn+"/"+parent_id+"/"+infotype+"/update";
      if ( type == 22 ) var act = "/admin/booking_subtype/"+idn+"/delete";
      if ( type == 30 ) var act = "/admin/sell_subtype/"+parent_id+"/"+infotype+"/save";
      if ( type == 31 ) var act = "/admin/sell_subtype/"+idn+"/"+parent_id+"/"+infotype+"/update";
      if ( type == 32 ) var act = "/admin/sell_subtype/"+idn+"/delete";
      if ( type == 40 ) var act = "/admin/info_subtype/"+parent_id+"/"+infotype+"/save";
      if ( type == 41 ) var act = "/admin/info_subtype/"+idn+"/"+parent_id+"/"+infotype+"/update";
      if ( type == 42 ) var act = "/admin/info_subtype/"+idn+"/delete";

      //alert("type = "+type);
      let formuniv = document.getElementById('universalForm');
      formuniv.setAttribute('action',act).submit();
      formuniv.reset();
      //resetForm($('#universalForm'));
      return false;
    };

    function myFunction(divName) {
        console.log("divName = "+divName);
        var x = document.getElementById(divName);
        if (x.style.display === "none") {
            x.style.display = "block";
        } else {
            x.style.display = "none";
        }
    }
