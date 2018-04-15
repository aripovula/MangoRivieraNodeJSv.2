
$.get("/dashboard.html", function(data){
    console.log("data="+data);
    Handlebars.registerPartial("dashboard", data);

    var template = $('#dashboard-partial').html();

    var templateScript = Handlebars.compile(template);

    var html = templateScript();

    $("#dashboard_placeholder").html(html);

    var source = $("#some-template").html();
    var template = Handlebars.compile(source);
    
    var data = {
        users: [ { 
            fullName: {
                atype: "Garry", 
                aname: "Finch"
            },
            occupancy: "Front End Technical Lead",
            bookNow: "gazraa" 
        }, {
            fullName: {
                atype: "Garry", 
                aname: "Finch"
            }, 
            occupancy: "Photographer",
            bookNow: "photobasics"
        }, {
            fullName: {
                atype: "Garry", 
                aname: "Finch"
            }, 
            occupancy: "LEGO Geek",
            bookNow: "minifigures"
        }, {
            fullName: {
                atype: "Harry", 
                aname: "Linch"
            }, 
            occupancy: "MEGO Geek",
            bookNow: "ninifigures"
        } ]
    }; 
    
    //spa Wellness, fitness O'zone, crossfit ManGo
    
    var dataspa = {
        users: [ { 
            fullName: {
                atype: "spa", 
                aname: "Wellness"
            },
            occupancy: "80% occupied",
            bookNow: "book now" 
        }, {
            fullName: {
                atype: "fitness", 
                aname: "O-zone"
            }, 
            occupancy: "70% occupied",
            bookNow: "book now"
        }, {
            fullName: {
                atype: "crossfit", 
                aname: "ManGo"
            }, 
            occupancy: "90% occupied",
            bookNow: "book now"
        }
     ]
    }; 
    
    Handlebars.registerHelper('linkedName', function(fullName) {
        return fullName.atype + "_" + fullName.aname;
      });
    
    Handlebars.registerHelper('fullName', function(fullName) {
      return fullName.atype + " '" + fullName.aname+"'";
    });  
    
    $("#tab").html(template(data));
    $("#tabspa").html(template(dataspa));
    
});