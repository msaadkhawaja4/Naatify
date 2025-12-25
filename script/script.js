let currentFolder = null;
let allFolders = [];
let currentAudio = null;
let currentIndex = null;
let naats = [];
let naatPlayImages = [];
let naatcarDivs = [];
let lastPlayedIndex = null;

function showCustomAlert(message) {
    const alertDiv = document.getElementById('custom-alert');
    const messageP = document.getElementById('alert-message');
    const okBtn = document.getElementById('alert-ok');

    messageP.textContent = message;
    alertDiv.style.display = 'flex';

    okBtn.onclick = () => {
        alertDiv.style.display = 'none';
    };
}

function updatePlayButtonImage() {
    const playBtn = document.getElementById('pbplb');
    if (!playBtn) return;
    const img = playBtn.querySelector('img');
    if (!img) return;
    if (!currentAudio || currentAudio.paused) {
        img.src = 'play-button.png';
    } else {
        img.src = 'pause.png';
    }
}

function updateFolderCard() {
    const cards = document.querySelectorAll('.card-cont .card');
    cards.forEach(c => c.classList.remove('playing-folder'));
    if (currentFolder && currentAudio && !currentAudio.paused) {
        const playingCard = document.querySelector(`.card-cont .card[data-folder="${currentFolder.path}"]`);
        if (playingCard) playingCard.classList.add('playing-folder');
    }
}

function updateNaatListImages() {
    for (let j = 0; j < naatPlayImages.length; j++) {
        naatPlayImages[j].src = 'play-button.png';
        naatcarDivs[j].classList.remove('playing');
        naatcarDivs[j].classList.remove('last-played');
    }

    if (currentIndex !== null && !currentAudio.paused) {
        naatPlayImages[currentIndex].src = 'pause.png';
        naatcarDivs[currentIndex].classList.add('playing');

        const container = document.querySelector('.l-b');
        if (container && container.scrollHeight > container.clientHeight) {
            const target = naatcarDivs[currentIndex];
            const containerRect = container.getBoundingClientRect();
            const targetRect = target.getBoundingClientRect();
            const offset = targetRect.top - containerRect.top;
            const scrollTop = container.scrollTop + offset - (container.clientHeight / 2) + (target.offsetHeight / 2);
            container.scrollTo({ top: scrollTop, behavior: 'smooth' });
        }

        return;
    }

    if (currentAudio.paused && lastPlayedIndex !== null) {
        if (lastPlayedIndex >= 0 && lastPlayedIndex < naatcarDivs.length) {
            naatcarDivs[lastPlayedIndex].classList.add('last-played');
            naatPlayImages[lastPlayedIndex].src = 'play-button.png';
        }
    }
}

function playIndex(index) {
    if (index == null || index < 0 || index >= naats.length) return;
    if (!currentAudio.paused) {
        currentAudio.pause();
    }
    lastPlayedIndex = null;
    currentIndex = index;
    currentAudio.src = naats[currentIndex];
    currentAudio.currentTime = 0;
    currentAudio.play();
    updatePlayButtonImage();
    updateNaatListImages();
    updateFolderCard();
}

function stopCurrent() {
    try {
        if (currentIndex !== null) {
            currentAudio.pause();
            currentAudio.currentTime = 0;
            naatPlayImages[currentIndex].src = 'play-button.png';
            naatcarDivs[currentIndex].classList.remove('playing');
            lastPlayedIndex = currentIndex;
        }
        updateNaatListImages();
        updateFolderCard();
    } catch (e) { }
}

async function getFolders() {
    try {
        console.log('Fetching folders from API...');
        console.log('Current protocol:', window.location.protocol);
        console.log('Current hostname:', window.location.hostname);
        console.log('Current port:', window.location.port);

        const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
        const apiUrl = isLocalhost ? 'http://localhost:3001/api/folders' : '/api/folders';

        console.log('isLocalhost:', isLocalhost);
        console.log('Using API URL:', apiUrl);

        const response = await fetch(apiUrl);
        console.log('Response status:', response.status);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const folders = await response.json();
        console.log('Fetched folders:', folders);
        return folders;
    } catch (error) {
        console.error('Error fetching folders:', error);
        return [];
    }
}

