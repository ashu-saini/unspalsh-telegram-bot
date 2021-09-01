const { Telegraf } = require('telegraf');
const unsplash  = require('./unspalsh.js');
require('dotenv').config();

const fs = require('fs');

const app = new Telegraf(process.env.BOT_TOKEN);
let user = null;

app.start(ctx => {
  if (ctx.message.from.username !== undefined) {
    ctx.reply(
      `Hey ${ ctx.message.from.username } 😊 \nsearch HD images specfic to the text you will want!`
    );
  } else if (ctx.message.from.first_name !== undefined) {
    ctx.reply(
      `Welcome ${ ctx.message.from.first_name } 😊 \nsearch HD images specfic to the text you want!`
    );
  } else {
    ctx.reply(
      `Welcome ${ ctx.message.from.id } 😊 \nsearch HD images specfic to the text you want!`
    );
  }
});

const fetchImages = async(field) => {
	const page = Math.floor(Math.random() * 4);
	try {
		let result  = await unsplash.search.getPhotos({
			query: field,
  		page: page,
  		perPage: 10
  	});
		if(result.type === 'error') {
			throw result.errors[0];
		} else {
			const  photos = result.response.results;
			return photos.map(({ urls }) => ({ media: { url: urls?.regular }, caption: "unsplash", type: "photo" }));
		}
	} catch (err) {
		throw err;
	}
}

app.on("text", async (ctx) => {
  try {
  	// wait until to fetch images from unsplash
    ctx.reply("⌛️ please Wait... "); 
    // fetch images from unsplash
    const photos = await fetchImages(ctx.message.text);
    photos.length > 0 ? ctx.replyWithMediaGroup(photos) : ctx.reply(`Sorry Images not found related to this text`);
  } catch (e) {
    console.log(e);
    ctx.reply("Something went wrong please try again later 😣")
  }
});

app.startPolling();
