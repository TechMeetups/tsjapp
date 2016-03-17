Template.sponsorTab.created = function () {

  this.autorun(function () {
    this.subscription = sponsor_manager.default_subscribe();
  }.bind(this));
};
Template.sponsorTab.rendered = function () {
  this.autorun(function () {
    if (!this.subscription.ready()) {
      IonLoading.show();
    } else {
      IonLoading.hide();
    }
  }.bind(this));
};
Template.sponsorTab.helpers({
  format_date : function(date){
    return sponsor_manager.format_data(date)
  },
  build_path : function(_id){
    return "/tabs/sponsor/"+Router.current().params._id+"/"+_id;
 },
 sponsor_list: function(){
    return sponsor_manager.getList()
 }
});
