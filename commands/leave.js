const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('leave')
		.setDescription('Saca al bot del canal de discord donde se encuentre')
        .setName('leave'),
    async execute() {
    
    },
};