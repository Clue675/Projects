import React from 'react';

interface CombatLogProps {
    log: string[];
}

const CombatLog: React.FC<CombatLogProps> = ({ log }) => {
    return (
        <div className="bg-white p-4 rounded shadow-md mt-4">
            <h2 className="text-lg font-bold mb-2">Combat Log</h2>
            <ul className="space-y-2">
                {log.map((entry, index) => (
                    <li key={index} className="text-sm text-gray-700">
                        {entry}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CombatLog;
