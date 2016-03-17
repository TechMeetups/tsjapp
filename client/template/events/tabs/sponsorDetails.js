Template.sponsorDetails.created = function () {
  this.autorun(function () {
    this.subscription = sponsor_manager.default_subscribe();
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
 }
});
