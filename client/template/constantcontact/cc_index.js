Template.ccindex.events({
    'click #cc_login' : function(event, template){
        console.log("fa login click");
        console.log(getUrlParameter("code"));
        var  auth_code = getUrlParameter("code");
        var formData = {
             grant_type : "authorization_code",
             code: auth_code,
             client_id : "sgp54b32c64mqkc9e7g3zm9e",
             client_secret : "fRzKbhrkdTPttWG4fvfcsCRj",
             redirect_uri : "http://ccintegration.herokuapp.com/cc_oauth/"

         };
         localStorage.setItem("cc_auth_code",auth_code);
         url = "https://oauth2.constantcontact.com/oauth2/oauth/token";
         Meteor.call("authenticate", auth_code, function(error, result){
           if(error){
             console.log("error", error);
           }
           if(result){
              console.log(result)
              localStorage.setItem("cc_access_token",result.access_token);
              localStorage.setItem("cc_token_type",result.token_type);
           }
         });
    },
    'click #cc_contects' : function(event, template){
        var auth_code =   localStorage.getItem("cc_access_token");
        var params = "?status=ALL&limit=50&api_key=sgp54b32c64mqkc9e7g3zm9e";
        url = "https://api.constantcontact.com/v2/contacts";
        Meteor.call("APICall","GET",url+params,auth_code, function(error, result){
          if(error){
            console.log("error", error);
          }
          if(result){
             console.log(result)

          }
        });
    }
});
Template.ccindex.helpers({
  access_token: function(){
    return localStorage.getItem("cc_access_token")
  },
  token_type: function(){
    return localStorage.getItem("cc_token_type")
  },
  refresh_token: function(){
    return "n/a";
  },
  auth_code: function(){
    return localStorage.getItem("cc_auth_code")
  }
});