async function displayFolders() {
    allFolders = await getFolders();
    const cardContainer = document.querySelector('.card-cont');

    if (!cardContainer) {
        console.error('Card container not found');
        return;
    }

    cardContainer.innerHTML = '';

    for (const folder of allFolders) {
        const card = document.createElement('div');
        card.className = 'card bbb chover';
        card.style.cursor = 'pointer';
        card.setAttribute('data-folder', folder.path);

        card.innerHTML = `
            <div class="play-button">
                <img src="play-button.png" alt="Play">
            </div>
            <img class="bb" src="${folder.img || 'Naatify_logo.png'}" alt="pic">
            <h2>${folder.name}</h2>
            <p>${folder.count} Naat${folder.count > 1 ? 's' : ''}</p>
        `;

        card.addEventListener('click', () => {
            if (currentAudio && !currentAudio.paused) {
                currentAudio.pause();
                updateFolderCard();
                updatePlayButtonImage();
            }
            currentFolder = folder;
            const naats = folder.files.map(file => folder.path ? `Naats/${folder.path}/${file}` : `Naats/${file}`);
            loadNaatPlayer(naats);
        });

        cardContainer.appendChild(card);
    }
}

function loadNaatPlayer(naatsParam) {
    console.log("Loading naats:", naatsParam);
    const naatul = document.querySelector(".l-b ul");
    if (!naatul) {
        console.error('Could not find the Naats list container (.l-b ul) in the DOM');
        return;
    }

    naatul.innerHTML = '';

    if (!naatsParam || naatsParam.length === 0) {
        console.warn('No naats found in this folder.');
        const li = document.createElement('li');
        li.textContent = 'No naats found.';
        naatul.appendChild(li);
        return;
    }

    naats = naatsParam;
    const audio = new Audio();
    currentAudio = audio;
    currentIndex = null;
    naatPlayImages = [];
    naatcarDivs = [];
    lastPlayedIndex = null;

    const naatinfoDiv = document.querySelector('.naatinfo');
    const naattimeDiv = document.querySelector('.naattime');
    const seekbar = document.querySelector('.seekbar');
    const circle = document.querySelector('.circle');

    function formatTime(seconds) {
        if (isNaN(seconds)) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }

    function updateProgressBar() {
        if (!audio.duration) return;
        const percent = (audio.currentTime / audio.duration) * 100;
        if (circle) circle.style.left = percent + '%';
    }

    function updateTimeDisplay() {
        if (naattimeDiv) {
            const current = formatTime(audio.currentTime);
            const duration = formatTime(audio.duration);
            naattimeDiv.textContent = `${current} / ${duration}`;
        }
    }

    function updateNaatInfo() {
        if (naatinfoDiv && currentIndex !== null) {
            naatinfoDiv.textContent = decodeURIComponent(naats[currentIndex].split('/').pop()).replace('.mp3', '');
        }
    }

    audio.addEventListener('loadedmetadata', () => {
        updateTimeDisplay();
        updateNaatInfo();
        updateProgressBar();
    });

    audio.addEventListener('timeupdate', () => {
        updateProgressBar();
        updateTimeDisplay();
    });

    for (let i = 0; i < naats.length; i++) {
        const n = naats[i];
        const naatcar = document.createElement('div');
        naatcar.className = 'naatcar';
        naatcarDivs.push(naatcar);

        const ul = document.createElement('ul');
        const li = document.createElement('li');

        const musicImg = document.createElement('img');
        musicImg.src = 'musicnote.png';
        musicImg.alt = '';

        const naatName = document.createElement('div');
        naatName.className = 'nn';
        naatName.textContent = decodeURIComponent(n.split('/').pop()).replace('.mp3', '');

        const ncpb = document.createElement('div');
        ncpb.className = 'ncpb';

        const playSpan = document.createElement('span');
        playSpan.textContent = 'Play';

        const playImg = document.createElement('img');
        playImg.src = 'play-button.png';
        playImg.alt = '';

        naatPlayImages.push(playImg);

        ncpb.appendChild(playSpan);
        ncpb.appendChild(playImg);

        li.appendChild(musicImg);
        li.appendChild(naatName);
        li.appendChild(ncpb);

        ul.appendChild(li);
        naatcar.appendChild(ul);
        naatul.appendChild(naatcar);

        li.style.cursor = 'pointer';
        li.addEventListener('click', (e) => {
            playIndex(i);
        });

        playImg.style.cursor = 'pointer';
        playImg.addEventListener('click', (e) => {
            e.stopPropagation();
            if (currentIndex === i && !currentAudio.paused) {
                currentAudio.pause();
                lastPlayedIndex = currentIndex;
                updateNaatListImages();
                updateFolderCard();
            } else {
                playIndex(i);
            }
            updatePlayButtonImage();
        });
    }


}

