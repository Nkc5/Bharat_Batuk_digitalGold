const Log = require('../../models/log.models.js');


class logAction {

  static async log(action, oldDocument, newDocument) {

    try {
      await Log.create({
        action,
        oldData: oldDocument,
        newData: newDocument,
      });

      console.log(`Logged ${action} action`);
    } catch (error) {
      console.error('Error logging action:', error);
    }
  }

}


module.exports = logAction;