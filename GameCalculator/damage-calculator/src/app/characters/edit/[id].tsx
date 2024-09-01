import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import CharacterForm from '@/app/components/CharacterForm';
import Character from '@/app/utils/Character';

const EditCharacter = () => {
    const router = useRouter();
    const { id } = router.query;  // Capture the character ID from the URL
    const [characters, setCharacters] = useState<Character[]>([]);
    const [character, setCharacter] = useState<Character | undefined>(undefined);

    useEffect(() => {
        if (id !== undefined && characters.length > 0) {
            setCharacter(characters[parseInt(id as string)]);
        }
    }, [id, characters]);

    const handleSubmit = (updatedCharacter: Character) => {
        const updatedCharacters = [...characters];
        updatedCharacters[parseInt(id as string)] = updatedCharacter;
        setCharacters(updatedCharacters);
        router.push('/characters'); // Redirect to the character list after editing
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Edit Character</h1>
            {character && (
                <CharacterForm character={character} onSubmit={handleSubmit} />
            )}
        </div>
    );
};

export default EditCharacter;
