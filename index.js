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

client.on('ready', () => client.user.setActivity('spammers.', { type: 'WATCHING' }));

client.on('message', msg => {
	msg.channel.messages.fetch({ limit: process.env.NUMBER_OF_MESSAGES_BEFORE_SPAM }).then(m => {
		var aM = m.array();
		var isSameMessage = Object.keys(aM.reduce((a, b, i) => {
			if (b.content.length > process.env.MAX_LENGTH_OF_NOT_SPAM) {
				a[b.author.id + b.content] = true;
			} else {
				a[i] = true;
			}
			return a;
		}, {})).length === 1;
		if (isSameMessage && m.first().createdTimestamp - m.last().createdTimestamp < process.env.TIME_BETWEEN_MESSAGES) {
			msg.member.ban({ days: 1 }).catch(() => console.log('can\'t ban spammer'));
			msg.channel.send('Trying to ban <@' + msg.author.id + '> for spamming ||' + msg.content.slice(0, 20) + (msg.content.length > 20 ? '...' : '') +  '||!').catch(() => console.log('Can\'t send to chat'));
		}
	});
});

client.login(process.env.BOT_TOKEN);
