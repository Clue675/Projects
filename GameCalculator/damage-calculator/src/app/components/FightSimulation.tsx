import React, { useState, useEffect } from 'react';
import Character from '@/app/utils/Character';
import CombatLog from './CombatLog';

interface FightSimulationProps {
    player: Character;
    opponent: Character;
}

const FightSimulation: React.FC<FightSimulationProps> = ({ player, opponent }) => {
    const [combatLog, setCombatLog] = useState<string[]>([]);
    const [round, setRound] = useState(1);
    const [isBattleOver, setIsBattleOver] = useState(false);

    useEffect(() => {
        const simulateBattle = () => {
            let log: string[] = [];
            let currentRound = round;

            while (player.health > 0 && opponent.health > 0) {
                let logEntry = `\n--- Round ${currentRound} ---\n`;

                // Player's Turn
                const playerDamage = player.attack(opponent, currentRound);
                logEntry += `Player attacks and deals ${playerDamage} damage. Opponent's health is now ${opponent.health}.\n`;

                // Check if opponent is defeated
                if (opponent.health <= 0) {
                    logEntry += `Opponent is defeated in round ${currentRound}!\n`;
                    log.push(logEntry);
                    setIsBattleOver(true);
                    break;
                }

                // Opponent's Turn
                const opponentDamage = opponent.attack(player, currentRound);
                logEntry += `Opponent attacks and deals ${opponentDamage} damage. Player's health is now ${player.health}.\n`;

                // Check if player is defeated
                if (player.health <= 0) {
                    logEntry += `Player is defeated in round ${currentRound}!\n`;
                    log.push(logEntry);
                    setIsBattleOver(true);
                    break;
                }

                log.push(logEntry);
                currentRound++;
            }

            setCombatLog(log);
            setRound(currentRound);
        };

        simulateBattle();
    }, [player, opponent]);

    return (
        <div className="mt-4">
            <h2 className="text-xl font-bold mb-4">Combat Log</h2>
            {combatLog.length > 0 ? (
                <CombatLog log={combatLog} />
            ) : (
                <p>No combat log to display.</p>
            )}
        </div>
    );
};

export default FightSimulation;
