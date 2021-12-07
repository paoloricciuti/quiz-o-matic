const db = require('../models');
const utils = require('../utils');

const exec = async (update) => {
    const checkAdmin = await utils.checkAdmin(update);
    if (!checkAdmin) {
        return;
    }
    utils.deleteMessage(update.callback_query.message.message_id, update.callback_query.message.chat.id);
};

module.exports = {
    exec
};