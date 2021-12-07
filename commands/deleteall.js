const utils = require('../utils');

const exec = async (update) => {
    const checkAdmin = await utils.checkAdmin(update);
    if (!checkAdmin) {
        const message = {
            chat_id: update.message.chat.id,
            text: "This command can only be used by admins.",
        };
        utils.sendMessage(message);
        return;
    }
    const message = {
        chat_id: update.message.chat.id,
        text: "Are you sure you want to permanently delete all this chat history? This cannot be undone.",
        reply_markup: {
            inline_keyboard: [[{
                text: "Do it! 😢",
                callback_data: "confirmdelete",
            }, {
                text: "Nope, it was a mistake! 😊",
                callback_data: "canceldelete",
            }]]
        },
    };
    utils.sendMessage(message);
};

module.exports = {
    exec,
    scopes: [utils.SCOPES_ENUM.ALL_CHAT_ADMINISTRATORS],
    description: "Delete all chat data",
};