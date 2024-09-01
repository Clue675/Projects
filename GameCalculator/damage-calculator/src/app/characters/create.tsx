import React, { useState } from 'react';
import { useRouter } from 'next/router';
import CharacterForm from '@/app/components/CharacterForm';
import Character from '@/app/utils/Character';

const CreateCharacter = () => {
    const router = useRouter();
    const [characters, setCharacters] = useState<Character[]>([]);

    const handleSubmit = (newCharacter: Character) => {
        setCharacters([...characters, newCharacter]);
        router.push('/characters'); // Redirect to the character list after creation
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Create New Character</h1>
            <CharacterForm onSubmit={handleSubmit} />
        </div>
    );
};

export default CreateCharacter;
