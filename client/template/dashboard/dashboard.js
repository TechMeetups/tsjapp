
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
      return "btn btn-theme02"
    }
  }
});

Template._myPopover.events({
'click #fa_contacts' : function(event, template){
  console.log("clickd")
  if(!is_fa_ccount_active()){
    $('#error-message').html("Setup your Accounts before importing any contacts");
    $('#main-error-box').css("display","block");
    setTimeout(function () {
        $('#main-error-box').css("display","none");
        Router.go('accountsetup');
    },2000);

    return;
  }
  IonLoading.show();
  refresh_fa_access_token(function(result){
    if(result){
      localStorage.setItem("fa_access_token",result.access_token);
      localStorage.setItem("fa_token_type",result.token_type);
      updateUserFaAccess();

      var access_token = localStorage.getItem("fa_access_token");
      var page =1;
      getfreeagentcontect(page,access_token)
    }
  })
},
'click #cc_contacts' : function(event, template){
  if(!is_cc_account_active()){
    $('#error-message').html("Setup your Accounts before importing any contacts");
    $('#main-error-box').css("display","block");
    setTimeout(function () {
        $('#main-error-box').css("display","none");
        Router.go('accountsetup');
    },2000);

    return;
  }
  IonLoading.show();
    var auth_code =   localStorage.getItem("cc_access_token");
    var url = "https://api.constantcontact.com/v2/contacts";
    var params = "?status=ALL&limit=50";
    getCCContact(auth_code,url+params)
},
'click #sync_contacts' :  function(event, template){
  if(!is_cc_account_active() && !is_fa_ccount_active()){
    $('#error-message').html("Setup your Accounts before importing any contacts");
    $('#main-error-box').css("display","block");
    setTimeout(function () {
        $('#main-error-box').css("display","none");
        Router.go('accountsetup');
    },2000);
    return;
  }
  $('#processingmodelwindow').modal('show');
  var auth_code =   localStorage.getItem("cc_access_token");
  Meteor.call("sync_contact",auth_code,function(error, result){
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
  $('#processingmodelwindow').modal('show');
  Meteor.call("delete_contact",Meteor.userId(),function(error, result){
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
