/* ============================================
   MUSIC PLAYER PRO - COMPLETE APPLICATION
   ============================================ */

// ============================================
// STATE MANAGEMENT
// ============================================

let songs = [];
let currentSongIndex = 0;
let isPlaying = false;
let isShuffle = false;
let repeatMode = 0; // 0 = no repeat, 1 = repeat all, 2 = repeat one
let favorites = JSON.parse(localStorage.getItem('favoritesSongs')) || [];
let userSettings = JSON.parse(localStorage.getItem('userSettings')) || {
  autoplay: true,
  lyrics: false,
  quality: true,
  theme: 'dark',
  fontSize: 14,
  history: true
};

// ============================================
// DOM ELEMENTS - PLAYER CONTROLS
// ============================================

const playBtn = document.getElementById('playBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const repeatBtn = document.getElementById('repeatBtn');
const shuffleBtn = document.getElementById('shuffleBtn');
const progressBar = document.getElementById('progressBar');
const volumeSlider = document.getElementById('volumeSlider');
const playlist = document.getElementById('playlist');
const favoriteBtn = document.getElementById('favoriteBtn');

// Song info elements
const songTitle = document.getElementById('songTitle');
const songArtist = document.getElementById('songArtist');
const songAlbum = document.getElementById('songAlbum');
const songDuration = document.getElementById('songDuration');
const currentTimeEl = document.getElementById('currentTime');
const totalTimeEl = document.getElementById('totalTime');
const songCount = document.getElementById('songCount');
const favoritesBadge = document.getElementById('favoritesBadge');

// Header elements
const headerTitle = document.getElementById('headerTitle');
const headerSubtitle = document.getElementById('headerSubtitle');

// Navigation elements
const navItems = document.querySelectorAll('.nav-item');
const viewContainers = document.querySelectorAll('.view-container');

// Search elements
const globalSearch = document.getElementById('globalSearch');
const searchSuggestions = document.getElementById('searchSuggestions');
const filterGenre = document.getElementById('filterGenre');
const sortBy = document.getElementById('sortBy');
const searchResults = document.getElementById('searchResults');

// Library elements
const filterTabs = document.querySelectorAll('.filter-tab');
const libraryContent = document.getElementById('libraryContent');

// Favorites elements
const favoritesList = document.getElementById('favoritesList');
const clearFavoritesBtn = document.getElementById('clearFavoritesBtn');

// Settings elements
const userName = document.getElementById('userName');
const userEmail = document.getElementById('userEmail');
const autoplayToggle = document.getElementById('autoplayToggle');
const lyricsToggle = document.getElementById('lyricsToggle');
const qualityToggle = document.getElementById('qualityToggle');
const themeSelect = document.getElementById('themeSelect');
const fontSizeSlider = document.getElementById('fontSizeSlider');
const fontSizeValue = document.getElementById('fontSizeValue');
const favoritesCount = document.getElementById('favoritesCount');
const clearHistoryBtn = document.getElementById('clearHistoryBtn');
const clearCacheBtn = document.getElementById('clearCacheBtn');
const totalSongsInfo = document.getElementById('totalSongsInfo');

// Audio element
const audio = new Audio();
audio.volume = 0.7;

// ============================================
// FETCH SONGS FROM API
// ============================================

async function fetchSongs() {
  try {
    const response = await fetch('/songs');
    songs = await response.json();
    
    // Update song count
    songCount.textContent = `${songs.length} songs`;
    totalSongsInfo.textContent = songs.length;
    
    // Load first song and render playlist
    loadSong(0);
    renderPlaylist();
    updateFavoritesBadge();
  } catch (error) {
    console.error('Error fetching songs:', error);
  }
}

// ============================================
// ONLINE ALBUM COVER ARTWORK & FAST PLAYBACK
// ============================================

const GENRE_COVERS = {
  'Afrobeats': [
    'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=600&auto=format&fit=crop&q=80'
  ],
  'Anime J-Rock': [
    'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=600&auto=format&fit=crop&q=80'
  ],
  'Anime J-Pop': [
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80'
  ],
  'Anime Soundtrack': [
    'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=600&auto=format&fit=crop&q=80'
  ],
  'Dark Pop': [
    'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=600&auto=format&fit=crop&q=80'
  ]
};

function getSongCover(song) {
  if (song && song.cover && song.cover.startsWith('http')) {
    return song.cover;
  }
  const genreList = GENRE_COVERS[song.genre] || GENRE_COVERS['Afrobeats'];
  const index = Math.abs((song.id || 0)) % genreList.length;
  return genreList[index];
}

const nextAudioPreloader = new Audio();
nextAudioPreloader.preload = 'auto';

function preloadNextSong(nextIndex) {
  if (songs.length === 0) return;
  const targetIndex = nextIndex % songs.length;
  const nextTrack = songs[targetIndex];
  if (nextTrack && nextTrack.audio && nextTrack.audio.includes('cloudinary.com')) {
    nextAudioPreloader.src = nextTrack.audio;
  }
}

// ============================================
// PLAYER FUNCTIONS
// ============================================

function loadSong(index) {
  if (songs.length === 0) return;
  
  if (index < 0) {
    currentSongIndex = songs.length - 1;
  } else if (index >= songs.length) {
    currentSongIndex = 0;
  } else {
    currentSongIndex = index;
  }
  
  const song = songs[currentSongIndex];
  
  // Synchronous UI updates (0ms delay response)
  songTitle.textContent = song.title;
  songArtist.textContent = song.artist;
  songAlbum.textContent = song.album;
  songDuration.textContent = song.duration;
  totalTimeEl.textContent = song.duration;
  
  // Set album artwork image
  const albumCover = document.getElementById('albumCover');
  const albumPlaceholder = document.getElementById('albumPlaceholder');
  if (albumCover) {
    albumCover.src = getSongCover(song);
    albumCover.style.display = 'block';
    if (albumPlaceholder) albumPlaceholder.style.display = 'none';
  }
  
  updatePlaylistHighlight();
  updateFavoriteButton();
  
  // Fast audio source assignment
  audio.pause();
  audio.preload = 'auto';
  
  if (song.audio && song.audio.startsWith('http')) {
    if (song.audio.includes('spotify.com') || song.audio.includes('google.com')) {
      audio.src = '';
    } else {
      audio.src = song.audio;
    }
  } else {
    audio.src = `audio/${song.id}.mp3`;
  }
  
  progressBar.value = 0;
  currentTimeEl.textContent = '0:00';
}

// Function to load AND play a song instantly
function playSong(index) {
  loadSong(index);
  
  // Update UI immediately so click feels instant
  playBtn.textContent = '⏸';
  playBtn.classList.add('playing');
  isPlaying = true;
  
  if (!audio.src || audio.src === window.location.href) {
    showNotification(`🎵 Selected: ${songs[currentSongIndex].title}`);
    preloadNextSong(currentSongIndex + 1);
    return;
  }
  
  audio.play().then(() => {
    console.log('Playback started for:', songs[currentSongIndex].title);
    preloadNextSong(currentSongIndex + 1);
  }).catch(error => {
    console.warn('Playback info:', error.message);
    if (error.name === 'NotSupportedError' || error.name === 'NotAllowedError') {
      showNotification(`🎵 Selected: ${songs[currentSongIndex].title}`);
    }
  });
}

// ============================================
// PLAY & PAUSE
// ============================================

playBtn.addEventListener('click', () => {
  if (songs.length === 0) return;
  
  if (isPlaying) {
    audio.pause();
    playBtn.textContent = '▶';
    playBtn.classList.remove('playing');
    isPlaying = false;
  } else {
    audio.play();
    playBtn.textContent = '⏸';
    playBtn.classList.add('playing');
    isPlaying = true;
  }
});

// ============================================
// PREVIOUS & NEXT
// ============================================

prevBtn.addEventListener('click', () => {
  if (isShuffle) {
    currentSongIndex = Math.floor(Math.random() * songs.length);
  } else {
    currentSongIndex--;
  }
  loadSong(currentSongIndex);
  if (isPlaying) audio.play();
});

nextBtn.addEventListener('click', () => {
  if (isShuffle) {
    currentSongIndex = Math.floor(Math.random() * songs.length);
  } else {
    currentSongIndex++;
  }
  loadSong(currentSongIndex);
  if (isPlaying) audio.play();
});

// ============================================
// REPEAT MODE
// ============================================

repeatBtn.addEventListener('click', () => {
  repeatMode = (repeatMode + 1) % 3;
  
  if (repeatMode === 0) {
    repeatBtn.textContent = '🔄';
    repeatBtn.style.color = '';
  } else if (repeatMode === 1) {
    repeatBtn.textContent = '🔁';
    repeatBtn.style.color = 'var(--color-accent-pink)';
  } else if (repeatMode === 2) {
    repeatBtn.textContent = '🔂';
    repeatBtn.style.color = 'var(--color-accent-pink)';
  }
});

// ============================================
// SHUFFLE MODE
// ============================================

shuffleBtn.addEventListener('click', () => {
  isShuffle = !isShuffle;
  
  if (isShuffle) {
    shuffleBtn.style.color = 'var(--color-accent-cyan)';
  } else {
    shuffleBtn.style.color = '';
  }
});

// ============================================
// PROGRESS BAR
// ============================================

progressBar.addEventListener('input', (e) => {
  const time = (e.target.value / 100) * audio.duration;
  audio.currentTime = time;
});

audio.addEventListener('timeupdate', () => {
  if (!isNaN(audio.duration)) {
    const percent = (audio.currentTime / audio.duration) * 100;
    progressBar.value = percent;
    currentTimeEl.textContent = formatTime(audio.currentTime);
  }
});

// ============================================
// VOLUME CONTROL
// ============================================

volumeSlider.addEventListener('input', (e) => {
  audio.volume = e.target.value / 100;
});

// ============================================
// SONG END
// ============================================

audio.addEventListener('ended', () => {
  if (repeatMode === 2) {
    audio.currentTime = 0;
    audio.play();
  } else {
    nextBtn.click();
  }
});

// ============================================
// FAVORITES SYSTEM
// ============================================

function addToFavorites(songId) {
  if (!favorites.includes(songId)) {
    favorites.push(songId);
    localStorage.setItem('favoritesSongs', JSON.stringify(favorites));
    updateFavoritesBadge();
    updateFavoriteButton();
  }
}

function removeFromFavorites(songId) {
  favorites = favorites.filter(id => id !== songId);
  localStorage.setItem('favoritesSongs', JSON.stringify(favorites));
  updateFavoritesBadge();
  updateFavoriteButton();
}

function isFavorite(songId) {
  return favorites.includes(songId);
}

function updateFavoriteButton() {
  const currentSong = songs[currentSongIndex];
  if (isFavorite(currentSong.id)) {
    favoriteBtn.textContent = '❤️';
    favoriteBtn.classList.add('active');
  } else {
    favoriteBtn.textContent = '🤍';
    favoriteBtn.classList.remove('active');
  }
}

function updateFavoritesBadge() {
  favoritesBadge.textContent = favorites.length;
}

favoriteBtn.addEventListener('click', () => {
  const currentSong = songs[currentSongIndex];
  if (isFavorite(currentSong.id)) {
    removeFromFavorites(currentSong.id);
  } else {
    addToFavorites(currentSong.id);
  }
});

// ============================================
// VIEW MANAGEMENT
// ============================================

function switchView(viewName) {
  // Hide all views
  viewContainers.forEach(container => {
    container.classList.add('hidden');
  });
  
  // Show selected view
  const selectedView = document.getElementById(viewName + '-view');
  if (selectedView) {
    selectedView.classList.remove('hidden');
  }
  
  // Update nav items
  navItems.forEach(item => {
    if (item.getAttribute('data-view') === viewName) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });
  
  // Update header
  updateHeader(viewName);
}

function updateHeader(viewName) {
  const headerTexts = {
    'now-playing': { title: 'Now Playing', subtitle: 'Your current song' },
    'search': { title: 'Search', subtitle: 'Find songs, artists, and more' },
    'library': { title: 'Library', subtitle: 'All your songs organized' },
    'favorites': { title: 'Favorite Songs', subtitle: `${favorites.length} favorites saved` },
    'settings': { title: 'Settings', subtitle: 'Customize your experience' }
  };
  
  const text = headerTexts[viewName] || headerTexts['now-playing'];
  headerTitle.textContent = text.title;
  headerSubtitle.textContent = text.subtitle;
}

// Navigation event listeners
navItems.forEach(item => {
  item.addEventListener('click', () => {
    const viewName = item.getAttribute('data-view');
    switchView(viewName);
    
    if (viewName === 'search') {
      renderSearchResults(songs);
    } else if (viewName === 'library') {
      renderLibrary('all');
    } else if (viewName === 'favorites') {
      renderFavorites();
    }
  });
});

// ============================================
// RENDER PLAYLIST
// ============================================

function formatPaddedDuration(durationStr) {
  if (!durationStr) return '00:00';
  const parts = durationStr.split(':');
  if (parts.length === 2) {
    const mins = parts[0].padStart(2, '0');
    const secs = parts[1].padStart(2, '0');
    return `${mins}:${secs}`;
  }
  return durationStr;
}

function renderPlaylist() {
  playlist.innerHTML = '';
  
  songs.forEach((song, index) => {
    const item = document.createElement('div');
    item.className = 'playlist-item';
    item.style.setProperty('--index', index);
    
    if (index === currentSongIndex) {
      item.classList.add('active');
    }
    
    const isFav = isFavorite(song.id);
    const formattedTime = formatPaddedDuration(song.duration);
    
    item.innerHTML = `
      <button class="playlist-play-btn" title="Play">▶</button>
      <div class="playlist-item-info">
        <div class="playlist-item-title">${song.title}</div>
        <div class="playlist-item-artist">${song.artist}</div>
      </div>
      <div class="playlist-item-album">
        <a href="#" class="album-link" onclick="event.preventDefault();">${song.album || 'Single'}</a>
      </div>
      <div class="playlist-item-actions">
        <button class="action-btn btn-add ${isFav ? 'active' : ''}" title="Add to Favorites">
          <svg class="action-icon" viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="1.8" fill="none"><rect x="3" y="3" width="18" height="18" rx="4"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
        </button>
        <button class="action-btn btn-share" title="Share Song">
          <svg class="action-icon" viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="1.8" fill="none"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
        </button>
        <button class="action-btn btn-download" title="Download Audio">
          <svg class="action-icon" viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="1.8" fill="none"><rect x="4" y="3" width="16" height="18" rx="4"/><path d="M12 7v7m0 0l-3-3m3 3l3-3"/><line x1="8" y1="17" x2="16" y2="17"/></svg>
        </button>
        <button class="action-btn btn-more" title="More Options">
          <svg class="action-icon" viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><circle cx="12" cy="5" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="12" cy="19" r="2"/></svg>
        </button>
      </div>
      <div class="playlist-item-duration">${formattedTime}</div>
    `;
    
    item.addEventListener('click', (e) => {
      if (e.target.closest('.action-btn') || e.target.closest('.album-link')) return;
      playSong(index);
    });
    
    const addBtn = item.querySelector('.btn-add');
    addBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (isFavorite(song.id)) {
        removeFromFavorites(song.id);
        addBtn.classList.remove('active');
        showNotification(`Removed "${song.title}" from Favorites`);
      } else {
        addToFavorites(song.id);
        addBtn.classList.add('active');
        showNotification(`Added "${song.title}" to Favorites`);
      }
    });

    const shareBtn = item.querySelector('.btn-share');
    shareBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const songUrl = window.location.origin + `/songs/${song.id}`;
      navigator.clipboard.writeText(songUrl).then(() => {
        showNotification(`🔗 Link for "${song.title}" copied to clipboard!`);
      }).catch(() => {
        showNotification(`🔗 "${song.title}" by ${song.artist}`);
      });
    });

    const downloadBtn = item.querySelector('.btn-download');
    downloadBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (song.audio && song.audio.startsWith('http') && !song.audio.includes('spotify.com')) {
        window.open(song.audio, '_blank');
        showNotification(`📥 Opening audio link for "${song.title}"...`);
      } else {
        showNotification(`📥 Download link for "${song.title}"`);
      }
    });

    const moreBtn = item.querySelector('.btn-more');
    moreBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      showNotification(`🎵 Options menu for "${song.title}"`);
    });
    
    playlist.appendChild(item);
  });
}

