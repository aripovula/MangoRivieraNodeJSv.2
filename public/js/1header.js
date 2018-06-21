
$.get("/header.html", function(data){
    //console.log("data="+data);
    Handlebars.registerPartial("header", data);

    var template = $('#header-partial').html();

    var templateScript = Handlebars.compile(template);

    var html = templateScript();

    $("#header_placeholder").html(html);

});