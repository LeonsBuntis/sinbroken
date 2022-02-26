/*
 * Application
 */
const FormData = require("form-data");
const axios = require("axios");
const config = require("../config.json");

// Functions
module.exports = {
  async start(client) {
    const everyMinute = 1 * 60 * 1000;
    // const everyFifthMinute = 1 * 60 * 1000;
    const clientKey = config["blizzard-client"];
    const secret = config["blizzard-secret"];
    let lastActivity = null;
    const data = {
      clientKey,
      secret,
      lastActivity,
      interval: everyMinute,
      generalChannel: {},
    };
    client.channels
      .fetch(config["general-channel"])
      .then((channel) => (data.generalChannel = channel));
    schedule(data, client);
  },
};

async function schedule(data) {
  setTimeout(() => {
    const formData = new FormData();
    formData.append("grant_type", "client_credentials");
    axios
      .post("https://us.battle.net/oauth/token", formData, {
        auth: {
          username: data.clientKey,
          password: data.secret,
        },
        headers: {
          "Content-Type": `multipart/form-data; boundary=${formData._boundary}`,
        },
      })
      .then((response) => {
        const token = response.data.access_token;
        const members = `https://eu.api.blizzard.com/data/wow/guild/ravencrest/sinbreakers/roster?namespace=profile-eu&locale=en_US&access_token=${token}`;
        const achievements = `https://eu.api.blizzard.com/data/wow/guild/ravencrest/sinbreakers/activity?namespace=profile-eu&locale=en_US&access_token=${token}`;

        getActivity(
          achievements,
          members,
          data.lastActivity,
          data.generalChannel
        ).then((activity) => (activity ? (data.lastActivity = activity) : ""));
      });

    schedule(data);
  }, data.interval);
}

async function getActivity(
  achievements,
  members,
  lastActivity,
  generalChannel
) {
  let newActivity, latestActivity;
  await axios
    .get(achievements)
    .then((response) => {
      latestActivity = response.data.activities[0] ?? null;
    })
    .catch((e) => console.log(e.response.data));

  if (latestActivity && latestActivity.timestamp !== lastActivity) {
    await getRoster(members)
      .then((members) => {
        if (
          members.includes(latestActivity.character_achievement.character.id) &&
          generalChannel
        ) {
          newActivity = latestActivity.timestamp;
          generalChannel.send(
            `${latestActivity.character_achievement.character.name} just got the achievement **${latestActivity.character_achievement.achievement.name}**! <:1778_monkaW:897957671183990824> \n\nhttps://www.wowhead.com/achievement=${latestActivity.character_achievement.achievement.id}`
          );
        }
      })
      .catch((e) => console.log(e));
  }
  return newActivity;
}

async function getRoster(members) {
  let memberList = [];
  await axios
    .get(members)
    .then((response) => {
      if (!response.data || !response.data.members > 0) {
        return (memberList = null);
      }

      response.data.members.forEach((member) => {
        if (member.rank < 7) {
          memberList.push(member.character.id);
        }
      });
    })
    .catch((e) => console.log(e.response.data));
  return memberList;
}
