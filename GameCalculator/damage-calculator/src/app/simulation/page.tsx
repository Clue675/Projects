import React, { useState } from 'react';
import CharacterForm from '@/app/components/CharacterForm';
import Character from '@/app/utils/Character';
import FightSimulation from '@/app/components/FightSimulation';

const SimulationPage = () => {
    const [player, setPlayer] = useState<Character | null>(null);
    const [opponent, setOpponent] = useState<Character | null>(null);
    const [characters, setCharacters] = useState<Character[]>([]);

    const saveCharacter = (newCharacter: any) => {
        const updatedCharacters = [...characters, newCharacter];
        setCharacters(updatedCharacters);
        localStorage.setItem('characters', JSON.stringify(updatedCharacters));
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6">Fight Simulation</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <h2 className="text-2xl font-semibold mb-4">Create a Character</h2>
                    <CharacterForm onSubmit={saveCharacter} />
                </div>
                <div>
                    <h2 className="text-2xl font-semibold mb-4">Player</h2>
                    <select
                        className="p-2 border rounded"
                        onChange={(e) =>
                            setPlayer(characters.find((char) => char.name === e.target.value) || null)
                        }
                    >
                        <option value="">Select Player Character</option>
                        {characters.map((character) => (
                            <option key={character.name} value={character.name}>
                                {character.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <h2 className="text-2xl font-semibold mb-4">Opponent</h2>
                    <select
                        className="p-2 border rounded"
                        onChange={(e) =>
                            setOpponent(
                                characters.find((char) => char.name === e.target.value && char !== player) ||
                                    null
                            )
                        }
                    >
                        <option value="">Select Opponent Character</option>
                        {characters.map((character) => (
                            <option key={character.name} value={character.name}>
                                {character.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            {player && opponent && (
                <div className="mt-10">
                    <FightSimulation player={player} opponent={opponent} />
                </div>
            )}
        </div>
    );
};

export default SimulationPage;
