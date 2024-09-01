import Character from './Character';

export const applySereneState = (character: Character) => {
    character.reflex += 10;
    if (character.stamina < 100) {
        character.stamina = Math.min(character.stamina + 150, 100);
    }
    if (character.energy < 100) {
        character.energy = Math.min(character.energy + 150, 100);
    }
};

export const applyFlexibility = (character: Character, roundsFought: number) => {
    if (roundsFought >= 5) {
        character.reflex += 5;
    } else if (roundsFought >= 2) {
        character.reflex += 10;
        character.attackSpeed += 10;
    } else if (roundsFought >= 1) {
        character.reflex += 5;
        character.attackSpeed += 5;
    }
};

export const applyLethalLegs = (character: Character) => {
    if (character.perks.some(perk => perk.name === 'Lethal Legs')) {
        character.legDamage += 5;
        character.legDefense += 5;
    }
};

export const applyFistHardening = (character: Character) => {
    if (character.perks.some(perk => perk.name === 'Fist Hardening')) {
        character.fistDamage += 5;
        character.fistDefense += 5;
    }
};

export const applyBoxingInitiate = (character: Character) => {
    if (character.perks.some(perk => perk.name === 'Boxing Initiate')) {
        character.attackSpeed += 2.5;
    }
};

export const applyKarateNovice = (character: Character) => {
    if (character.perks.some(perk => perk.name === 'Karate Novice')) {
        character.blockDamageReduction += 2.5;
        character.nextAttackDamage += 2.5;
    }
};

export const applyKickboxingNovice = (character: Character) => {
    if (character.perks.some(perk => perk.name === 'Kickboxing Novice')) {
        character.nextAttackDamage += 2.5;
    }
};

export const applyJiuJitsuInitiate = (character: Character) => {
    if (character.perks.some(perk => perk.name === 'Jiu Jitsu Initiate')) {
        character.opponentPhysicalSkill -= 2.5;
    }
};

export const applyMarksman = (character: Character) => {
    if (character.perks.some(perk => perk.name === 'Marksman')) {
        character.projectileDamage += 2.5;
    }
};

export const applyTheCleaver = (character: Character) => {
    if (character.perks.some(perk => perk.name === 'The Cleaver')) {
        character.opponentDurability -= 15;
        character.weaponArmorDurability *= 0.75;
    }
};

export const applySwordsmanshipNovice = (character: Character) => {
    if (character.perks.some(perk => perk.name === 'Swordsmanship Novice')) {
        character.attackSpeed += 2.5;
    }
};

export const applyGuardian = (character: Character) => {
    if (character.perks.some(perk => perk.name === 'Guardian')) {
        character.reflex += 6;
    }
};

export const applyDemonAura = (character: Character) => {
    if (character.perks.some(perk => perk.name === 'Demon Aura')) {
        character.painTolerance += 20;
        character.opponentMentalDamage += character.strength / 2;
    }
};

export const applySaintly = (character: Character) => {
    if (character.perks.some(perk => perk.name === 'Saintly')) {
        character.painTolerance += 10;
        character.redirectOffensivePressure = true;
    }
};
