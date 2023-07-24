import React from 'react';
import { useNavigate } from 'react-router-dom';
import CustomButton from './CustomButton';
import { useGlobalContext } from '../context';
import { player01, player02 } from '../assets';
import styles from '../styles';

const GameLoad = () => {
  const { walletAddress } = useGlobalContext();
  const navigate = useNavigate();

  const renderPlayer = (image, playerName) => {
    return (
      <div className={`${styles.flexCenter} flex-col`}>
        <img src={image} className={styles.gameLoadPlayerImg} alt={playerName} />
        <p className={styles.gameLoadPlayerText}>{playerName}</p>
      </div>
    );
  };

  return (
    <div className={`${styles.flexBetween} ${styles.gameLoadContainer}`}>
      <div className={styles.gameLoadBtnBox}>
        <CustomButton
          title="Choose Battleground"
          handleClick={() => navigate('/battleground')}
          restStyles="mt-6"
        />
      </div>

      <div className={`flex-1 ${styles.flexCenter} flex-col`}>
        <h1 className={`${styles.headText} text-center`}>
          Waiting for a <br /> worthy opponent...
        </h1>
        <p className={styles.gameLoadText}>
          Protip: while you're waiting, choose your preferred battleground
        </p>

        <div className={styles.gameLoadPlayersBox}>
          {renderPlayer(player01, walletAddress.slice(0, 30))}
          <h2 className={styles.gameLoadVS}>Vs</h2>
          {renderPlayer(player02, '??????????')}
        </div>

        <div className="mt-10">
          <p className={`${styles.infoText} text-center mb-5`}>OR</p>

          <CustomButton
            title="Join other battles"
            handleClick={() => navigate('/join-battle')}
          />
        </div>
      </div>
    </div>
  );
};

export default GameLoad;