function updatePlaylistHighlight() {
  const items = document.querySelectorAll('.playlist-item');
  items.forEach((item, index) => {
    if (index === currentSongIndex) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });
}

// ============================================
// SEARCH FUNCTIONALITY
// ============================================

function searchSongs(query, genre = '', sortOption = 'title') {
  let results = songs;
  
  // Filter by genre
  if (genre) {
    results = results.filter(song => song.genre === genre);
  }
  
  // Search by query
  if (query) {
    const lowerQuery = query.toLowerCase();
    results = results.filter(song =>
      song.title.toLowerCase().includes(lowerQuery) ||
      song.artist.toLowerCase().includes(lowerQuery) ||
      song.album.toLowerCase().includes(lowerQuery)
    );
  }
  
  // Sort results
  switch (sortOption) {
    case 'artist':
      results.sort((a, b) => a.artist.localeCompare(b.artist));
      break;
    case 'genre':
      results.sort((a, b) => a.genre.localeCompare(b.genre));
      break;
    case 'duration':
      results.sort((a, b) => {
        const aDur = a.duration.split(':').reduce((acc, val) => acc * 60 + parseInt(val), 0);
        const bDur = b.duration.split(':').reduce((acc, val) => acc * 60 + parseInt(val), 0);
        return aDur - bDur;
      });
      break;
    default: // title
      results.sort((a, b) => a.title.localeCompare(b.title));
  }
  
  return results;
}

