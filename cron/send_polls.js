const utils = require('../utils');
const fetch = require('node-fetch');
const db = require('../models');
const { Op, QueryTypes } = require('sequelize');
const { sequelize } = require('../models');

const base64ToString = (base64) => {
	return Buffer.from(base64, 'base64').toString('ascii');
};

const shuffle = (array) => {
	const retval = [];
	const hat = [...array];
	for (let i = 0; i < array.length; i++) {
		const random = Math.floor(Math.random() * hat.length);
		retval.push(hat.splice(random, 1)[0]);
	}
	return retval;
};

const exec = async () => {
	const { Chat, Poll } = db;
	const hour = new Date().getHours();
	const registeredChats = await sequelize.query(
		'SELECT id, chat, active, hours, locale, created_at AS createdAt, updated_at AS updatedAt FROM chats AS Chat WHERE Chat.active = true AND Chat.hours LIKE CONCAT("%$",IF($1+Chat.locale<0, (24+($1+Chat.locale)), (($1+Chat.locale) % 24)),"$%")',
		{
			bind: [hour],
			type: QueryTypes.SELECT,
			model: Chat,
			mapToModel: true,
		}
	);
	const res = await fetch(
		`https://opentdb.com/api.php?amount=${registeredChats.length}&type=multiple&encode=base64`
	);
	const toReturn = [];
	if (res.ok) {
		const { results: questions } = await res.json();
		let i = 0;
		const promises = [];
		for (let chat of registeredChats) {
			promises.push(async () => {
				const data = questions[i];
				const options = shuffle([
					...data.incorrect_answers,
					data.correct_answer,
				]);
				const sentPoll = await utils.sendPoll({
					chat_id: chat.id,
					question: base64ToString(data.question),
					options: options.map(base64ToString),
					is_anonymous: false,
					type: 'quiz',
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
					toReturn.push({
						id: chat.id,
						name: chat.chat,
						question: sentPoll.result.poll.question,
					});
				} catch (e) {
					console.error(e);
				}
			});
			i = (i + 1) % questions.length;
		}
	}
	await Promise.allSettled(promises);
	return toReturn;
};

module.exports = {
	exec,
};
