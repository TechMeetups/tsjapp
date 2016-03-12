Template._companyNew.events({
  'submit form': function(event, template)
        {
            event.preventDefault();
            var name = template.find('#name').value;
            var pic = template.find('#pic').value;
            var logo = template.find('#logo').value;
            var desc = template.find('#desc').value;
            var city = template.find('#city').value;
            data = {name:name,logo:logo,pic:pic,desc:desc,city:city,created_at:new Date()}
            event_id = Router.current().params._id
            console.log(data)
            console.log(event_id)
            company_manager.add(data,event_id)
            IonModal.close();
          //  template.modal.hide();
            //Router.go('events');
  }
});
