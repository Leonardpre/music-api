import React, { useState, useEffect } from 'react';
import LeftSidebar from './components/LeftSidebar';
import MainFeed from './components/MainFeed';
import RightSidebar from './components/RightSidebar';
import AudioControlDock from './components/AudioControlDock';
import { SAMPLE_SONGS } from './data/sampleSongs';
import { audioEngine } from './utils/audioEngine';

export default function App() {
  const [allSongs, setAllSongs] = useState(SAMPLE_SONGS);
  const [currentTrack, setCurrentTrack] = useState(SAMPLE_SONGS[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(219);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  
  const [activeNav, setActiveNav] = useState('Home');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [likedSongIds, setLikedSongIds] = useState([1, 6, 71]);
  const [queue, setQueue] = useState(SAMPLE_SONGS.slice(1, 6));

  // Mobile drawer states
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileRightOpen, setIsMobileRightOpen] = useState(false);

  // Curated Editorial Playlists Definition
  const playlists = [
    { id: 'p1', name: '01 — Afrobeats Essentials', genre: 'Afrobeats', trackCount: 40 },
    { id: 'p2', name: '02 — Anime Openings', genre: 'Anime J-Rock', trackCount: 30 },
    { id: 'p3', name: '03 — Solo Leveling OST', genre: 'Anime J-Pop', trackCount: 5 },
    { id: 'p4', name: '04 — Dark Pop Vault', genre: 'Dark Pop', trackCount: 15 },
    { id: 'p5', name: '05 — Late Night Vinyl', genre: 'All', trackCount: 10 }
  ];

  // Fetch full songs catalog from Express backend
  useEffect(() => {
    fetch('/songs')
      .then(res => {
        if (!res.ok) throw new Error('API offline');
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          const enriched = data.map((s, idx) => ({
            ...s,
            cover: s.cover || SAMPLE_SONGS[idx % SAMPLE_SONGS.length].cover
          }));
          setAllSongs(enriched);
          if (!currentTrack) setCurrentTrack(enriched[0]);
        }
      })
      .catch(() => {
        console.log('Using sample fallback dataset');
      });
  }, []);

  const genres = ['All', ...new Set(allSongs.map(s => s.genre).filter(Boolean))];

  const filteredSongs = allSongs.filter(song => {
    if (activeNav === 'Collection' && !likedSongIds.includes(song.id)) {
      return false;
    }

    if (selectedPlaylist) {
      const pl = playlists.find(p => p.id === selectedPlaylist);
      if (pl && pl.genre !== 'All' && song.genre !== pl.genre) {
        return false;
      }
    } else if (selectedGenre !== 'All' && song.genre !== selectedGenre) {
      return false;
    }

    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchTitle = song.title.toLowerCase().includes(q);
      const matchArtist = song.artist.toLowerCase().includes(q);
      const matchAlbum = (song.album || '').toLowerCase().includes(q);
      return matchTitle || matchArtist || matchAlbum;
    }

    return true;
  });

  const handlePlayTrack = (track) => {
    setCurrentTrack(track);
    setIsPlaying(true);
    
    const index = filteredSongs.findIndex(s => s.id === track.id);
    if (index !== -1) {
      const nextQueue = filteredSongs.slice(index + 1);
      setQueue(nextQueue.length > 0 ? nextQueue : filteredSongs.slice(0, 5));
    }

    audioEngine.playTrack(
      track,
      (currSecs, totalSecs) => {
        setCurrentTime(currSecs);
        setDuration(totalSecs);
      },
      () => {
        handleSkipNext();
      }
    );
  };

  const handlePlayPause = () => {
    if (!currentTrack) {
      if (filteredSongs.length > 0) handlePlayTrack(filteredSongs[0]);
      return;
    }

    if (isPlaying) {
      audioEngine.pause();
      setIsPlaying(false);
    } else {
      audioEngine.resume();
      setIsPlaying(true);
    }
  };

  const handleSkipNext = () => {
    if (queue.length > 0) {
      const nextTrack = queue[0];
      setQueue(queue.slice(1));
      handlePlayTrack(nextTrack);
    } else {
      const currentIndex = allSongs.findIndex(s => s.id === currentTrack?.id);
      const nextIndex = (currentIndex + 1) % allSongs.length;
      handlePlayTrack(allSongs[nextIndex]);
    }
  };

  const handleSkipPrev = () => {
    const currentIndex = allSongs.findIndex(s => s.id === currentTrack?.id);
    const prevIndex = (currentIndex - 1 + allSongs.length) % allSongs.length;
    handlePlayTrack(allSongs[prevIndex]);
  };

  const handleSeek = (newTimeSeconds) => {
    setCurrentTime(newTimeSeconds);
    audioEngine.seek(newTimeSeconds);
  };

  const handleVolumeChange = (newVol) => {
    setVolume(newVol);
    setIsMuted(newVol === 0);
    audioEngine.setVolume(newVol);
  };

  const handleToggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      audioEngine.setVolume(volume || 0.8);
    } else {
      setIsMuted(true);
      audioEngine.setVolume(0);
    }
  };

  const handleToggleLike = (songId) => {
    setLikedSongIds(prev =>
      prev.includes(songId)
        ? prev.filter(id => id !== songId)
        : [...prev, songId]
    );
  };

  const selectedPlaylistObj = playlists.find(p => p.id === selectedPlaylist);

  return (
    <div className="flex flex-col h-screen w-screen bg-[#121113] text-[#F4F1EA] overflow-hidden font-editorial-sans antialiased relative">
      {/* Mobile Backdrop Overlays */}
      {(isMobileMenuOpen || isMobileRightOpen) && (
        <div
          onClick={() => {
            setIsMobileMenuOpen(false);
            setIsMobileRightOpen(false);
          }}
          className="fixed inset-0 bg-[#121113]/80 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      {/* Main Workspace (Left Nav + Main Feed + Right Context Sleeve) */}
      <div className="flex-1 flex overflow-hidden min-h-0 relative">
        <LeftSidebar
          activeNav={activeNav}
          setActiveNav={setActiveNav}
          selectedPlaylist={selectedPlaylist}
          setSelectedPlaylist={setSelectedPlaylist}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          playlists={playlists}
          isMobileOpen={isMobileMenuOpen}
          onCloseMobile={() => setIsMobileMenuOpen(false)}
        />

        <MainFeed
          songs={filteredSongs}
          currentTrack={currentTrack}
          isPlaying={isPlaying}
          onPlayTrack={handlePlayTrack}
          onPauseTrack={handlePlayPause}
          selectedGenre={selectedGenre}
          setSelectedGenre={setSelectedGenre}
          genres={genres}
          likedSongIds={likedSongIds}
          onToggleLike={handleToggleLike}
          activeNav={activeNav}
          selectedPlaylistObj={selectedPlaylistObj}
          onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          onToggleMobileRight={() => setIsMobileRightOpen(!isMobileRightOpen)}
        />

        <RightSidebar
          currentTrack={currentTrack}
          isPlaying={isPlaying}
          queue={queue}
          onPlayTrack={handlePlayTrack}
          onRemoveFromQueue={(idx) => setQueue(q => q.filter((_, i) => i !== idx))}
          likedSongIds={likedSongIds}
          onToggleLike={handleToggleLike}
          isMobileRightOpen={isMobileRightOpen}
          onCloseMobileRight={() => setIsMobileRightOpen(false)}
        />
      </div>

      {/* Bottom Audio Control Dock */}
      <AudioControlDock
        currentTrack={currentTrack}
        isPlaying={isPlaying}
        onPlayPause={handlePlayPause}
        onSkipNext={handleSkipNext}
        onSkipPrev={handleSkipPrev}
        currentTime={currentTime}
        duration={duration}
        onSeek={handleSeek}
        volume={volume}
        onVolumeChange={handleVolumeChange}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        isRepeat={isRepeat}
        onToggleRepeat={() => setIsRepeat(!isRepeat)}
        isShuffle={isShuffle}
        onToggleShuffle={() => setIsShuffle(!isShuffle)}
        queueCount={queue.length}
        onToggleMobileRight={() => setIsMobileRightOpen(!isMobileRightOpen)}
      />
    </div>
  );
}
