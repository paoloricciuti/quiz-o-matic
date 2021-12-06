const utils = require('../utils');

const exec = (update) => {
    const message = {
        chat_id: update.message.chat.id,
        text: "Hey thanks for helping me mantain this bot, any help is really appreciated!",
        reply_markup: {
            inline_keyboard: [[{
                text: "Buy me a coffee! ☕",
                url: "https://buymeacoffee.com/pablopang",
            }]]
        },
    };
    utils.sendMessage(message);
};

module.exports = {
    exec,
    description: "Support the maintenance of this bot",
};