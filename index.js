const { request } = require('undici');
const { createReadStream } = require('node:fs');
const { join } = require('node:path');
const wait = require('node:timers/promises').setTimeout;
const dotenv = require('dotenv');
dotenv.config();

const { 
	joinVoiceChannel ,
	createAudioPlayer, 
	createAudioResource,
	AudioPlayerStatus,
	StreamType,
	NoSubscriberBehavior,
	generateDependencyReport,
} = require('@discordjs/voice');


const fs = require('node:fs')
const path = require('node:path');
/*
 * 
 * Mensaje para el futuro developer de este bot
 * 
 * Parcero, mire este pedaso de codigo ni yo Julian Ramirez (rcomunica#3285) 
 * quien fue el que creo las bases lo entiendo
 * entonces ¿que le sugiero? 
 * facil NO HAGA NADA ACA  NO TOQUE NADA USTED MUEVE ALGO DE ACA Y SE CAE TODO
 * ENTONCES ECHESE LA BENCICION Y COMIENZE MAS ABAJO.
 * 
 * 
 * AMEN.
 *
 */ 

const { 
	Client, 
	Collection, 
	Events, 
	GatewayIntentBits,
	EmbedBuilder, 
	ActionRowBuilder, 
	ModalBuilder,
	TextInputStyle,
	TextInputBuilder,
	ButtonBuilder,
	ButtonStyle,
	MessageActionRow,
	StringSelectMenuBuilder,
	ChannelType,
	PermissionsBitField
} = require('discord.js');
const { token, pageLink } = require('./config.json');

// Mensajes customizados (messages.json)

const { 
	successVerifyMessage, 
	tickets,
	responseTicket
} = require("./messages.json");
const { channel } = require('node:diagnostics_channel');
const { type } = require('node:os');



const client = new Client({ intents: [
	GatewayIntentBits.Guilds, 
	GatewayIntentBits.GuildMessages, 
	GatewayIntentBits.GuildMessageReactions,
	GatewayIntentBits.MessageContent,
	GatewayIntentBits.GuildVoiceStates,
	GatewayIntentBits.GuildMembers,
]
});


client.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	client.commands.set(command.data.name, command);
};

const audioPath = './AUDIO/';
const audioFiles = fs.readdirSync(audioPath).filter(file => file.endsWith('.ogg'));
const audiosActivos = audioFiles.map((file, index) => ({
	name: file.replace('.ogg', '').replaceAll('_', ' '),
	route: file,
	id: index.toString()
  }
));

let audiosEnCarpeta = []

for (const audioActivo of audiosActivos) {
	audiosEnCarpeta.push(audioActivo)
}


const groupsOfAudios = [];
while (audiosActivos.length > 0) {
	groupsOfAudios.push(audiosActivos.splice(0, 4));
}

client.once(Events.ClientReady, () => {
	// console.log(generateDependencyReport());
	console.log(`Buenas! ${client.user.tag} listo pa lo k sea!`);
});

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;
	
	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'Revise esos logs papito!', ephemeral: true });
	}
});




/* FIN DE LA TORTURA :D */




/**
 * 
 * Funcion: conexion a canal de voz
 * 
 * ¿Que hace?
 * 
 * Esta es declarada para la optimizacion de codigo para no estar copiando
 * y pegando codigo.
 * A si mismo liberar un poco de espacio en memoria
 * 
 * 
 * @param {"string"} canalId En este parametro se ingresa el id del Canal
 * @param {"string"} guilid Tambien se ingresa el id del Canal de voz
 * @param {"string"} adapter <https://discord.js.org/#/docs/discord.js/main/class/Guild?scrollTo=voiceAdapterCreator>
 * @param {boolean} desconexion  True para que el bot de desconecte - False para no realizar
 * 								 ninguna accion
 * @author Julian Ramirez <staff@aerofarallones.com>
 * @tutorial https://discordjs.guide/voice/voice-connections.html#cheat-sheet
 * @returns 
 */





