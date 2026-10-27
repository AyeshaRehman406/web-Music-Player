document.addEventListener("DOMContentLoaded", () => {
  // Built-in public domain audio tracks
  const defaultTracks = [
    {
      id: 1,
      title: "Summer Breeze",
      artist: "Ason ID",
      category: "Lo-Fi",
      duration: "2:45",
      src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
      cover: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=400&auto=format&fit=crop&q=80"
    },
    {
      id: 2,
      title: "Midnight Chill",
      artist: "Ghostrifter",
      category: "Chill",
      duration: "3:12",
      src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
      cover: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&auto=format&fit=crop&q=80"
    },
    {
      id: 3,
      title: "Neon Pulse",
      artist: "Alex-Productions",
      category: "Electronic",
      duration: "4:01",
      src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
      cover: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&auto=format&fit=crop&q=80"
    },
    {
      id: 4,
      title: "Quiet Morning",
      artist: "Purrple Cat",
      category: "Lo-Fi",
      duration: "2:20",
      src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
      cover: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&auto=format&fit=crop&q=80"
    },
    {
      id: 5,
      title: "Cyber City",
      artist: "Infraction",
      category: "Electronic",
      duration: "3:30",
      src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
      cover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&auto=format&fit=crop&q=80"
    }
  ];

  let songsList = [...defaultTracks];
  let filteredSongs = [...defaultTracks];
  let currentIndex = 0;
  let isPlaying = false;
  let currentCategory = "All";
  let searchQuery = "";

  // Elements
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

  function formatTime(sec) {
    if (isNaN(sec) || sec < 0) return "0:00";
    const mins = Math.floor(sec / 60);
    const secs = Math.floor(sec % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  }

  function loadTrack(index) {
    if (!filteredSongs || filteredSongs.length === 0) return;
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
    updateActiveQueueItem();
  }

  function playTrack() {
    isPlaying = true;
    audio.play().then(() => {
      playIcon.className = "fa-solid fa-pause";
      vinylDisc.classList.add("playing");
    }).catch(() => {
      // User gesture needed on initial click
      playIcon.className = "fa-solid fa-play";
      vinylDisc.classList.remove("playing");
    });
  }

  function pauseTrack() {
    isPlaying = false;
    audio.pause();
    playIcon.className = "fa-solid fa-play";
    vinylDisc.classList.remove("playing");
  }

  function togglePlay() {
    if (isPlaying) {
      pauseTrack();
    } else {
      playTrack();
    }
  }

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

  function updateActiveQueueItem() {
    const cards = playlistView.querySelectorAll(".queue-card");
    cards.forEach((card, idx) => {
      card.classList.toggle("active", idx === currentIndex);
    });
  }

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
    }
  }

  // Audio Engine Listeners
  audio.addEventListener("timeupdate", () => {
    if (audio.duration) {
      const progress = (audio.currentTime / audio.duration) * 100;
      progressBar.value = progress;
      currentTimeEl.textContent = formatTime(audio.currentTime);
    }
  });

  audio.addEventListener("loadedmetadata", () => {
    durationTimeEl.textContent = formatTime(audio.duration);
  });

  audio.addEventListener("ended", () => {
    nextTrack();
  });

  // Controls
  playBtn.addEventListener("click", togglePlay);
  nextBtn.addEventListener("click", nextTrack);
  prevBtn.addEventListener("click", prevTrack);

  progressBar.addEventListener("input", () => {
    if (audio.duration) {
      audio.currentTime = (progressBar.value / 100) * audio.duration;
    }
  });

  volumeSlider.addEventListener("input", (e) => {
    const val = parseFloat(e.target.value);
    audio.volume = val;
    if (val === 0) {
      volumeIcon.className = "fa-solid fa-volume-off";
    } else if (val < 0.5) {
      volumeIcon.className = "fa-solid fa-volume-low";
    } else {
      volumeIcon.className = "fa-solid fa-volume-high";
    }
  });

  muteBtn.addEventListener("click", () => {
    audio.muted = !audio.muted;
    volumeIcon.className = audio.muted
      ? "fa-solid fa-volume-xmark"
      : (audio.volume < 0.5 ? "fa-solid fa-volume-low" : "fa-solid fa-volume-high");
  });

  searchInput.addEventListener("input", (e) => {
    searchQuery = e.target.value.trim().toLowerCase();
    applyFilters();
  });

  genreTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      genreTabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      currentCategory = tab.dataset.category;
      applyFilters();
    });
  });

  // Add Songs / Upload Handling
  uploadBtn.addEventListener("click", () => {
    fileUpload.click();
  });

  fileUpload.addEventListener("change", (e) => {
    const chosenFiles = Array.from(e.target.files);
    if (!chosenFiles.length) return;

    chosenFiles.forEach((file) => {
      const fileBlob = URL.createObjectURL(file);
      const cleanTitle = file.name.replace(/\.[^/.]+$/, "");

      const customTrack = {
        id: Date.now() + Math.random(),
        title: cleanTitle,
        artist: "Uploaded Track",
        category: "Custom",
        duration: "Local",
        src: fileBlob,
        cover: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&auto=format&fit=crop&q=80"
      };

      songsList.unshift(customTrack);
    });

    // Reset filter to All to ensure new track is visible
    genreTabs.forEach((t) => t.classList.remove("active"));
    const allTab = document.querySelector('[data-category="All"]');
    if (allTab) allTab.classList.add("active");
    currentCategory = "All";

    applyFilters();
    loadTrack(0);
    playTrack();
    fileUpload.value = "";
  });

  // Render on startup
  renderPlaylist();
  loadTrack(0);
  audio.volume = parseFloat(volumeSlider.value);
});