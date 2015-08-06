Template.faindex.events({
    'click #fa_login' : function(event, template){
        console.log("fa login click");
        console.log(getUrlParameter("code"));
        var  auth_code = getUrlParameter("code");
        var formData = {
             grant_type : "authorization_code",
             code: auth_code,
             client_id : "cKzxWGuOHl9dOC1dNbLclw",
             client_secret : "PDxv8sDQpYktmUnzsYvDaQ",
             redirect_uri : "http://ce9baf06.ngrok.io/oauth/"

         };

         localStorage.setItem("auth_code",auth_code);

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
            localStorage.setItem("access_token",data.access_token);
            localStorage.setItem("token_type",data.token_type);
            localStorage.setItem("refresh_token",data.token_type);

          },
          error: function (jqXHR, textStatus, errorThrown)
          {
            console.log(textStatus)
          }
        });
    },
    'click #fa_contects' : function(event, template){
        url = "https://api.sandbox.freeagent.com/v2/contacts";
        $.ajax({
          url : url,
          type: "GET",
          headers:{ "Authorization" : "Bearer "+localStorage.getItem("access_token")+""},
          success: function(data, textStatus, jqXHR)
          {
            console.log(textStatus)
            console.log(data)
          },
          error: function (jqXHR, textStatus, errorThrown)
          {
            console.log(textStatus)
          }
        });
    }
});
