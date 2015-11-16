function create_fa_contactBlock(cc_contect,list_id){
  var newContectblock = {
    "contact":{
    "first_name":cc_contect.first_name,
    "last_name":cc_contect.last_name,
    "organisation_name":cc_contect.company_name,
    "email":cc_contect.email,
    "billing_email":cc_contect.email,
    "phone_number":cc_contect.home_phone,
    "mobile":cc_contect.home_phone,
    "address1":cc_contect.address1,
    "address2": "",
    "address3": "",
    "town":cc_contect.town,
    "region": "",
    "postcode":"",
    "country":"",
    "charge_sales_tax":"Auto"
  }
};
return newContectblock;
}
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
var getFreeagentContectAPI = function(page,token,user){
  var method = "GET"
  console.log(token)
  url = "https://api.freeagent.com/v2/contacts?page="+page+"&per_page=25";
  var result = Meteor.http.call(method, url,{
      headers: {
        "Authorization" : "Bearer "+token+"",
        "User-Agent" : "Mozilla/5.0 (Windows NT 5.1; rv:19.0) Gecko/20100101 Firefox/19.0"
      }
  });
  result = result.data;
  var result_count = result.contacts.length;
  if(result_count > 0){
    page = page +1 ;
    faContectInsertToDB(result,user._id);
    getFreeagentContectAPI(page,token,user);
  }
}
var getFreeagentContectFromServer = function(user){
  var refresh = refresh_fa_access_token_from_server(user);
  if(refresh){
    var page =1;
    Meteor.users.update({_id:user._id}, {$set:{"profile.fa_access_token":refresh.data.access_token}});
    getFreeagentContectAPI(page,refresh.data.access_token,user)
  }
}

var refresh_fa_access_token_from_server = function(user){
  var profile = user.profile;
  var formData = {
       grant_type : "refresh_token",
       refresh_token: profile.fa_refresh_token,
       client_id : FA_CLIENT_ID_KEY,
       client_secret : FA_CLIENT_SECRET_KEY
   };
   var method ="POST"
   var url = "https://api.freeagent.com/v2/token_endpoint";

   var result = Meteor.http.call(method, url,{
       headers: {
         "User-Agent" : "Mozilla/5.0 (Windows NT 5.1; rv:19.0) Gecko/20100101 Firefox/19.0"
       },
       data:formData
   });
   if (result){
     return result;
   }else{
     return null;
   }
}
var fa_access_token_from_server = function(auth_code){
  var formData = {
       grant_type : "authorization_code",
       code: auth_code,
       client_id : FA_CLIENT_ID_KEY,
       client_secret : FA_CLIENT_SECRET_KEY,
       redirect_uri : FA_AUTH_URL
   };
   var method ="POST"
   var url = "https://api.freeagent.com/v2/token_endpoint";

   var result = Meteor.http.call(method, url,{
       headers: {
         "User-Agent" : "Mozilla/5.0 (Windows NT 5.1; rv:19.0) Gecko/20100101 Firefox/19.0"
       },
       data:formData
   });
   if (result){
     return result;
   }else{
     return null;
   }
}

var APICallByServer = function(method,url,code,user_id){
  var result = Meteor.http.call(method, url,{
      headers: {
        "Authorization" : "Bearer "+code+""
      },
  });
  try {
    cc_contect_insert(result.data,user_id)
  }
  catch(err) {
    console.log(err)
  }
  return result.data;
}
var generalAPICall = function(method,url,code,user_id){
  var result = Meteor.http.call(method, url,{
      headers: {
        "Authorization" : "Bearer "+code+""
      },
  });
  return result.data;
}

