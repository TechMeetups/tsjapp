Meteor.startup(function () {
    smtp = {
        username: 'admin@techmeetups.com',   // eg: server@gentlenode.com
        password: 'admin123',   // eg: 3eeP1gtizk5eziohfervU
        server:   'send.one.com',  // eg: mail.gandi.net
        port: 587
    }

    process.env.MAIL_URL = 'smtp://' + encodeURIComponent(smtp.username) + ':' + encodeURIComponent(smtp.password) + '@' + encodeURIComponent(smtp.server) + ':' + smtp.port;
});