function renderSearchResults(results) {
  searchResults.innerHTML = '';
  
  if (results.length === 0) {
    searchResults.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">🔍</div>
        <div class="empty-state-title">No songs found</div>
        <div class="empty-state-text">Try adjusting your search or filters</div>
      </div>
    `;
    return;
  }
  
  results.forEach(song => {
    const item = document.createElement('div');
    item.className = 'search-result-item';
    if (currentSongIndex >= 0 && songs[currentSongIndex].id === song.id) {
      item.classList.add('active');
    }
    
    const isFav = isFavorite(song.id);
    
    item.innerHTML = `
      <img src="${getSongCover(song)}" class="item-thumb-img" alt="${song.title}">
      <div class="search-result-info">
        <div class="search-result-title">${song.title}</div>
        <div class="search-result-artist">${song.artist}</div>
      </div>
      <div class="search-result-duration">${song.duration}</div>
      <button class="search-result-favorite ${isFav ? 'active' : ''}">
        ${isFav ? '❤️' : '🤍'}
      </button>
    `;
    
    const playArea = item.querySelector('.search-result-info');
    playArea.style.cursor = 'pointer';
    playArea.addEventListener('click', () => {
      const songIndex = songs.findIndex(s => s.id === song.id);
      playSong(songIndex);
    });
    
    const favBtn = item.querySelector('.search-result-favorite');
    favBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (isFavorite(song.id)) {
        removeFromFavorites(song.id);
        favBtn.textContent = '🤍';
        favBtn.classList.remove('active');
      } else {
        addToFavorites(song.id);
        favBtn.textContent = '❤️';
        favBtn.classList.add('active');
      }
    });
    
    searchResults.appendChild(item);
  });
}

// ============================================
// LIVE SEARCH SUGGESTIONS & EVENT LISTENERS
// ============================================

function highlightMatch(text, query) {
  if (!query) return text;
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  return text.replace(regex, '<span class="suggestion-match">$1</span>');
}

function renderSearchSuggestions(query) {
  if (!searchSuggestions) return;
  const trimmed = query.trim().toLowerCase();
  
  if (!trimmed) {
    searchSuggestions.classList.add('hidden');
    searchSuggestions.innerHTML = '';
    return;
  }

  const matches = songs.filter(song =>
    song.title.toLowerCase().includes(trimmed) ||
    song.artist.toLowerCase().includes(trimmed) ||
    song.album.toLowerCase().includes(trimmed) ||
    song.genre.toLowerCase().includes(trimmed)
  ).slice(0, 8); // Top 8 suggestions

  searchSuggestions.innerHTML = '';

  if (matches.length === 0) {
    searchSuggestions.innerHTML = `
      <div class="suggestion-empty">No matching songs found for "${query}"</div>
    `;
    searchSuggestions.classList.remove('hidden');
    return;
  }

  const header = document.createElement('div');
  header.className = 'suggestion-header';
  header.textContent = `Suggestions (${matches.length})`;
  searchSuggestions.appendChild(header);

  matches.forEach(song => {
    const item = document.createElement('div');
    item.className = 'suggestion-item';
    
    item.innerHTML = `
      <img src="${getSongCover(song)}" class="item-thumb-img" alt="${song.title}">
      <div class="suggestion-details">
        <div class="suggestion-title">${highlightMatch(song.title, query)}</div>
        <div class="suggestion-artist">${highlightMatch(song.artist, query)}</div>
      </div>
      <div class="suggestion-genre-badge">${song.genre}</div>
    `;

    item.addEventListener('click', (e) => {
      e.stopPropagation();
      const songIndex = songs.findIndex(s => s.id === song.id);
      if (songIndex !== -1) {
        playSong(songIndex);
      }
      globalSearch.value = song.title;
      searchSuggestions.classList.add('hidden');
    });

    searchSuggestions.appendChild(item);
  });

  searchSuggestions.classList.remove('hidden');
}

// Search event listeners
globalSearch.addEventListener('input', (e) => {
  const query = e.target.value;
  renderSearchSuggestions(query);
  
  const genre = filterGenre ? filterGenre.value : '';
  const sortOption = sortBy ? sortBy.value : 'title';
  const results = searchSongs(query, genre, sortOption);
  renderSearchResults(results);
});

globalSearch.addEventListener('focus', () => {
  if (globalSearch.value.trim()) {
    renderSearchSuggestions(globalSearch.value);
  }
});

document.addEventListener('click', (e) => {
  if (searchSuggestions && !e.target.closest('.search-wrapper')) {
    searchSuggestions.classList.add('hidden');
  }
});

filterGenre.addEventListener('change', (e) => {
  const query = globalSearch.value;
  const genre = e.target.value;
  const sortOption = sortBy.value;
  const results = searchSongs(query, genre, sortOption);
  renderSearchResults(results);
});

sortBy.addEventListener('change', (e) => {
  const query = globalSearch.value;
  const genre = filterGenre.value;
  const sortOption = e.target.value;
  const results = searchSongs(query, genre, sortOption);
  renderSearchResults(results);
});

// ============================================
// LIBRARY FUNCTIONALITY
// ============================================

function renderLibrary(filterType = 'all') {
  libraryContent.innerHTML = '';
  let groupedSongs = {};
  
  switch (filterType) {
    case 'genre':
      groupedSongs = groupSongsByGenre();
      renderGroupedLibrary(groupedSongs, 'Genre');
      break;
    case 'artist':
      groupedSongs = groupSongsByArtist();
      renderGroupedLibrary(groupedSongs, 'Artist');
      break;
    case 'duration':
      groupedSongs = groupSongsByDuration();
      renderGroupedLibrary(groupedSongs, 'Duration');
      break;
    default:
      renderAllSongs();
  }
}

function groupSongsByGenre() {
  return songs.reduce((acc, song) => {
    if (!acc[song.genre]) acc[song.genre] = [];
    acc[song.genre].push(song);
    return acc;
  }, {});
}

function groupSongsByArtist() {
  return songs.reduce((acc, song) => {
    if (!acc[song.artist]) acc[song.artist] = [];
    acc[song.artist].push(song);
    return acc;
  }, {});
}

function groupSongsByDuration() {
  return songs.reduce((acc, song) => {
    const dur = song.duration.split(':')[0];
    const key = `${dur} min`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(song);
    return acc;
  }, {});
}

function renderGroupedLibrary(grouped, groupName) {
  Object.keys(grouped).sort().forEach(groupKey => {
    const group = document.createElement('div');
    group.className = 'library-group';
    
    const title = document.createElement('div');
    title.className = 'library-group-title';
    title.textContent = `${groupName}: ${groupKey}`;
    group.appendChild(title);
    
    grouped[groupKey].forEach((song, index) => {
      const item = document.createElement('div');
      item.className = 'library-item';
      if (currentSongIndex >= 0 && songs[currentSongIndex].id === song.id) {
        item.classList.add('active');
      }
      
      item.innerHTML = `
        <div class="library-item-number">${index + 1}</div>
        <img src="${getSongCover(song)}" class="item-thumb-img" alt="${song.title}">
        <div class="playlist-item-info">
          <div class="playlist-item-title">${song.title}</div>
          <div class="playlist-item-artist">${song.artist}</div>
        </div>
        <div class="playlist-item-genre">${song.genre}</div>
        <div class="playlist-item-duration">${song.duration}</div>
      `;
      
      item.addEventListener('click', () => {
        const songIndex = songs.findIndex(s => s.id === song.id);
        playSong(songIndex);
      });
      
      group.appendChild(item);
    });
    
    libraryContent.appendChild(group);
  });
}

function renderAllSongs() {
  songs.forEach((song, index) => {
    const item = document.createElement('div');
    item.className = 'library-item';
    if (index === currentSongIndex) {
      item.classList.add('active');
    }
    
    item.innerHTML = `
      <div class="library-item-number">${index + 1}</div>
      <img src="${getSongCover(song)}" class="item-thumb-img" alt="${song.title}">
      <div class="playlist-item-info">
        <div class="playlist-item-title">${song.title}</div>
        <div class="playlist-item-artist">${song.artist}</div>
      </div>
      <div class="playlist-item-genre">${song.genre}</div>
      <div class="playlist-item-duration">${song.duration}</div>
    `;
    
    item.addEventListener('click', () => {
      playSong(index);
    });
    
    libraryContent.appendChild(item);
  });
}

// Library filter tabs
filterTabs.forEach(tab => {
  tab.addEventListener('click', (e) => {
    filterTabs.forEach(t => t.classList.remove('active'));
    e.target.classList.add('active');
    const filterType = e.target.getAttribute('data-filter');
    renderLibrary(filterType);
  });
});

// ============================================
// FAVORITES VIEW
// ============================================

function renderFavorites() {
  favoritesList.innerHTML = '';
  
  if (favorites.length === 0) {
    favoritesList.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">❤️</div>
        <div class="empty-state-title">No favorites yet</div>
        <div class="empty-state-text">Click the heart icon on any song to add it to favorites</div>
      </div>
    `;
    return;
  }
  
  favorites.forEach(songId => {
    const song = songs.find(s => s.id === songId);
    if (!song) return;
    
    const item = document.createElement('div');
    item.className = 'favorites-item';
    if (currentSongIndex >= 0 && songs[currentSongIndex].id === song.id) {
      item.classList.add('active');
    }
    
    item.innerHTML = `
      <img src="${getSongCover(song)}" class="item-thumb-img" alt="${song.title}">
      <div class="favorite-info">
        <div class="favorite-title">${song.title}</div>
        <div class="favorite-artist">${song.artist}</div>
      </div>
      <div class="favorite-duration">${song.duration}</div>
      <button class="btn-remove-favorite">❌</button>
    `;
    
    const favPlayArea = item.querySelector('.favorite-info');
    favPlayArea.style.cursor = 'pointer';
    favPlayArea.addEventListener('click', () => {
      const songIndex = songs.findIndex(s => s.id === song.id);
      playSong(songIndex);
    });
    
    const removeBtn = item.querySelector('.btn-remove-favorite');
    removeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      removeFromFavorites(song.id);
      renderFavorites();
    });
    
    favoritesList.appendChild(item);
  });
}

