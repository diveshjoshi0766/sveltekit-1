import { fail } from '@sveltejs/kit';
import { Game } from './game';
import fetch from 'node-fetch';

/** @type {import('./$types').PageServerLoad} */
export const load = ({ cookies }) => {
	const game = new Game(cookies.get('sverdle'));

	const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    const req = {"email":"diveshjoshi35@gmail.com","phone":"9057578213"}
    const request = {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(req)
    };
    console.log("request",request)
    let endpoint = "https://script.google.com/macros/s/AKfycbwkNd7eZXwQ8ZVrH9vVek5ZJwabKXtV2mF8xPzzDL6K3oGeG7ERThQHylbNOMD7tUeU/exec?action=addUser"
	fetch(endpoint, request, 10000)           //api for the get request
	.then(response => {
		console.log("response", response)})
	.then(data => console.log(data));

    console.log("endPoint", endpoint)
    console.log("request", request)

	return {
		/**
		 * The player's guessed words so far
		 */
		guesses: game.guesses,

		/**
		 * An array of strings like '__x_c' corresponding to the guesses, where 'x' means
		 * an exact match, and 'c' means a close match (right letter, wrong place)
		 */
		answers: game.answers,

		/**
		 * The correct answer, revealed if the game is over
		 */
		answer: game.answers.length >= 6 ? game.answer : null
	};
};

/** @type {import('./$types').Actions} */
export const actions = {
	/**
	 * Modify game state in reaction to a keypress. If client-side JavaScript
	 * is available, this will happen in the browser instead of here
	 */
	update: async ({ request, cookies }) => {
		const game = new Game(cookies.get('sverdle'));

		const data = await request.formData();
		const key = data.get('key');

		const i = game.answers.length;

		if (key === 'backspace') {
			game.guesses[i] = game.guesses[i].slice(0, -1);
		} else {
			game.guesses[i] += key;
		}

		cookies.set('sverdle', game.toString());
	},

	/**
	 * Modify game state in reaction to a guessed word. This logic always runs on
	 * the server, so that people can't cheat by peeking at the JavaScript
	 */
	enter: async ({ request, cookies }) => {
		const game = new Game(cookies.get('sverdle'));

		const data = await request.formData();
		const guess = /** @type {string[]} */ (data.getAll('guess'));

		if (!game.enter(guess)) {
			return fail(400, { badGuess: true });
		}

		cookies.set('sverdle', game.toString());
	},

	restart: async ({ cookies }) => {
		cookies.delete('sverdle');
	}
};
