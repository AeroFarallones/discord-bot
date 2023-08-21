const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('play')
		.setDescription('Ejecuta el audio donde convenga mas a la situacion')
        .setName('play')
        .addNumberOption(option =>
            option.setName('number')
                .setDescription('Ingrese el Id el audio')
                .setRequired(true)),
        async execute() {
            
        },
};