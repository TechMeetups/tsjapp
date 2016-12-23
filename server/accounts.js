// first, remove configuration entry in case service is already configured
ServiceConfiguration.configurations.remove({
    service: 'facebook'
});
ServiceConfiguration.configurations.insert({
  service: "facebook",
  appId: "1338623249501281",
  secret: "a578d0b8edf5dabc7bfc8cce63539d23"
});

// // first, remove configuration entry in case service is already configured
ServiceConfiguration.configurations.remove({
    service: 'twitter'
});
ServiceConfiguration.configurations.insert({
  service: "twitter",
  consumerKey: "7dMF3uSQ8TGfFiQAI6oEfU7qf",
  secret: "qNH7bkAiYjiepEyFBEbsjic5DeWjI7iKVN4ukOns1xm0FM7owq"
});

ServiceConfiguration.configurations.remove({
    service: 'google'
});
ServiceConfiguration.configurations.insert({
  service: "google",
  clientId: "890456960906-4t0ptqo2ekam8mcao7rnmi7gach4vfcg.apps.googleusercontent.com",
  secret: "t4Zxmla31GrivP6T6ZTo8uEI"
});
