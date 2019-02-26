const { Client, Util } = require('discord.js');
const { TOKEN, PREFIX, GOOGLE_API_KEY, SOUNDCLOUD_CLIENT_ID } = require('./config');
const YouTube = require('simple-youtube-api');
const ytdl = require('ytdl-core');
const axios = require('axios');
const m3u8stream = require('m3u8stream')

const client = new Client({ disableEveryone: true });

const youtube = new YouTube(GOOGLE_API_KEY);

const queue = new Map();

client.on('warn', console.warn);

client.on('error', console.error);

client.on('ready', () => console.log('Yo this ready!'));

client.on('disconnect', () => console.log('I just disconnected, making sure you know, I will reconnect now...'));

client.on('reconnecting', () => console.log('I am reconnecting now!'));

client.on('message', async msg => { // eslint-disable-line
    if (msg.author.bot) return undefined;
    if (!msg.content.startsWith(PREFIX)) return undefined;

    const args = msg.content.split(' ');
    const serverQueue = queue.get(msg.guild.id);

    let command = msg.content.toLowerCase().split(' ')[0];
    command = command.slice(PREFIX.length)

    if (command === 'data') {
        await getMyData(msg);
    }
    if (command === 'play') {
        await playCommand(msg);
    } else if (command === 'skip') {
        // if (!msg.member.voiceChannel) return msg.channel.send('You are not in a voice channel!'); that seems irrelevant
        if (!serverQueue) return msg.channel.send('There is nothing playing that I could skip for you.');
        serverQueue.connection.dispatcher.end('Skip command has been used!');
        return undefined;
    } else if (command === 'stop') {
        // if (!msg.member.voiceChannel) return msg.channel.send('You are not in a voice channel!');
        if (!serverQueue) return msg.channel.send('There is nothing playing that I could stop for you.');
        serverQueue.songs = [];
        serverQueue.connection.dispatcher.end('Stop command has been used!');
        return undefined;
    } else if (command === 'volume') {
        // if (!msg.member.voiceChannel) return msg.channel.send('You are not in a voice channel!');
        if (!serverQueue) return msg.channel.send('There is nothing playing.');
        if (!args[1]) return msg.channel.send(`The current volume is: **${serverQueue.volume}**`);
        serverQueue.volume = args[1];
        serverQueue.connection.dispatcher.setVolumeLogarithmic(args[1] / 5);
        return msg.channel.send(`I set the volume to: **${args[1]}**`);
    } else if (command === 'np') {
        if (!serverQueue) return msg.channel.send('There is nothing playing.');
        return msg.channel.send(`🎶 Now playing: **${serverQueue.songs[0].title}**`);
    } else if (command === 'queue') {
        if (!serverQueue) return msg.channel.send('There is nothing playing.');
        return msg.channel.send(`
__**Song queue:**__

${serverQueue.songs.map(song => `**-** ${song.title}`).join('\n')}

**Now playing:** ${serverQueue.songs[0].title}
		`);
    } else if (command === 'pause') {
        if (serverQueue && serverQueue.playing) {
            serverQueue.playing = false;
            serverQueue.connection.dispatcher.pause();
            return msg.channel.send('⏸ Paused the music for you!');
        }
        return msg.channel.send('There is nothing playing.');
    } else if (command === 'resume') {
        if (serverQueue && !serverQueue.playing) {
            serverQueue.playing = true;
            serverQueue.connection.dispatcher.resume();
            return msg.channel.send('▶ Resumed the music for you!');
        }
        return msg.channel.send('There is nothing playing.');
    } else if (command === 'jukebox') {
        await getMyUrl(msg)
    }

    return undefined;
});

async function handleVideo(video, msg, voiceChannel, playlist = false) {
    const serverQueue = queue.get(msg.guild.id);
    const song = {
        id: video.id,
        title: Util.escapeMarkdown(video.title),
        url: `https://www.youtube.com/watch?v=${video.id}`
    };
    if (!serverQueue) {
        const queueConstruct = {
            textChannel: msg.channel,
            voiceChannel: voiceChannel,
            connection: null,
            songs: [],
            volume: 1,
            playing: true
        };
        queue.set(msg.guild.id, queueConstruct);

        queueConstruct.songs.push(song);

        try {
            var connection = await voiceChannel.join();
            queueConstruct.connection = connection;
            await play(msg.guild, queueConstruct.songs[0]);
        } catch (error) {
            console.error(`I could not join the voice channel: ${error}`);
            queue.delete(msg.guild.id);
            return msg.channel.send(`I could not join the voice channel: ${error}`);
        }
    } else {
        serverQueue.songs.push(song);
        if (playlist) return undefined;
        else return msg.channel.send(`✅ **${song.title}** has been added to the queue!`);
    }
    return undefined;
}

async function handleSong(member, guild, url, target, title = undefined, volume = 1) {
    const serverQueue = queue.get(guild.id);
    const song = {
        title: title,
        url,
        volume,
        target
    };
    if (!serverQueue) {
        const queueConstruct = {
            connection: null,
            songs: [],
            volume: 1,
            playing: true
        };
        queue.set(guild.id, queueConstruct);
        queueConstruct.songs.push(song);
        try {
            var connection = await member.voiceChannel.join();
            queueConstruct.connection = connection;
            await play(guild, queueConstruct.songs[0]);
        } catch (error) {
            console.error(`I could not join the voice channel: ${error}`);
            queue.delete(guild.id);
        }
    } else {
        serverQueue.songs.push(song);
    }
}

