Template._importAttendee.events({
  'click #btn_import_file': function(event, template)
        {
            event.preventDefault();
            var f = document.getElementById('import_file').files[0];
            console.log("read file");
            IonLoading.show();
             readFile(f, function(content) {
               Meteor.call('upload_attandee',content,function(error, result){
                 if(error){
                   console.log("error : "+ error)
                   IonLoading.hide();
                   IonModal.close();
                 }
                 if(result){
                   IonLoading.hide();
                   IonModal.close();
                   console.log(result);
                 }
               });
             });

          //  template.modal.hide();
            //Router.go('events');
    }
});
