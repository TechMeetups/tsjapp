Template._jobNew.events({
  'submit form': function(event, template)
        {
            event.preventDefault();
            var title = template.find('#title').value;
            var profession = template.find('#profession').value;
            var skill = template.find('#skill').value;
            var experience = template.find('#experience').value;
            var desc = template.find('#desc').value;
            var pic = template.find('#pic').value;
            var city = template.find('#city').value;
            company_id = Router.current().params._company_id ;
            data = {title:title,profession:profession,skill:skill,experience:experience,desc:desc,
                    city:city,pic:pic,created_at:new Date(),company_id:company_id}

            job_manager.add(data)
          
          //  template.modal.hide();
            //Router.go('events');
  }
});
Template._jobNew.helpers({
  company_id: function(){
    return Router.current().params._company_id;
  }
  });
