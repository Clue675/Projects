import React from 'react';
import Link from 'next/link';
import Character from '@/app/utils/Character';

interface CharacterListProps {
    characters?: Character[]; // Make characters optional
    onDelete: (id: number) => void;
}

const CharacterList: React.FC<CharacterListProps> = ({ characters = [], onDelete }) => { // Default to an empty array
    return (
        <div className="bg-white p-4 rounded shadow-md">
            <h2 className="text-lg font-bold mb-4">Characters</h2>
            <ul>
                {characters.map((character, index) => (
                    <li key={index} className="mb-2">
                        <span className="font-bold">{character.name}</span>
                        <Link href={`/characters/edit/${index}`} className="ml-2 text-blue-500">
                            Edit
                        </Link>
                        <button
                            onClick={() => onDelete(index)}
                            className="ml-2 text-red-500"
                        >
                            Delete
                        </button>
                    </li>
                ))}
            </ul>
            <Link href="/characters/create" className="mt-4 inline-block text-blue-500">
                Create New Character
            </Link>
        </div>
    );
};

export default CharacterList;