function conexion(canalId, guilid, adapter, desconexion){
	const connection = joinVoiceChannel({
		channelId: canalId,
		guildId: guilid,
		adapterCreator: adapter,
		selfDeaf: true,
	});

	if(desconexion == true){
		connection.destroy();
	}

}


client.on(Events.InteractionCreate, async interaction =>{





	var configJoin = {
		canalId: interaction.member.voice.channelId,
		servidorId: interaction.guild.id,
		adaptador: interaction.guild.voiceAdapterCreator
	}
	

	if(interaction.commandName == 'join'){
		
		let JoinEmbed  = new EmbedBuilder()
		.setColor('#00157f')
		.setAuthor({ name: interaction.user.username, iconURL: interaction.user.avatarURL()})
		.setDescription(`Se ha unido exitoxamente a <#${interaction.member.voice.channelId}>`)

		conexion(configJoin.canalId, configJoin.servidorId, configJoin.adaptador);

		await interaction.reply({ embeds: [JoinEmbed]});
		
	}

	if(interaction.commandName == 'leave'){

		conexion(configJoin.canalId, configJoin.servidorId, configJoin.adaptador, true);

		let LeaveEmbed  = new EmbedBuilder()
		.setColor('#00157f')
		.setAuthor({ name: interaction.user.username, iconURL: interaction.user.avatarURL()})
		.setDescription(`Faralloncito bot se salio del canal de voz <#${interaction.member.voice.channelId}>`)

		await interaction.reply({ embeds: [LeaveEmbed], fetchReply: true});
		

	}

	
	
    if(interaction.commandName === 'play'){
	

		let id = interaction.options.getNumber('number');
		
		const audioSeleccionado = audiosEnCarpeta.find(audio => audio.id == id.toString());

		// Verificar que se haya seleccionado un audio válido
		if (!audioSeleccionado) {
			return interaction.reply('El ID de audio proporcionado no es válido.');
		}
	  
		
		let LeaveEmbed  = new EmbedBuilder()
		.setColor('#00157f')
		.setAuthor({ name: interaction.user.username, iconURL: interaction.user.avatarURL()})
		.setDescription(`**Ejecutandose:** ${audioSeleccionado.name} \n **id:** ${audioSeleccionado.id}`)
		await interaction.reply({ embeds: [LeaveEmbed], fetchReply: true});
		
        const connection = joinVoiceChannel({
            channelId: interaction.member.voice.channelId,
            guildId: interaction.guild.id,
            adapterCreator: interaction.guild.voiceAdapterCreator,
            selfDeaf: true,
        });

		const player = createAudioPlayer();
		

		let resource = createAudioResource(createReadStream(join(__dirname, `AUDIO/${audioSeleccionado.route}`), {
		 	inputType: StreamType.OggOpus,
		}));
	
		connection.subscribe(player);
        player.play(resource);

    }

	if(interaction.commandName == "morcillolandia"){



		const connection = joinVoiceChannel({
            channelId: interaction.member.voice.channelId,
            guildId: interaction.guild.id,
            adapterCreator: interaction.guild.voiceAdapterCreator,
            selfDeaf: true,
        });

		const player = createAudioPlayer();


		let resource = createAudioResource(createReadStream(join(__dirname, `AUDIO/Himno_de_Mamertolandia.ogg`), {
			inputType: StreamType.OggOpus,
	   }));

	   connection.subscribe(player);
	   player.play(resource);
	   await interaction.reply({content: "🤡🤡🤡"})
	}

	if(interaction.commandName == "audios"){
		
		for (const group of groupsOfAudios) {
			const embed = new EmbedBuilder()
			.setColor('#00157f')
			.setAuthor({ name: interaction.client.user.username, iconURL: interaction.user.avatarURL()})
			.setTitle('Comandos de audio')
			.setDescription(group.map(audio => `Nombre: ${audio.name} \n **ID: ${audio.id}**`).join('\n'));
			interaction.channel.send({embeds: [embed]});
		}
		  
	}
});

let response = '';


/**  Funcion #02

	Bueno Señores, como se menciono en el README.md, la funcion #02 se trata de poder
	agregar llamdas API, desde nuestro sistema de PHPvms7 (https://aerofarallones.com)

*/

