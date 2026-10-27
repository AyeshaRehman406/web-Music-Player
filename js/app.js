// Default Audio Catalog with reliable direct streams
const initialSongs = [
  {
    id: 1,
    title: "Summer Breeze",
    artist: "Ason ID",
    category: "Lo-Fi",
    duration: "2:45",
    src: "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3",
    cover: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=400&auto=format&fit=crop&q=80"
  },
  {
    id: 2,
    title: "Midnight Chill",
    artist: "Ghostrifter",
    category: "Chill",
    duration: "3:12",
    src: "https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=chill-abstract-intention-12099.mp3",
    cover: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&auto=format&fit=crop&q=80"
  },
  {
    id: 3,
    title: "Neon Pulse",
    artist: "Alex-Productions",
    category: "Electronic",
    duration: "2:26",
    src: "https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73467.mp3?filename=electronic-future-beats-117997.mp3",
    cover: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&auto=format&fit=crop&q=80"
  },
  {
    id: 4,
    title: "Quiet Morning",
    artist: "Purrple Cat",
    category: "Lo-Fi",
    duration: "2:14",
    src: "https://cdn.pixabay.com/download/audio/2022/11/06/audio_c920150d99.mp3?filename=coffee-chill-out-126200.mp3",
    cover: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&auto=format&fit=crop&q=80"
  },
  {
    id: 5,
    title: "Cyber City",
    artist: "Infraction",
    category: "Electronic",
    duration: "2:50",
    src: "https://cdn.pixabay.com/download/audio/2021/09/06/audio_731e8c743e.mp3?filename=cyberpunk-2099-10701.mp3",
    cover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&auto=format&fit=crop&q=80"
  }
];

// App State
let songsList = [...initialSongs];
let filteredSongs = [...initialSongs];
let currentIndex = 0;
let isPlaying = false;
let currentCategory = "All";
let searchQuery = "";

// DOM Elements
const audio = document.getElementById("audioEngine");
const playBtn = document.getElementById("playBtn");
const playIcon = document.getElementById("playIcon");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const progressBar = document.getElementById("progressBar");
const currentTimeEl = document.getElementById("currentTime");
const durationTimeEl = document.getElementById("durationTime");
const volumeSlider = document.getElementById("volumeSlider");
const muteBtn = document.getElementById("muteBtn");
const volumeIcon = document.getElementById("volumeIcon");

const vinylDisc = document.getElementById("vinylDisc");
const trackCover = document.getElementById("trackCover");
const trackTitle = document.getElementById("trackTitle");
const trackArtist = document.getElementById("trackArtist");
const trackGenre = document.getElementById("trackGenre");

const dockThumbnail = document.getElementById("dockThumbnail");
const dockTitle = document.getElementById("dockTitle");
const dockArtist = document.getElementById("dockArtist");

const playlistView = document.getElementById("playlistView");
const playlistCount = document.getElementById("playlistCount");
const searchInput = document.getElementById("searchInput");
const genreTabs = document.querySelectorAll(".genre-tab");

const fileUpload = document.getElementById("fileUpload");
const uploadBtn = document.getElementById("uploadBtn");

// Helper: Format Seconds to MM:SS
function formatTime(seconds) {
  if (isNaN(seconds) || seconds < 0) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
}

// Load Song into Player & Dock
function loadTrack(index) {
  if (filteredSongs.length === 0) return;
  currentIndex = index;
  const track = filteredSongs[currentIndex];

  trackTitle.textContent = track.title;
  trackArtist.textContent = track.artist;
  trackGenre.textContent = track.category;
  trackCover.src = track.cover;

  dockTitle.textContent = track.title;
  dockArtist.textContent = track.artist;
  dockThumbnail.src = track.cover;

  audio.src = track.src;
  updateActiveItemUI();
}

// Play / Pause
function playTrack() {
  isPlaying = true;
  audio.play().then(() => {
    playIcon.className = "fa-solid fa-pause";
    vinylDisc.classList.add("playing");
  }).catch((err) => {
    console.warn("Playback prevented or blocked:", err);
  });
}

function pauseTrack() {
  isPlaying = false;
  audio.pause();
  playIcon.className = "fa-solid fa-play";
  vinylDisc.classList.remove("playing");
}

function togglePlay() {
  if (filteredSongs.length === 0) return;
  if (isPlaying) {
    pauseTrack();
  } else {
    playTrack();
  }
}

// Skip Controls
function nextTrack() {
  if (filteredSongs.length === 0) return;
  currentIndex = (currentIndex + 1) % filteredSongs.length;
  loadTrack(currentIndex);
  if (isPlaying) playTrack();
}

function prevTrack() {
  if (filteredSongs.length === 0) return;
  currentIndex = (currentIndex - 1 + filteredSongs.length) % filteredSongs.length;
  loadTrack(currentIndex);
  if (isPlaying) playTrack();
}

