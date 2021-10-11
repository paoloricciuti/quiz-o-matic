const utils = require('../utils');

const exec = (update) => {
    const message = {
        chat_id: update.message.chat.id,
        text: "This is the QuizOMaticBot...add me in a group to receive daily quiz!"
    }
    utils.sendMessage(message)
};

module.exports = {
    exec
}