/// <reference types="../CTAutocomplete" />
import "./features/Diana/DianaBurrows";
import "./features/Kuudra";
import "./features/diana/DianaMobDetect";
import "./features/general/CopyMessage";
import "./features/general/PartyCommands";
import "./features/general/Waypoints";
import "./features/general/fossilSolver";
import "./features/general/messageHider";
import "./features/general/pickuplog";
import "./features/guis/BobberCounter";
import "./features/guis/LegionCounter";
import "./features/slayer/BlazeSlayer";
import Settings from "./settings";
import "./utils/overlays";
import "./features/Diana/PartyFinder";

// in sbo addons packen
import "./features/dungeon/recognizeRareRoom";
import "./features/general/QOL";
import "./features/guis/SlayerGuis";
import { data } from "./utils/variables";
import { isDataLoaded } from "./utils/checkData";


register("command", () => Settings.openGUI()).setName("skyblockoverhaul").setAliases("sbo");

// Title bug fix
register("worldLoad", () => {
    Client.showTitle("", "", 0, 40, 20);
});

// dowload msg beispiel
const newVersion = "0.1.7" // hier neue version eintragen wenn changelog angezeigt werden soll
const downloadMsgReg = register("step", () => {
    if (!World.isLoaded()) return
    if (!isDataLoaded()) return
    if (data.downloadMsg) {
        downloadMsgReg.unregister()
        return
    }
    ChatLib.chat(ChatLib.getChatBreak("&b-"))
    ChatLib.chat(`&aThanks for importing &6SBO`)
    ChatLib.chat(`&7> &ayou can open the settings with /sbo`)
    ChatLib.chat(ChatLib.getChatBreak("&b-"))

    data.downloadMsg = true
    data.changelogVersion = newVersion
    data.save()
    
    downloadMsgReg.unregister()
}).setFps(1)

// changelog beispiel
const changeLogReg = register("step", () => {
    if (!World.isLoaded()) return
    if (!isDataLoaded()) return
    if (data.changelogVersion === newVersion) { 
        changeLogReg.unregister()
        return
    }
    ChatLib.chat(ChatLib.getChatBreak("&b-"))
    ChatLib.chat(`&6[SBO] &r&bVersion &e${newVersion}&r`)
    ChatLib.chat(`&aChangelog:`)
    ChatLib.chat(`&7> &aUpdate Fossil Solver (better detection)`)
    ChatLib.chat(`&7> &aRemoved Mineshaft title (hypixel added it)`)
    ChatLib.chat(`&7> &aAdded Guild Bridge Bot Formatter`)
    ChatLib.chat(`&7> &aAdded Party Checker For Diana (/sbocheckp)`)
    ChatLib.chat(`&7> &aAdded Player Checker For Diana (/sbocheck <player>)`)

    ChatLib.chat(`&7> &aFixed bug with Diana Burrows Detection`)
    ChatLib.chat(`&7> &aFixed the inquisitor line always pointing up`)
    ChatLib.chat(`&7> &aFixed bug with Blaze Slayer Effects`)
    ChatLib.chat(`&7> &aSome other minor bug fixes`)
    ChatLib.chat(ChatLib.getChatBreak("&b-"))

    data.changelogVersion = newVersion
    data.save()
    changeLogReg.unregister()
}).setFps(1)


import { HypixelModAPI } from "./../HypixelModAPI";

HypixelModAPI.setLogging(true);


HypixelModAPI.on("partyInfo", (partyInfo) => {
    // print all keys of partyInfo
    Object.keys(partyInfo).forEach(key => {
        print(key);
    })

})

register("command", () => {
    HypixelModAPI.requestPartyInfo()
}).setName("sbotest");

// register("step", () => {
//     // print each egg
//     print(`&r&6Eggs: &e${eggs.length}`);
//     eggs.forEach(egg => {
//         createWorldWaypoint("Egg", egg.x, egg.y, egg.z, 0, 255, 0);
//     })
// }).setFps(1);

// register("chat", (event) => {
//     Client.showTitle("&l&9!!!!!WORM!!!!!!", "&eKILL!!!", 0, 90, 20);
// }).setCriteria("&r&7&oYou hear the sound of something approaching...&r");

// register("chat", (message, event) => {
//     message = message.removeFormatting();
//     if (!message.includes("Powder") && !message.includes("Refelctor") && !message.includes("Blue Goblin Egg") && !message.includes("Heart")) {
//         cancel(event);
//     }
//     if (message.includes("Refelctor")) {
//         Client.showTitle("&9Robotron Reflector", "&eCarrot", 0, 40, 20);
//     }
//     if (message.includes("Blue Goblin Egg")) {
//         Client.showTitle("&3Blue Goblin Egg", "&eCarrot", 0, 40, 20);
//     }
// }).setCriteria("&r&aYou received ${message}");

// register("command", () => {
//     // Client.showTitle(`&r&6&l<&b&l&kO&6&l> &b&lINQUISITOR! &6&l<&b&l&kO&6&l>`, "&r&b[MVP&f+&b] RolexDE", 0, 90, 20);
//     Client.showTitle(`&5&lMinos Relic!`, "", 0, 25, 35);
//     ChatLib.chat("&6[SBO] &r&6&lRARE DROP! &5Minos Relic!");
//     setTimeout(function() {
//         World.playSound("random.levelup", 1, 1.0);
//    }, 0);
//     setTimeout(function() {
//         World.playSound("random.levelup", 1, 1.2);
//    }, 50);
//     setTimeout(function() {
//         World.playSound("random.levelup", 1, 1.4);
//    }, 100);
//     setTimeout(function() {
//         World.playSound("random.levelup", 1, 1.6);
//    }, 150);
// }).setName("sboinq");
