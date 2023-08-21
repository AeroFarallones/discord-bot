const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('audios')
		.setDescription('Mira los apodos vigentes en el servidor'),
     async execute() {
        
    },
};