async function main() {
    await displayFolders();

    document.querySelector(".Go-2").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0"
    });

    document.querySelector(".Go-1").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-100%"
    });

    const playBtn = document.getElementById('pbplb');
    const prevBtn = document.getElementById('pbprb');
    const nextBtn = document.getElementById('pbneb');
    const seekbar = document.querySelector('.seekbar');

    if (playBtn) {
        playBtn.addEventListener('click', () => {
            if (currentIndex === null) {
                return;
            }

            if (currentAudio.paused) {
                currentAudio.play();
                updateNaatListImages();
            } else {
                currentAudio.pause();
                lastPlayedIndex = currentIndex;
                updateNaatListImages();
            }
            updatePlayButtonImage();
            updateFolderCard();
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (currentIndex === null) return;
            if (currentIndex > 0) {
                stopCurrent();
                playIndex(currentIndex - 1);
            }
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            if (currentIndex === null) return;
            if (currentIndex < naats.length - 1) {
                stopCurrent();
                playIndex(currentIndex + 1);
            }
        });
    }

    if (seekbar) {
        seekbar.addEventListener('click', (e) => {
            if (!currentAudio || !currentAudio.duration) return;
            const rect = seekbar.getBoundingClientRect();
            const percent = (e.clientX - rect.left) / rect.width;
            currentAudio.currentTime = percent * currentAudio.duration;
        });
    }

    document.addEventListener('keydown', (e) => {
        const active = document.activeElement;
        if (active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA' || active.isContentEditable || active.classList.contains('search-input'))) return;

        const code = e.code;
        const key = e.key;
        const keyCode = e.keyCode || e.which;
        const isSpace = code === 'Space' || key === ' ' || key === 'Spacebar' || keyCode === 32;
        const isLeft = code === 'ArrowLeft' || key === 'ArrowLeft' || keyCode === 37;
        const isRight = code === 'ArrowRight' || key === 'ArrowRight' || keyCode === 39;
        const isUp = code === 'ArrowUp' || key === 'ArrowUp' || keyCode === 38;
        const isDown = code === 'ArrowDown' || key === 'ArrowDown' || keyCode === 40;

        if (isSpace) {
            e.preventDefault();
            if (currentIndex === null) {
                return;
            }

            if (currentAudio.paused) {
                currentAudio.play();
                updateNaatListImages();
            } else {
                currentAudio.pause();
                lastPlayedIndex = currentIndex;
                updateNaatListImages();
            }
            updatePlayButtonImage();
            updateFolderCard();
        } else if (isLeft) {
            e.preventDefault();
            if (currentIndex === null) return;
            if (currentIndex > 0) {
                stopCurrent();
                playIndex(currentIndex - 1);
            }
        } else if (isRight) {
            e.preventDefault();
            if (currentIndex === null) return;
            if (currentIndex < naats.length - 1) {
                stopCurrent();
                playIndex(currentIndex + 1);
            }
        } else if (isUp) {
            e.preventDefault();
            scrollNaatList('up');
        } else if (isDown) {
            e.preventDefault();
            scrollNaatList('down');
        }
    });

    const signUpBtn = document.querySelector('.sign-up');
    const logInBtn = document.querySelector('.log-in');

    if (signUpBtn) {
        signUpBtn.addEventListener('click', () => {
            showCustomAlert('Sorry the Sign in service is not available yet');
        });
    }

    if (logInBtn) {
        logInBtn.addEventListener('click', () => {
            showCustomAlert('Sorry the Log in service is not available yet');
        });
    }

    const homeIcon = document.querySelector('.home-icon');
    if (homeIcon) {
        homeIcon.addEventListener('click', () => {
            window.location.reload();
        });
    }

    const searchIcon = document.querySelector('.search-icon');
    if (searchIcon) {
        searchIcon.addEventListener('click', () => {
            const img = searchIcon.querySelector('img');
            const h3 = searchIcon.querySelector('h3');

            if (img) img.style.display = 'none';
            if (h3) h3.style.display = 'none';

            const searchInput = document.createElement('input');
            searchInput.type = 'text';
            searchInput.placeholder = 'Search naats...';
            searchInput.className = 'search-input';
            searchInput.style.width = '100%';
            searchInput.style.padding = '8px';
            searchInput.style.border = '1px solid #578bfc';
            searchInput.style.backgroundColor = '#313131ff';
            searchInput.style.color = 'white';
            searchInput.style.outline = 'none';
            searchInput.style.borderRadius = '4px';
            searchInput.style.fontSize = '14px';

            searchIcon.innerHTML = '';
            searchIcon.appendChild(searchInput);

            searchInput.focus();

            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    const searchTerm = searchInput.value.trim().toLowerCase();
                    if (searchTerm && currentFolder && naats.length > 0) {
                        searchNaat(searchTerm);
                    }
                    searchIcon.innerHTML = `
                        <img src="search.png" alt="Search">
                        <h3 class="h3">Search</h3>
                    `;
                }
            });

            searchInput.addEventListener('blur', () => {
                setTimeout(() => {
                    searchIcon.innerHTML = `
                        <img src="search.png" alt="Search">
                        <h3 class="h3">Search</h3>
                    `;
                }, 100);
            });
        });
    }
}

