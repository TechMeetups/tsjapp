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
 }

});