clearFavoritesBtn.addEventListener('click', () => {
  if (confirm('Are you sure you want to clear all favorites?')) {
    favorites = [];
    localStorage.setItem('favoritesSongs', JSON.stringify(favorites));
    updateFavoritesBadge();
    renderFavorites();
  }
});

// ============================================
// SETTINGS FUNCTIONALITY
// ============================================

function loadSettings() {
  autoplayToggle.checked = userSettings.autoplay;
  lyricsToggle.checked = userSettings.lyrics;
  qualityToggle.checked = userSettings.quality;
  themeSelect.value = userSettings.theme;
  fontSizeSlider.value = userSettings.fontSize;
  fontSizeValue.textContent = userSettings.fontSize + 'px';
  favoritesCount.textContent = favorites.length;
}

autoplayToggle.addEventListener('change', () => {
  userSettings.autoplay = autoplayToggle.checked;
  localStorage.setItem('userSettings', JSON.stringify(userSettings));
});

lyricsToggle.addEventListener('change', () => {
  userSettings.lyrics = lyricsToggle.checked;
  localStorage.setItem('userSettings', JSON.stringify(userSettings));
});

qualityToggle.addEventListener('change', () => {
  userSettings.quality = qualityToggle.checked;
  localStorage.setItem('userSettings', JSON.stringify(userSettings));
});