client.on(Events.InteractionCreate, async interaction =>{


		const errorMessage = new EmbedBuilder()
		.setColor('#ff0000')
		.setAuthor({ name: interaction.client.user.username, iconURL: interaction.user.avatarURL()})
		.setFooter({text: "Contacta a rcomunica#3285 (Capisito julian | FLS104)"})


		const pageButton = new ButtonBuilder()
		.setLabel("Configuracion de Perfil")
		.setURL("https://aerofarallones.com/profile/")
		.setStyle(ButtonStyle.Link)

		let row = new ActionRowBuilder()
		.addComponents(pageButton);


	if(interaction.commandName == "verify"){
		const modal = new ModalBuilder()
			.setCustomId('setVerification')
			.setTitle('Verificacion');
	
		const apiKeyInput = new TextInputBuilder()
			.setCustomId("apiKeyInput")
			.setLabel("Ingresa tu Api Key")
			.setRequired(true)
			.setMinLength(20)
			.setPlaceholder('XXXXXXXXXXXXXXXXXXXX')
			.setStyle(TextInputStyle.Short);
	
	
		const firstActionRow = new ActionRowBuilder().addComponents(apiKeyInput);
			modal.addComponents(firstActionRow);
			await interaction.showModal(modal);
		}
	
		if(interaction.customId == "setVerification"){
			const xApiKey = interaction.fields.getTextInputValue('apiKeyInput');
			const user = await request(`${pageLink}/api/user`, {method: 'GET', headers: {
				'X-API-Key': `${xApiKey}`,
				'Content-type': 'application/json'
			}})


				for await (const chunk of user.body) {
					response += chunk;
				}
				
				var jsonResponse = JSON.parse(response);
			

			if (interaction.appPermissions.has("Administrator")){
				
				let interactionMember = interaction.member;

				if(interactionMember.roles.cache.has("828499679654051870") || interactionMember.roles.cache.size == 0){
					interactionMember.roles.remove("828499679654051870")
						.then(() =>{
							interactionMember.roles.add("740378729909321780");
							interaction.channel.send("**Roles Actualizados (1/2)!** :white_check_mark:")
						})
						.catch(error =>{
							console.log(error);
							errorMessage.setDescription("**ERROR**\n Algo salio mal D:");
							return interaction.reply({embeds: [errorMessage], ephemeral: true});
						});

					interaction.member.setNickname(`${jsonResponse.data.name} | FLS${jsonResponse.data.pilot_id}`)
						.then(() => {
							interaction.channel.send("**Apodo Actualizado (2/2)!** :white_check_mark:")
						})
					.catch(error =>{
						console.log(error);
						errorMessage.setDescription("**ERROR**\n Algo salio mal D:");
						return interaction.reply({embeds: [errorMessage], ephemeral: true});
					});	
					
					setTimeout(() => interaction.channel.bulkDelete(2), 2000)
				}

			} else {
				errorMessage.setDescription("**ERROR**\n Algo salio mal D:");
				return interaction.reply({embeds: [errorMessage], ephemeral: true});
			}

				const verifyCorrectEmbed = new EmbedBuilder()
				.setColor('Green')
				.setAuthor({iconURL: interaction.user.avatarURL(), name: `${jsonResponse.data.name} | FLS${jsonResponse.data.pilot_id}`, url: `${pageLink}/profile/${jsonResponse.data.id}`})
				.setTitle("Verificacion Correcta! ✅")
				.setURL("https://aerofarallones.com")
				.setDescription(`${successVerifyMessage}`)
				.addFields(
					{name: "Aeropuerto Base", value: `${jsonResponse.data.home_airport}`, inline: true},
					{name: "Aerpuerto Actual", value: `${jsonResponse.data.curr_airport}`, inline: true},
					{name: "Zona Horaria", value: `${jsonResponse.data.timezone}`, inline: true},
					{name: "Callsing", value: `FLS${jsonResponse.data.pilot_id}`, inline: true},
					{name: "Rango", value: `${jsonResponse.data.rank.name}`, inline: true},
					{name: "Discord User Id", value: `_Ingrese esto en su configuracion de perfil:_ \n **${interaction.user.id}**`}		
				)
				.setTimestamp()
				.setFooter({ text: "Para reclamar tu medalla manda una Screenshot a nuestros Webmasters o algun staff!", iconURL: client.user.avatarURL()})
				
				await interaction.reply({embeds: [verifyCorrectEmbed], components: [row], content: `Hola **${jsonResponse.data.name}!**, te has verificado correctamente!... Bienvenido a **AeroFarallones VA** <:logoFLS:1103541612094697472>` });
				interaction.channel.send("Todo se ha configurado correctamente! :white_check_mark:")

			
				
		}


});

