/// <reference types="../CTAutocomplete" />
import Settings from "./settings";
import "./features/general/pickuplog";
import "./features/diana/DianaMobDetect";
// import "./features/Diana/DianaWaypoints";
import "./features/guis/BobberCounter";
import "./features/general/PartyCommands";
import "./features/general/messageHider";
import "./features/general/Waypoints";
import "./features/diana/DianaBurrowDetect";
import "./features/slayer/BlazeSlayer";
import "./features/general/CopyMessage";

// in sbo addons packen
import "./features/general/QOL";
import "./features/guis/SlayerGuis";
import "./features/dungeon/recognizeRareRoom";
import "./features/general/alphaCheck";
import "./utils/overlays";

import { indexDict, indexDictReverse } from "./utils/constants";



register("command", () => Settings.openGUI()).setName("skyblockoverhaul").setAliases("sbo");

// Title bug fix
register("worldLoad", () => {
    Client.showTitle("", "", 0, 40, 20);
});

register("chat", (event) => {
    Client.showTitle("&l&9!!!!!WORM!!!!!!", "&eKILL!!!", 0, 90, 20);
}).setCriteria("&r&7&oYou hear the sound of something approaching...&r");

register("chat", (message, event) => {
    message = message.removeFormatting();
    if (!message.includes("Powder") && !message.includes("Refelctor") && !message.includes("Blue Goblin Egg") && !message.includes("Heart")) {
        cancel(event);
    }
    if (message.includes("Refelctor")) {
        Client.showTitle("&9Robotron Reflector", "&eCarrot", 0, 40, 20);
    }
    if (message.includes("Blue Goblin Egg")) {
        Client.showTitle("&3Blue Goblin Egg", "&eCarrot", 0, 40, 20);
    }
}).setCriteria("&r&aYou received ${message}");

register("chat", (player, message, event) =>{
    // cancel original message
    // send new guildbot message
    if (!player.includes(" ")) {
        cancel(event);
        player = player.removeFormatting();
        ChatLib.chat("&r&2Guild > &b[DC] &b" + player + "&r:" + message);
        // print("&r&2Guild > &b[DC] &b" + player + "&r:" + message);
    }
    else if (player.includes("replying to")) {
        cancel(event);
        let split = player.split(" ");
        let player1 = split[0];
        let player2 = split[3];
        ChatLib.chat("&r&2Guild > &b[DC] &b" + player1 + " &3replying to &b" + player2 + "&r:" + message);
        // print("&r&2Guild > &b[DC] &b" + player1 + " &3replying to &b" + player2 + "&r:" + message);
    }
}).setCriteria("&r&2Guild > &a[VIP] SlowDT &3[GM]&f: ${player}:${message}").setContains()
// geht
// &r&2Guild > &a[VIP] SlowDT &3[GM]&f: &rSuccesfully invited kenchika to the party!&r
// &r&2Guild > &b[MVP&2+&b] MasterNR &3[320]&f: &rnice&r
// testen
// &r&2Guild > &a[VIP] SlowDT &3[GM]&f: &rWiggleSnakey replying to dtAxl: WWDYM&r 

// register("command", () => {
//     // Client.showTitle(`&r&6&l<&b&l&kO&6&l> &b&lINQUISITOR! &6&l<&b&l&kO&6&l>`, "&r&b[MVP&f+&b] RolexDE", 0, 90, 20);
//     Client.showTitle(`&5&lMinos Relic!`, "", 0, 25, 35);
//     ChatLib.chat("&6[SBO] &r&6&lRARE DROP! &5Minos Relic!");
//     setTimeout(function() {
//         World.playSound("random.levelup", 1, 1.0);
//     }, 0);
//     setTimeout(function() {
//         World.playSound("random.levelup", 1, 1.2);
//     }, 50);
//     setTimeout(function() {
//         World.playSound("random.levelup", 1, 1.4);
//     }, 100);
//     setTimeout(function() {
//         World.playSound("random.levelup", 1, 1.6);
//     }, 150);
// }).setName("sboinq");

function calculatePositions(figure, mapSize) {
    let positions = [];
    let figureWidth = Math.max(...figure.map(p => p.x)) - Math.min(...figure.map(p => p.x));
    let figureHeight = Math.max(...figure.map(p => p.y)) - Math.min(...figure.map(p => p.y));

    for (let x = 0; x <= mapSize.x - figureWidth; x++) {
        for (let y = 0; y <= mapSize.y - figureHeight; y++) {
            let newPosition = figure.map(p => ({x: p.x + x, y: p.y + y}));
            positions.push(newPosition);
        }
    }

    return positions;
}

