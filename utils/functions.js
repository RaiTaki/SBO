import { fetch } from "../../tska/polyfill/Fetch";
import settings, { getcustomSounds } from "../settings";
import { YELLOW, BOLD, GOLD, DARK_GREEN, LIGHT_PURPLE, DARK_PURPLE, GREEN, DARK_GRAY, GRAY, WHITE, AQUA, ITALIC, BLUE, UNDERLINE} from "../utils/constants";

import { registerWhen, dianaTrackerMayor as trackerMayor, dianaTrackerSession as trackerSession, dianaTrackerTotal as trackerTotal, data } from "./variables";
import { getWorld } from "./world";
import HypixelModAPI from "../../tska/api/ModAPI";

/**
 * @param {number} x - x coordinate
 * @param {number} y - y coordinate
 * @param {number} z - z coordinate 
 * @param {number} red - red color value [0-255] 
 * @param {number} green - green color value [0-255]
 * @param {number} blue - blue color value [0-255]
 * @param {number} alpha - alpha value [0-255]
 * @param {number} type - type of trace, calc is centering the line on the block
 * @param {number} lineWidth - width of the line
 */
export function trace (x, y, z, red, green, blue, alpha, type, lineWidth) {
    if (type === "calc")
    {
        if (x >= 0) {
            x = parseFloat(x) + 0.5;
        } else {
            x = parseFloat(x) - 0.5;
        }
        if (z >= 0)
        {
            z = parseFloat(z) + 0.5;
        } else {
            z = parseFloat(z) - 0.5;
        }
    }
    if (Player.isSneaking())
        drawLine(Player.getRenderX(), Player.getRenderY() + 1.54, Player.getRenderZ(), x, y, z, red, green, blue, alpha, lineWidth)
    else
        drawLine(Player.getRenderX(), Player.getRenderY() + 1.62, Player.getRenderZ(), x, y, z, red, green, blue, alpha, lineWidth)
}

function drawLine (x1, y1, z1, x2, y2, z2, red, green, blue, alpha, lineWidth)
{
    GlStateManager.func_179112_b(770,771)
    GlStateManager.func_179147_l()
    GL11.glLineWidth(lineWidth)
    GlStateManager.func_179090_x()
    GlStateManager.func_179097_i()
    GlStateManager.func_179132_a(false)

    Tessellator.begin(GL11.GL_LINE_STRIP).colorize(red, green, blue, alpha)
    Tessellator.pos(x1, y1, z1).tex(0, 0)
    Tessellator.pos(x2, y2, z2).tex(0, 0)
    Tessellator.draw()

    GlStateManager.func_179098_w()
    GlStateManager.func_179126_j()
    GlStateManager.func_179132_a(true)
    GlStateManager.func_179084_k()
    GL11.glLineWidth(2);
}

export function getClosest(origin, positions) {
    let closestPosition = positions.length > 0 ? positions[0] : [0, 0, 0];
    let closestDistance = 999;
    let distance = 999;

    positions.forEach(position => {
        distance = Math.hypot(origin[1] - position[1], origin[2] - position[2], origin[3] - position[3]);
        if (distance < closestDistance) {
            closestDistance = distance;
            closestPosition = position;
        }
    });

    return [closestPosition, closestDistance];
};
export function convertToPascalCase(input) {
    if (!input) return; 

    return input
        .split(" ")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join("");
}
/** 
 * @param {string} chat
 * @param {string} mob
 * @param {number} x
 * @param {number} y
 * @param {number} z
 */
export function mobAnnouncement(chat,mob,x,y,z) {
    x = Math.round(x);
    y = Math.round(y);
    z = Math.round(z);

    let zone = Scoreboard.getLines().find(line => line.getName().includes("⏣"));
    if(zone === undefined) zone = Scoreboard.getLines().find(line => line.getName().includes("ф"));
    const area = zone === undefined ? "None" : zone.getName().removeFormatting();

    ChatLib.command(`pc x: ${x} y: ${y} z: ${z} | ${mob} found at ${area}!`);
}

export function getSBID(item) {
    return item?.getNBT()?.getCompoundTag("tag")?.getCompoundTag("ExtraAttributes")?.getString("id") || null;
}
export function getSBUUID(item) {
    return item?.getNBT()?.getCompoundTag("tag")?.getCompoundTag("ExtraAttributes")?.getString("uuid") || null;
}

export function getTextureID(item) {
    let props = item?.getCompoundTag("tag")?.getCompoundTag("SkullOwner")?.getCompoundTag("Properties")?.toObject()
    if (!props?.textures) return null;
    try {
        return JSON.parse(new java.lang.String(java.util.Base64.getDecoder().decode(props.textures[0]?.Value)))["textures"]["SKIN"]["url"].split("/texture/")[1]
    } catch (e) {
        return null;
    }
}

