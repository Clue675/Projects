import React, { useState } from 'react';
import CharacterForm from '@/app/components/CharacterForm';
import Character from '@/app/utils/Character';
import FightSimulation from '@/app/components/FightSimulation';

const SimulationPage = () => {
    const [player, setPlayer] = useState<Character | null>(null);
    const [opponent, setOpponent] = useState<Character | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleStartSimulation = () => {
        if (!player || !opponent) {
            setError('Both player and opponent must be selected to start the simulation.');
            return;
        }
        setError(null);
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6">Fight Simulation</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Player Character Form */}
                <div className="bg-white shadow-lg rounded-lg p-6">
                    <h2 className="text-2xl font-semibold mb-4">Player</h2>
                    <CharacterForm onSubmit={setPlayer} />
                </div>

                {/* Opponent Character Form */}
                <div className="bg-white shadow-lg rounded-lg p-6">
                    <h2 className="text-2xl font-semibold mb-4">Opponent</h2>
                    <CharacterForm onSubmit={setOpponent} />
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="mt-4 p-4 bg-red-100 text-red-800 rounded">
                    {error}
                </div>
            )}

            {/* Start Simulation Button */}
            <div className="mt-8 flex justify-center">
                <button
                    onClick={handleStartSimulation}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                    Start Simulation
                </button>
            </div>

            {/* Fight Simulation Component */}
            {player && opponent && !error && (
                <div className="mt-10">
                    <FightSimulation player={player} opponent={opponent} />
                </div>
            )}
        </div>
    );
};

export default SimulationPage;