themeSelect.addEventListener('change', () => {
  userSettings.theme = themeSelect.value;
  localStorage.setItem('userSettings', JSON.stringify(userSettings));
  applyTheme(userSettings.theme);
});

fontSizeSlider.addEventListener('input', () => {
  const size = fontSizeSlider.value;
  userSettings.fontSize = size;
  fontSizeValue.textContent = size + 'px';
  document.documentElement.style.fontSize = size + 'px';
  localStorage.setItem('userSettings', JSON.stringify(userSettings));
});

clearHistoryBtn.addEventListener('click', () => {
  if (confirm('Clear playback history?')) {
    localStorage.removeItem('playbackHistory');
    alert('History cleared');
  }
});

clearCacheBtn.addEventListener('click', () => {
  if (confirm('Clear cache?')) {
    localStorage.removeItem('playerCache');
    alert('Cache cleared');
  }
});

function applyTheme(theme) {
  if (theme === 'dark') {
    document.body.classList.remove('light-mode');
    document.body.style.colorScheme = 'dark';
  } else if (theme === 'light') {
    document.body.classList.add('light-mode');
    document.body.style.colorScheme = 'light';
  } else {
    // Auto mode - detect system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (prefersDark) {
      document.body.classList.remove('light-mode');
      document.body.style.colorScheme = 'dark';
    } else {
      document.body.classList.add('light-mode');
      document.body.style.colorScheme = 'light';
    }
  }
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

