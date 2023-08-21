# [![AeroFarallones Logo](https://aerofarallones.com/image/LogoAcars.png "AeroFarallones Logo")](http://aerofarallones.com "AeroFarallones Logo") (Bot)

> Version: 2.1.4 (Fase temprana de desarrollo)

¡Hi future developer!, soy rcomunica (Julian Ramires | FLS104) el creador de este bot. Te comentare algunos aspectos, funciones y caracteritisticas de este bot, pero antes tenemos que saber lo siguiente

## ¿De donde viene la idea?

Aproximadamente hace un año nos proponen la idea de crear un bot, y que su funcion principal sea reproducir una lista de audios, claramente asignados cada uno con su respectivo **ID**, esto se logra, pero con pesimas practicas, ocacionando que el codigo no pueda seguir durante mucho tiempo...

## Funciones principales

| Funcion                                  | ¿Logrado? |
| :--------------------------------------- | :-------- |
| Reproducccion de audio                   | ✅        |
| Automatizacion en registro de audios     | ✅        |
| Creacion de tickets                      | ✅        |
| Obtener informacion de usuario (APIs)    | ✅        |
| Opciones de Moderacion (ban, kick, mute) | ❌        |
| Slash Commands                           | ✅        |

> ###### Nota: ✅ realizado ~ 🚧En creacion y/o mantenimiento ~ ❌ No logrado o en futuros planes

### Audio (funcion #01)

Conexion y desconexion: Esta es declarada para la optimizacion de codigo para no estar copiando y pegando codigo. A si mismo liberar un poco de espacio en memoria

Esta funcion tiene varios parametros:

- canalId: En este parametro se ingresa el [Voice Channel Id](https://old.discordjs.dev/#/docs/discord.js/14.9.0/class/VoiceChannel "Voice Channel Id")
- GuildId: Se ingresa el [GuilID o Server ID](https://old.discordjs.dev/#/docs/discord.js/14.9.0/class/Guild "GuilID o Server ID")
- Adapter: [VoiceAdapter](https://discord.js.org/#/docs/discord.js/main/class/Guild?scrollTo=voiceAdapterCreator "VoiceAdapter")
- desconexion : True para que el bot de desconecte - False para no realizar ninguna accion (Tipo Boolean)
  **Los primeros 3 son tipo string**

###### index.js (181:1)

```js
function conexion(canalId, guilid, adapter, desconexion) {
  const connection = joinVoiceChannel({
    channelId: canalId,
    guildId: guilid,
    adapterCreator: adapter,
    selfDeaf: true,
  });
  if (desconexion == true) {
    connection.destroy();
  }
}
```

Esta parte lo que hace es buscar en la carpeta "AUDIO" todos los archivos que terminen con la extencion **.ogg**
Despues manda estos archivos a un array con un "name" quitando los "\_" y la extencion ".ogg"
En un ciclo **forof** guarda todos los datos obtenidos anteriormente y posteriormente en otro array los divide en 4 nuevos grupos
(esta funcion nos ayudara al momento de mandar el listado de audios)

```js
const audioPath = "./AUDIO/";
const audioFiles = fs
  .readdirSync(audioPath)
  .filter((file) => file.endsWith(".ogg"));
const audiosActivos = audioFiles.map((file, index) => ({
  name: file.replace(".ogg", "").replaceAll("_", " "),
  route: file,
  id: index.toString(),
}));

let audiosEnCarpeta = [];

for (const audioActivo of audiosActivos) {
  audiosEnCarpeta.push(audioActivo);
}

const groupsOfAudios = [];
while (audiosActivos.length > 0) {
  groupsOfAudios.push(audiosActivos.splice(0, 4));
}
```

### Slash Commands (Funcion OBG)

> La funciones OBG es que son **OBLIGATORIAS** para el funcionamiento del bot

```js
const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs
  .readdirSync(commandsPath)
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  client.commands.set(command.data.name, command);
}
```

```js
client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({
      content: "Revise esos logs papito!",
      ephemeral: true,
    });
  }
});
```

## Documentacion en construccion! 🚧🚨
