EVENT_INCREMENT = 10;
Template.events.created = function ()
{
  Session.set('search_terms','')
  Session.set("eventLimit",EVENT_INCREMENT)
  this.autorun(function () {
    this.subscription = event_manager.default_subscribe();
  }.bind(this));
};

Template.events.rendered = function ()
{
  this.autorun(function ()
  {
    if (!this.subscription.ready())
    {
      IonLoading.show();
    }
    else
    {
      IonLoading.hide();
    }
  }.bind(this));
};

Template.events.helpers(
{
  events: function ()
  {
    return event_manager.getList();
  },
  format_date : function(date)
  {
    return event_manager.format_data(date)
  },
  moreTasks  : function()
    {
      return !(event_manager.getCount() < Session.get("eventLimit"));
    },
    helpShowEventText : function()
    {
      if( Session.get("showPastEvents") )
        return 'Only show upcoming events'
      else   
        return 'Show past events'
    }
});

Template.events.events(
{
  'keyup #search': function (event, template)
  {
      console.log("search") ; 
    search_terms = $(event.currentTarget).val();
    //Session.get('search_terms')
    event_manager.search(search_terms)
  },
  'click #showMoreResults' : function(event, template)
  {

    Session.set("eventLimit",Session.get("eventLimit") + EVENT_INCREMENT);

  },
  'click #allmatch' : function(event, template)
  {
      console.log("allmatch") ; 
      match_manager.email_matched(null,null,null,null) ; 
  },
  'click #pastEventBtn' : function(event, template)
  {
    console.log("showPastEvents") ; 
   if( Session.get("showPastEvents") )
        Session.set("showPastEvents",false );
    else   
      Session.set("showPastEvents",true );
  },
  
});