let onAlpha = false;
export function isOnAlpha() {
    return onAlpha;
}

export function checkIfInSkyblock() {
    inSkyblockBool = (settings.alwaysInSkyblock || Scoreboard.getTitle()?.removeFormatting().includes("SKYBLOCK"));
    lines = Scoreboard.getLines();
    if (lines[0] != undefined) {
        onAlpha = lines[0].toString().toLowerCase().includes("alpha")
    } else {
        onAlpha = false;
    }
    return inSkyblockBool;
}

// returns if in skyblock //
let inSkyblock = false;
export function isInSkyblock() {
    return inSkyblock;
}

let state = {
    entityDeathOccurred: false
}

let state2 = {
    entityDeathOccurred: false
}

let state3 = {
    entityDeathOccurred: false
}

// return 2sec long true if entity death occurred //
export function mobDeath2SecsTrue() {
    return state.entityDeathOccurred;
}

// return 4sec long true if entity death occurred //
export function mobDeath4SecsTrue() {
    return state2.entityDeathOccurred;
}

export function inquisDeathTrue() {
    return state3.entityDeathOccurred;
}

let allowedToTrackSacks = false;
export function getAllowedToTrackSacks() {
    return allowedToTrackSacks;
}

registerWhen(register("guiOpened", () => {
    setTimeout(() => {
        if (Player.getContainer() != undefined) {
            if (Player.getContainer().getName() == "Sack of Sacks") {
                allowedToTrackSacks = false;
            }
        }
    }, 300);
}), () => settings.dianaTracker);

let dianaMobNames = ["Minos Inquisitor", "Minotaur", "Iron Golem", "Ocelot", "Minos Champion", "Zombie"];

function trackLsInq(tracker) {
    if (tracker["mobs"]["Minos Inquisitor Ls"] != null) {
        tracker["mobs"]["Minos Inquisitor Ls"] += 1;
    }
    else {
        tracker["mobs"]["Minos Inquisitor Ls"] = 1;
    }
    tracker.save();
}
export let hasTrackedInq = false;
registerWhen(register("entityDeath", (entity) => { // geht noch nicht weil er real enitiy names mint wie ZOMBIE, Iron Golem etc
    let dist = entity.distanceTo(Player.getPlayer());
    entityName = entity.getName().toString();
    if (gotLootShare() && entityName == "Minos Inquisitor" && !hasTrackedInq) {
        trackLsInq(trackerMayor);
        trackLsInq(trackerSession);
        trackLsInq(trackerTotal);
        data.inqsSinceLsChim += 1;
        if (data.inqsSinceLsChim >= 2) data.b2bChimLsInq = false;
        hasTrackedInq = true;
        setTimeout(() => {
            hasTrackedInq = false;
        }, 4000);
    }
    if (dianaMobNames[0].includes(entityName.trim())) {
        if (dist <= 30) {
            state3.entityDeathOccurred = true;
            setTimeout(() => {
                state3.entityDeathOccurred = false;
            }, 2000);
        }
    }
    if (dianaMobNames.includes(entityName.trim())) {
        if (dist <= 30 ) {
            allowedToTrackSacks = true;
            state.entityDeathOccurred = true;
            state2.entityDeathOccurred = true;
            setTimeout(() => {
                state.entityDeathOccurred = false;
            }, 2000);
            setTimeout(() => {
                state2.entityDeathOccurred = false;
            }, 4000);
        }
    }
}), () => getWorld() === "Hub" && settings.dianaTracker);

export function getDateString(date) {
    return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
}

// string to title case //
export function toTitleCase(str) {
    return str.replace(
      /\w\S*/g,
      function(txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      }
    );
}

// read player inventory //
export function readPlayerInventory(type="") {
    let slots = 0;
    if (!worldLoaded) return {};
    if (type === "hotbar") {
        slots = 8;
    }
    else {
        slots = 39;
    }
    let playerItems = {}
    let playerInv = Player.getInventory();
    if (playerInv == null) return playerItems;
    let playerInvItems = playerInv.getItems();
    // const inventory = Player.getContainer();
    for (let i in playerInv.getItems()) {
        if (i <= slots) {
            if (playerInvItems[i] !== null && ![8, 36, 37, 38, 39].includes(parseInt(i))) { 
                if (playerItems[getSBID(playerInvItems[i])]) {
                    playerItems[getSBID(playerInvItems[i])][0] += playerInvItems[i].getStackSize();
                }
                else {
                    playerItems[getSBID(playerInvItems[i])] = [playerInvItems[i].getStackSize(), playerInvItems[i].getName()];
                }
            }
        }
    }
    return playerItems;
}

// check if item is in hotbar //
export function checkItemInHotbar(item) {
    if (!worldLoaded) return false;
    const hotbarItems = readPlayerInventory("hotbar");
    for (let i in hotbarItems) {
        if (item == i) {
            return true;
        }
    }
    return false;
}