function scrollNaatList(direction) {
    const container = document.querySelector('.l-b');
    if (!container) return;

    const scrollAmount = 100;
    const currentScroll = container.scrollTop;

    if (direction === 'up') {
        container.scrollTo({
            top: Math.max(0, currentScroll - scrollAmount),
            behavior: 'smooth'
        });
    } else if (direction === 'down') {
        const maxScroll = container.scrollHeight - container.clientHeight;
        container.scrollTo({
            top: Math.min(maxScroll, currentScroll + scrollAmount),
            behavior: 'smooth'
        });
    }
}

function searchNaat(searchTerm) {
    if (!naats.length) {
        showCustomAlert('No naats loaded. Please select a playlist first.');
        return;
    }

    const foundIndex = naats.findIndex(naat => {
        const naatName = decodeURIComponent(naat.split('/').pop()).replace('.mp3', '').toLowerCase();
        return naatName.includes(searchTerm);
    });

    if (foundIndex !== -1) {
        const targetNaatCar = naatcarDivs[foundIndex];
        if (targetNaatCar) {
            targetNaatCar.scrollIntoView({ behavior: 'smooth', block: 'center' });
            const targetLi = targetNaatCar.querySelector('li');
            if (targetLi) {
                targetLi.style.backgroundColor = '#505050ff';
                targetLi.style.borderColor = '#25dff8';
                setTimeout(() => {
                    targetLi.style.backgroundColor = '';
                    targetLi.style.borderColor = '#0051ff';
                }, 2000);
            }
        }
    } else {
        showCustomAlert(`The selected playlist does not contain this naat: "${searchTerm}"`);
    }
}

window.addEventListener('pagehide', () => {
    if (currentAudio) {
        currentAudio.pause();
    }
});

window.addEventListener('beforeunload', () => {
    if (currentAudio) {
        currentAudio.pause();
    }
});

main();
