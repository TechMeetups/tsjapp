
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
  },
  invoices : function(){
    var id = window.location.pathname.split("/")[3];
    var data = contacts.findOne({_id:id});
    if(data.provider != "freeagent"){
      data = contacts.findOne({user_id:Meteor.userId(),provider:"freeagent",email:data.email});
    }
    if(data){
      return fa_invoices.find({user_id:Meteor.userId(),contact:data.url})
    }else{
      return [];
    }

  }
});

Template.tabsTwo.events({
  "click #run_report": function(event, template){

  }
});