async function play(guild, song) {
    const serverQueue = queue.get(guild.id);

    if (!song) {
        serverQueue.voiceChannel.leave();
        queue.delete(guild.id);
        return;
    }

    let stream = undefined;
    if (song.target === 'yt') {
        stream = ytdl(song.url);
    } else if (song.target === 'sc') {
        let s = await axios.post(`http://api.soundcloud.com/resolve?url=${song.url}&client_id=${SOUNDCLOUD_CLIENT_ID}`, {});
        s = s.data;
        try {
            const t = await axios.get(`https://api-v2.soundcloud.com/media/soundcloud:tracks:${s.id}/legacy-mp3/stream/hls?client_id=${SOUNDCLOUD_CLIENT_ID}`);
            stream = m3u8stream(t.data.url);
            console.log(stream);
        } catch (error) {
            console.error(error);
            return undefined;
        }
    }

    const dispatcher = serverQueue.connection.playStream(stream)
        .on('end', reason => {
            if (reason === 'Stream is not generating quickly enough.') console.log('Song ended.');
            else console.log(`Song ended: ${reason}`);
            serverQueue.songs.shift();
            play(guild, serverQueue.songs[0]);
        })
        .on('error', error => console.error(error));
    dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);

    if (serverQueue.textChannel) {
        serverQueue.textChannel.send(`🎶 Start playing: **${Util.escapeMarkdown(song.title)}**`);
    }
}

async function playCommand(msg) {

    const args = msg.content.split(' ');
    const searchString = args.slice(1).join(' ');
    const url = args[1] ? args[1].replace(/<(.+)>/g, '$1') : '';


    const voiceChannel = msg.member.voiceChannel;
    if (!voiceChannel) return msg.channel.send('I\'m sorry but you need to be in a voice channel to play music!');
    const permissions = voiceChannel.permissionsFor(msg.client.user);
    if (!permissions.has('CONNECT')) {
        return msg.channel.send('I cannot connect to your voice channel, make sure I have the proper permissions!');
    }
    if (!permissions.has('SPEAK')) {
        return msg.channel.send('I cannot speak in this voice channel, make sure I have the proper permissions!');
    }

    if (url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
        const playlist = await youtube.getPlaylist(url);
        const videos = await playlist.getVideos();
        for (const video of Object.values(videos)) {
            const video2 = await youtube.getVideoByID(video.id); // eslint-disable-line no-await-in-loop
            await handleVideo(video2, msg, voiceChannel, true); // eslint-disable-line no-await-in-loop
        }
        return msg.channel.send(`✅ Playlist: **${playlist.title}** has been added to the queue!`);
    } else {
        try {
            var video = await youtube.getVideo(url);
        } catch (error) {
            try {
                var videos = await youtube.searchVideos(searchString, 10);
                let index = 0;
                msg.channel.send(`
__**Song selection:**__

${videos.map(video2 => `**${++index} -** ${video2.title}`).join('\n')}

Please provide a value to select one of the search results ranging from 1-10.
					`);
                // eslint-disable-next-line max-depth
                try {
                    var response = await msg.channel.awaitMessages(msg2 => msg2.content > 0 && msg2.content < 11, {
                        maxMatches: 1,
                        time: 10000,
                        errors: ['time']
                    });
                } catch (err) {
                    console.error(err);
                    return msg.channel.send('No or invalid value entered, cancelling video selection.');
                }
                const videoIndex = parseInt(response.first().content);
                var video = await youtube.getVideoByID(videos[videoIndex - 1].id);
            } catch (err) {
                console.error(err);
                return msg.channel.send('🆘 I could not obtain any search results.');
            }
        }
        return handleVideo(video, msg, voiceChannel);
    }
}

async function getMyData(msg) {
    msg.channel.send(`Channel${msg.member.voiceChannel}`)
}

async function playSong(songTitle, memberId, guildId) {
    const guild = client.guilds.get(guildId);
    if (!guild) {
        console.log('You need to specify correct guild id');
        return undefined;
    }
    const member = guild.members.get(memberId);
    if (!member.voiceChannel) {
        console.log('You are not in voice channel');
        return undefined;
    }

    const soundcloudRegex = /(https\:\/\/)?(www\.)?soundcloud.com(.*)/;
    const ytRegex = /(https\:\/\/)?(www\.)?youtube.com(.*)/;
    console.log('Play song');
    if (songTitle.match(soundcloudRegex)) {
        // const song = await SC.resolve(args[1]);
        // console.log(song);
        // const stream = await SC.stream(`/tracks/${song.id}`);
        console.log('Play sc song');
        await handleSong(member, guild, songTitle, 'sc');
    } else if (songTitle.match(ytRegex)) {
        console.log('Play yt url');
        await handleSong(member, guild, songTitle, 'yt');
    } else {
        console.log('Play yt song');
        const videos = await youtube.searchVideos(songTitle, 1);
        if (videos.length < 1) {
            // error
            return;
        }
        const video = await youtube.getVideoByID(videos[0].id);
        await handleSong(member, guild, video.url, 'yt', songTitle);
        // await handleVideo2(video, guild, undefined, member.voiceChannel);
    }  
}

async function getMyUrl(msg) {
    
    const url = 'https://discord-dj.herokuapp.com/jukebox';
    const memberB64 = Buffer.from(msg.member.id).toString('base64')
    const guildB64 = Buffer.from(msg.guild.id).toString('base64')
    return msg.channel.send(`${url}?member=${memberB64}&guild=${guildB64}`)
}

function getMemberName(memberId, guildId) {
    const guild = client.guilds.get(guildId);
    return guild.members.get(memberId).displayName;
}

function login() {
    // SC.initialize({
    //     client_id: SOUNDCLOUD_CLIENT_ID
    // });
    client.login(TOKEN);
}

module.exports.login = login
module.exports.playSong = playSong
module.exports.getMemberName = getMemberName;