let mapSize = {x: 8, y: 5};
let anker = [{x:0,y:1},{x:1,y:2},{x:2,y:3},{x:3,y:3},{x:3,y:2},{x:3,y:1},{x:3,y:0},{x:4,y:3},{x:5,y:2},{x:6,y:1}];
let tusk = [{x:2,y:0},{x:1,y:1},{x:3,y:1},{x:0,y:2},{x:1,y:3},{x:2,y:4},{x:3,y:4},{x:4,y:4}];
let pyrmaide = [{x:0,y:0},{x:0,y:1},{x:1,y:1},{x:0,y:2},{x:1,y:2},{x:2,y:2},{x:0,y:3},{x:1,y:3},{x:2,y:3},{x:0,y:4},{x:1,y:4},{x:0,y:5}];
let helix = [{x:0,y:0},{x:1,y:0},{x:2,y:0},{x:3,y:0},{x:4,y:0},{x:0,y:1},{x:4,y:1},{x:0,y:2},{x:2,y:2},{x:4,y:2},{x:0,y:3},{x:2,y:3},{x:3,y:3},{x:4,y:3}];
let clubbed = [{x:6,y:0},{x:7,y:0},{x:1,y:1},{x:6,y:1},{x:7,y:1},{x:0,y:2},{x:5,y:2},{x:1,y:3},{x:2,y:3},{x:3,y:3},{x:4,y:3}];
let ugly = [{x:1,y:0},{x:0,y:1},{x:1,y:1},{x:2,y:1},{x:0,y:2},{x:1,y:2},{x:2,y:2},{x:3,y:2},{x:0,y:3},{x:1,y:3},{x:2,y:3},{x:3,y:3},{x:0,y:4},{x:1,y:4},{x:2,y:4},{x:1,y:5}];
let footprint = [{x:0,y:0},{x:2,y:0},{x:4,y:0},{x:0,y:1},{x:2,y:1},{x:4,y:1},{x:1,y:2},{x:2,y:2},{x:3,y:2},{x:1,y:3},{x:2,y:3},{x:3,y:3},{x:2,y:4}];
let allFigures = [anker, tusk, pyrmaide, helix, clubbed, ugly, footprint];

let allFossilCoords = [];
let counter = {}
let slotToHighlight = 0;
function resetCoords() {
    allFossilCoords = [];
    counter = {};
    slotToHighlight = 0;
    for (let figur of allFigures) {
        calculatePositions(figur, mapSize).forEach(pos => {
            pos.forEach(p => {
                allFossilCoords.push(p);
                // print("Fossil at: " + p.x + " " + p.y);
                let index = indexDict[`${p.x}${p.y}`];
                if (counter.hasOwnProperty(index)) {
                    counter[index]++;
                }
                else {
                    counter[index] = 1;
                }
            });
        });
    }
    
    // print index with most fossils
    let max = 0;
    for (let key in counter) {
        if (counter[key] > max) {
            max = counter[key];
            slotToHighlight = key;
        }
    }
    print("Index with most fossils: " + slotToHighlight + " with " + max + " fossils");
}
resetCoords();

let guiOpenedCounter = 0;
register("guiOpened", () => {
    setTimeout(() => {
        guiOpenedCounter++;
    }, 300);
});

register("guiClosed", () => {
    guiOpenedCounter = 0;
});


let fossilFoundAt = [];
let noFossilAt = [];
register("guiMouseClick", () => {
    let slot = Client.currentGui.getSlotUnderMouse()
    if (slot == null) return;
    let index = slot.getIndex();
    const container = Player.getContainer();
    if (container == null) return;
    if (container.getName() != "Fossil Excavator") return; 
    if (guiOpenedCounter < 2) return;
    setTimeout(() => {
        let item = container.getStackInSlot(index);
        if (item == null) {
            let xy = indexDictReverse[index];
            noFossilAt.push({x: xy[0], y: xy[1]});
            print("No Fossil at: " + xy[0] + " " + xy[1]);
            return;
        };
        if (item.getName() == "§6Fossil") {
            let xy = indexDictReverse[index];
            fossilFoundAt.push({x: xy[0], y: xy[1]});
            print("Fossil at: " + xy[0] + " " + xy[1]);
        }
        else {
            let xy = indexDictReverse[index];
            noFossilAt.push({x: xy[0], y: xy[1]});
            print("No Fossil at: " + xy[0] + " " + xy[1]);
        }
    }, 1000);
});

register("renderSlot", (slot) => {
    const container = Player.getContainer();
    if (container == null) return;
    if (container == undefined) return;
    if (container.getName() == "Fossil Excavator") {
        let item = slot.getItem();
        if (item == null) return;
        if (item.getName() != "§6Dirt") return;
        if (slot.getIndex() == slotToHighlight) {
            let x = slot.getDisplayX() + 5;
            let y = slot.getDisplayY();
            drawOutlinedString("§6Dirt", x, y, 0.5, 500)
        }
        
    }
});

function drawOutlinedString(text,x1,y1,scale,z) {
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