/**

	Function #03 (Creacion de tickets)

 */

client.on(Events.InteractionCreate, async interaction  =>{

	var guild = interaction.guild;
	var supportChannel;
	var idTicketChannel;

	const firstSelectMenu = new StringSelectMenuBuilder({
		custom_id: 'selectProblem',
		placeholder: '¿Con cual red tienes problemas?',
		max_values: 1,
		options: [
			{label: 'AeroFarallones', value: 'option1', description: `${tickets.FLSOptionDescription}`,  },
			{label: 'IVAO', value: 'option2', description: `${tickets.IvaoOptionDescription}`},
		]
	});

	const row = new ActionRowBuilder()
			.addComponents(firstSelectMenu);

	if(interaction.commandName == "install-tickets"){
		supportChannel = interaction.options.getChannel("canal");
		let ticketEmbed = new EmbedBuilder()
		.setAuthor({ name: client.user.username, iconURL: client.user.avatarURL() })
		.setURL(pageLink)
		.setColor("#00157f")
		.setDescription(`${tickets.TicketInformation}`)
		.setTimestamp()
		
		
		supportChannel.send({embeds: [ticketEmbed], components: [row]});

		await interaction.reply(`En el canal ${supportChannel}, fue instalado el Embed ✅`)
	}

	const secondSelect = new StringSelectMenuBuilder({
		custom_id: 'selectReason',
		placeholder: '¿Que situacion describe mas su problema?',
		max_values: 1,
		options: [
			{label: "Web", value: "web", description: "¿Problemas con la web?"},
			{label: "Discord", value: "discord", description: "¿Problemas con nuestro Discord?"},
			{label: "Acars", value: "acars", description: "¿Problemas con el Acars?"},
			{label: "Cuenta", value: "cuenta", description: "¿Problemas y/o dudas con su cuenta?"},
			{label: "Reporte de usuarios", value: "usuario", description: "Por favor, adjuntar pruebas"},
		]
	});

	const rowTwo = new ActionRowBuilder()
		.addComponents(secondSelect);

	if(interaction.customId == "selectProblem"){
		let choices = "";

		await interaction.values.forEach(value =>{
			choices += `${value}`
		})

		switch (choices) {
			case 'option1':
				let staffMembers = guild.roles.cache.find(role => role.permissions.has(PermissionsBitField.Flags.Administrator)).id;
				var ChannelTicket = await guild.channels.create({
					name: `Ticket Number ${interaction.user.discriminator}`,
					type: ChannelType.GuildText,
					permissionOverwrites: [
						{
							id: guild.roles.everyone,
							deny: ["ViewChannel"],
						},
						{
							id: interaction.user.id,
							allow: ["ViewChannel"]
						},
						{
							id: staffMembers,
							allow: ["ViewChannel"]
						}
					]
				});
				
				ChannelTicket.send({content:`${interaction.user}! ${responseTicket.TicketFirstResponse}`, components: [rowTwo]})
				await interaction.reply({content: `Se ha creado su ticket... <#${ChannelTicket.id}> ✅`, ephemeral: true})
				
				break;
			case 'option2':

				// Si el problema es Option2 (IVAO), se le dara un mensaje el cual 
				// lo llevara al discord de IVAO

				await interaction.reply({content: `${tickets.IvaoOptionResult}`, ephemeral: true})
				break;
			default:
				await interaction.reply("Seleccione una opcion valida!");
				break;
		}

		
	}

	if(interaction.customId == "selectReason"){
		let choices = "";

		await interaction.values.forEach(value =>{
			choices += `${value}`
		});

		let responseEmbed = new EmbedBuilder()
		.setAuthor({iconURL: client.user.avatarURL(), name: client.user.username})
		.setColor('Random')
		.setDescription(responseTicket.TicketFillResponse)

		const close = new ButtonBuilder()
			.setCustomId("closeticket")
			.setLabel("Close Ticket")
			.setStyle(ButtonStyle.Danger);
		
		const row = new ActionRowBuilder()
		.addComponents(close)

		switch (choices) {
			case "web":

				interaction.channel.bulkDelete(1)
				await wait(1000)
				responseEmbed.setFields(
					{name: "Solicitud:", value: "Web", inline: true},
					{name: "Usuario:", value: `${interaction.member.displayName}`, inline: true},
					{name: "Prioridad:", value: "Alta", inline: true},
				);
				await interaction.reply({ content: "**¡Bienvenido al servicio de tickets!**", embeds: [responseEmbed], components: [row] })
				break;
		
			case "discord":

				interaction.channel.bulkDelete(1)
				await wait(1000)
				await responseEmbed.setFields(
					{name: "Solicitud:", value: "Discord", inline: true},
					{name: "Usuario:", value: `${interaction.member.displayName}`, inline: true},
					{name: "Prioridad:", value: "Media", inline: true},
				);

				await interaction.reply({ content: "**¡Bienvenido al servicio de tickets!**", embeds: [responseEmbed], components: [row] })
				break;

			case "acars":

				interaction.channel.bulkDelete(1)
				await wait(1000)
				await responseEmbed.setFields(
					{name: "Solicitud:", value: "Acars", inline: true},
					{name: "Usuario:", value: `${interaction.member.displayName}`, inline: true},
					{name: "Prioridad:", value: "Alta", inline: true},
				);
				await interaction.reply({ content: "**¡Bienvenido al servicio de tickets!**", embeds: [responseEmbed], components: [row] })
				break;
			
			case "cuenta":

				interaction.channel.bulkDelete(1);
				await wait(1000)
				await responseEmbed.setFields(
					{name: "Solicitud:", value: "Cuenta", inline: true},
					{name: "Usuario:", value: `${interaction.member.displayName}`, inline: true},
					{name: "Prioridad:", value: "Baja", inline: true},
				)

				await interaction.reply({ content: "**¡Bienvenido al servicio de tickets!**", embeds: [responseEmbed], components: [row] })
				break;

			case "usuario":
				interaction.channel.bulkDelete(1);
				await wait(1000);
				await responseEmbed.setFields(
					{name: "Solicitud:", value: "Reporte de usuario", inline: true},
					{name: "Usuario:", value: `${interaction.member.displayName}`, inline: true},
					{name: "Prioridad:", value: "Media", inline: true},
				)

				await interaction.reply({ content: "**¡Bienvenido al servicio de tickets!**", embeds: [responseEmbed], components: [row] })
				break;
			default:

				console.error("Interacion invalida! (Ticket #03 response) D:");

				break;
		}

	}

	if(interaction.customId == "closeticket"){
		let ticketChannelEnd =  interaction.guild.channels.cache.get(interaction.channelId);

		interaction.channel.send("Conversacion Cerrada... ¡Buenos Vuelos!")
		await wait(2500)
		ticketChannelEnd.delete()
			.then(deleteChannel => {
				interaction.user.send(responseTicket.TicketEndResponse);
			})
			.catch(console.error);

	}

})

client.login(process.env.discord_token);


/**
    _                       ___                       _   _                         
   /_\    ___   _ _   ___  | __|  __ _   _ _   __ _  | | | |  ___   _ _    ___   ___
  / _ \  / -_) | '_| / _ \ | _|  / _` | | '_| / _` | | | | | / _ \ | ' \  / -_) (_-<
 /_/ \_\ \___| |_|   \___/ |_|   \__,_| |_|   \__,_| |_| |_| \___/ |_||_| \___| /__/
                                                                                    

*/