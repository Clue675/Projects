import React, { useState } from 'react';

interface CharacterFormProps {
    onSubmit: (character: any) => void;
}

const CharacterForm: React.FC<CharacterFormProps> = ({ onSubmit }) => {
    const [name, setName] = useState('');
    const [strength, setStrength] = useState(0);
    const [reflex, setReflex] = useState(0);
    const [speed, setSpeed] = useState(0);
    const [durability, setDurability] = useState(0);
    const [attackSpeed, setAttackSpeed] = useState(0);
    const [physicalSkill, setPhysicalSkill] = useState(0);
    const [intelligence, setIntelligence] = useState(0);
    const [perks, setPerks] = useState<{ name: string; tier: number }[]>([]);

    const handleSubmit = () => {
        const newCharacter = {
            name,
            strength,
            reflex,
            speed,
            durability,
            attackSpeed,
            physicalSkill,
            intelligence,
            perks,
        };
        onSubmit(newCharacter);
    };

    const addPerk = () => {
        setPerks([...perks, { name: '', tier: 1 }]);
    };

    const handlePerkChange = (index: number, field: string, value: any) => {
        const updatedPerks = perks.map((perk, i) => 
            i === index ? { ...perk, [field]: value } : perk
        );
        setPerks(updatedPerks);
    };

    return (
        <div className="p-4 bg-gray-100 rounded">
            <div>
                <label>Name:</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="border p-2 rounded w-full"
                />
            </div>
            <div>
                <label>Strength:</label>
                <input
                    type="number"
                    value={strength}
                    onChange={(e) => setStrength(parseInt(e.target.value))}
                    className="border p-2 rounded w-full"
                />
            </div>
            <div>
                <label>Reflex:</label>
                <input
                    type="number"
                    value={reflex}
                    onChange={(e) => setReflex(parseInt(e.target.value))}
                    className="border p-2 rounded w-full"
                />
            </div>
            <div>
                <label>Speed:</label>
                <input
                    type="number"
                    value={speed}
                    onChange={(e) => setSpeed(parseInt(e.target.value))}
                    className="border p-2 rounded w-full"
                />
            </div>
            <div>
                <label>Durability:</label>
                <input
                    type="number"
                    value={durability}
                    onChange={(e) => setDurability(parseInt(e.target.value))}
                    className="border p-2 rounded w-full"
                />
            </div>
            <div>
                <label>Attack Speed:</label>
                <input
                    type="number"
                    value={attackSpeed}
                    onChange={(e) => setAttackSpeed(parseInt(e.target.value))}
                    className="border p-2 rounded w-full"
                />
            </div>
            <div>
                <label>Physical Skill:</label>
                <input
                    type="number"
                    value={physicalSkill}
                    onChange={(e) => setPhysicalSkill(parseInt(e.target.value))}
                    className="border p-2 rounded w-full"
                />
            </div>
            <div>
                <label>Intelligence:</label>
                <input
                    type="number"
                    value={intelligence}
                    onChange={(e) => setIntelligence(parseInt(e.target.value))}
                    className="border p-2 rounded w-full"
                />
            </div>
            <div>
                <label>Perks:</label>
                {perks.map((perk, index) => (
                    <div key={index} className="mb-2">
                        <input
                            type="text"
                            placeholder="Perk Name"
                            value={perk.name}
                            onChange={(e) =>
                                handlePerkChange(index, 'name', e.target.value)
                            }
                            className="border p-2 rounded w-full mb-2"
                        />
                        <input
                            type="number"
                            placeholder="Tier"
                            value={perk.tier}
                            onChange={(e) =>
                                handlePerkChange(index, 'tier', parseInt(e.target.value))
                            }
                            className="border p-2 rounded w-full"
                        />
                    </div>
                ))}
                <button onClick={addPerk} className="bg-blue-500 text-white p-2 rounded">
                    Add Perk
                </button>
            </div>
            <button onClick={handleSubmit} className="bg-green-500 text-white p-2 rounded mt-4">
                Save Character
            </button>
        </div>
    );
};

export default CharacterForm;
