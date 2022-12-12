const Command = require("../../base/Command.js");
const fetch = require('node-fetch');
const windrose = require('windrose');
const ISO2 = require('../../assets/ISO2.json');


module.exports = class Weather extends Command {
    constructor (name, category) {
        super (name, category)
        this.name = name,
        this.description = 'View the weather in a place ',
        this.options = [
            {
                type: 3,
                name: "city",
                description: "The city to check the weather at",
                required: true
            },
            {
                type: 3,
                name: "country",
                description: "The country the city is in",
            }
        ],
        this.category = category,
        this.cooldown = 10000
    };

    async run (client, interaction, data) { //eslint-disable-line no-unused-vars

        await interaction.deferReply();

        const city = await interaction.options.get('city').value;
        let country = await interaction.options.get('country');
        let countryCode = "";

        if (country) {
            country = country.value;
            countryCode += ","
            if (ISO2.country[country.toProperCase().trim()]) {
                countryCode += ISO2.country[country.toProperCase().trim()];
            } else {
                countryCode += country.trim();
            }
        };

        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city + countryCode}&appid=${client.config.keys.weather}`, { headers: { 'User-Agent': client.config.userAgent }})
        .then(res => res.json())
        .then(json => {
            if (json.cod >= 200 && json.cod <= 299) {
                const tempCelsius = Math.round(json.main.temp - 273.15);
                let embedColor;
                if (tempCelsius < 0) {
                    embedColor = '#addeff';
                } else if (tempCelsius < 20) {
                    embedColor = '#4fb8ff';
                } else if (tempCelsius < 26) {
                    embedColor = '#ffea4f';
                } else if (tempCelsius < 31) {
                    embedColor = '#ffa14f';
                } else {
                    embedColor = '#ff614f';
                }
    
                const embed = new client.EmbedBuilder()
                .setTitle('Current conditions in ' + city.toProperCase() + ', ' + ISO2.code[json.sys.country])
                .setThumbnail(`https://openweathermap.org/img/wn/${json.weather[0].icon}@4x.png`)
                .setColor(embedColor)
                .addFields([
                    { name: 'Condition:', value: json.weather[0].main, inline: true },
                    { name: 'Temperature:', value: `${tempCelsius}°C ・ ${Math.round(json.main.temp * 9/5 - 459.67)}°F`, inline: true },
                    { name: 'Min/Max:', value:`
                        ${Math.round(json.main.temp_min - 273.15)}°C ・ ${Math.round(json.main.temp_max - 273.15)}°C
                        ${Math.round(json.main.temp_min * 9/5 - 459.67)}°F ・ ${Math.round(json.main.temp_max * 9/5 - 459.67)}°F
                    `, inline: true},
                    { name: 'Humidity:', value: `${json.main.humidity}%`, inline: true },
                    { name: 'Wind Speed:', value: `${Math.round(json.wind.speed * 10) / 10}km/h ・ ${Math.round(json.wind.speed * 10 / 1.609344)}mi/h`, inline: true },
                    { name: 'Wind Direction:', value: windrose.getPoint(json.wind.deg).name, inline: true}
                ])
                .setFooter({ text: 'Powered by openweathermap.org'});
    
                return interaction.editReply({embeds: [embed]});
            } else {
                if (json.message && json.message === 'city not found') {
                    return interaction.editReply(`${client.config.emojis.userError} ${city.toProperCase()} is not listed in my sources.`);
                }
                return interaction.editReply(`${client.config.emojis.botError} API error occurred: \`code ${json.cod}: ${json.message}\``);
            }
        })
        .catch(err => {
            return interaction.editReply(`${client.config.emojis.botError} An error has occurred: \`${err.stack}\``);
        });

    };
};