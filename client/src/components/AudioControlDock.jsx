import React from 'react';
import { Play, Pause, SkipBack, SkipForward, Repeat, Shuffle, Volume2, VolumeX, ListMusic, Disc } from 'lucide-react';

export default function AudioControlDock({
  currentTrack,
  isPlaying,
  onPlayPause,
  onSkipNext,
  onSkipPrev,
  currentTime,
  duration,
  onSeek,
  volume,
  onVolumeChange,
  isMuted,
  onToggleMute,
  isRepeat,
  onToggleRepeat,
  isShuffle,
  onToggleShuffle,
  queueCount,
  onToggleMobileRight
}) {
  // Format seconds to MM:SS
  const formatTime = (secs) => {
    if (!secs || isNaN(secs)) return '00:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <footer className="h-20 bg-[#1C1817] border-t border-[#2A2725] px-3 sm:px-6 flex items-center justify-between select-none z-30 relative">
      {/* Precision Dual-Tone Audio Progress Line */}
      <div
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const clickX = e.clientX - rect.left;
          const newTime = (clickX / rect.width) * (duration || 180);
          onSeek(newTime);
        }}
        className="absolute top-0 left-0 right-0 h-1 bg-[#2A2725] cursor-pointer group"
      >
        <div
          className="h-full bg-[#D96B43] relative transition-all duration-100"
          style={{ width: `${progressPercent}%` }}
        >
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-[#F4F1EA] border border-[#121113] opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </div>
      </div>

      {/* Left: Track Snippet Information */}
      <div
        onClick={onToggleMobileRight}
        className="flex items-center space-x-3 min-w-0 w-1/2 sm:w-1/4 cursor-pointer sm:cursor-default"
      >
        {currentTrack ? (
          <>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#121113] border border-[#2A2725] p-1 flex-shrink-0 relative overflow-hidden">
              <img
                src={currentTrack.cover || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=800&auto=format&fit=crop'}
                alt={currentTrack.title}
                className="w-full h-full object-cover grayscale contrast-125"
              />
              {isPlaying && (
                <div className="absolute inset-0 bg-[#121113]/40 flex items-center justify-center">
                  <span className="w-2 h-2 bg-[#D96B43] animate-ping"></span>
                </div>
              )}
            </div>
            <div className="min-w-0">
              <div className="text-xs font-editorial-sans font-bold text-[#F4F1EA] truncate">
                {currentTrack.title}
              </div>
              <div className="text-[11px] font-editorial-sans text-[#D96B43] truncate mt-0.5">
                {currentTrack.artist}
              </div>
            </div>
          </>
        ) : (
          <div className="text-xs font-editorial-mono text-[#9E988F]">
            NO ACTIVE TRACK
          </div>
        )}
      </div>

      {/* Center: Playback Controls */}
      <div className="flex flex-col items-center justify-center space-y-1 w-1/2 sm:w-2/4">
        <div className="flex items-center space-x-3 sm:space-x-6">
          <button
            onClick={onToggleShuffle}
            className={`p-1.5 hidden sm:block transition-colors ${
              isShuffle ? 'text-[#D96B43]' : 'text-[#9E988F] hover:text-[#F4F1EA]'
            }`}
            title="Shuffle"
          >
            <Shuffle className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onSkipPrev}
            className="p-1.5 text-[#F4F1EA] hover:text-[#D96B43] transition-colors"
            title="Previous track"
          >
            <SkipBack className="w-4 h-4 fill-current" />
          </button>

          <button
            onClick={onPlayPause}
            className="w-9 h-9 sm:w-10 sm:h-10 bg-[#D96B43] hover:bg-[#c45a33] text-[#121113] flex items-center justify-center transition-colors border border-[#D96B43]"
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
            ) : (
              <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-current ml-0.5" />
            )}
          </button>

          <button
            onClick={onSkipNext}
            className="p-1.5 text-[#F4F1EA] hover:text-[#D96B43] transition-colors"
            title="Next track"
          >
            <SkipForward className="w-4 h-4 fill-current" />
          </button>

          <button
            onClick={onToggleRepeat}
            className={`p-1.5 hidden sm:block transition-colors ${
              isRepeat ? 'text-[#D96B43]' : 'text-[#9E988F] hover:text-[#F4F1EA]'
            }`}
            title="Repeat"
          >
            <Repeat className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Precision Dual Timer */}
        <div className="text-[10px] font-editorial-mono text-[#9E988F] space-x-1 sm:space-x-2 tracking-widest">
          <span className="text-[#F4F1EA] font-semibold">{formatTime(currentTime)}</span>
          <span>/</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Right: Volume & Queue Indicators (Hidden on extra small mobile screens) */}
      <div className="hidden md:flex items-center justify-end space-x-4 w-1/4">
        <div className="flex items-center space-x-2">
          <button
            onClick={onToggleMute}
            className="text-[#9E988F] hover:text-[#F4F1EA] transition-colors"
          >
            {isMuted || volume === 0 ? (
              <VolumeX className="w-4 h-4 text-[#D96B43]" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </button>

          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={isMuted ? 0 : volume}
            onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
            className="w-16 lg:w-20 accent-[#D96B43] bg-[#2A2725] h-1 cursor-pointer"
          />
        </div>

        <div className="h-4 w-[1px] bg-[#2A2725]"></div>

        <button
          onClick={onToggleMobileRight}
          className="flex items-center space-x-1.5 text-[10px] font-editorial-mono text-[#9E988F] bg-[#121113] px-2.5 py-1 border border-[#2A2725] hover:border-[#D96B43]"
        >
          <ListMusic className="w-3.5 h-3.5 text-[#D96B43]" />
          <span>{queueCount} QUEUED</span>
        </button>
      </div>
    </footer>
  );
}
