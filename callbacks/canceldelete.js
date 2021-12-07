const db = require('../models');
const utils = require('../utils');

const exec = async (update) => {
    const checkAdmin = await utils.checkAdmin(update);
    if (!checkAdmin) {
        return;
    }
    utils.deleteMessage(update.message.message_id, update.message.chat.id);
};

module.exports = {
    exec
};