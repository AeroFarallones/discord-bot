const { PermissionFlagsBits ,SlashCommandBuilder, ChannelType } = require('discord.js');


module.exports = {
	data: new SlashCommandBuilder()
		.setName('install-tickets')
		.setDescription('Instalara todos los recursos necesarios para el funcionamiento #03')
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
		.addChannelOption(option =>
			option.setName("canal")
				.setDescription("Seleccione el canal donde quiere que se agrege los tickets")
				.addChannelTypes(ChannelType.GuildText)
				.setRequired(true)
		),
	async execute(interaction) {
		
	},
};