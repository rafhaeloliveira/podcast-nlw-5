import { useContext, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { PlayerContext } from './../../context/PlayerContext';
import Slider from 'rc-slider';
import { convertDurationToTimeString } from './../../utils/convertDurationToTimeString';


import 'rc-slider/assets/index.css';
import styles from './styles.module.scss';

export default function Player() {
    const {
        episodeList,
        currentEpisodeIndex,
        isPlaying,
        isLooping,
        isShuffling,
        hasPrevious,
        hasNext,
        togglePlay,
        toggleLooping,
        toggleShuffle,
        setPlayingState,
        playNext,
        playPrev
    } = useContext(PlayerContext);

    const episode = episodeList[currentEpisodeIndex];

    const audioRef = useRef<HTMLAudioElement>(null);

    const [progress, setProgress] = useState(0);

    const setupProgressListener = () => {
        audioRef.current.currentTime = 0;

        audioRef.current.addEventListener('timeupdate', event => {
            setProgress(Math.floor(audioRef.current.currentTime));
        });
    }

    const handleSeek = (amount: number) => {
        audioRef.current.currentTime = amount;
        setProgress(amount);
    }

    useEffect(() => {
        if(!audioRef.current) return

        if(isPlaying) {
            audioRef.current.play();
        } else {
            audioRef.current.pause();
        }
    }, [isPlaying]);

    return (
        <div className={styles.playerContainer}>
            <header>
                <img src="/playing.svg" alt="Tocando agora" />
                <strong>Tocando agora</strong>
            </header>

            {episode ? (
                <div className={styles.currentEpisode}>
                    <Image width={592} height={592} src={episode.thumbnail} objectFit="cover"/>
                    <strong>{episode.title}</strong>
                    <span>{episode.members}</span>
                </div>
            ) : (
                <div className={styles.emptyPlayer}>
                    <strong>Selecione um podcast para ouvir</strong>
                </div>
            )}

            <footer className={!episode ? styles.empty : ''}>
                <div className={styles.progress}>
                    <span>{convertDurationToTimeString(progress)}</span>
                    <div className={styles.slider}>
                        {episode ? (
                            <Slider
                                value={progress}
                                max={episode.duration}
                                onChange={handleSeek}
                                trackStyle={{ backgroundColor: '#84d361' }}
                                railStyle={{ backgroundColor: '#9f75ff' }}
                                handleStyle={{ backgroundColor: '#84d361', borderWidth: 4 }}
                            />
                        ) : (
                            <div className={styles.emptySlider} />
                        )}
                    </div>
                    <span>{convertDurationToTimeString(episode?.duration)}</span>
                </div>

                <div className={styles.buttons}>
                    <button type="button" className={isShuffling ? styles.isActive : ''} disabled={!episode || episodeList.length === 1} onClick={toggleShuffle}>
                        <img src="/shuffle.svg" alt="Embaralhar" />
                    </button>
                    <button type="button" disabled={!episode || !hasPrevious} onClick={() => playPrev()}>
                        <img src="/play-previous.svg" alt="Tocar anterior" />
                    </button>
                    <button type="button" onClick={togglePlay} className={styles.playButton} disabled={!episode}>
                        {isPlaying ? (
                            <img src="/pause.svg" alt="Tocar" />
                        ) : (
                            <img src="/play.svg" alt="Tocar" />
                        )}
                    </button>
                    <button type="button" disabled={!episode || !hasNext} onClick={() => playNext()}>
                        <img src="/play-next.svg" alt="Tocar próxima" />
                    </button>
                    <button type="button" className={isLooping ? styles.isActive : ''} disabled={!episode} onClick={toggleLooping}>
                        <img src="/repeat.svg" alt="Repetir" />
                    </button>
                </div>
            </footer>

            {episode && (
                <audio
                    ref={audioRef}
                    src={episode.url}
                    loop={isLooping}
                    onEnded={playNext}
                    onPlay={() => setPlayingState(true)}
                    onPause={() => setPlayingState(false)}
                    onLoadedMetadata={setupProgressListener}
                    autoPlay
                />
            )}
        </div>
    )
}