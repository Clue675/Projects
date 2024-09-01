import {
    applySereneState,
    applyFlexibility,
    applyLethalLegs,
    applyFistHardening,
    applyBoxingInitiate,
    applyKarateNovice,
    applyKickboxingNovice,
    applyJiuJitsuInitiate,
    applyMarksman,
    applyTheCleaver,
    applySwordsmanshipNovice,
    applyGuardian,
    applyDemonAura,
    applySaintly,
} from './perks';

export default class Character {
    name: string;
    health: number;
    stamina: number;
    energy: number;
    strength: number;
    reflex: number;
    speed: number;
    durability: number;
    attackSpeed: number;
    physicalSkill: number;
    intelligence: number;
    perks: { name: string; tier: number }[];
    offensivePressure: number;
    legDamage: number;
    fistDamage: number;
    legDefense: number;
    fistDefense: number;
    blockDamageReduction: number;
    nextAttackDamage: number;
    opponentPhysicalSkill: number;
    projectileDamage: number;
    opponentDurability: number;
    weaponArmorDurability: number;
    opponentMentalDamage: number;
    painTolerance: number;
    redirectOffensivePressure: boolean;

    constructor(
        name: string,
        strength: number,
        reflex: number,
        speed: number,
        durability: number,
        attackSpeed: number,
        physicalSkill: number,
        intelligence: number,
        perks: { name: string; tier: number }[] = []
    ) {
        this.name = name;
        this.health = 100; // Default health
        this.stamina = 100; // Default stamina
        this.energy = 100; // Default energy
        this.strength = strength;
        this.reflex = reflex;
        this.speed = speed;
        this.durability = durability;
        this.attackSpeed = attackSpeed;
        this.physicalSkill = physicalSkill;
        this.intelligence = intelligence;
        this.perks = perks;
        this.offensivePressure = 0; // Default offensive pressure
        this.legDamage = 0;
        this.fistDamage = 0;
        this.legDefense = 0;
        this.fistDefense = 0;
        this.blockDamageReduction = 0;
        this.nextAttackDamage = 0;
        this.opponentPhysicalSkill = 0;
        this.projectileDamage = 0;
        this.opponentDurability = 0;
        this.weaponArmorDurability = 100; // 100% durability initially
        this.opponentMentalDamage = 0;
        this.painTolerance = 0;
        this.redirectOffensivePressure = false;
    }

    applyPerks(roundsFought = 0) {
        this.perks.forEach(perk => {
            if (perk.name === 'Serene State') {
                applySereneState(this);
            } else if (perk.name === 'Flexibility') {
                applyFlexibility(this, roundsFought);
            } else if (perk.name === 'Lethal Legs') {
                applyLethalLegs(this);
            } else if (perk.name === 'Fist Hardening') {
                applyFistHardening(this);
            } else if (perk.name === 'Boxing Initiate') {
                applyBoxingInitiate(this);
            } else if (perk.name === 'Karate Novice') {
                applyKarateNovice(this);
            } else if (perk.name === 'Kickboxing Novice') {
                applyKickboxingNovice(this);
            } else if (perk.name === 'Jiu Jitsu Initiate') {
                applyJiuJitsuInitiate(this);
            } else if (perk.name === 'Marksman') {
                applyMarksman(this);
            } else if (perk.name === 'The Cleaver') {
                applyTheCleaver(this);
            } else if (perk.name === 'Swordsmanship Novice') {
                applySwordsmanshipNovice(this);
            } else if (perk.name === 'Guardian') {
                applyGuardian(this);
            } else if (perk.name === 'Demon Aura') {
                applyDemonAura(this);
            } else if (perk.name === 'Saintly') {
                applySaintly(this);
            }
            // More perks logic...
        });
    }

    attack(target: Character, roundsFought = 0) {
        this.applyPerks(roundsFought);
        const baseDamage = this.strength * (this.attackSpeed / 10);
        const damage = baseDamage + this.legDamage + this.fistDamage + this.nextAttackDamage + this.projectileDamage;
        return this.calculateDamage(target, damage);
    }

    calculateDamage(target: Character, damage: number) {
        const netDamage = Math.max(damage - target.durability - this.legDefense - this.fistDefense - this.blockDamageReduction, 0);
        return this.applyDamage(target, netDamage);
    }

    applyDamage(target: Character, netDamage: number) {
        if (netDamage >= 50) {
            target.health -= 40;  // Lethal damage
        } else if (netDamage >= 30) {
            target.health -= 25;  // Major damage
        } else if (netDamage >= 10) {
            target.health -= 10;  // Medium damage
        } else {
            target.health -= 5;   // Minor damage
        }
        target.offensivePressure += netDamage === 0 ? 3 : 0;
        return target.health;
    }

    dodge(opponent: Character): boolean {
        return this.reflex > opponent.attackSpeed;
    }

    parry(opponent: Character): boolean {
        return this.physicalSkill > opponent.strength;
    }

    block(opponent: Character): boolean {
        return this.durability > opponent.strength;
    }
}