var getCCContactfromServer = function(auth_code,url,user_id){
  var auth_code =  auth_code;
  var params = "&api_key="+CC_CLIENT_ID_KEY;
  var result = APICallByServer("GET",url+params,auth_code,user_id);
  if(result){
     if(result.meta.pagination.next_link){
       var url = "https://api.constantcontact.com"+result.meta.pagination.next_link
       console.log(url)
       getCCContactfromServer(auth_code,url,user_id);
     }else{
     }
  }
}
var getEmailCampaigns= function(auth_code,url,user_id){
  var auth_code =  auth_code;
  var params = "&api_key="+CC_CLIENT_ID_KEY;
  var result = generalAPICall("GET",url+params,auth_code,user_id);
  if(result){
     insert_email_campaigns(result,user_id)
     if(result.meta.pagination.next_link){
       var url = "https://api.constantcontact.com"+result.meta.pagination.next_link
       console.log(url)
       getEmailCampaigns(auth_code,url,user_id);
     }else{
     }
  }
}
var getClickReport = function(auth_code,url,user_id,campaign_id){
  var auth_code =  auth_code;
  var params = "&api_key="+CC_CLIENT_ID_KEY;
  cc_clicked.remove({user_id:user_id,user_campaign_id:campaign_id})
  var result = generalAPICall("GET",url+params,auth_code,user_id);
  if(result){
     insert_click_reports(result,user_id,campaign_id)
     if(result.meta.pagination.next_link){
       var url = "https://api.constantcontact.com"+result.meta.pagination.next_link
       console.log(url)
       getClickReport(auth_code,url,user_id);
     }else{
     }
  }
}
var getOpenReport = function(auth_code,url,user_id,campaign_id){
  var auth_code =  auth_code;
  var params = "&api_key="+CC_CLIENT_ID_KEY;
  cc_send_report.remove({user_id:user_id,user_campaign_id:campaign_id})
  var result = generalAPICall("GET",url+params,auth_code,user_id);
  if(result){
     insert_open_reports(result,user_id,campaign_id)
     if(result.meta.pagination.next_link){
       var url = "https://api.constantcontact.com"+result.meta.pagination.next_link
       console.log(url)
       getOpenReport(auth_code,url,user_id);
     }else{
     }
  }
}
var getSendReport = function(auth_code,url,user_id,campaign_id){
  var auth_code =  auth_code;
  var params = "&api_key="+CC_CLIENT_ID_KEY;
  cc_opened_report.remove({user_id:user_id,user_campaign_id:campaign_id})
  var result = generalAPICall("GET",url+params,auth_code,user_id);
  if(result){
     insert_send_reports(result,user_id,campaign_id)
     if(result.meta.pagination.next_link){
       var url = "https://api.constantcontact.com"+result.meta.pagination.next_link
       console.log(url)
       getSendReport(auth_code,url,user_id);
     }else{
     }
  }
}
var getConstantContactEmailCampaigns = function(user){
  var auth_code =   user.profile.cc_access_token;
  var url = "https://api.constantcontact.com/v2/emailmarketing/campaigns";
  var params = "?status=ALL&limit=50";
  getEmailCampaigns(auth_code,url+params,user._id);
}

var getConstantContactClickReport = function(user){
  var auth_code =   user.profile.cc_access_token;
  var user_id = user._id;
  var campaigns = cc_campaign.find({user_id:user_id,status:"SENT"}).fetch();
  console.log(campaigns.length);
  for(var i = 0; i < campaigns.length ;i++){
    var url = "https://api.constantcontact.com/v2/emailmarketing/campaigns/"+campaigns[i].id+"/tracking/clicks";
    var params = "?limit=50";
    getClickReport(auth_code,url+params,user._id,campaigns[i].id);
  }

}