export function checkItemInInv(item) {
    if (!worldLoaded) return false;
    const playerInv = readPlayerInventory();
    for (let i in playerInv) {
        if (item == i) {
            return true;
        }
    }
    return false;
}

export function checkHotbarItems() {
    let hotbarItems = []
    if (!worldLoaded) return hotbarItems;
    let playerInv = Player.getInventory();
    if (playerInv == null) return hotbarItems;
    let playerInvItems = playerInv.getItems();
    playerInvItems.forEach((item, i) => {
        if (i <= 8) {
            if (playerInvItems[i] !== null) {
                hotbarItems.push(item);
            }
        }
    });
    return hotbarItems;
}


export function checkDaxeEnchants() {
    let chimVbool, lootingVbool, divineGift3bool = false;
    if (!worldLoaded) return [false, false, false];
    let hotbarItems = checkHotbarItems();
    for (let item of hotbarItems) {
        let nbtData = item.getNBT();
        if (!nbtData) return [false, false, false];
        let itemName = nbtData.getCompoundTag("tag").getCompoundTag("display").getString("Name");
        if (!itemName) itemName = "";
        itemName = itemName.removeFormatting().trim();
        enchantments = nbtData.getCompoundTag("tag").getCompoundTag("ExtraAttributes").getCompoundTag("enchantments");
        if (!enchantments) enchantments = {};
        if (itemName.includes("Daedalus Axe")) {
            if (enchantments.getInteger("ultimate_chimera") == 5) {
                chimVbool = true;
            }
            if (enchantments.getInteger("looting") == 5) {
                lootingVbool = true;
            }
            if (enchantments.getInteger("divine_gift") == 3) {
                divineGift3bool = true;
            }
        }
        continue;
    }
    return [chimVbool, lootingVbool, divineGift3bool];
}

export function playerHasSpade() {
    return spadeBool;
}

let spadeBool = false;
register("step", () => {
    spadeBool = checkItemInInv("ANCESTRAL_SPADE");
}).setFps(1)

// return 1sec long true if player got loot share //
export function gotLootShare() {
    return lootShareBool;
}

// check if player got loot share //
let lootShareBool = false;
register("chat" , (player) => {
    lootShareBool = true;
    setTimeout(() => {
        lootShareBool = false;
    }, 2000);
}).setCriteria("&r&e&lLOOT SHARE &r&r&r&fYou received loot for assisting &r${player}&r&f!&r");
// &r&e&lLOOT SHARE &r&r&r&fYou received loot for assisting &r&6D4rkSwift&r&f!&r

// check if in skyblock //
register("step", () => {
    inSkyblock = checkIfInSkyblock();
}).setFps(1);


export function initializeGuiSettings() {
    return {
        MobLoc: { "x": 15, "y": 22, "s": 1 },
        LootLoc: { "x": 15, "y": 112, "s": 1 },
        BobberLoc: { "x": 10, "y": 295, "s": 1 },
        MythosHpLoc: { "x": 400, "y": 50, "s": 1 },
        EffectsLoc: { "x": 10, "y": 200, "s": 1 },
        BlazeLoc: { "x": 10, "y": 10, "s": 1 },
        fossilLoc: { "x": 275, "y": 185, "s": 1 },
        LegionLoc: { "x": 10, "y": 310, "s": 1 },
        StatsLoc: { "x": 15, "y": 290, "s": 1 },
        AvgMagicFindLoc: { "x": 15, "y": 350, "s": 1 },
        PickupLogLoc: { "x": 2, "y": 2, "s": 1 },
        CrownLoc: { "x": 15, "y": 435, "s": 1 },
        GoldenFishLoc: { "x": 15, "y": 50, "s": 1 },   
        FlareLoc: { "x": 170, "y": 150, "s": 1 },
        InquisLoc: { "x": 40, "y": 22, "s": 1 },
    };
}

export function loadGuiSettings() {
    let loadedSettings = {};
    try {
        loadedSettings = JSON.parse(FileLib.read("SBO", "guiSettings.json")) || initializeGuiSettings();
        loadedSettings = checkSettings(loadedSettings);
    } 
    catch (e) {
        loadedSettings = initializeGuiSettings();
        saveGuiSettings(loadedSettings);
    }
    return loadedSettings;
}

function checkSettings(loadedSettings) {
    // Get the default settings
    const defaultSettings = initializeGuiSettings();

    // Loop through default settings and ensure loaded settings have all properties
    for (let key in defaultSettings) {
        if (!loadedSettings.hasOwnProperty(key)) {
            loadedSettings[key] = defaultSettings[key];
        }
    }
    
    return loadedSettings;
}

export function saveGuiSettings(guiSettings) {
    FileLib.write("SBO", "guiSettings.json", JSON.stringify(guiSettings, null, 4));
}