function formatTime(seconds) {
  if (isNaN(seconds)) return '0:00';
  
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

// Show a temporary notification to the user
function showNotification(message) {
  // Remove existing notification if any
  const existing = document.querySelector('.player-notification');
  if (existing) existing.remove();
  
  const notification = document.createElement('div');
  notification.className = 'player-notification';
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    bottom: 30px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(255, 59, 48, 0.9);
    color: white;
    padding: 12px 24px;
    border-radius: 12px;
    font-size: 14px;
    z-index: 10000;
    backdrop-filter: blur(10px);
    box-shadow: 0 4px 20px rgba(0,0,0,0.3);
    animation: slideUp 0.3s ease;
  `;
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.opacity = '0';
    notification.style.transition = 'opacity 0.3s ease';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// ============================================
// KEYBOARD SHORTCUTS
// ============================================

document.addEventListener('keydown', (e) => {
  if (e.code === 'Space') {
    e.preventDefault();
    playBtn.click();
  } else if (e.code === 'ArrowRight') {
    nextBtn.click();
  } else if (e.code === 'ArrowLeft') {
    prevBtn.click();
  } else if (e.code === 'KeyF') {
    favoriteBtn.click();
  }
});

// ============================================
// INITIALIZE APPLICATION
// ============================================

function initializeApp() {
  fetchSongs();
  loadSettings();
  applyTheme(userSettings.theme);
  
  // Set initial view
  switchView('now-playing');
}

initializeApp();
