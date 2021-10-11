const db = require('../models');
const utils = require('../utils');

const exec = async (update) => {
    const { message: { chat: { id: chatId }, from: { id: userId } } } = update;
    if (chatId === userId) {
        const message = {
            chat_id: update.message.chat.id,
            text: "This command is only for groups.",
        }
        utils.sendMessage(message)
        return;
    }
    const { Answer, User } = db;
    const answers = await Answer.findAll({
        where: {
            chat_id: update.message.chat.id.toString(),
        },
        include: {
            model: User,
        },
    });
    const groupByUsers = answers.reduce((acc, current) => {
        if (!acc[current.User.username]) {
            acc[current.User.username] = [];
        }
        acc[current.User.username].push(current);
        return acc;
    }, {});
    const leaderboardEntries = Object.entries(groupByUsers);
    leaderboardEntries.sort(([, answersA], [, answersB]) => {
        let correctA = answersA.filter(elem => elem.correct).length / answersA.length;
        let correctB = answersB.filter(elem => elem.correct).length / answersB.length;
        return correctA - correctB;
    });
    let text = `🏆🏆<b>OFFICIAL PERCENTAGE LEADERBOARD FOR ${update.message.chat.title ? update.message.chat.title.toUpperCase() : "THIS CHAT"}</b>🏆🏆\n\n`;
    let i = 1;
    for (let [user, answers] of leaderboardEntries) {
        text += `${i}. ${user} (${Math.round((answers.filter(elem => elem.correct).length / answers.length) * 100)}%)\n`;
    }
    const message = {
        chat_id: update.message.chat.id,
        text,
        parse_mode: "HTML",
    }
    utils.sendMessage(message)
};

module.exports = {
    exec
}