var getConstantContactOpenReport = function(user){
  var auth_code =   user.profile.cc_access_token;
  var user_id = user._id;
  var campaigns = cc_campaign.find({user_id:user_id,status:"SENT"}).fetch();
  console.log(campaigns.length);
  for(var i = 0; i < campaigns.length ;i++){
    var url = "https://api.constantcontact.com/v2/emailmarketing/campaigns/"+campaigns[i].id+"/tracking/opens";
    var params = "?limit=50";
    getOpenReport(auth_code,url+params,user._id,campaigns[i].id);
  }
}
var getConstantContactSendReport = function(user){
  var auth_code =   user.profile.cc_access_token;
  var user_id = user._id;
  var campaigns = cc_campaign.find({user_id:user_id,status:"SENT"}).fetch();
  console.log(campaigns.length);
  for(var i = 0; i < campaigns.length ;i++){
    var url = "https://api.constantcontact.com/v2/emailmarketing/campaigns/"+campaigns[i].id+"/tracking/sends";
    var params = "?limit=50";
    getSendReport(auth_code,url+params,user._id,campaigns[i].id);
  }
}
 var getConstantContactFormServer= function(user){
   var auth_code =   user.profile.cc_access_token
   var url = "https://api.constantcontact.com/v2/contacts";
   var params = "?status=ALL&limit=50";
   getCCContactfromServer(auth_code,url+params,user._id)
 }
