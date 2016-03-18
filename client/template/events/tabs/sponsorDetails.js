Template.sponsorDetails.created = function () {
  this.autorun(function () {
    this.subscription = sponsor_manager.default_subscribe();
    this.subscription = Meteor.subscribe('event', Router.current().params._id);
  }.bind(this));
};
Template.sponsorDetails.rendered = function () {
  this.autorun(function () {
    if (!this.subscription.ready()) {
      IonLoading.show();
    } else {
      IonLoading.hide();
    }
  }.bind(this));
};
Template.sponsorDetails.helpers({
  format_date : function(date){
    return sponsor_manager.format_data(date)
  },
 sponsor_list: function(){
    return sponsor_manager.getList();
 },
 description_list: function(desc){
   if(desc){
     return desc.split(",");
   }
 },
 sponsor : function(sponsor){
   if(sponsor.toUpperCase() =="Gold".toUpperCase() || sponsor.toUpperCase() == "Silver".toUpperCase()){
     return sponsor+" Sponsor";
   }else {
     return sponsor;
   }
 }
});
Template.sponsorDetails.events(
{
  'click #sponsor_ticket': function (event, template)
  {
    event_id = Router.current().params._id
    user_id = Meteor.userId()
    var id = Router.current().params._sponsor_id;
    var sponsor = Sponsor.findOne({_id:id});
    event = Events.findOne({_id:event_id});
    data = {
      user_id : user_id,
      pic : sponsor.pic.length > 1 ? sponsor.pic : " ",
      item_type:"sponsor",
      desc:sponsor.name+" "+event.name,
      amount:sponsor.amount,
      paid:"unpaid",
      item_id:sponsor._id,
      created_at:new Date()
    }
    console.log(data)
    checkout_manager.checkout_item(data)

  }
});
