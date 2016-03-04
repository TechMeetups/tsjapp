Template.dashboard.created = function () {
  Session.set('search_terms','')
  Session.set("eventLimit",10)
  this.autorun(function () {
    this.subscription = event_manager.default_subscribe();
  }.bind(this));
};

Template.dashboard.rendered = function () {
  this.autorun(function () {
    if (!this.subscription.ready()) {
      IonLoading.show();
    } else {
      IonLoading.hide();
    }
  }.bind(this));
};

Template.dashboard.helpers({
  events: function () {
    return event_manager.getList();
  },
  format_date : function(date){
    return event_manager.format_data(date)
  },
  moreTasks  : function()
    {
      return !(event_manager.getCount() < Session.get("eventLimit"));
    },
});
Template.dashboard.events({
  'keyup #search': function (event, template) {
    search_terms = $(event.currentTarget).val();
    //Session.get('search_terms')
    event_manager.search(search_terms)
  }
});
