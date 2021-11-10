const db = require('../models');
const utils = require('../utils');

const exec = async (update) => {
    console.log(utils.checkAdmin(update));
    if (!utils.checkAdmin(update)) {
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
    const { Chat } = db;
    const savedChat = await Chat.findOne({
        where: {
            id: update.message.chat.id.toString(),
        }
    });
    if (!savedChat) {
        const message = {
            chat_id: update.message.chat.id,
            text: "This chat appears to not be registered, try again later.",
        };
        utils.sendMessage(message);
        return;
    }
    let inline_keyboard = utils.getHoursInlineKeyboard(savedChat);
    const hour = new Date().getHours();
    const message = {
        chat_id: update.message.chat.id,
        text: "Set the hours you want to receive a quiz.\n\nN.b. The default locale is UTC you can set your locale with the command\n\n```\n\/setlocale [yourlocale]```\n\nwhere yourlocale is the difference between UTC and your timezone (UTC is currently at " + (hour) + ", subtract your hours to this to find your number). With your current locale in your timezone should be " + ((hour + savedChat.locale) < 0 ? (24 + (hour + savedChat.locale)) : (hour + savedChat.locale) % 24) + ". If this does not match with your current time consider changing the locale.",
        reply_markup: { inline_keyboard },
        parse_mode: "Markdown",
    };
    utils.sendMessage(message);
};

module.exports = {
    exec
};