export function drawRect(x1,y1,scale,z) {
    let x = x1/scale
    let y = y1/scale
    // settings.slotColor: java.awt.Color[r=19,g=145,b=224]
    let color = Renderer.color(settings.slotColor.getRed(), settings.slotColor.getGreen(), settings.slotColor.getBlue(), 200)
    Renderer.translate(0, 0, z)
    Renderer.scale(scale,scale)
    Renderer.drawRect(color, x, y, 6.5, 6.5);
}

export function drawOutlinedString(text,x1,y1,scale,z) {
    let outlineString = "&0" + ChatLib.removeFormatting(text)
    let x = x1/scale
    let y = y1/scale

    Renderer.translate(0,0,z)
    Renderer.scale(scale,scale)
    Renderer.drawString(outlineString, x + 1, y)

    Renderer.translate(0,0,z)
    Renderer.scale(scale,scale)
    Renderer.drawString(outlineString, x - 1, y)

    Renderer.translate(0,0,z)
    Renderer.scale(scale,scale)
    Renderer.drawString(outlineString, x, y + 1)

    Renderer.translate(0,0,z)
    Renderer.scale(scale,scale)
    Renderer.drawString(outlineString, x, y - 1)

    Renderer.translate(0,0,z)
    Renderer.scale(scale,scale)
    Renderer.drawString(text, x, y)
}

let printBool = false;
export function printDev(msg) {
    if(!printBool) return;
    return print("[DEV]: " + msg);
}

export function getplayername(player) {
    let num
    let name
    num = player.indexOf(']')
    if (num == -1) {                // This part is only  ***When I wrote this, god and I knew how it worked, now only he knows.***
        num = player.indexOf('&7')  // for nons because
        if (num == -1) {            // it doesnt work
            num = -2                // without that
        }                           // #BanNons
    }
    name = player.substring(num+2).removeFormatting()
    name = name.replaceAll(/[^a-zA-Z0-9_]/g, '').replaceAll(' ', '').trim()
    return name
}

export function isWorldLoaded() {
    return worldLoaded;
}

let worldLoaded = false;
register("worldUnload", () => {
    worldLoaded = false;
});

register("worldLoad", () => {
    setTimeout(() => {
        worldLoaded = true;
    }, 1000);
});

register("command", () => {
    printBool = !printBool;
    if(printBool) {
        ChatLib.chat("&6[SBO] &aDev Mode enabled");
    }
    else {
        ChatLib.chat("&6[SBO] &aDev Mode disabled");
    }
}).setName("sbodev")

export function playCustomSound(sound, volume) {
    if (sound != "" && sound != undefined && sound != "none") {
        if (sound.includes(".ogg")) sound = sound.replace(".ogg", "");
        if (FileLib.exists(Config.modulesFolder.replace("modules", "images") + `/${sound}.ogg`)) {
            new Sound({ source: new java.lang.String(sound + ".ogg") }).setVolume(volume/100).play()
        }
        else {
            ChatLib.chat(`&6[SBO] &cSound file not found! (if the filename is correct, make sure to reload ct by "/ct load")`);
        }
    }
}

let customSounds = undefined
register("command", () => {
    customSounds = getcustomSounds();
    playCustomSound(customSounds[settings.customSound], settings.customVolume);
}).setName("playsbotestsound");

let lastUpdate = 0;
let updateing = false;
let dianaItems = undefined;
let bazaarItems = undefined;

export function getDianaItems() {
    return dianaItems;
}

export function getBazaarItems() {
    return bazaarItems;
}

register("step", () => {
    // update every 5 minutes
    if (updateing) return;
    if (Date.now() - lastUpdate > 300000 || lastUpdate == 0) {
        updateing = true;
        lastUpdate = Date.now();
        updateItemValues()
        setTimeout(() => {
            updateing = false;
        }, 300000);
    }
}).setFps(1);

function updateItemValues() {
    fetch("https://api.skyblockoverhaul.com/ahItems", {
        json: true
    }).then((response)=>{
        dianaItems = response[1];
        if (dianaItems == undefined) {
            print("diana items undefined");
            dianaItems = {};
        }
    }).catch((error)=>{
        console.error("An error occurred: " + error);
    });

    fetch("https://api.hypixel.net/skyblock/bazaar?product", {
        json: true
    }).then((response)=>{
        bazaarItems = response;
        if (bazaarItems == undefined) {
            print("bazaar items undefined");
            bazaarItems = {};
        }
    }).catch((error)=>{
        console.error("bazaar " + error);
    });
}

