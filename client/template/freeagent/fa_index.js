Template.faindex.events({
    'clcik #fa_refresh' : function(event, template){
      console.log("fa click");
      var formData = {
           grant_type : "refresh_token",
           refresh_token: localStorage.getItem("fa_refresh_token"),
           client_id : "cKzxWGuOHl9dOC1dNbLclw",
           client_secret : "PDxv8sDQpYktmUnzsYvDaQ"
       };

       url = "https://api.sandbox.freeagent.com/v2/token_endpoint";

      $.ajax({
        url : url,
        type: "POST",
        contentType: "application/x-www-form-urlencoded",
        data : formData,
        success: function(data, textStatus, jqXHR)
        {
          console.log(textStatus)
          console.log(data)
          localStorage.setItem("fa_access_token",data.access_token);
          localStorage.setItem("fa_token_type",data.token_type);
        },
        error: function (jqXHR, textStatus, errorThrown)
        {
          console.log(textStatus)
        }
      });
    },
    'click #fa_login' : function(event, template){
        console.log("fa login click");
        console.log(getUrlParameter("code"));
        var  auth_code = getUrlParameter("code");
        var formData = {
             grant_type : "authorization_code",
             code: auth_code,
             client_id : "cKzxWGuOHl9dOC1dNbLclw",
             client_secret : "PDxv8sDQpYktmUnzsYvDaQ",
             redirect_uri : "http://ccintegration.herokuapp.com/oauth/"
         };

         localStorage.setItem("fa_auth_code",auth_code);
         url = "https://api.sandbox.freeagent.com/v2/token_endpoint";
        $.ajax({
          url : url,
          type: "POST",
          contentType: "application/x-www-form-urlencoded",
          data : formData,
          success: function(data, textStatus, jqXHR)
          {
            console.log(textStatus)
            console.log(data)
            localStorage.setItem("fa_access_token",data.access_token);
            localStorage.setItem("fa_token_type",data.token_type);
            localStorage.setItem("fa_refresh_token",data.token_type);

          },
          error: function (jqXHR, textStatus, errorThrown)
          {
            console.log(textStatus)
          }
        });
    },
    'click #fa_contects' : function(event, template){
      url = "https://api.sandbox.freeagent.com/v2/contacts";
      var access_token = localStorage.getItem("fa_access_token");
      // Meteor.call("fa_contect","GET",url,access_token, function(error, result){
      //   if(error){
      //     console.log("error", error);
      //   }
      //   if(result){
      //      console.log(result)
      //
      //   }
      // });

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
    }
});

Template.faindex.helpers({
  access_token: function(){

    return localStorage.getItem("fa_access_token")
  },
  token_type: function(){

    return localStorage.getItem("fa_token_type")
  },
  refresh_token: function(){

    return localStorage.getItem("fa_refresh_token")
  },
  auth_code: function(){

    return localStorage.getItem("fa_auth_code")
  },
  cc_contects : function(){
    return contacts.find({user_id:Meteor.userId()});
  }
});
