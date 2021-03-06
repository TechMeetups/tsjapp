Template.companiesTab.helpers(
{
  build_path: function(_id){
    return "/tabs/company/"+Router.current().params._id+"/"+_id;
  },
  format_date: function(date){
    return attendee_manager.format_data(date);
  },
  companies: function(){
    return company_manager.getList()
  },
  moreTasks:function(){
    {
      return !(company_manager.getCount() < Session.get("company_limit"));
    }
  }
});

Template.companiesTab.events(
{
  "click #showMoreResults": function(event, template)
  {
    Session.set("company_limit",Session.get("company_limit") + EVENT_INCREMENT);
  },
  'keyup #search': function (event, template)
  {
    search_terms = $(event.currentTarget).val();
    //Session.get('search_terms')
    company_manager.search(search_terms)
  },
  "click #event_match": function(event, template)
  {
      match_manager.email_matched(null,Router.current().params._id,null,null) ;
  },
  "click .companyItem": function(event, template)
  {
      animateThis($(event.currentTarget),'tada') ;
  },
  "click .delete_company": function(event, template){
     var company_id = $(event.currentTarget).attr("data-id");
     console.log(company_id);
     company_manager.delete_event_company(company_id);     
  }

});

EVENT_INCREMENT = 10;
Template.companiesTab.created = function ()
{
  Session.set('company_terms','')
  Session.set("company_limit",EVENT_INCREMENT)
  this.autorun(function () {
    this.subscription = company_manager.default_subscribe(Router.current().params._id);
  }.bind(this));
};
