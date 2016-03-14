Template.jobDetails.created = function () {
  Session.set("job_limit",JOB_INCREMENT)
  this.autorun(function () {
    this.subscription = Meteor.subscribe('job_details',Router.current().params._company_id,Router.current().params._job_id);

  }.bind(this));
};
Template.jobDetails.rendered = function () {
  this.autorun(function () {
    if (!this.subscription.ready()) {
      IonLoading.show();
    } else {
      IonLoading.hide();
    }
  }.bind(this));
};
Template.jobDetails.helpers({
  format_date : function(date){
    return company_manager.format_data(date)
  }
});
