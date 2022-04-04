/*
 * Trial Template
 */

// Functions
module.exports = {
  getWelcomeTemplate: (user, channels) => {
    // config - i suppose its best put here atm
    const raidInfo = channels.cache
      .find((channel) => channel.name === "raid-info")
      .toString();
    const raidRules = channels.cache
      .find((channel) => channel.name === "raid-rules")
      .toString();
    const raidRoster = channels.cache
      .find((channel) => channel.name === "raid-roster")
      .toString();
    const raidAbsence = channels.cache
      .find((channel) => channel.name === "absence")
      .toString();

    // text
    const intro = `Welcome, ${user}!`;
    const info = `This channel is made so we can gather all the info about your trial and for the officers to review and being able to easily have a conversation with you :smiley:`;
    const questions = `:grey_question: **QUESTIONS**\n
        1. What's your ilvl and spec?\n
        2. How many set pieces do you got?\n
        3. What's your previous raid experience? Historically and current tier.\n
        4. Any warcraftlogs?\n
        5. Please link your raiderIO page\n
        6. Does our raid times fit you or can they be problematic? (18:30-21:30 Wed/Thu/Sun, 19-22 during summer)\n
        7. Where are you from and how old are you?\n
        8. Anything else you want to tell us about yourself to sell yourself in? Gaming related or otherwhise?`;
    const guildInfo = `:information_source: **DISCORD CHANNELS**\n
        ${raidInfo} - Contains need-to-know information about raids.\n
        ${raidRules} - The rules and required addons we have for raiding with us.\n
        ${raidRoster} - This is where the raid roster will be posted before each raid, you don't sign up to it - instead you're selected unless you have left absence.\n
        ${raidAbsence} - Use this channel when you will be absent for a raid, AT ALL TIMES!\n
        `;
    const lootRules = `:page_facing_up: **TRIAL INFO**\nCore raiders has priority over loot, if a item drops & core needs then it should be prioritized.\nOnly MS for Raid, M+/OS etc is NOT allowed - and if its BiS for one, but not for another, it goes to BiS`;
    const trialPeriodInfo = `Trial length can differ depending on how many we have to trial and how much we get to see from each individual.\nThings we look at are general gameplay, ability to see, acknowledge, correct and research own mistakes and spec. Social fit, reliability regarding attendance and leaving absence in due time.\nUsually we trial for around two resets. The more active you are in and out of raid in all channels (text or speech) the faster we get a clear picture of you as a person and player.`;
    return `${intro}\n\n${info}\n\n${questions}\n\n${guildInfo}\n${lootRules}\n\n${trialPeriodInfo}`;
  },
};