let activeUsers = undefined
export function getActiveUsers(useCallback = false, callback = null) {
    fetch("https://api.skyblockoverhaul.com/activeUsers", {
        json: true
    }).then((response) => {
        activeUsers = response.activeUsers;

        if (activeUsers === undefined) {
            print("active users undefined");
            activeUsers = 0;
        }

        if (useCallback && callback) {
            callback(activeUsers);
        } else {
            ChatLib.chat("&6[SBO] &aActive user: &e" + activeUsers);
        }
    }).catch((error) => {
        console.error("An error occurred: " + error);
    });
}

register("command", () => {
    getActiveUsers();
}).setName("sboactiveuser");

export function getBazaarPriceDiana(itemId) {
    if (bazaarItems == undefined) return 0;
    if (bazaarItems.success == false) return 0;
    let product = bazaarItems.products[itemId];
    if (product == undefined) return 0;
    if (settings.bazaarSettingDiana == 0) {
        return product.quick_status.sellPrice;
    }
    else {
        return product.quick_status.buyPrice;
    }
}

export function getDianaAhPrice(itemId) {
    if (dianaItems == undefined) return 0;
    if (dianaItems[itemId] == undefined) return 0;
    if (itemId == "CROWN_OF_GREED") {
        if (dianaItems[itemId].price < 1000000) return 1000000;
        return dianaItems[itemId].price;
    }
    return dianaItems[itemId].price;
}

export function getPrice(item, tracker = undefined) {
    if (tracker) {
        if (item.bazaarKey) {
            return getBazaarPriceDiana(item.bazaarKey) * tracker["items"][item.key];
        } else if (item.ahKey) {
            return getDianaAhPrice(item.ahKey) * tracker["items"][item.key];
        }
        return 0;
    }
}

export function formatNumber(number) {
    if(number == undefined) return 0;
    if (number >= 1000000000) {
        return (number / 1000000000).toFixed(2) + "b";
    }
    else if (number >= 1000000) {
        return (number / 1000000).toFixed(1) + "m";  
    }
    else if (number >= 1000) {
        return (number / 1000).toFixed(1) + "k";
    }
    return parseFloat(number).toFixed(0);
}

