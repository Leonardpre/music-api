import React from 'react';
import { Search, Compass, Bookmark, Home, Disc, Radio, Sliders, ArrowUpRight, X } from 'lucide-react';

export default function LeftSidebar({
  activeNav,
  setActiveNav,
  selectedPlaylist,
  setSelectedPlaylist,
  searchQuery,
  setSearchQuery,
  playlists,
  isMobileOpen,
  onCloseMobile
}) {
  return (
    <aside
      className={`fixed inset-y-0 left-0 w-72 bg-[#121113] border-r border-[#2A2725] flex flex-col h-full select-none z-50 transition-transform duration-300 transform ${
        isMobileOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:relative lg:translate-x-0 lg:w-64 xl:w-72 flex-shrink-0`}
    >
      {/* Brand & Edition Header with Gold Crest Logo */}
      <div className="p-6 border-b border-[#2A2725] bg-[#121113] relative">
        {/* Mobile Close Button */}
        <button
          onClick={onCloseMobile}
          className="lg:hidden absolute top-5 right-5 text-[#9E988F] hover:text-[#F4F1EA] p-1 border border-[#2A2725]"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3.5 mb-3">
          <div className="w-12 h-12 flex-shrink-0 border border-[#2A2725] bg-[#1C1817] p-1 shadow-none">
            <img
              src="/logo.png"
              alt="Sonic Archive Gold Emblem"
              className="w-full h-full object-contain filter drop-shadow-md"
            />
          </div>
          <div>
            <span className="text-[9px] tracking-[0.2em] text-[#D96B43] font-editorial-mono uppercase font-bold block">
              ARCHIVE NO. 04
            </span>
            <span className="text-[10px] text-[#9E988F] font-editorial-mono block">
              EST. 2026
            </span>
          </div>
        </div>

        <h1 className="font-editorial-serif text-2xl font-normal text-[#F4F1EA] tracking-tight leading-none">
          SONIC ARCHIVE
        </h1>
        <p className="text-[11px] text-[#9E988F] font-editorial-sans mt-1.5 font-light tracking-wide">
          Curated Soundscapes & Pressings
        </p>
      </div>

      {/* Editorial Search Bar */}
      <div className="px-5 py-4 border-b border-[#2A2725]">
        <div className="relative flex items-center">
          <Search className="w-3.5 h-3.5 text-[#9E988F] absolute left-3 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tracks, artists..."
            className="w-full bg-[#1C1817] text-[#F4F1EA] placeholder-[#9E988F]/60 text-xs font-editorial-sans pl-9 pr-3 py-2 border border-[#2A2725] rounded-none focus:outline-none focus:border-[#D96B43] transition-colors"
          />
        </div>
      </div>

      {/* Main Navigation (Minimalist Bold Text Links) */}
      <nav className="p-5 border-b border-[#2A2725] space-y-1">
        <div className="text-[10px] font-editorial-mono tracking-widest text-[#9E988F] uppercase mb-3 px-1">
          NAVIGATION
        </div>
        {[
          { id: 'Home', label: 'Home', icon: Home },
          { id: 'Explore', label: 'Explore', icon: Compass },
          { id: 'Collection', label: 'Collection', icon: Bookmark },
        ].map((item) => {
          const isActive = activeNav === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveNav(item.id);
                setSelectedPlaylist(null);
                if (onCloseMobile) onCloseMobile();
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 text-xs font-editorial-sans font-bold tracking-wider text-left transition-all ${
                isActive
                  ? 'bg-[#D96B43] text-[#121113]'
                  : 'text-[#F4F1EA] hover:bg-[#1E241E] hover:text-[#D96B43]'
              }`}
            >
              <span className="uppercase">{item.label}</span>
              <span className={`text-[10px] font-editorial-mono ${isActive ? 'text-[#121113]' : 'text-[#9E988F]'}`}>
                0{item.id === 'Home' ? '1' : item.id === 'Explore' ? '2' : '3'}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Text-based Playlists List */}
      <div className="flex-1 overflow-y-auto p-5">
        <div className="flex items-center justify-between text-[10px] font-editorial-mono tracking-widest text-[#9E988F] uppercase mb-3 px-1">
          <span>SELECTED PLAYLISTS</span>
          <span>({playlists.length})</span>
        </div>
        <div className="space-y-1">
          {playlists.map((playlist) => {
            const isSelected = selectedPlaylist === playlist.id;
            return (
              <button
                key={playlist.id}
                onClick={() => {
                  setSelectedPlaylist(playlist.id);
                  setActiveNav('Explore');
                  if (onCloseMobile) onCloseMobile();
                }}
                className={`w-full group flex items-baseline justify-between px-3 py-2 text-xs font-editorial-sans text-left transition-colors border-l-2 ${
                  isSelected
                    ? 'border-[#D96B43] bg-[#1E241E] text-[#F4F1EA] font-semibold'
                    : 'border-transparent text-[#9E988F] hover:text-[#F4F1EA] hover:bg-[#1C1817]'
                }`}
              >
                <span className="truncate pr-2">{playlist.name}</span>
                <span className="text-[10px] font-editorial-mono opacity-60 text-right flex-shrink-0">
                  {playlist.trackCount}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Editorial Footer Badge */}
      <div className="p-4 border-t border-[#2A2725] bg-[#1C1817] text-center">
        <div className="flex items-center justify-between text-[10px] font-editorial-mono text-[#9E988F]">
          <span>VINYL PRESSING</span>
          <span className="inline-block w-2 h-2 rounded-full bg-[#D96B43] animate-pulse"></span>
        </div>
        <div className="text-[11px] text-[#F4F1EA] font-editorial-serif italic mt-1">
          "Music as a tactile art form"
        </div>
      </div>
    </aside>
  );
}
