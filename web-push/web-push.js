const webpush = require("web-push")


webpush.setVapidDetails(
    'mailto:johnny54wm@gmail.com',

    process.env.PUBLIC_VAPID_KEY,
    process.env.PRIVATE_VALID_KEY
  );

  module.exports = webpush