export function formatNumberCommas(number) {
    // add commas to number 1000000 -> 1,000,000
    if(number == undefined) return 0;
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function getPurse() {
    let scoreboard = Scoreboard.getLines();
    if (scoreboard != undefined) {
        for (let line of scoreboard) {
            line = line.getName().removeFormatting();
            if (line.includes("Purse")) {
                let parts = line.split(": ");
                parts[1] = parts[1].split(" ")[0];
                parts[1] = parts[1].replace(/[^0-9,]/g, '').replaceAll(",", "");
                let purse = parseInt(parts[1]);
                return purse; 
            }
        }      
    }
    return -1;
}

// calc percent from tracker //
export function calcPercent(trackerToCalc, type) {
    if (trackerToCalc == undefined) return;
    percentDict = {};
    if (type == "mobs") {
        for (let mob in trackerToCalc["mobs"]) {
            percentDict[mob] = parseFloat((trackerToCalc["mobs"][mob] / trackerToCalc["mobs"]["TotalMobs"] * 100).toFixed(2));
        }
        return percentDict;
    }
    else if (type == "inquis") {
        percentDict["DWARF_TURTLE_SHELMET"] = parseFloat((trackerToCalc["inquis"]["DWARF_TURTLE_SHELMET"] / trackerToCalc["mobs"]["Minos Inquisitor"] * 100).toFixed(2));
        percentDict["CROCHET_TIGER_PLUSHIE"] = parseFloat((trackerToCalc["inquis"]["CROCHET_TIGER_PLUSHIE"] / trackerToCalc["mobs"]["Minos Inquisitor"] * 100).toFixed(2));
        percentDict["ANTIQUE_REMEDIES"] = parseFloat((trackerToCalc["inquis"]["ANTIQUE_REMEDIES"] / trackerToCalc["mobs"]["Minos Inquisitor"] * 100).toFixed(2));
        percentDict["DWARF_TURTLE_SHELMET_LS"] = parseFloat((trackerToCalc["inquis"]["DWARF_TURTLE_SHELMET_LS"] / trackerToCalc["mobs"]["Minos Inquisitor Ls"] * 100).toFixed(2));
        percentDict["CROCHET_TIGER_PLUSHIE_LS"] = parseFloat((trackerToCalc["inquis"]["CROCHET_TIGER_PLUSHIE_LS"] / trackerToCalc["mobs"]["Minos Inquisitor Ls"] * 100).toFixed(2));
        percentDict["ANTIQUE_REMEDIES_LS"] = parseFloat((trackerToCalc["inquis"]["ANTIQUE_REMEDIES_LS"] / trackerToCalc["mobs"]["Minos Inquisitor Ls"] * 100).toFixed(2));
        return percentDict;
    }
    else {
        for (let obj in ["Minos Inquisitor", "Minos Champion", "Minotaur"].values()) {
            switch (obj) {
                case "Minos Inquisitor":
                    percentDict["Chimera"] = parseFloat((trackerToCalc["items"]["Chimera"] / trackerToCalc["mobs"][obj] * 100).toFixed(2));
                    percentDict["ChimeraLs"] = parseFloat((trackerToCalc["items"]["ChimeraLs"] / trackerToCalc["mobs"]["Minos Inquisitor Ls"] * 100).toFixed(2));
                    break;
                case "Minos Champion":
                    percentDict["MINOS_RELIC"] = parseFloat((trackerToCalc["items"]["MINOS_RELIC"] / trackerToCalc["mobs"][obj] * 100).toFixed(2));
                    break;
                case "Minotaur":
                    percentDict["Daedalus Stick"] = parseFloat((trackerToCalc["items"]["Daedalus Stick"] / trackerToCalc["mobs"][obj] * 100).toFixed(2));
                    break;
            }
        }
        return percentDict;
    }
}

export function calcPercentOne(tracker, item, mob = undefined) {
    if (tracker == undefined) return;
    if (mob) {
        return parseFloat((tracker["items"][item] / tracker["mobs"][mob] * 100).toFixed(2));
    } else {
        return parseFloat((tracker["mobs"][item] / tracker["mobs"]["TotalMobs"] * 100).toFixed(2));  
    }
}

export function getTracker(setting) {
    switch (setting) {
        case 1:
            return trackerTotal;
        case 2:
            return trackerMayor;
        case 3:
            return trackerSession;
    }
}

export function formatTime(milliseconds) {
    const totalSeconds = parseInt(milliseconds / 1000);
    const totalMinutes = parseInt(totalSeconds / 60);
    const totalHours = parseInt(totalMinutes / 60);
    const days = parseInt(totalHours / 24);
    const hours = totalHours % 24;
    const minutes = totalMinutes % 60;
    const seconds = totalSeconds % 60;

    let formattedTime = '';
    if (days > 0) {
        formattedTime += `${days}d `;
    }
    if (hours > 0 || days > 0) {
        formattedTime += `${hours}h `;
    }
    if (minutes > 0 || hours > 0 || days > 0) {
        formattedTime += `${minutes}m `;
    }
    if (minutes < 1 && hours == 0 && days == 0) {
        formattedTime += `${seconds}s `;
    }

    return formattedTime.trim();
}

export function formatTimeMinSec(milliseconds) {
    const totalSeconds = parseInt(milliseconds / 1000);
    const totalMinutes = parseInt(totalSeconds / 60);
    const totalHours = parseInt(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    const seconds = totalSeconds % 60;
    const hours = totalHours % 24;

    return `${hours > 0 ? hours + "h " : ""}${minutes > 0 ? minutes + "m " : ""}${seconds}s`;
}

let dianaMayorTotalProfit = 0;
let dianaMayorOfferType
let profitPerHour = 0;
let burrowsPerHour = 0;
let mobsPerHour = 0;

export function getBurrowsPerHour() {
    return burrowsPerHour;
}

export function setBurrowsPerHour(burrows) {
    burrowsPerHour = burrows;
}

export function getMobsPerHour() {
    return mobsPerHour;
}

export function setMobsPerHour(mobs) {
    mobsPerHour = mobs;
}

export function getDianaMayorTotalProfitAndOfferType(total = false) {
    return [dianaMayorTotalProfit, dianaMayorOfferType, profitPerHour];
}

export function setDianaMayorTotalProfit(profit, offerType, profitHour) {
    dianaMayorTotalProfit = profit;
    dianaMayorOfferType = offerType;
    profitPerHour = profitHour;
}

export const itemData = [
    { name: "Chimera", key: "Chimera", color: LIGHT_PURPLE, bazaarKey: "ENCHANTMENT_ULTIMATE_CHIMERA_1", hasPercent: true},
    { name: "Chimera &7[&bLS&7]", key: "ChimeraLs", color: LIGHT_PURPLE, bazaarKey: "ENCHANTMENT_ULTIMATE_CHIMERA_1", hasPercent: true},
    { name: "Minos Relic", key: "MINOS_RELIC", color: DARK_PURPLE, ahKey: "MINOS_RELIC", hasPercent: true },
    { name: "Daedalus Stick", key: "Daedalus Stick", color: GOLD, bazaarKey: "DAEDALUS_STICK", hasPercent: true },
    { name: "Crown of Greed", key: "Crown of Greed", color: GOLD, ahKey: "CROWN_OF_GREED" },
    { name: "Souvenir", key: "Washed-up Souvenir", color: GOLD, ahKey: "WASHED_UP_SOUVENIR" },
    { name: "Griffin Feather", key: "Griffin Feather", color: GOLD, bazaarKey: "GRIFFIN_FEATHER" },
    { name: "Turtle Shelmet", key: "DWARF_TURTLE_SHELMET", color: DARK_GREEN, ahKey: "DWARF_TURTLE_SHELMET" },
    { name: "Tiger Plushie", key: "CROCHET_TIGER_PLUSHIE", color: DARK_GREEN, ahKey: "CROCHET_TIGER_PLUSHIE" },
    { name: "Antique Remedies", key: "ANTIQUE_REMEDIES", color: DARK_GREEN, ahKey: "ANTIQUE_REMEDIES" },
    { name: "Ancient Claws", key: "ANCIENT_CLAW", color: BLUE, bazaarKey: "ANCIENT_CLAW", format: true },
    { name: "Enchanted Claws", key: "ENCHANTED_ANCIENT_CLAW", color: BLUE, bazaarKey: "ENCHANTED_ANCIENT_CLAW" },
    { name: "Enchanted Gold", key: "ENCHANTED_GOLD", color: BLUE, bazaarKey: "ENCHANTED_GOLD", format: true },
    { name: "Enchanted Iron", key: "ENCHANTED_IRON", color: BLUE, bazaarKey: "ENCHANTED_IRON", format: true }
];

export function getTotalValue(tracker) {
    let totalValue = 0;
    for (let item of itemData) {
        totalValue += getPrice(item, tracker);
    }
    totalValue += tracker["items"]["coins"];
    return totalValue;
}

export function getRarity(item){
    switch (item.toLowerCase().trim()) {
        case "common":
            return "&f" + item;
        case "uncommon":
            return "&a" + item;
        case "rare":
            return "&9" + item;
        case "epic":
            return "&5" + item;
        case "legendary":
            return "&6" + item;
        case "mythic":
            return "&d" + item;
        default:
            return "&7";
    }
}

export function getNumberColor(number, range) {
    if (number === range) {
        return "&c" + number;
    }
    else if (number === range - 1) {
        return "&6" + number;
    }
    else {
        return "&9" + number;
    }
}

export function getGriffinItemColor(item, noColors = false) {
    if (item == 0 || !item) return "";
    let name = item.replace("PET_ITEM_", "");
    name = toTitleCase(name.replaceAll("_", " "));
    if (noColors) return name;
    switch (name) {
        case "Four Eyed Fish":
            return "&5" + name;
        case "Dwarf Turtle Shelmet":
            return "&a" + name;
        case "Crochet Tiger Plushie":
            return "&5" + name;
        case "Antique Remedies":
            return "&5" + name;
        case "Lucky Clover":
            return "&a" + name;
        case "Minos Relic":
            return "&5" + name;
        default:
            return "&7" + name;
    }
}

export function getMagicFind(mf) {
    let magicFindMatch = mf.match(/\+(&r&b)?(\d+)/);
    let magicFind = parseInt((magicFindMatch ? magicFindMatch[2] : 0));
    return magicFind;
}

export function matchLvlToColor(lvl) {
    if (lvl >= 480) {
        return "&4" + lvl;
    } else if (lvl >= 440) {
        return "&c" + lvl;
    } else if (lvl >= 400) {
        return "&6" + lvl;
    } else if (lvl >= 360) {
        return "&5" + lvl;
    } else if (lvl >= 320) {
        return "&d" + lvl;
    } else if (lvl >= 280) {
        return "&9" + lvl;
    } else if (lvl >= 240) {
        return "&3" + lvl;
    } else if (lvl >= 200) {
        return "&b" + lvl;
    } else {
        return "&7" + lvl;
    }
}

export function matchDianaKillsToColor(kills) {
    if (kills >= 200000) {
        return "&6" + formatNumberCommas(kills);
    }
    else if (kills >= 150000) {
        return "&e" + formatNumberCommas(kills);
    }
    else if (kills >= 100000) {
        return "&c" + formatNumberCommas(kills);
    }
    else if (kills >= 75000) {
        return "&d" + formatNumberCommas(kills);
    }
    else if (kills >= 50000) {
        return "&9" + formatNumberCommas(kills);
    }
    else if (kills >= 25000) {
        return "&a" + formatNumberCommas(kills);
    }
    else if (kills >= 10000) {
        return "&2" + formatNumberCommas(kills);
    }
    else {
        return "&7" + formatNumberCommas(kills);
    }
}

// gui functions/classes
export function drawRectangleOutline(color, x, y, width, height, thickness) {
    Renderer.drawLine(color, x , y, x + width, y, thickness); // Top Line
    Renderer.drawLine(color, x, y, x, y + height, thickness); // Left Line
    Renderer.drawLine(color, x , y + height, x + width, y + height, thickness); // Bottom Line
    Renderer.drawLine(color, x + width, y, x + width, y + height, thickness); // Right Line
}

export function checkSendInqMsg(since) {
    let text = settings.announceKilltext;
    if (text != "") {
        if (text.includes("{since}")) {

            text = text.replace(/{since}/g, since);
        }
        if (text.includes("{chance}")) {
            let chance = calcPercentOne(trackerMayor, "Minos Inquisitor")
            text = text.replace(/{chance}/g, chance);
        }
        return [true, text];
    } else {
        return [false, ""];
    }
}

let dianaStats = undefined;
let loadingDianaStats = false;
export function getDianaStats(useCallback = false, callback = null) {
    if (loadingDianaStats) return;
    if (dianaStats != undefined) {
        return dianaStats;
    }
    else {
        loadingDianaStats = true;
        if (data.dianaStatsUpdated && Date.now() - data.dianaStatsUpdated < 600000) { // 10 minutes
            dianaStats = data.dianaStats;
            loadingDianaStats = false;
            if (useCallback && callback) {
                callback(dianaStats);
            }
            return;
        }
        fetch("https://api.skyblockoverhaul.com/partyInfoByUuids?uuids=" + Player.getUUID().replaceAll("-", "") + "&readcache=false", {
            json: true
        }).then((response) => {
            dianaStats = response.PartyInfo[0];
            data.dianaStats = dianaStats;
            data.dianaStatsUpdated = Date.now();
            data.save();	
            loadingDianaStats = false;
            if (useCallback && callback) {
                callback(dianaStats);
            } 
        }).catch((error) => {
            console.error("An error occurred while loding Diana Stats: " + error);
        });
    }
}

const Runnable = Java.type("java.lang.Runnable");
const Executors = Java.type("java.util.concurrent.Executors");
const TimeUnit = Java.type("java.util.concurrent.TimeUnit");
const scheduler = Executors.newSingleThreadScheduledExecutor();
export function setTimeout(callback, delay, ...args) {
    args = args || [];

    const timer = scheduler.schedule(
        new JavaAdapter(Runnable, {
            run: function() {
                callback(...args);
            }
        }),
        delay,
        TimeUnit.MILLISECONDS
    );
    return timer;
}

export function cancelTimeout(timer) {
    timer.cancel(true);
}

export function calcBurrowsPerHour(burrows, playtime) { // playtime in milliseconds
    return (burrows / (playtime / 3600000)).toFixed(2);
}

export function calcTotalProfit(item, amount) {
    let totalProfit = 0;
    switch (item) {
        case "Coins":
            totalProfit += amount;
            break;
        case "Griffin Feather":
            totalProfit += getBazaarPriceDiana("GRIFFIN_FEATHER") * amount;
            break;
        case "Ancient Claw":
        case "Ancient Claws":
            totalProfit += getBazaarPriceDiana("ANCIENT_CLAW") * amount;
            break;
        case "Enchanted Ancient Claw":
        case "Enchanted Ancient Claws":
            totalProfit += getBazaarPriceDiana("ENCHANTED_ANCIENT_CLAW") * amount;
            break;
        case "Enchanted Gold":
            totalProfit += getBazaarPriceDiana("ENCHANTED_GOLD") * amount;
            break;
        case "Enchanted Iron":
            totalProfit += getBazaarPriceDiana("ENCHANTED_IRON") * amount;
            break;
        case "Chimera":
            totalProfit += getBazaarPriceDiana("ENCHANTMENT_ULTIMATE_CHIMERA_1") * amount;
            break;
        case "Minos Relic":
            totalProfit += getDianaAhPrice("MINOS_RELIC") * amount;
            break;
        case "Daedalus Stick":
            totalProfit += getBazaarPriceDiana("DAEDALUS_STICK") * amount;
            break;
        case "Crown Of Greed":
        case "Crown of Greed":
            totalProfit += getDianaAhPrice("CROWN_OF_GREED") * amount;
            break;
        case "Washed-up Souvenir":
            totalProfit += getDianaAhPrice("WASHED_UP_SOUVENIR") * amount;
            break;
        case "Dwarf Turtle Shelmet":
            totalProfit += getDianaAhPrice("DWARF_TURTLE_SHELMET") * amount;
            break;
        case "Crochet Tiger Plushie":
            totalProfit += getDianaAhPrice("CROCHET_TIGER_PLUSHIE") * amount;
            break;
        case "Antique Remedies":
            totalProfit += getDianaAhPrice("ANTIQUE_REMEDIES") * amount;
            break;
        case "Chimerals":
            totalProfit += getBazaarPriceDiana("ENCHANTMENT_ULTIMATE_CHIMERA_1") * amount;
            break;
    }
    return totalProfit;
}

export function getParty() {
    return party;
}

let party = [];
HypixelModAPI.on("partyinfo", (inparty, partyInfo) => {
    party = [];
    Object.keys(partyInfo).forEach(key => {
        if (key != Player.getUUID()) {
            party.push(key);
        }
    })
});
