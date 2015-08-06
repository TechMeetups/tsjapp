if (Meteor.isServer)
{

    Blog.config({
        adminRole:'admin',
        authorRole: 'blogAuthor'
    });
    // Router.route('/oauth').
    // get(function () {
    //     //console.log(this.request);
    //     var code = this.params['query'].code;
    //     authenticate(code,function(error, result){
    //       console.log(error);
    //       console.log(result);
    //     })
    //     this.response.writeHead(200);
    //    this.response.end('Success\n');
    // });
    Meteor.startup(function () {

        // By default, the email is sent from no-reply@meteor.com. If you wish to receive email from users asking for help with their account, be sure to set this to an email address that you can receive email at.
        Accounts.emailTemplates.from = 'admin <no-reply@CCIntegration.com>';
        // The public name of your application. Defaults to the DNS name of the application (eg: awesome.meteor.com).
        Accounts.emailTemplates.siteName = 'Graphical.IO';
        // A Function that takes a user object and returns a String for the subject line of the email.
        Accounts.emailTemplates.verifyEmail.subject = function(user) {
            return 'Confirm Your Email Address';
        };
        // A Function that takes a user object and a url, and returns the body text for the email.
        // Note: if you need to return HTML instead, use Accounts.emailTemplates.verifyEmail.html
        Accounts.emailTemplates.verifyEmail.text = function(user, url) {
            return 'click on the following link to verify your email address: ' + url;
        };
    });
    Accounts.onCreateUser(function(options, user) {
      console.log("on account create");
      if(options.autocreate){
          user.profile = {user_id :options.profile.user_id,firstname:options.profile.firstname};
          userRegistration(user,options.password)
      }else{
          user.profile = {};
          console.log(options);
          console.log(user);
          userRegistration(user,"hidden")
      }
      return user;
    });
    var userRegistration = function(user,pass){
        var fromEmail = "admin@CCIntegration.com";
        var toEmail = user.emails[0].address;
        Email.send({
            from: fromEmail,
            to: toEmail,
            replyTo: fromEmail ,
            subject: "CCIntegration Registration",
            text: "Hi "+user.profile.firstname+",\nYour Email: "+user.emails[0].address+" has been registered."+
            "\nYour password is : "+pass+"\n\n"+
            "Thank you.\n"+
            "The CCIntegration Team.\n"+Meteor.absoluteUrl()+"\n"
            // + "http://www.graphical.io/assets/img/Graphical-IO.png"
        });
    }

    var userPasswordReset = function(user,pass)
    {
        var fromEmail = "admin@CCIntegration.com";
        var toEmail = user.emails[0].address;
        Email.send({
            from: fromEmail,
            to: toEmail,
            replyTo: fromEmail ,
            subject: "CCIntegration Password Reset",
            text: "Hi "+user.profile.firstname+",\nYour password has been reset."+
            "\nYour new password is : "+pass+"\n\n"+
            "Thank you.\n"+
            "The CCIntegration Team.\n"+Meteor.absoluteUrl()+"\n"
            // +"http://www.graphical.io/assets/img/Graphical-IO.png"
        });
    }
    var sendMessage = function (user_email)
    {
        var fromEmail = "admin@CCIntegration.com";
        var toEmail = " shawn@techmeetups.com";
        Email.send({
            from: fromEmail,
            to: toEmail,
            replyTo: fromEmail ,
            subject: "CCIntegration Registration Request",
            text: "Hi SysAdmin,\nUser: "+user_email+" wants to register on Graphical.IO\n\n"+
            "Thank you.\n"+
            "The CCIntegration Team.\n"+Meteor.absoluteUrl()+"\n"
            // + "http://www.graphical.io/assets/img/Graphical-IO.png"
        });
   }
   var authenticate = function (auth_code) {
     var formData = {
            grant_type : "authorization_code",
            code: auth_code,
            client_id : "sgp54b32c64mqkc9e7g3zm9e",
            client_secret : "fRzKbhrkdTPttWG4fvfcsCRj",
            redirect_uri : "http://ce9baf06.ngrok.io/cc_oauth/"

        };
        url = "https://oauth2.constantcontact.com/oauth2/oauth/token";
        var result = Meteor.http.call('POST', url,{
            headers: {
              "content-type" : "application/x-www-form-urlencoded"
            },
            params: formData
        });
        return result.data;
     }
      Meteor.methods(
    {
        'sendMessage': function (toId)
        {
            if (Meteor.isServer)
                sendMessage(toId);
        },
        'sendTaskassignNotification' : function(useremail,WBS_id,project_name,notes,resource_id)
        {
            if (Meteor.isServer)
                sendTaskassignNotification(useremail,WBS_id,project_name,notes,resource_id) ;
        },
        'sendTaskassignNotificationTemplate' : function(useremail,WBS_id,project_name,notes)
        {
            if (Meteor.isServer)
                sendTaskassignNotificationTemplate(useremail,WBS_id,project_name,notes) ;
        },
        'sendNoteNotification' : function(useremail,project,process,workitem,itemtype,resource,notes)
        {
            if (Meteor.isServer)
                sendNoteNotification(useremail,project,process,workitem,itemtype,resource,notes) ;
        },
        'sendtaskCompletedNotification':function(useremail,project,workitem,notes){
            sendtaskCompletedNotification(useremail,project,workitem,notes);
        },
        resetpassword : function (user_id,pass)
        {
            Accounts.setPassword(user_id, pass);
        },
        authenticate : function(code){
          this.unblock();
          return authenticate(code)
        },
        APICall : function (method,url, code){
          this.unblock();
          var result = Meteor.http.call(method, url,{
              headers: {
                "Authorization" : "Bearer "+code+""
              },
          });
          return result.data;

        }
    });


}
