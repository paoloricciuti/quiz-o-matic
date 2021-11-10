const db = require('../models');
const utils = require('../utils');

const exec = async (update, [stringHour]) => {
    const hour = +stringHour;
    const checkAdmin = await utils.checkAdmin(update);
    if (!checkAdmin) {
        return;
    }
    const { Chat } = db;
    const toModify = await Chat.findOne({
        where: {
            id: update.callback_query.message.chat.id.toString(),
        }
    });
    if (!toModify) {
        return;
    }
    if (toModify.hours.includes(hour)) {
        toModify.hours = toModify.hours.filter(elem => elem !== hour);
    } else {
        toModify.hours = [...toModify.hours, hour];
    }
    try {
        await toModify.save();
    } catch (e) {
        console.error(e);
    }
    const inline_keyboard = utils.getHoursInlineKeyboard(toModify);
    utils.editMessageReplyMarkup(update.callback_query.message.chat.id, update.callback_query.message.message_id, inline_keyboard);
};

module.exports = {
    exec
};