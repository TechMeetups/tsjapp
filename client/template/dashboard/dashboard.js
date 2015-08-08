
Template.dashboard.helpers({
  cc_contects : function(){
    return contacts.find({user_id:Meteor.userId()});
  }
});

Template.dashboard.events({
  'click #fa_contects' : function(event, template){
    url = "https://api.sandbox.freeagent.com/v2/contacts";
    var access_token = localStorage.getItem("fa_access_token");
      $.ajax({
        url : url,
        type: "GET",
        headers:{ "Authorization" : "Bearer "+access_token+""},
        success: function(data, textStatus, jqXHR)
        {
          console.log(textStatus)
          console.log(data)
          Meteor.call("fa_contect_insert",data, function(error, result){
            if(error){
              console.log("error", error);
            }
            if(result){
               console.log(result)
            }
          });
        },
        error: function (jqXHR, textStatus, errorThrown)
        {
          console.log(textStatus)
        }
      });
  },
  'click #cc_contects' : function(event, template){
      var auth_code =   localStorage.getItem("cc_access_token");
      var params = "?status=ALL&limit=50&api_key="+CC_CLIENT_ID_KEY;
      url = "https://api.constantcontact.com/v2/contacts";
      Meteor.call("APICall","GET",url+params,auth_code, function(error, result){
        if(error){
          console.log("error", error);
        }
        if(result){
           console.log(result)

        }
      });
  },
  'click #sync_contects' :  function(event, template){
    $('#processingmodelwindow').modal('show');
    Meteor.call("sync_contact",function(error, result){
      if(error){
        console.log("error", error);
        $('#processingmodelwindow').modal('hide');
      }
      if(result){
         console.log(result)
         $('#processingmodelwindow').modal('hide');
      }
    });
  }
});
