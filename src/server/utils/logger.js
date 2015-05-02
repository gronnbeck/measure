var logger = {
  message: function(message) {
    console.log(message);
  },
  debug: function(level, message) {
    if (level != null && message == null) {
      message = level;
      level = 'Unknown';
    }
    console.log(message);
  }
};

module.exports = logger;
