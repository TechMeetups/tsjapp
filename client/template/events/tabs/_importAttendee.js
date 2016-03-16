Template._importAttendee.events({
  'click #btn_import_file': function(event, template)
        {
            event.preventDefault();
            var f = document.getElementById('import_file').files[0];
            console.log("read file");
             readFile(f, function(content) {
               Meteor.call('upload_attandee',content);
             });
          //  template.modal.hide();
            //Router.go('events');
    }
});
