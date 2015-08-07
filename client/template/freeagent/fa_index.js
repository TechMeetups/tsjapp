function updateUserFaAccess(){
  var fa_refresh_token = localStorage.getItem("fa_refresh_token");
  var fa_access_token = localStorage.getItem("fa_access_token");
  var fa_auth_code = localStorage.getItem("fa_auth_code");
  var fa_token_type = localStorage.getItem("fa_token_type");
  Meteor.users.update({_id:Meteor.userId()}, { $set:{"profile.fa_auth_code":fa_auth_code,"profile.fa_refresh_token":fa_refresh_token,
  "profile.fa_access_token":fa_access_token,"profile.fa_token_type":fa_token_type}},function(error){
    if(error){
      console.log("error : "+ error);
    }else{
      console.log("User Update Success");
    }
  });
}
Template.faindex.events({
    'click #fa_refresh' : function(event, template){
      console.log("fa_refresh click");
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
          updateUserFaAccess();
        },
        error: function (jqXHR, textStatus, errorThrown)
        {
          console.log(textStatus)
          updateUserFaAccess();
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
            localStorage.setItem("fa_refresh_token",data.refresh_token);
            updateUserFaAccess();
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
