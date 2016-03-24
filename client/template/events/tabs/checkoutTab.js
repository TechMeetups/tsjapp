Template.checkoutTab.created = function () {
  this.autorun(function () {
    this.subscription = checkout_manager.default_subscribe();
  }.bind(this));
};
Template.checkoutTab.rendered = function () {
  this.autorun(function () {
    if (!this.subscription.ready()) {
      IonLoading.show();
    } else {
      IonLoading.hide();
    }
  }.bind(this));
};
Template.checkoutTab.helpers({
  format_date : function(date){
    return checkout_manager.format_data(date)
  },
 item_list: function(){
    return checkout_manager.getList();
 },
 description_list: function(desc){
   if(desc){
     return desc.split(",");
   }
 },
 disabled_btn : function(){
   if(checkout_manager.getList().count() > 0){
     return true
   }else{
     return false;
   }
 },
 total_amount: function(){
   return checkout_manager.getTotal();
 },
 breaklines:function(text) {
  text = text.replace(/(\r\n|\n|\r)/gm, '<br/>');
  return text;
}
});


Template.checkoutTab.events(
{
  'click .remove_item' : function(event, template)
  {
    var item_id = $(event.currentTarget).attr('data');
    checkout_manager.remove_checkout_item(item_id)
  }, 
  'click #pay_now' : function(event, template)
  {
    var item_id = $(event.currentTarget).attr('data');
    checkout_manager.pay_now() ; 
  }
});
