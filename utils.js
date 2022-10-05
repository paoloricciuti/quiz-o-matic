const fetch = require('node-fetch');
require('dotenv').config();

const BASE_URL = `https://api.telegram.org/bot${process.env.BOT_TOKEN}`;

const SCOPES_ENUM = {
    DEFAULT: "default",
    ALL_PRIVATE_CHATS: "all_private_chats",
    ALL_GROUP_CHATS: "all_group_chats",
    ALL_CHAT_ADMINISTRATORS: "all_chat_administrators",
    CHAT: "chat",
    CHAT_ADMINISTRATORS: "chat_administrators",
    CHAT_MEMBER: "chat_member",
};

const getUpdates = () => {
    return fetch(`${BASE_URL}/getUpdates`);
};

const setCommands = async (commandMap) => {
    await fetch(`${BASE_URL}/deleteMyCommands`);
    commandMap.forEach((commands, scope) => {
        fetch(`${BASE_URL}/setMyCommands`, {
            method: "POST",
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify({
                commands,
                scope: {
                    type: scope,
                },
            })
        }).then(res => res.json()).then(data => console.log(`Setting commands ${JSON.stringify(commands.map(elem => elem.command))} with scope ${scope}`, data));
    });
};

const getCommand = (update) => {
    if (!update.message) return "";
    if (!update.message.entities) return "";
    const commandEntity = update.message.entities.find(entity => entity.type == "bot_command");
    if (!commandEntity) return "";
    if (commandEntity.offset === 0) {
        let command = update.message.text.substring(0, commandEntity.length);
        command = command.replace(process.env.BOT_NAME, "");
        return command;
    }
    return "";
};

const deleteMessage = (message_id, chat_id) => {
    return fetch(`${BASE_URL}/deleteMessage`, {
        method: "POST",
        headers: {
            "content-type": "application/json",
        },
        body: JSON.stringify({
            chat_id,
            message_id,
        }),
    }).then(res => res.json());
};

const sendMessage = (message) => {
    return fetch(`${BASE_URL}/sendMessage`, {
        method: "POST",
        headers: {
            "content-type": "application/json",
        },
        body: JSON.stringify(message),
    }).then(res => res.json());
};

const editMessageReplyMarkup = (chat_id, message_id, inline_keyboard) => {
    return fetch(`${BASE_URL}/editMessageReplyMarkup`, {
        method: "POST",
        headers: {
            "content-type": "application/json",
        },
        body: JSON.stringify({
            chat_id,
            message_id,
            reply_markup: { inline_keyboard },
        }),
    }).then(res => res.json());
};

const sendPoll = (poll) => {
    return fetch(`${BASE_URL}/sendPoll`, {
        method: "POST",
        headers: {
            "content-type": "application/json",
        },
        body: JSON.stringify(poll),
    }).then(res => res.json());
};

const checkAdmin = async (update) => {
    let toDestructure = update;
    if (update.callback_query) {
        toDestructure = update.callback_query;
    }
    let { message: { chat: { id: chatId }, from: { id: userId } } } = toDestructure;
    if (update.callback_query) {
        userId = update.callback_query.from.id;
    }
    if (chatId == userId) {
        return true;
    }
    const response = await fetch(`${BASE_URL}/getChatMember?chat_id=${chatId}&user_id=${userId}`);
    const result = await response.json();
    return ["administrator", "creator"].includes(result.result.status);
};

const hoursStringToArray = (hoursString) => {
    return (hoursString.match(/\$(\d)+\$/g) ?? []).map(elem => +elem.replace(/\$/g, ""));
};

const hoursArrayToString = (hoursArray) => {
    return hoursArray?.map(elem => `$${elem}$`).join("") ?? "";
};

const getHoursInlineKeyboard = (chat) => {
    let inline_keyboard = [];
    const hours = hoursStringToArray(chat.hours);
    const per_row = 3;
    for (let i = 0; i < 24 / per_row; i++) {
        let button_row = [];
        for (let j = 0; j < per_row; j++) {
            button_row.push({
                text: `${!hours.includes(i * per_row + j) ? '🟥' : '🟩'} ${(i * per_row + j).toString().padStart(2, '0')}:00`,
                callback_data: `togglehour ${(i * per_row + j)}`
            });
        }
        inline_keyboard.push(button_row);
    }
    return inline_keyboard;
};

module.exports = {
    getCommand,
    sendMessage,
    checkAdmin,
    sendPoll,
    getUpdates,
    getHoursInlineKeyboard,
    editMessageReplyMarkup,
    SCOPES_ENUM,
    setCommands,
    deleteMessage,
    hoursStringToArray,
    hoursArrayToString,
};