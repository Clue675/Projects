import React, { useState } from 'react';
import Link from 'next/link';
import CharacterList from '@/app/components/CharacterList';
import Character from '@/app/utils/Character';

const CharacterIndex = () => {
    const [characters, setCharacters] = useState<Character[]>([]);

    const handleDelete = (id: number) => {
        setCharacters(characters.filter((_, index) => index !== id));
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Characters</h1>
            <CharacterList characters={characters} onDelete={handleDelete} />
            <Link href="/characters/create" className="mt-4 inline-block text-blue-500">
                Create New Character
            </Link>
        </div>
    );
};

export default CharacterIndex;
