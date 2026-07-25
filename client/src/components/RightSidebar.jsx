import React from 'react';
import { Disc, Play, Heart, Radio, ListMusic, Volume2, ShieldCheck, Sparkles, X } from 'lucide-react';

export default function RightSidebar({
  currentTrack,
  isPlaying,
  queue,
  onPlayTrack,
  onRemoveFromQueue,
  likedSongIds,
  onToggleLike,
  isMobileRightOpen,
  onCloseMobileRight
}) {
  const containerClasses = `
    bg-[#1C1817] border-l border-[#2A2725] flex flex-col h-full overflow-y-auto select-none z-40 transition-transform duration-300
    fixed inset-y-0 right-0 w-80 max-w-[85vw] ${isMobileRightOpen ? 'translate-x-0' : 'translate-x-full'}
    xl:relative xl:translate-x-0 xl:w-80 flex-shrink-0
  `;

  if (!currentTrack) {
    return (
      <aside className={containerClasses}>
        <div className="p-4 border-b border-[#2A2725] flex justify-between items-center xl:hidden">
          <span className="text-xs font-editorial-mono text-[#D96B43]">NOW PLAYING</span>
          <button onClick={onCloseMobileRight} className="p-1 text-[#9E988F] border border-[#2A2725]">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="text-center my-auto space-y-4 p-6">
          <Disc className="w-12 h-12 text-[#9E988F]/40 mx-auto animate-spin [animation-duration:12s]" />
          <h3 className="font-editorial-serif text-lg text-[#F4F1EA]">NO RECORD PLAYING</h3>
          <p className="text-xs text-[#9E988F] font-editorial-sans font-light">
            Select any track from the magazine catalog to initiate audio stream.
          </p>
        </div>
      </aside>
    );
  }

  const isLiked = likedSongIds.includes(currentTrack.id);

  return (
    <aside className={containerClasses}>
      {/* Context Sidebar Header */}
      <div className="p-5 border-b border-[#2A2725] flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 bg-[#D96B43]"></span>
          <span className="text-[10px] font-editorial-mono tracking-widest text-[#9E988F] uppercase">
            NOW ON TURNTABLE
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-[9px] font-editorial-mono px-2 py-0.5 border border-[#2A2725] bg-[#121113] text-[#D96B43] font-bold">
            24-BIT / 96KHZ
          </span>
          <button
            onClick={onCloseMobileRight}
            className="xl:hidden p-1 text-[#9E988F] hover:text-[#F4F1EA] border border-[#2A2725]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Record Sleeve Container (Sharp square corners + Spinning Vinyl) */}
      <div className="p-6 border-b border-[#2A2725] bg-[#1E241E] space-y-6">
        <div className="relative mx-auto w-52 h-52 sm:w-60 sm:h-60">
          {/* Vinyl Record Peeking Out */}
          <div
            className={`absolute top-0 right-[-14px] w-48 h-48 sm:w-56 sm:h-56 rounded-full bg-[#121113] border-4 border-[#2A2725] flex items-center justify-center shadow-none transition-transform duration-700 ${
              isPlaying ? 'animate-spin [animation-duration:6s] translate-x-4' : 'translate-x-0'
            }`}
          >
            {/* Vinyl Groves */}
            <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-full border border-[#2A2725]/60 flex items-center justify-center">
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border border-[#2A2725]/40 flex items-center justify-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#D96B43] flex items-center justify-center text-[8px] font-editorial-mono text-[#121113] font-bold text-center p-1">
                  SONIC
                </div>
              </div>
            </div>
          </div>

          {/* Record Sleeve Cover Art Container */}
          <div className="relative z-10 w-48 h-48 sm:w-56 sm:h-56 bg-[#121113] border border-[#2A2725] p-2 overflow-hidden shadow-none">
            <img
              src={currentTrack.cover || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=800&auto=format&fit=crop'}
              alt={currentTrack.title}
              className="w-full h-full object-cover grayscale contrast-125 hover:grayscale-0 transition-all duration-300"
            />
            {/* Corner Badge */}
            <div className="absolute top-4 left-4 bg-[#121113] border border-[#2A2725] px-2 py-0.5 text-[9px] font-editorial-mono text-[#F4F1EA]">
              SIDE A
            </div>
          </div>
        </div>

        {/* Full Track Details & Metadata */}
        <div className="space-y-3 text-left pt-2">
          <div className="flex items-start justify-between">
            <div className="min-w-0 pr-2">
              <h3 className="font-editorial-serif text-xl font-normal text-[#F4F1EA] leading-snug truncate">
                {currentTrack.title}
              </h3>
              <p className="text-xs font-editorial-sans text-[#D96B43] font-semibold mt-0.5 truncate">
                {currentTrack.artist}
              </p>
            </div>
            <button
              onClick={() => onToggleLike(currentTrack.id)}
              className={`p-1.5 border border-[#2A2725] flex-shrink-0 transition-colors ${
                isLiked ? 'bg-[#D96B43] text-[#121113]' : 'bg-[#121113] text-[#9E988F] hover:text-[#F4F1EA]'
              }`}
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
            </button>
          </div>

          {/* Record Metadata Specs Table */}
          <div className="grid grid-cols-2 gap-2 text-[10px] font-editorial-mono pt-2 border-t border-[#2A2725]">
            <div className="bg-[#121113] p-2 border border-[#2A2725]">
              <span className="block text-[#9E988F]/60">ALBUM</span>
              <span className="text-[#F4F1EA] truncate block font-bold">{currentTrack.album || 'Single'}</span>
            </div>
            <div className="bg-[#121113] p-2 border border-[#2A2725]">
              <span className="block text-[#9E988F]/60">GENRE</span>
              <span className="text-[#D96B43] truncate block font-bold">{currentTrack.genre || 'Afrobeats'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Up Next Queue Sequence */}
      <div className="flex-1 p-5 space-y-3">
        <div className="flex items-center justify-between text-[10px] font-editorial-mono tracking-widest text-[#9E988F] uppercase">
          <span>UP NEXT QUEUE</span>
          <span>({queue.length})</span>
        </div>

        {queue.length === 0 ? (
          <div className="text-xs font-editorial-sans text-[#9E988F]/70 text-center py-6 border border-dashed border-[#2A2725]">
            No queued tracks. Click any track to add.
          </div>
        ) : (
          <div className="space-y-1.5">
            {queue.slice(0, 5).map((track, idx) => (
              <div
                key={`${track.id}-${idx}`}
                onClick={() => onPlayTrack(track)}
                className="group flex items-center justify-between p-2.5 bg-[#121113] border border-[#2A2725] hover:border-[#D96B43] cursor-pointer transition-colors"
              >
                <div className="flex items-center space-x-3 min-w-0">
                  <span className="text-[10px] font-editorial-mono text-[#9E988F]">
                    0{idx + 1}
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-editorial-sans text-[#F4F1EA] truncate group-hover:text-[#D96B43] font-medium">
                      {track.title}
                    </p>
                    <p className="text-[10px] font-editorial-sans text-[#9E988F] truncate">
                      {track.artist}
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-editorial-mono text-[#9E988F]">
                  {track.duration}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
}