// Render the Playlist UI
function renderPlaylist() {
  playlistView.innerHTML = "";
  playlistCount.textContent = `${filteredSongs.length} track${filteredSongs.length === 1 ? "" : "s"} available`;

  filteredSongs.forEach((song, idx) => {
    const li = document.createElement("li");
    li.className = `queue-card ${idx === currentIndex ? "active" : ""}`;
    li.innerHTML = `
      <img src="${song.cover}" alt="${song.title}" />
      <div class="queue-details">
        <p class="queue-title">${song.title}</p>
        <p class="queue-artist">${song.artist}</p>
      </div>
      <span class="queue-time">${song.duration}</span>
    `;

    li.addEventListener("click", () => {
      loadTrack(idx);
      playTrack();
    });

    playlistView.appendChild(li);
  });
}

function updateActiveItemUI() {
  const cards = playlistView.querySelectorAll(".queue-card");
  cards.forEach((card, idx) => {
    card.classList.toggle("active", idx === currentIndex);
  });
}

// Filter and Search Handler
function applyFilters() {
  filteredSongs = songsList.filter((song) => {
    const matchesCategory =
      currentCategory === "All" || song.category === currentCategory;
    const matchesSearch =
      song.title.toLowerCase().includes(searchQuery) ||
      song.artist.toLowerCase().includes(searchQuery);
    return matchesCategory && matchesSearch;
  });

  renderPlaylist();
  if (filteredSongs.length > 0) {
    loadTrack(0);
  } else {
    trackTitle.textContent = "No matches found";
    trackArtist.textContent = "Try searching something else";
    dockTitle.textContent = "No track";
    dockArtist.textContent = "";
    pauseTrack();
  }
}

// Audio Engine Events
audio.addEventListener("timeupdate", () => {
  if (audio.duration) {
    const percent = (audio.currentTime / audio.duration) * 100;
    progressBar.value = percent;
    currentTimeEl.textContent = formatTime(audio.currentTime);
  }
});

audio.addEventListener("loadedmetadata", () => {
  durationTimeEl.textContent = formatTime(audio.duration);
});

audio.addEventListener("ended", () => {
  nextTrack();
});

// Controls & Sliders
playBtn.addEventListener("click", togglePlay);
nextBtn.addEventListener("click", nextTrack);
prevBtn.addEventListener("click", prevTrack);

progressBar.addEventListener("input", () => {
  if (audio.duration) {
    audio.currentTime = (progressBar.value / 100) * audio.duration;
  }
});

volumeSlider.addEventListener("input", (e) => {
  const vol = parseFloat(e.target.value);
  audio.volume = vol;
  updateVolumeIcon(vol);
});

muteBtn.addEventListener("click", () => {
  audio.muted = !audio.muted;
  if (audio.muted) {
    volumeIcon.className = "fa-solid fa-volume-xmark";
  } else {
    updateVolumeIcon(audio.volume);
  }
});

function updateVolumeIcon(vol) {
  if (vol === 0) {
    volumeIcon.className = "fa-solid fa-volume-off";
  } else if (vol < 0.5) {
    volumeIcon.className = "fa-solid fa-volume-low";
  } else {
    volumeIcon.className = "fa-solid fa-volume-high";
  }
}

// Search Filter
searchInput.addEventListener("input", (e) => {
  searchQuery = e.target.value.trim().toLowerCase();
  applyFilters();
});

// Category Tabs
genreTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    genreTabs.forEach((t) => t.classList.remove("active"));
    tab.classList.add("active");
    currentCategory = tab.dataset.category;
    applyFilters();
  });
});

// Upload User's Own MP3 Files
uploadBtn.addEventListener("click", () => fileUpload.click());

fileUpload.addEventListener("change", (e) => {
  const files = Array.from(e.target.files);
  if (!files.length) return;

  files.forEach((file) => {
    const blobUrl = URL.createObjectURL(file);
    const fileNameWithoutExt = file.name.replace(/\.[^/.]+$/, "");

    const newSong = {
      id: Date.now() + Math.random(),
      title: fileNameWithoutExt,
      artist: "Local Track",
      category: "Custom",
      duration: "Local Audio",
      src: blobUrl,
      cover: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&auto=format&fit=crop&q=80"
    };

    songsList.unshift(newSong);
  });

  // Switch category to All or Custom to show newly uploaded tracks
  genreTabs.forEach((t) => t.classList.remove("active"));
  const allTab = document.querySelector('[data-category="All"]');
  if (allTab) allTab.classList.add("active");
  currentCategory = "All";

  applyFilters();
  loadTrack(0);
  playTrack();
});

// Init
renderPlaylist();
loadTrack(0);
audio.volume = parseFloat(volumeSlider.value);