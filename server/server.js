function create_cc_contactBlock(faContect,list_id){
  var newContectblock = {
    "addresses": [
    {
      "address_type": "PERSONAL",
      "city": "",
      "country_code": "",
      "line1": faContect.address1,
      "line2": faContect.town,
      "line3": "",
      "postal_code": "",
      "state_code": "",
      "sub_postal_code": ""
    }],
    "lists": [
        {
            "id": list_id
        }
    ],
    "cell_phone": "",
    "company_name": faContect.organisation_name,
    "confirmed": false,
    "email_addresses": [
        {
            "email_address": faContect.email
        }
    ],
    "fax": "",
    "first_name": faContect.first_name,
    "home_phone": "",
    "job_title": "",
    "last_name": faContect.last_name,
    "middle_name": "",
    "prefix_name": "",
    "work_phone": ""
};
return newContectblock;
}

if (Meteor.isServer)
{

    Blog.config({
        adminRole:'admin',
        authorRole: 'blogAuthor'
    });
    Meteor.publish("contacts", function (user_id)
    {
        return contacts.find({user_id:user_id});
    });
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


      SyncedCron.add({
        name: 'FA-CC Contact Sync',
        schedule: function(parser) {
          // parser is a later.parse object
          return parser.text('every 1 minutes');
        },
        job: function() {
          console.log("test 123")
        }
      });
      SyncedCron.start();
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
          user.profile = {firstname:options.profile.firstname};
          userRegistration(user,"hidden")
      }
      return user;
    });
    var userRegistration = function(user,pass){
        var fromEmail = "admin@techmeetups.com";
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
        var fromEmail = "admin@techmeetups.com";
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
        var fromEmail = "admin@techmeetups.com";
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
   var cc_contect_insert = function(data){
     var contect = data.results
     for(var i=0;i < contect.length ; i++)
     {
       var jsondata = contect[i];
       jsondata['provider'] = "constantcontact";
       jsondata['user_id'] = Meteor.userId();
       try{
         jsondata['email'] = jsondata.email_addresses[0].email_address;
         var contact = contacts.findOne({user_id:Meteor.userId(),email:jsondata.email,provider:"constantcontact"});
         if(contact){
           contacts.update({_id:contact._id},{$set:jsondata});
         }else{
           jsondata['sync_state'] = "new";
           contacts.insert(jsondata);
         }
       }
       catch(err) {
         console.log(err)
        }

     }
   }
   var create_cc_contect = function (data,cc_access_token){
     var url = "https://api.constantcontact.com/v2/contacts?action_by=ACTION_BY_OWNER&api_key="+CC_CLIENT_ID_KEY;
     console.log("call inside create cc")
     var result = Meteor.http.call("POST", url,{
         headers: {
           "Authorization" : "Bearer "+cc_access_token+"",
           "content-type" : "application/json"
         },
         data:data
     });
     return result;
   }
   var authenticate = function (auth_code) {
     var formData = {
            grant_type : "authorization_code",
            code: auth_code,
            client_id : CC_CLIENT_ID_KEY,
            client_secret : CC_CLIENT_SECRET_KEY,
            redirect_uri : CC_AUTH_URL
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
     var getcontectlist_id = function(code)
     {
       var url = "https://api.constantcontact.com/v2/lists"
       var params = "?api_key="+CC_CLIENT_ID_KEY;
       console.log(url);
       var result = Meteor.http.call("GET", url+params,{
           headers: {
             "Authorization" : "Bearer "+code+""
           }
       });
       return result.data[0].id
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
        resetpasswordByEmail : function (email){
          var user = Meteor.users.findOne({'emails.address': {$regex:email,$options:'i'}});
          console.log(user);
          if(user){
            pass = guid()
            Accounts.setPassword(user._id, pass);
            userPasswordReset(user,pass)
            return "Password Reset successfully Please check your email for new password."
          }else{
            return "User not available with provided email"
          }
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
          try {
            cc_contect_insert(result.data)
          }
          catch(err) {
            console.log(err)
          }
          return result.data;
        },
        fa_contect_insert :  function (result){
          this.unblock();
          result = result.contacts
          for(var i = 0;i< result.length ; i++){
            var jsondata = result[i];
            jsondata['provider'] = "freeagent";
            jsondata['user_id'] = Meteor.userId();
            if(jsondata.email && jsondata.email.length > 1){
              var contact = contacts.findOne({user_id:Meteor.userId(),email:jsondata.email,provider:"freeagent"});
              if(contact){
                contacts.update({_id:contact._id},{$set:jsondata});
              }else{
                jsondata['sync_state'] = "new";
                contacts.insert(jsondata);
              }
            }
          }
          return result;
        },
        delete_contact : function(id){
          this.unblock();
          contacts.remove({user_id:id},function(error){
            if(error){
              console.log(error)
            }else{

            }
          });
          return "success"
        },
        sync_contact : function(cc_acccess_code){
          this.unblock();
          var list_id = getcontectlist_id(cc_acccess_code);
          var freeagentcontacts = contacts.find({user_id:Meteor.userId(),provider:"freeagent"}).fetch();
          var constantcontact = contacts.find({user_id:Meteor.userId(),provider:"constantcontact"}).fetch();
          for(var i =0 ; i< freeagentcontacts.length ;i++){
            for(var j = 0 ; j < constantcontact.length ; j++){
              if(freeagentcontacts[i].email == constantcontact[j].email){
                contacts.update({_id:freeagentcontacts[i]._id}, {$set:{sync_state:"sync"}});
                contacts.update({_id:constantcontact[j]._id}, {$set:{sync_state:"sync"}});
              }
            }
          }
          var freeagentcontactsforcreate = contacts.find({user_id:Meteor.userId(),provider:"freeagent",sync_state:"new"}).fetch();
          for(var c=0;c < freeagentcontactsforcreate.length ;c++){

              var newobject = create_cc_contactBlock(freeagentcontactsforcreate[c],list_id);
              try {
                var response = create_cc_contect(newobject,cc_acccess_code);
                 if(response){
                   console.log(response.statusCode)
                   if(response.statusCode == 201){
                     contacts.update({_id:freeagentcontactsforcreate[c]._id}, {$set:{sync_state:"sync"}});
                   }
                 }
                 Meteor.sleep(300);
              } catch (e) {
                  console.log(e)
              }
          }
          return "sync done"
        }
    });
}
