import React from 'react';
import { Play, Pause, Heart, Menu, Disc, Sparkles, Filter, Check, Music } from 'lucide-react';

export default function MainFeed({
  songs,
  currentTrack,
  isPlaying,
  onPlayTrack,
  onPauseTrack,
  selectedGenre,
  setSelectedGenre,
  genres,
  likedSongIds,
  onToggleLike,
  activeNav,
  selectedPlaylistObj,
  onToggleMobileMenu,
  onToggleMobileRight
}) {
  // Featured hero spotlight track
  const heroTrack = songs.find(s => s.artist === 'Asake' || s.artist === 'Eve') || songs[0];

  return (
    <main className="flex-1 bg-[#121113] overflow-y-auto flex flex-col min-w-0 border-r border-[#2A2725]">
      {/* Mobile Top Navigation Bar (Shown only on small/medium screens) */}
      <div className="lg:hidden px-4 py-3 bg-[#1C1817] border-b border-[#2A2725] flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center space-x-3">
          <button
            onClick={onToggleMobileMenu}
            className="p-2 bg-[#121113] border border-[#2A2725] text-[#F4F1EA] hover:text-[#D96B43]"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center space-x-2">
            <img src="/logo.png" alt="Sonic Archive Gold Crest" className="w-8 h-8 object-contain" />
            <span className="font-editorial-serif text-lg font-normal text-[#F4F1EA]">
              SONIC ARCHIVE
            </span>
          </div>
        </div>

        <button
          onClick={onToggleMobileRight}
          className="flex items-center space-x-1 px-3 py-1.5 bg-[#121113] border border-[#2A2725] text-xs font-editorial-mono text-[#D96B43]"
        >
          <Disc className={`w-3.5 h-3.5 ${isPlaying ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline">NOW PLAYING</span>
        </button>
      </div>

      {/* Editorial Magazine Top Header Bar */}
      <header className="px-5 sm:px-8 pt-6 sm:pt-8 pb-6 border-b border-[#2A2725]">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <span className="px-2 py-0.5 bg-[#1E241E] text-[#D96B43] border border-[#2A2725] text-[10px] font-editorial-mono uppercase font-bold tracking-widest">
                FEATURED SELECTION
              </span>
              <span className="text-[11px] font-editorial-mono text-[#9E988F]">
                ISSUE NO. 84 — VOL. II
              </span>
            </div>
            <h2 className="font-editorial-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-[#F4F1EA] tracking-tight leading-none">
              {selectedPlaylistObj ? selectedPlaylistObj.name : activeNav === 'Collection' ? 'SAVED REPERTOIRE' : 'CURATED SOUNDSCAPES'}
            </h2>
            <p className="text-xs font-editorial-sans text-[#9E988F] mt-2 max-w-xl font-light">
              An architectural curation of high-fidelity Afrobeats, Japanese Rock anthologies, and atmospheric soundscapes.
            </p>
          </div>
          <div className="flex items-center space-x-4 text-xs font-editorial-mono text-[#9E988F] border-l border-[#2A2725] pl-4 hidden lg:flex">
            <div>
              <span className="block text-[10px] uppercase text-[#9E988F]/60">CATALOG SIZE</span>
              <span className="text-[#F4F1EA] font-bold">{songs.length} TRACKS</span>
            </div>
            <div>
              <span className="block text-[10px] uppercase text-[#9E988F]/60">CURATION</span>
              <span className="text-[#D96B43] font-bold">100% ANALOG</span>
            </div>
          </div>
        </div>

        {/* Category Pills (Flat sharp design discipline) */}
        <div className="flex items-center space-x-2 mt-6 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-[10px] font-editorial-mono uppercase tracking-widest text-[#9E988F] mr-2 flex-shrink-0">
            GENRES:
          </span>
          {genres.map((genre) => {
            const isSelected = selectedGenre === genre;
            return (
              <button
                key={genre}
                onClick={() => setSelectedGenre(genre)}
                className={`px-3.5 py-1.5 text-xs font-editorial-mono font-medium whitespace-nowrap transition-all border ${
                  isSelected
                    ? 'bg-[#D96B43] text-[#121113] border-[#D96B43] font-bold'
                    : 'bg-[#1E241E] text-[#F4F1EA] border-[#2A2725] hover:bg-[#1C1817] hover:border-[#9E988F]'
                }`}
              >
                {genre}
              </button>
            );
          })}
        </div>
      </header>

      {/* Main Content Feed Container */}
      <div className="p-4 sm:p-8 space-y-6 sm:space-y-8">
        
        {/* Asymmetrical Editorial Featured Hero Card */}
        {heroTrack && !selectedPlaylistObj && activeNav !== 'Collection' && (
          <section className="bg-[#1E241E] border border-[#2A2725] p-5 sm:p-8 relative overflow-hidden group">
            {/* Background texture overlay */}
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#F4F1EA_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>
            
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              <div className="md:col-span-8 space-y-4">
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-[#D96B43]"></span>
                  <span className="text-[10px] font-editorial-mono tracking-widest uppercase text-[#9E988F]">
                    EDITORIAL SPOTLIGHT
                  </span>
                </div>
                <h3 className="font-editorial-serif text-2xl sm:text-4xl text-[#F4F1EA] font-normal leading-tight">
                  {heroTrack.album || heroTrack.title}
                </h3>
                <div className="text-xs sm:text-sm font-editorial-sans text-[#D96B43] font-semibold tracking-wide">
                  BY {heroTrack.artist.toUpperCase()}
                </div>
                <p className="text-xs text-[#9E988F] font-editorial-sans max-w-lg font-light leading-relaxed">
                  Featured in this issue's prime selection. Heavy percussive polyrhythms paired with high-contrast production and visceral energy.
                </p>
                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => {
                      if (currentTrack?.id === heroTrack.id && isPlaying) {
                        onPauseTrack();
                      } else {
                        onPlayTrack(heroTrack);
                      }
                    }}
                    className="px-5 py-2.5 sm:px-6 sm:py-3 bg-[#D96B43] hover:bg-[#c45a33] text-[#121113] font-editorial-mono font-bold text-xs uppercase tracking-widest transition-colors flex items-center space-x-2"
                  >
                    {currentTrack?.id === heroTrack.id && isPlaying ? (
                      <>
                        <Pause className="w-4 h-4 fill-current" />
                        <span>PAUSE SPOTLIGHT</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 fill-current" />
                        <span>PLAY SPOTLIGHT</span>
                      </>
                    )}
                  </button>
                  <span className="text-xs font-editorial-mono text-[#9E988F]">
                    {heroTrack.duration} • {heroTrack.genre}
                  </span>
                </div>
              </div>

              {/* Asymmetrical Hero Art Frame */}
              <div className="md:col-span-4 flex justify-start md:justify-end">
                <div className="relative w-40 h-40 sm:w-48 sm:h-48 lg:w-56 lg:h-56 bg-[#1C1817] border border-[#2A2725] p-2 flex-shrink-0">
                  <img
                    src={heroTrack.cover || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=800&auto=format&fit=crop'}
                    alt={heroTrack.title}
                    className="w-full h-full object-cover grayscale contrast-125 hover:grayscale-0 transition-all duration-500"
                  />
                  <div className="absolute bottom-3 right-3 bg-[#121113] border border-[#2A2725] px-2 py-1 text-[9px] font-editorial-mono text-[#F4F1EA]">
                    #01
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Track List Section Header */}
        <div className="flex items-center justify-between border-b border-[#2A2725] pb-3">
          <div className="flex items-center space-x-3">
            <h4 className="font-editorial-serif text-lg sm:text-xl text-[#F4F1EA]">
              Track Catalog
            </h4>
            <span className="text-xs font-editorial-mono text-[#9E988F] bg-[#1C1817] px-2 py-0.5 border border-[#2A2725]">
              {songs.length} entries
            </span>
          </div>
          <div className="text-xs font-editorial-mono text-[#9E988F] hidden sm:block">
            SORT: NUMERICAL INDEX
          </div>
        </div>

        {/* Tabular Track List View (Responsive Table Layout) */}
        <div className="border border-[#2A2725] bg-[#121113]">
          {/* Table Header */}
          <div className="grid grid-cols-12 px-3 sm:px-4 py-3 bg-[#1C1817] border-b border-[#2A2725] text-[10px] font-editorial-mono text-[#9E988F] uppercase tracking-wider">
            <div className="col-span-2 sm:col-span-1 text-center">#</div>
            <div className="col-span-7 sm:col-span-4">TITLE & ARTIST</div>
            <div className="col-span-4 sm:col-span-4 hidden md:block">ALBUM / RECORD</div>
            <div className="col-span-3 sm:col-span-2 hidden sm:block text-center">GENRE</div>
            <div className="col-span-3 sm:col-span-1 text-right">TIME</div>
          </div>

          {/* Track Rows */}
          {songs.length === 0 ? (
            <div className="p-12 text-center text-[#9E988F] font-editorial-sans text-sm">
              No matching tracks found in this collection category.
            </div>
          ) : (
            songs.map((track, index) => {
              const isCurrent = currentTrack?.id === track.id;
              const isLiked = likedSongIds.includes(track.id);

              return (
                <div
                  key={track.id}
                  onClick={() => {
                    if (isCurrent && isPlaying) {
                      onPauseTrack();
                    } else {
                      onPlayTrack(track);
                    }
                  }}
                  className={`grid grid-cols-12 px-3 sm:px-4 py-3 border-b border-[#2A2725] items-center text-xs font-editorial-sans cursor-pointer transition-colors group ${
                    isCurrent
                      ? 'bg-[#1E241E] text-[#F4F1EA]'
                      : 'hover:bg-[#1C1817] text-[#F4F1EA]'
                  }`}
                >
                  {/* Track Number / Playing indicator */}
                  <div className="col-span-2 sm:col-span-1 text-center font-editorial-mono text-[#9E988F]">
                    {isCurrent && isPlaying ? (
                      <span className="inline-block w-2.5 h-2.5 bg-[#D96B43] animate-pulse"></span>
                    ) : (
                      <span className="group-hover:text-[#D96B43]">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                    )}
                  </div>

                  {/* Title & Artist */}
                  <div className="col-span-7 sm:col-span-4 pr-2 min-w-0">
                    <div className={`font-semibold truncate ${isCurrent ? 'text-[#D96B43]' : 'text-[#F4F1EA] group-hover:text-[#D96B43]'}`}>
                      {track.title}
                    </div>
                    <div className="text-[11px] text-[#9E988F] truncate font-light">
                      {track.artist}
                    </div>
                  </div>

                  {/* Album */}
                  <div className="col-span-4 sm:col-span-4 hidden md:block truncate text-[#9E988F] text-[11px] font-light">
                    {track.album || 'Single Release'}
                  </div>

                  {/* Genre */}
                  <div className="col-span-3 sm:col-span-2 hidden sm:block text-center">
                    <span className="inline-block px-2 py-0.5 text-[9px] font-editorial-mono border border-[#2A2725] bg-[#121113] text-[#9E988F]">
                      {track.genre || 'Afrobeats'}
                    </span>
                  </div>

                  {/* Duration & Actions */}
                  <div className="col-span-3 sm:col-span-1 flex items-center justify-end space-x-2 font-editorial-mono text-[#9E988F]">
                    <span className="text-[11px]">{track.duration}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleLike(track.id);
                      }}
                      className={`p-1 hover:text-[#D96B43] transition-colors ${
                        isLiked ? 'text-[#D96B43]' : 'text-[#9E988F]/40'
                      }`}
                      title={isLiked ? 'Remove from collection' : 'Add to collection'}
                    >
                      <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-current' : ''}`} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </main>
  );
}
