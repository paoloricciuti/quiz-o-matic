const utils = require('../utils');

const exec = (update) => {
    const message = {
        chat_id: update.message.chat.id,
        text: "To use me add me in a group, set the locale and the hours to receive daily quiz!"
    };
    utils.sendMessage(message);
};

module.exports = {
    exec,
};