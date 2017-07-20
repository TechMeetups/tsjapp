Template.matchJob.onRendered(function()
{
    $('#foundVal').text(0) ; 
    $('#showFound').fadeOut() ; 
});

Template.matchJob.events(
{
  'click #match_job': function(event, template)
  {
      event.preventDefault();

      $('#foundVal').text(0) ; 
      $('#showFound').fadeOut() ; 

      var title = $('#title').val() ; 
      var profession = $('#profession').val() ; 
      var experience = $('#experience').val() ; 
      var skill = $('#skill').val() ; 
      var city = $('#city').val() ; 
      var showemail = $('#showemail').is(':checked') ; 
      var showlinkedin = $('#showlinkedin').is(':checked') ; 

      var usr = Meteor.user() ;

       IonLoading.show(
      {
        customTemplate: "Matching candidates ...",
      });

        Meteor.call("email_matched_job", usr, title, profession, experience, skill, city , showemail, showlinkedin, function(error, res)
        {
          if(error)
          {
            console.log("error : "+ error)
          }

          IonLoading.hide() ; 

          $('#foundVal').text(res ) ; 
          $('#showFound').fadeIn() ; 

          return res ; 
        });

       
  }
}) ; 