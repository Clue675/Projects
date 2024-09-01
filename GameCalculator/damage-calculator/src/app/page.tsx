"use client";  // Ensures this is treated as a client component

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import CharacterForm from '@/app/components/CharacterForm';
import CharacterList from '@/app/components/CharacterList';
import Character from '@/app/utils/Character';
import { useRouter } from 'next/navigation';

const Home = () => {
    const router = useRouter();
    const [characters, setCharacters] = useState<Character[]>([]);
    const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);

    // Load characters from local storage on component mount
    useEffect(() => {
        const storedCharacters = localStorage.getItem('characters');
        if (storedCharacters) {
            setCharacters(JSON.parse(storedCharacters));
        }
    }, []);

    // Save characters to local storage whenever the character list changes
    useEffect(() => {
        localStorage.setItem('characters', JSON.stringify(characters));
    }, [characters]);

    const handleCreate = (newCharacter: Character) => {
        setCharacters([...characters, newCharacter]);
    };

    const handleEdit = (updatedCharacter: Character) => {
        const updatedCharacters = characters.map((char) =>
            char.name === updatedCharacter.name ? updatedCharacter : char
        );
        setCharacters(updatedCharacters);
        setSelectedCharacter(null); // Clear selection after editing
    };

    const handleDelete = (index: number) => {
        setCharacters(characters.filter((_, i) => i !== index));
    };

    const handleSelectCharacter = (index: number) => {
        setSelectedCharacter(characters[index]);
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Character Management</h1>

            <div className="mb-4">
                <h2 className="text-xl font-bold">Create or Edit Character</h2>
                <CharacterForm
                    character={selectedCharacter || undefined}
                    onSubmit={selectedCharacter ? handleEdit : handleCreate}
                />
            </div>

            <div className="mt-8">
                <h2 className="text-xl font-bold">Character List</h2>
                <CharacterList characters={characters} onDelete={handleDelete} />
            </div>

            <div className="mt-8">
                <Link href="/simulation" className="bg-blue-500 text-white p-2 rounded">
                    Go to Simulation
                </Link>
            </div>
        </div>
    );
};

export default Home;
