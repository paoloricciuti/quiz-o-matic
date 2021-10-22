const express = require('express');
const http = require('http');
const utils = require('./utils');
require('dotenv').config();
const app = express();
app.use(express.json());
const server = http.createServer(app);
const db = require('./models');

const answerMiddleware = async (req, res) => {
    const { body: update } = req;
    //if theres a new_chat_memberproperty and one of the member is the bot than we need to add the chat
    //to the db
    if (update.my_chat_member) {
        console.log(`Adding to chat ${update.my_chat_member.chat.title}`);
        const { Chat } = db;
        try {
            await Chat.create({
                id: update.my_chat_member.chat.id,
                chat: update.my_chat_member.chat.title,
                active: true,
            });
        } catch (e) {
            console.error(e);
        }
        res.sendStatus(200);
        return;
    }
    //if there's a poll answer i add the new answer
    if (update.poll_answer) {
        const { Answer, User, Poll } = db;
        const { poll_answer } = update;
        console.log(poll_answer);
        try {
            User.upsert({
                id: poll_answer.user.id,
                username: poll_answer.user.username ? poll_answer.user.username : `${poll_answer.user.first_name}${poll_answer.user.last_name ? ` ${$poll_answer.user.last_name}` : ""}`
            });
        } catch (e) { console.error(e); }
        try {
            const poll = await Poll.findOne({
                where: {
                    id: poll_answer.poll_id,
                }
            });
            Answer.create({
                poll_id: poll_answer.poll_id,
                user_id: poll_answer.user.id,
                chat_id: poll.chat_id,
                answer: poll_answer.option_ids[0],
                correct: poll_answer.option_ids[0] === poll.correct_option,
                time_to_answer: Math.floor((new Date() - poll.createdAt) / 1000),
            });
        } catch (e) { console.error(e); }
        res.sendStatus(200);
        return;
    }
    if (update.callback_query) {
        const [callback, ...callbackArgs] = update.callback_query.data.split(" ");
        try {
            const command = require(`./callbacks/${callback}`);
            command.exec(update, callbackArgs);
        } catch (e) { }
        res.sendStatus(200);
        return;
    }
    const commandString = utils.getCommand(update);
    if (commandString !== "") {
        console.log("EXECUTING COMMAND ", commandString);
        try {
            const command = require(`./commands${commandString}`);
            command.exec(update);
        } catch (e) {
            console.error(e);
        }
    }
    res.sendStatus(200);
};

//dev only
// app.get(`/${process.env.BOT_TOKEN}`, async (req, res) => {
//     const updates = (await utils.getUpdates().then(res => res.json())).result;
//     updates.forEach(update => answerMiddleware({
//         body: update,
//     }, {
//         sendStatus: (status) => { console.log(status) }
//     }));
//     res.json(updates);
// })

app.post(`/${process.env.BOT_TOKEN}`, answerMiddleware);

app.get('/send-polls', async (req, res) => {
    try {
        const command = require(`./cron/send_polls`);
        const chats = await command.exec();
        return res.json(chats);
    } catch (e) { console.error(e); }
    res.sendStatus(200);
});

server.listen(process.env.PORT || 3333, () => {
    console.log("Server up and running...");
});