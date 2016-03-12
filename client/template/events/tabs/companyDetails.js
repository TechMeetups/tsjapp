Template.companyDetails.created = function () {
  this.autorun(function () {
    this.subscription = Meteor.subscribe('company_details',Router.current().params._id,Router.current().params._company_id);
  }.bind(this));
};
Template.companyDetails.rendered = function () {
  this.autorun(function () {
    if (!this.subscription.ready()) {
      IonLoading.show();
    } else {
      IonLoading.hide();
    }
  }.bind(this));
};
Template.companyDetails.helpers({
  format_date : function(date){
    return company_manager.format_data(date)
  }
});
