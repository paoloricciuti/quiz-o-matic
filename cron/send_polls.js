const utils = require('../utils');
const fetch = require('node-fetch');
const db = require('../models');
const { Op, QueryTypes } = require('sequelize');
const { sequelize } = require('../models');

const base64ToString = (base64) => {
    return Buffer.from(base64, "base64").toString("ascii");
};

const exec = async () => {
    const { Chat, Poll } = db;
    const hour = new Date().getHours() - 2;
    const registeredChats = await sequelize.query('SELECT "id", "chat", "active", "hours", "locale", "created_at" AS "createdAt", "updated_at" AS "updatedAt" FROM "chats" AS "Chat" WHERE "Chat"."active" = true AND "Chat"."hours" @> ARRAY[$1+"Chat"."locale"]::INTEGER[]', {
        bind: [hour],
        type: QueryTypes.SELECT,
        model: Chat,
        mapToModel: true,
    });
    const res = await fetch(`https://opentdb.com/api.php?amount=${registeredChats.length}&type=multiple&encode=base64`);
    if (res.ok) {
        const { results: questions } = await res.json();
        let i = 0;
        for (let chat of registeredChats) {
            const data = questions[i];
            const options = [...data.incorrect_answers, data.correct_answer].sort(() => Math.random() - .5);
            const sentPoll = await utils.sendPoll({
                chat_id: chat.id,
                question: base64ToString(data.question),
                options: options.map(base64ToString),
                is_anonymous: false,
                type: "quiz",
                correct_option_id: options.indexOf(data.correct_answer),
                open_period: 600,
            });
            console.log(sentPoll);
            try {
                Poll.create({
                    id: sentPoll.result.poll.id,
                    chat_id: sentPoll.result.chat.id,
                    correct_option: sentPoll.result.poll.correct_option_id,
                });
            } catch (e) { console.error(e); }
            i = (i + 1) % questions.length;
        }
    }
};

module.exports = {
    exec,
};