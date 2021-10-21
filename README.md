# Discord management bot for Sinbreakers WoW Guild  

## Features:  

### Warcraftlogs integration:  
Show data about a guild wipe in #logs channel  

### Loot Rolling  
Storing item stats data bis for specs etc in mongodb. Roll should have the stats of the item shown.  

!startroll <time> <item>  
    Start a roll and accept incoming rolls. Update and current winner and delete the roll message by the user.  
    <time> Duration of the roll.  
    <item> Item to roll for.  

!roll  
    Rolls between 1-100 to determine who gets the loot. (usable only when a loot is in progress.)  

### Trial Management  

!trial <name> <discordid> <outside>  
    Create text channel called trial-<name>, add <discordid> and officers to it.  
    <name>      The ingame name of the trial.  
    <discordid> The discord name of the trial. E.g. @xPremiix  
    <outside>   Whether the trial is on an outside realm. Optional: true/false  
    Send send generic info. E.g. Check raid info, raid rules.  

!trialvote <name>  
    Create a vote channel for the trial given by <name>  
    <name>      The ingame name of the trial  
