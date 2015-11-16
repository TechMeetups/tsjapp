
Template.tabsTwo.helpers({
  create: function(){

  },
  rendered: function(){

  },
  destroyed: function(){

  },cc_opened_report: function(){
    var id = window.location.pathname.split("/")[3];
    var data = contacts.findOne({_id:id});
    return cc_opened_report.find({user_id:Meteor.userId(),email_address:data.email})
  },
  campaign: function(id){
    return cc_campaign.findOne({id:id}).name;
  }
});

Template.tabsTwo.events({
  "click #run_report": function(event, template){
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
      }
    });
  }
});
