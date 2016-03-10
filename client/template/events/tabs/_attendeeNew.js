AutoForm.hooks({
  'attendees-new-form': {
    onSuccess: function (operation, result, template) {
      IonModal.close();
      Router.go('events.show', {_id: result});
    },

    onError: function(operation, error, template) {
      alert(error);
    }
  }
});
Template._attendeeNew.events({
  'submit form': function(event, template)
        {
            event.preventDefault();
            var name = template.find('#name').value;
            var pic = template.find('#pic').value;
            var email = template.find('#email').value;
            var skill = template.find('#skill').value;
            var lookingfor = template.find('#lookingfor').value;
            var experience = template.find('#experience').value;
            data = {name:name,email:email,pic:pic,skill:skill,lookingfor:lookingfor,experience:experience}
            event_id = Router.current().params._id
            console.log(data)
            console.log(event_id)
            attendee_manager.add(data,event_id)
            IonModal.close();
          //  template.modal.hide();
            //Router.go('events');
  }
});
