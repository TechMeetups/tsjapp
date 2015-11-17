
Template.dashboard.helpers({
  cc_contects : function(){
    return contacts.find({user_id:Meteor.userId()});
  },
  provider_label : function(provider_label){
    if(provider_label && provider_label == "freeagent"){
      return "label-success"
    }else{
      return "label-primary"
    }
  },
  image_src : function(provider_label){
    if(provider_label && provider_label == "freeagent"){
      return "http://freeagent-assets.s3.amazonaws.com/website-2014/images/logo.svg"
    }else{
      return "/assets/img/constant-contact-share-logo.gif"
    }
  },
  is_freeagent : function(provider_label){
    if(provider_label && provider_label == "freeagent"){
      return true;
    }else{
      return false
    }
  },
  sync_label : function(sync_label){
    if(sync_label && sync_label == "new"){
      return  "label-danger"
    }else {
      return "label-success"
    }
  }
});

Template._myPopover.events({
'click #fa_contacts' : function(event, template){
  IonPopover.hide()
  if(!is_fa_ccount_active()){
    IonLoading.show({
      customTemplate: "Setup your Accounts before importing any contacts",
      duration: 3000
    });
    setTimeout(function () {
        Router.go('accountsetup');
    },2000);
    return;
  }

  IonLoading.show({
    customTemplate :'<i class="fa fa-cog fa-spin font30"></i>'
  });
  getfreeagentcontect(Meteor.user());
  // refresh_fa_access_token(function(result){
  //   if(result){
  //     localStorage.setItem("fa_access_token",result.access_token);
  //     localStorage.setItem("fa_token_type",result.token_type);
  //     updateUserFaAccess();
  //     var access_token = localStorage.getItem("fa_access_token");
  //     var page =1;
  //     getfreeagentcontect(page,access_token)
  //   }
  // })
},
'click #load_report' : function(event, template){
  IonPopover.hide();
  IonLoading.show({
    customTemplate :'<i class="fa fa-cog fa-spin font30"></i>'
  });
  Meteor.call("getConstantContactEmailCampaigns",Meteor.user(), function(error, result){
    if(error){
      console.log("error", error);
    }
    else
    {
        console.log(result)
        IonLoading.hide();
        IonLoading.show({
          customTemplate :'<i class="fa fa-cog fa-spin font30"></i>'
        });
        Meteor.call("getConstantContactClickReport",Meteor.user(), function(error, result){
          if(error){
            console.log("error", error);
            IonLoading.hide();
          }else{
            IonLoading.hide();
            console.log("getConstantContactClickReport")
            console.log(result)
          }
        });
        Meteor.call("getConstantContactOpenReport",Meteor.user(), function(error, result){
          if(error){
            console.log("error", error);
            IonLoading.hide();
          }else{
            console.log("getConstantContactClickReport")
            console.log(result)
            IonLoading.hide();
          }
        });
        Meteor.call("getConstantContactSendReport",Meteor.user(), function(error, result){
          if(error){
            console.log("error", error);
            IonLoading.hide();
          }else{
            console.log("getConstantContactSendReport")
            console.log(result)
            IonLoading.hide();
          }
        });

        Meteor.call("getFreeagentInvoice",Meteor.user(), function(error, result){
          if(error){
            console.log("error", error);
            IonLoading.hide();
          }else{
            console.log("getFreeagentInvoice")
            console.log(result)
            IonLoading.hide();
          }
        });
    }
  });
},
'click #cc_contacts' : function(event, template){
    IonPopover.hide()
    if(!is_cc_account_active()){
      IonLoading.show({
        customTemplate: "Setup your Accounts before importing any contacts",
        duration: 3000
      });
      setTimeout(function () {
          Router.go('accountsetup');
      },2000);
      return;
    }
    IonLoading.show({
     customTemplate :'<i class="fa fa-cog fa-spin font30"></i>'
    });
    var auth_code =   localStorage.getItem("cc_access_token");
    var url = "https://api.constantcontact.com/v2/contacts";
    var params = "?status=ALL&limit=50";
    getCCContact(auth_code,url+params)
},
'click #sync_contacts' :  function(event, template){
  IonPopover.hide()
  if(!is_cc_account_active() && !is_fa_ccount_active()){
    IonLoading.show({
      customTemplate: "Setup your Accounts before importing any contacts",
      duration: 3000
    });
    setTimeout(function () {
        Router.go('accountsetup');
    },3000);
    return;
  }
  IonLoading.show({
  customTemplate :'<i class="fa fa-cog fa-spin font30"></i>'
});
  var auth_code =   localStorage.getItem("cc_access_token");
  refresh_fa_access_token(function(result){
    if(result){
      localStorage.setItem("fa_access_token",result.access_token);
      localStorage.setItem("fa_token_type",result.token_type);
      updateUserFaAccess();
      var access_token = localStorage.getItem("fa_access_token");
    }
  })
  IonLoading.show({
  customTemplate :'<i class="fa fa-cog fa-spin font30"></i>'
});
  var fa_access_token = localStorage.getItem("fa_access_token");
  Meteor.call("sync_contact",auth_code,fa_access_token,function(error, result){
    if(error){
      console.log("error", error);
      IonLoading.hide();
    }
    if(result){
       console.log(result)
       IonLoading.hide();
    }
  });
},
'click #clear_contacts' :  function(event, template){
  IonPopover.hide()
  IonPopup.confirm({
      title: 'Are you sure ?',
      template: 'Are you sure you want clear all contact ?',
      onOk: function() {
        IonLoading.show({
  customTemplate :'<i class="fa fa-cog fa-spin font30"></i>'
});
        Meteor.call("delete_contact",Meteor.userId(),function(error, result){
          if(error){
            console.log("error", error);
            IonLoading.hide();
          }
          if(result){
             console.log(result)
             IonLoading.hide();
          }
        });
      },
      onCancel: function() {
        console.log('Cancelled');
      }
    });
}
});
