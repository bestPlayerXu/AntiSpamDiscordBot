const client = new (require('discord.js')).Client();
require('fs').writeFileSync('logs/pid.log', '' + process.pid);

var exit = () => {
	//do whatever necessary before exit
	client.destroy();
	console.log('Destroyed client. now killing myself ...');
	process.exit();
}
process.on('SIGTERM', () => exit());
process.on('SIGINT', () => exit());

client.on('ready', () => console.log('ready'));

client.on('message', msg => {
	msg.channel.messages.fetch({ limit: process.env.NUMBER_OF_MESSAGES_BEFORE_SPAM }).then(m => {
		var aM = m.array();
		if (Object.keys(aM.reduce((a, b) => {
			a[b.author.id + (b.content.length > process.env.MAX_LENGTH_OF_NOT_SPAM ? b.content : Date.now())] = true;
			return a;
		}, {})).length === 1 && m.first().createdTimestamp - m.last().createdTimestamp < process.env.TIME_BETWEEN_MESSAGES) msg.member.ban({ days: 1 }).catch(() => console.log('can\'t ban spammer'));
	});
});

client.login(process.env.BOT_TOKEN);
