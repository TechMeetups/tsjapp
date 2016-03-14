Template._jobNew.events({
  'submit form': function(event, template)
        {
            event.preventDefault();
            var title = template.find('#title').value;
            var desc = template.find('#desc').value;
            var city = template.find('#city').value;
            company_id = Router.current().params._company_id
            data = {title:title,desc:desc,city:city,created_at:new Date(),company_id:company_id}
            job_manager.add(data)
            IonModal.close();
          //  template.modal.hide();
            //Router.go('events');
  }
});
Template._jobNew.helpers({
  company_id: function(){
    return Router.current().params._company_id;
  }
  });
