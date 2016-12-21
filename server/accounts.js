// first, remove configuration entry in case service is already configured
ServiceConfiguration.configurations.remove({
    service: 'facebook'
});
ServiceConfiguration.configurations.insert({
  service: "facebook",
  appId: "1761592474164318",
  secret: "a15a529aed26da1ee0408f9df23d4f4e"
});

// // first, remove configuration entry in case service is already configured
ServiceConfiguration.configurations.remove({
    service: 'twitter'
});
ServiceConfiguration.configurations.insert({
  service: "twitter",
  consumerKey: "dWUCGMAjbPc2OXhumTz3Itkb7",
  secret: "MX41AhXOk97EiIfzTuWlz5ME5cQWyQ5DpieTcnsxSGFxP8l1fz"
});

ServiceConfiguration.configurations.remove({
    service: 'google'
});
ServiceConfiguration.configurations.insert({
  service: "google",
  clientId: "67018370884-u5mrogskri3evrdlug59esefqpblvhai.apps.googleusercontent.com",
  secret: "VTfOveAtwxwn1HHsr9n4sQxV"
});
