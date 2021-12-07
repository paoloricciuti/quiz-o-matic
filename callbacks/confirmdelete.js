const db = require('../models');
const utils = require('../utils');

const exec = async (update) => {
    const checkAdmin = await utils.checkAdmin(update);
    if (!checkAdmin) {
        return;
    }
    const { Poll, Answer } = db;
    try {
        await Poll.destroy({
            where: {
                chat_id: update.message.chat.id,
            }
        });
        await Answer.destroy({
            where: {
                chat_id: update.message.chat.id,
            }
        });
        utils.sendMessage({
            chat_id: update.message.chat.id,
            text: "And PUFF 💨! All your data is gone!",
        });
    } catch (e) {
        console.log(e);
        utils.sendMessage({
            chat_id: update.message.chat.id,
            text: "There was a problem deleting the chat history. Try to contact my creator!"
        });
    }
};

module.exports = {
    exec
};