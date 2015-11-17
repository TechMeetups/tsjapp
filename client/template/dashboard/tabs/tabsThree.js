
Template.tabsThree.helpers({
  create: function(){

  },
  rendered: function(){

  },
  destroyed: function(){

  },
  cc_send_report_helper: function(){
    var id = window.location.pathname.split("/")[3];
    var data = contacts.findOne({_id:id});
    return cc_send_report.find({user_id:Meteor.userId(),email_address:data.email})
  },
  campaign: function(id){
    return cc_campaign.findOne({id:id}).name;
  },
  campaigns : function(){
    return cc_campaign.find({user_id:Meteor.userId()})
  }
});

Template.tabsThree.events({
  "click #foo": function(event, template){

  }
});
