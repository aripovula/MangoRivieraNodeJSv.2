
$.get("/dashboard.html", function(data){
    console.log("data="+data);
    Handlebars.registerPartial("dashboard", data);

    var template = $('#dashboard-partial').html();

    var templateScript = Handlebars.compile(template);

    var html = templateScript();

    $("#dashboard_placeholder").html(html);

    var source = $("#some-template").html();
    var template = Handlebars.compile(source);
    
    // dolphine show, visit ancient castle, sport contest
    var data = {
        users: [ { 
            fullName: {
                atype: "dolphine ", 
                aname: "show"
            },
            occupancy: "rating: 4.3 / 5",
            bookNow: "buy ticket" 
        }, {
            fullName: {
                atype: "visit ", 
                aname: "ancient castle"
            }, 
            occupancy: "free shuttle bus",
            bookNow: "register"
        }, {
            fullName: {
                atype: "Sports ", 
                aname: "contest"
            }, 
            occupancy: "free entrance",
            bookNow: "beach area (see map & schedule)"
        }]
    }; 
    
    //spa Wellness, fitness O'zone, crossfit ManGo
    
    var dataspa = {
        users: [ { 
            fullName: {
                atype: "spa ", 
                aname: "'Wellness'"
            },
            occupancy: "80% occupied",
            bookNow: "book now" 
        }, {
            fullName: {
                atype: "fitness ", 
                aname: "'O-zone'"
            }, 
            occupancy: "70% occupied",
            bookNow: "book now"
        }, {
            fullName: {
                atype: "crossfit ", 
                aname: "'ManGo'"
            }, 
            occupancy: "90% occupied",
            bookNow: "book now"
        }
     ]
    }; 
    
    var datameals = {
        users: [ { 
            fullName: {
                atype: "restaurant ", 
                aname: "'Madeira'"
            },
            occupancy: "78% occupied",
            bookNow: "see menu" 
        }, {
            fullName: {
                atype: "restaurant ", 
                aname: "'Seaside Garden'"
            }, 
            occupancy: "74% occupied",
            bookNow: "see menu"
        }, {
            fullName: {
                atype: "Mexican a la carte ", 
                aname: "'Mockito'"
            }, 
            occupancy: "available",
            bookNow: "book now"
        }
     ]
    }; 

    var dataservices = {
        users: [ { 
            fullName: {
                atype: "Airport ", 
                aname: "'shuttle'"
            },
            occupancy: "every 2 hours",
            bookNow: "see schedule" 
        }, {
            fullName: {
                atype: "order ", 
                aname: "taxi"
            }, 
            occupancy: "( uses my API )",
            bookNow: "order form"
        }, {
            fullName: {
                atype: "Room ", 
                aname: "service"
            }, 
            occupancy: "",
            bookNow: "order form"
        }
     ]
    }; 
    Handlebars.registerHelper('linkedName', function(fullName) {
        return fullName.atype + "_" + fullName.aname;
      });
    
    Handlebars.registerHelper('fullName', function(fullName) {
      return fullName.atype + fullName.aname;
    });  
    
    $("#tab").html(template(data));
    $("#tabspa").html(template(dataspa));
    $("#tabmeals").html(template(datameals));
    $("#tabservices").html(template(dataservices));
});