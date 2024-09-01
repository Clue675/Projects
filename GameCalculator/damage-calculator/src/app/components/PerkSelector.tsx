import React from 'react';

interface Perk {
    name: string;
    tier: number;
}

interface PerkSelectorProps {
    selectedPerks: Perk[];
    onChange: (perks: Perk[]) => void;
}

const availablePerks: Perk[] = [
    { name: 'Serene State', tier: 3 },
    { name: 'Flexibility', tier: 2 },
    { name: 'Lethal Legs', tier: 3 },
    { name: 'Fist Hardening', tier: 3 },
    { name: 'Boxing Initiate', tier: 1 },
    { name: 'Boxing Specialist', tier: 3 },
    { name: 'Karate Novice', tier: 1 },
    { name: 'Karate Specialist', tier: 3 },
    { name: 'Kickboxing Specialist', tier: 3 },
    { name: 'Kickboxing Novice', tier: 1 },
    { name: 'Jiu Jitsu Initiate', tier: 1 },
    { name: 'Jiu Jitsu Specialist', tier: 3 },
    { name: 'Marksman', tier: 1 },
    { name: 'The Cleaver', tier: 4 },
    { name: 'Swordsmanship Novice', tier: 1 },
    { name: 'Sword Specialist', tier: 3 },
    { name: 'Gauntlet Apprentice', tier: 1 },
    { name: 'Spear Novice', tier: 1 },
    { name: 'Spear Specialist', tier: 3 },
    { name: 'Bow Specialist', tier: 3 },
    { name: 'Knife Specialist', tier: 3 },
    { name: 'Chain Initiate', tier: 1 },
    { name: 'Chain Specialist', tier: 3 },
    { name: 'Shield Novice', tier: 1 },
    { name: 'Shield Specialist', tier: 3 },
    { name: 'Saintly', tier: 4 },
    { name: 'Savior', tier: 3 },
    { name: 'Guardian', tier: 2 },
    { name: 'Will Breaker', tier: 4 },
    { name: 'Demon Aura', tier: 3 },
    // Add more perks here as needed
];

const PerkSelector: React.FC<PerkSelectorProps> = ({ selectedPerks, onChange }) => {
    const togglePerk = (perk: Perk) => {
        const isSelected = selectedPerks.some((p) => p.name === perk.name);
        if (isSelected) {
            onChange(selectedPerks.filter((p) => p.name !== perk.name));
        } else {
            onChange([...selectedPerks, perk]);
        }
    };

    return (
        <div className="mb-4">
            <label className="block text-sm font-bold mb-2">Perks</label>
            <div className="grid grid-cols-2 gap-2">
                {availablePerks.map((perk) => (
                    <div key={perk.name}>
                        <label className="inline-flex items-center">
                            <input
                                type="checkbox"
                                checked={selectedPerks.some((p) => p.name === perk.name)}
                                onChange={() => togglePerk(perk)}
                            />
                            <span className="ml-2">{perk.name} (Tier {perk.tier})</span>
                        </label>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PerkSelector;
