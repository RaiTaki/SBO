import settings from "../../settings";
import { registerWhen } from "../../utils/variables";
import { getWorld } from "../../utils/world";
import { mythosMobHpOverlay } from "./../guis/DianaGuis";
import { checkDiana } from "../../utils/checkDiana";
import RenderLibV2 from "../../../RenderLibv2";
import { printDev } from "../../utils/functions";

export function getMobsToDisplay() {
    return names;
}

registerWhen(register("chat", (woah) => {
    if (checkDiana()) {
        if(settings.inquisDetect) {
            ChatLib.command("pc x: " + Math.round(Player.getLastX()) + ", " + "y: " + Math.round(Player.getLastY()) + ", " + "z: " + Math.round(Player.getLastZ()));
        }
        if(settings.announceKill !== "") {
            setTimeout(function() 
                {ChatLib.command("pc " + settings.announceKill);
            }, 5000);
        }
    }
}).setCriteria("&r&c&l${woah} &r&eYou dug out a &r&2Minos Inquisitor&r&e!&r"), () => settings.inquisDetect || settings.announceKill);

let Mobs = [];
let inqs = [];
registerWhen(register("step", () => {
    if (checkDiana()) {
        World.getAllEntitiesOfType(net.minecraft.entity.item.EntityArmorStand).forEach((mob) => {
            let name = mob.getName();   
            if (Mobs.filter((e) => e.getUUID() === mob.getUUID()).length === 0) {
                if ((name.includes("Exalted") || name.includes("Stalwart")) && !name.split(" ")[2].startsWith("0")) { //  || name.includes("Graveyard Zombie")
                    Mobs.push(mob);
                }
                
            }
        });
        Mobs = Mobs.filter((e) => !e.getEntity()["field_70128_L"]);
        inqs = Mobs.filter((mob) => mob.getName().includes("Inquisitor")); // || mob.getName().includes("Graveyard Zombie")
    }
}).setFps(1), () => settings.mythosMobHp || settings.inqHighlight || settings.inqCircle && getWorld() === "Hub");

let names = [];
registerWhen(register("step", () => {
    if (checkDiana()) {
        names = [];
        Mobs.forEach((nameTag) => {
            names.push(nameTag.getName());
        });
        mythosMobHpOverlay(names);
    }
}).setFps(6), () => settings.mythosMobHp && getWorld() === "Hub");

// register("renderEntity", (entity, pos, ticks, event) => {
//     if(entity.getClassName() == 'EntityOtherPlayerMP') {
//         let name = entity.getName().trim();
//         if (name.includes("Inquisitor")){
//             let red = settings.inqColor.getRed() / 255;
//             let green = settings.inqColor.getGreen() / 255;
//             let blue = settings.inqColor.getBlue() / 255;
//             let alpha = settings.inqColor.getAlpha() / 255;
//             Tessellator.pushMatrix();
//             Tessellator.colorize(red, green, blue, 1);
//             Tessellator.enableAlpha()
//             Tessellator.enableBlend()
//         }
//         if (name.includes("Champion")){
//             let red = settings.inqColor.getRed() / 255;
//             let green = settings.inqColor.getGreen() / 255;
//             let blue = settings.inqColor.getBlue() / 255;
//             let alpha = settings.inqColor.getAlpha() / 255;
//             Tessellator.pushMatrix();
//             Tessellator.colorize(red, green, blue, 1);
//         }
//     }
// });
   
export const inqHighlightRegister = register("renderWorld", () => {
    inqs.forEach((mob) => {
        let red = settings.inqColor.getRed() / 255;
        let green = settings.inqColor.getGreen() / 255;
        let blue = settings.inqColor.getBlue() / 255;
        let alpha = settings.inqColor.getAlpha() / 255;
        if (settings.inqHighlight) {
            RenderLibV2.drawEspBoxV2(mob.x, mob.y - 2.05, mob.z, 1, 2, 1, red, green, blue, alpha, false)   
        }
        if (settings.inqCircle) {
            let hight = 0.6;
            let y = mob.y - 2.05;
            if (settings.inqCylinder) {
                hight = 50;
                y = 50;
            }
            RenderLibV2.drawCyl(mob.x, y, mob.z, 30, 30, hight, 120, 1, 0, 90, 90, red, green, blue, alpha, false, false)
        }
    });
});
inqHighlightRegister.unregister();

registerWhen(register("renderWorld", () => {
    
}), () => settings.inqCircle && getWorld() === "Hub"); 


// register("tick", () => {
//     // check if player is inside circle
//     // player x = Player.getX()
//     // player z = Player.getZ()
//     let inCircle = false;
//     inqs.forEach((mob) => {
//         let distance = Math.sqrt((mob.x - Player.getX()) ** 2 + (mob.z - Player.getZ()) ** 2);
//         if (distance < 30) {
//             inCircle = true;
//         }
//     });
//     ChatLib.chat("circle: " + inCircle);
// });

register("worldUnload", () => {
    Mobs = [];
    inqs = [];
    names = [];
});

//mob.nameTag.getName() step 10
// if (!Mobs?.map((a) => a.getUUID().toString()).includes(mob.getUUID().toString())) {
//     if ((name.includes("Exalted") || name.includes("Stalwart")) && !name.split(" ")[2].startsWith("0")) {
//         print("pushed");
//         Mobs.push(mob);
//     }
// }


// register("command", () => {
//     ChatLib.command("pc x: " + Math.round(Player.getLastX()) + ", " + "y: " + Math.round(Player.getLastY()) + ", " + "z: " + Math.round(Player.getLastZ()));
// }).setName("sbodetectinq");