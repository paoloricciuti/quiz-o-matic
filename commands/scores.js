const db = require('../models');
const utils = require('../utils');

const exec = async (update) => {
    const { message: { chat: { id: chatId }, from: { id: userId } } } = update;
    if (chatId === userId) {
        const message = {
            chat_id: update.message.chat.id,
            text: "This command is only for groups.",
        };
        utils.sendMessage(message);
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
        const correctAnswersA = answersA.filter(elem => elem.correct).length;
        const correctAnswersB = answersB.filter(elem => elem.correct).length;
        let correctA = correctAnswersA * (correctAnswersA / answersA.length);
        let correctB = correctAnswersB * (correctAnswersB / answersB.length);
        return correctB - correctA;
    });
    let text = `🏆🏆<b>OFFICIAL SCORE LEADERBOARD FOR ${update.message.chat.title ? update.message.chat.title.toUpperCase() : "THIS CHAT"}</b>🏆🏆\n\n`;
    let i = 1;
    for (let [user, answers] of leaderboardEntries) {
        const correctAnswers = answers.filter(elem => elem.correct).length;
        text += `${i}. ${user} (${(correctAnswers * (correctAnswers / answers.length)).toFixed(2)})\n`;
        i++;
    }
    const message = {
        chat_id: update.message.chat.id,
        text,
        parse_mode: "HTML",
    };
    utils.sendMessage(message);
};

module.exports = {
    exec,
    scopes: [utils.SCOPES_ENUM.ALL_CHAT_ADMINISTRATORS, utils.SCOPES_ENUM.ALL_GROUP_CHATS],
    description: "Send the leaderboard for the chat ordered by highest score",
};