Template.tabsFour.helpers({
  create: function(){

  },
  rendered: function(){

  },
  destroyed: function(){

  },
  cc_clicked_report: function(){
    var id = window.location.pathname.split("/")[3];
    var data = contacts.findOne({_id:id});
    return cc_clicked.find({user_id:Meteor.userId(),email_address:data.email})
  },
  campaign: function(id){
    return cc_campaign.findOne({id:id}).name;
  }
});

Template.tabsFour.events({
  "click #foo": function(event, template){

  }
});
