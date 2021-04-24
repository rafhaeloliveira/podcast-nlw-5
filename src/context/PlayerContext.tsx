import { createContext, ReactNode, useState } from 'react';

type Episode = {
    title: string;
    members: string;
    thumbnail: string;
    duration: number;
    url: string;
}

type PlayerContextData = {
    episodeList: Episode[];
    currentEpisodeIndex: number;
    isPlaying: boolean;
    isLooping: boolean;
    isShuffling: boolean;
    hasPrevious: boolean;
    hasNext: boolean;
    play: (episode: Episode) => void;
    playList: (episode: Episode[], index: number) => void;
    playNext: () => void;
    playPrev: () => void;
    togglePlay: () => void;
    toggleLooping: () => void;
    toggleShuffle: () => void;
    setPlayingState: (state: boolean) => void;
}

export const PlayerContext = createContext({} as PlayerContextData);

type PlayerContextProvider = {
    children: ReactNode
}

export const PlayerContextProvider = ({ children }: PlayerContextProvider) => {
    const [episodeList, setEpisodeList] = useState([]);
    const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLooping, setIsLooping] = useState(false);
    const [isShuffling, setIsShuffling] = useState(false);

    const play = (episode) => {
        setEpisodeList([episode]);
        setCurrentEpisodeIndex(0);
        setIsPlaying(true);
    }

    const playList = (list: Episode[], index: number) => {
        setEpisodeList(list);
        setCurrentEpisodeIndex(index);
        setIsPlaying(true);
    }

    const hasPrevious = currentEpisodeIndex > 0;
    const hasNext = currentEpisodeIndex < 0;

    const playPrev = () => {
        if (hasPrevious){
            setCurrentEpisodeIndex(currentEpisodeIndex - 1);
        }
    }

    const playNext = () => {
        if(isShuffling) {
            const nextRandomEpisodeIndex = Math.floor(Math.random() * episodeList.length);
            setCurrentEpisodeIndex(nextRandomEpisodeIndex);
        } else if (hasNext) {
            setCurrentEpisodeIndex(currentEpisodeIndex + 1);
        }
    }

    const togglePlay = () => {
        setIsPlaying(!isPlaying);
    }

    const setPlayingState = (state: boolean) => {
        setIsPlaying(state);
    }

    const toggleLooping = () => {
        setIsLooping(!isLooping);
    }

    const toggleShuffle = () => {
        setIsShuffling(!isShuffling);
    }

    return (
        <PlayerContext.Provider value={{
            episodeList,
            currentEpisodeIndex,
            isPlaying,
            isLooping,
            isShuffling,
            hasPrevious,
            hasNext,
            play,
            playList,
            playNext,
            playPrev,
            togglePlay,
            toggleLooping,
            toggleShuffle,
            setPlayingState
        }}>
            {children}
        </PlayerContext.Provider>
    )
}