const db = require('../models');
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
    const { message: { chat: { id: chatId }, from: { id: userId } } } = update;
    if (chatId === userId) {
        const message = {
            chat_id: update.message.chat.id,
            text: "This command is only for groups.",
        };
        utils.sendMessage(message);
        return;
    }
    const [, locale] = update.message.text.split(" ");
    if (isNaN(+locale)) {
        const message = {
            chat_id: update.message.chat.id,
            text: "The locale should be a positive or negative number and should be the difference between your timezone and UTC.",
        };
        utils.sendMessage(message);
        return;
    }
    const { Chat } = db;
    const chat = await Chat.findOne({
        where: {
            id: update.message.chat.id.toString(),
        }
    });
    if (!chat) {
        const message = {
            chat_id: update.message.chat.id,
            text: "This chat appears to not be registered, try again later.",
        };
        utils.sendMessage(message);
        return;
    }
    chat.locale = +locale;
    try {
        await chat.save();
    } catch (e) {
        console.error(e);
    }
    const message = {
        chat_id: update.message.chat.id,
        text: "The new Locale has been updated."
    };
    utils.sendMessage(message);
};

module.exports = {
    exec
};