var autoSyncContact = function(){
  var users = Meteor.users.find().fetch();
  console.log("auto sync call")
  for(var i=0;i < users.length;i++){
    var user = users[i];
    console.log(user)
    if(profile){
      try {
        console.log(profile)
        if(is_fa_ccount_active_by_user(user)){
          getFreeagentContectFromServer(user)
        }
        if(is_cc_account_active_by_user(user)){
          getConstantContactFormServer(user)
        }
        if(is_fa_ccount_active_by_user(user) && is_cc_account_active_by_user(user)){
          syncContacts(user)
        }

      } catch (e) {
          console.log(e)
      }
    }
  }
}
var faContectInsertToDB = function(result,userId){
  result = result.contacts
  for(var i = 0;i< result.length ; i++){
    var jsondata = result[i];
    jsondata['provider'] = "freeagent";
    jsondata['user_id'] = userId;
    if(jsondata.email && jsondata.email.length > 1){
      var contact = contacts.findOne({user_id:userId,email:jsondata.email,provider:"freeagent"});
      if(contact){
        contacts.update({_id:contact._id},{$set:jsondata});
      }else{
        jsondata['sync_state'] = "new";
        contacts.insert(jsondata);
      }
    }
  }
  return result;
}
var syncContacts = function(user){
  profile = user.profile;
  var list_id = getcontectlist_id(profile.cc_access_token);
  if(profile){
    if(profile.default_eamil_id){
      list_id = profile.default_eamil_id;
    }
  }
  var freeagentcontacts = contacts.find({user_id:user._id,provider:"freeagent"}).fetch();
  var constantcontact = contacts.find({user_id:user._id,provider:"constantcontact"}).fetch();
  for(var i =0 ; i< freeagentcontacts.length ;i++){
    for(var j = 0 ; j < constantcontact.length ; j++){
      if(freeagentcontacts[i].email == constantcontact[j].email){
        contacts.update({_id:freeagentcontacts[i]._id}, {$set:{sync_state:"sync"}});
        contacts.update({_id:constantcontact[j]._id}, {$set:{sync_state:"sync"}});
      }
    }
  }
  var freeagentcontactsforcreate = contacts.find({user_id:user._id,provider:"freeagent",sync_state:"new"}).fetch();
  for(var c=0;c < freeagentcontactsforcreate.length ;c++){

      var newobject = create_cc_contactBlock(freeagentcontactsforcreate[c],list_id);
      try {
        var response = create_cc_contect(newobject,profile.cc_acccess_code,user._id);
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
  var constantcontactcontactsforcreate = contacts.find({user_id:user._id,provider:"constantcontact",sync_state:"new"}).fetch();
  for(var c=0;c < constantcontactcontactsforcreate.length ;c++){
      var newobject = create_fa_contactBlock(constantcontactcontactsforcreate[c]);
      try {
        url = "https://api.freeagent.com/v2/contacts";
        var response = create_fa_contect("POST",url,profile.fa_access_token, newobject,user._id)
        //var response = createfreeagentcontect(newobject,fa_access_token);
        console.log(response)
         if(response){
           if(response.statusCode == 201){
             contacts.update({_id:constantcontactcontactsforcreate[c]._id}, {$set:{sync_state:"sync"}});
           }
         }
      } catch (e) {
          console.log(e)
      }
  }
}


    Blog.config({
        adminRole:'admin',
        authorRole: 'blogAuthor'
    });
    Meteor.publish("contacts", function (user_id)
    {
        return contacts.find({user_id:user_id});
    });
    Meteor.publish("emailLists", function (user_id)
    {
        return emailLists.find({user_id:user_id});
    });
    Meteor.publish("cc_campaign", function (user_id)
    {
        return cc_campaign.find({user_id:user_id});
    });
    Meteor.publish("cc_send_report", function (user_id)
    {
        return cc_send_report.find({user_id:user_id});
    });
    Meteor.publish("cc_opened_report", function (user_id)
    {
        return cc_opened_report.find({user_id:user_id});
    });
    Meteor.publish("cc_clicked", function (user_id)
    {
        return cc_clicked.find({user_id:user_id});
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
          return parser.text('every 60 minutes');
        },
        job: function() {
          autoSyncContact()
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
    var create_fa_contect = function (method,url, code,json_input,user_id){
      var result = Meteor.http.call(method, url,{
          headers: {
            "Authorization" : "Bearer "+code+"",
            "User-Agent" : "Mozilla/5.0 (Windows NT 5.1; rv:19.0) Gecko/20100101 Firefox/19.0"
          },
          data:json_input
      });
      try {
        var jsondata = result.data.contact;
        jsondata['provider'] = "freeagent";
        jsondata['user_id'] = user_id;
        if(jsondata.email && jsondata.email.length > 1){
          var contact = contacts.findOne({user_id:user_id,email:jsondata.email,provider:"freeagent"});
          if(contact){
            contacts.update({_id:contact._id},{$set:jsondata});
          }else{
            jsondata['sync_state'] = "sync";
            contacts.insert(jsondata);
          }
        }
      }
      catch(err) {
        console.log(err)
      }
      return result;
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
   var insert_click_reports = function(data,user_id,campaign_id){
     var clickReports = data.results
     for(var i=0;i < clickReports.length ; i++)
     {
       var jsondata = clickReports[i];
         jsondata['user_id'] = user_id;
         jsondata['user_campaign_id']=campaign_id
         cc_clicked.insert(jsondata);
     }
   }
   var insert_open_reports = function(data,user_id,campaign_id){
     var openReports = data.results
     for(var i=0;i < openReports.length ; i++)
     {
       var jsondata = openReports[i];
         jsondata['user_id'] = user_id;
         jsondata['user_campaign_id']=campaign_id
         cc_opened_report.insert(jsondata);
     }
   }
   var insert_send_reports = function(data,user_id,campaign_id){
     var sendReports = data.results
     for(var i=0;i < sendReports.length ; i++)
     {
       var jsondata = sendReports[i];
         jsondata['user_id'] = user_id;
         jsondata['user_campaign_id']=campaign_id
         cc_send_report.insert(jsondata);
     }
   }
   var insert_email_campaigns = function(data,user_id){
     var campaigns = data.results

     for(var i=0;i < campaigns.length ; i++)
     {
       var jsondata = campaigns[i];
         jsondata['user_id'] = user_id;
         var campaign = cc_campaign.findOne({id:jsondata.id});
         if(campaign){
           cc_campaign.update({_id:campaign._id},{$set:jsondata});
         }else{
           cc_campaign.insert(jsondata);
         }
     }
   }
   var cc_contect_insert = function(data,user_id){
     var contect = data.results
     for(var i=0;i < contect.length ; i++)
     {
       var jsondata = contect[i];
       jsondata['provider'] = "constantcontact";
       jsondata['user_id'] = user_id;
       try{
         jsondata['email'] = jsondata.email_addresses[0].email_address;
         var contact = contacts.findOne({user_id:user_id,email:jsondata.email,provider:"constantcontact"});
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
   var create_cc_contect = function (data,cc_access_token,user_id){
     var url = "https://api.constantcontact.com/v2/contacts?action_by=ACTION_BY_OWNER&api_key="+CC_CLIENT_ID_KEY;
     console.log("call inside create cc")
     var result = Meteor.http.call("POST", url,{
         headers: {
           "Authorization" : "Bearer "+cc_access_token+"",
           "content-type" : "application/json"
         },
         data:data
     });
     console.log(result)
     if(result.statusCode == 201){

       var jsondata = result.data;
       jsondata['provider'] = "constantcontact";
       jsondata['user_id'] = user_id;
       jsondata['email'] = jsondata.email_addresses[0].email_address;
       if(jsondata.email && jsondata.email.length > 1){
         var contact = contacts.findOne({user_id:user_id,email:jsondata.email,provider:"constantcontact"});
         if(contact){
           contacts.update({_id:contact._id},{$set:jsondata});
         }else{
           jsondata['sync_state'] = "sync";
           contacts.insert(jsondata);
         }
       }
     }
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
     var getEmailcontectlist = function(code)
     {
       var url = "https://api.constantcontact.com/v2/lists"
       var params = "?api_key="+CC_CLIENT_ID_KEY;
       console.log(url);
       var result = Meteor.http.call("GET", url+params,{
           headers: {
             "Authorization" : "Bearer "+code+""
           }
       });
       var result = result.data
       for(var i=0; i < result.length;i++){
         emaillist =  emailLists.findOne({id:result[i].id});
        if(emaillist){
          emailLists.update({_id:emaillist._id}, {$set:{id:result[i].id,name:result[i].name}});
        }else{
          emailLists.insert({id:result[i].id,name:result[i].name,user_id:Meteor.userId()});
        }
       }
       return result;
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
        getFreeagentContectFromServer : function(user){
          this.unblock();
          return getFreeagentContectFromServer(user)
        },
        getFaAcesstoken : function(auth_code){
          this.unblock();
          return fa_access_token_from_server(auth_code);
        },
        getConstantContactEmailCampaigns:function(user){
          this.unblock();
          return getConstantContactEmailCampaigns(user);
        },
        getConstantContactClickReport:function(user){
          return getConstantContactClickReport(user);
        },
        getConstantContactOpenReport:function(user){
          return getConstantContactOpenReport(user);
        },
        getConstantContactSendReport : function(user){
          return getConstantContactSendReport(user);
        },
        APICall : function (method,url, code){
          this.unblock();
          var result = APICallByServer("GET",url,code,Meteor.userId());
          return result;
        },
        fa_contect_insert :  function (result){
          this.unblock();
          var result = faContectInsertToDB(result,Meteor.userId());
          return result;
        },
        delete_contact : function(id){
          this.unblock();
          //autoSyncContact()
          contacts.remove({user_id:id},function(error){
            if(error){
              console.log(error)
            }else{

            }
          });
          return "success"
        },
        getEmailcontectlist : function(cc_acccess_code){
          this.unblock();
          return getEmailcontectlist(cc_acccess_code);
        },
        sync_contact : function(cc_acccess_code,fa_access_token){
          this.unblock();
          var list_id = getcontectlist_id(cc_acccess_code);
          profile = Meteor.user().profile
          if(profile){
            if(profile.default_eamil_id){
              list_id = profile.default_eamil_id;
            }
          }
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
                var response = create_cc_contect(newobject,cc_acccess_code,Meteor.userId());
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
          var constantcontactcontactsforcreate = contacts.find({user_id:Meteor.userId(),provider:"constantcontact",sync_state:"new"}).fetch();
          for(var c=0;c < constantcontactcontactsforcreate.length ;c++){
              var newobject = create_fa_contactBlock(constantcontactcontactsforcreate[c]);
              try {
                url = "https://api.freeagent.com/v2/contacts";
                var response = create_fa_contect("POST",url,fa_access_token, newobject,Meteor.userId())
                //var response = createfreeagentcontect(newobject,fa_access_token);
                 if(response){
                   if(response.statusCode == 201){
                     contacts.update({_id:constantcontactcontactsforcreate[c]._id}, {$set:{sync_state:"sync"}});
                   }
                 }
              } catch (e) {
                  console.log(e)
              }
          }
          return "sync done"
        }
    });
}
