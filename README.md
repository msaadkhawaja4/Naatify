# 🎵 Naatify - Beautiful Islamic Naat Player

A modern, responsive web-based music player designed specifically for Islamic Naats. Features automatic playlist detection, beautiful UI with dark theme, advanced search functionality, and seamless audio playback.

![Naatify Preview](Naatify_logo.png)

## ✨ Features

### 🎶 Core Music Features
- **Automatic Playlist Detection**: Scans your Naats folder and creates beautiful cards for each artist/album
- **Full Audio Controls**: Play, pause, next, previous, seek bar with smooth progress indication
- **Keyboard Shortcuts**: Space (play/pause), Left/Right arrows (navigation)
- **Real-time Playback Info**: Current naat name and time display
- **Auto-scroll**: Currently playing naat automatically scrolls into view

### 🔍 Advanced Search
- **Smart Search**: Click the search icon to instantly search within any loaded playlist
- **Visual Feedback**: Found naats highlight with smooth scrolling and temporary color change
- **Case-Insensitive**: Searches work regardless of letter case
- **Partial Matching**: Find naats by typing any part of the name

### 🎨 Beautiful UI/UX
- **Dark Theme**: Modern dark interface with blue accent colors (#578bfc, #25dff8)
- **Responsive Design**: Works perfectly on desktop and mobile devices
- **Smooth Animations**: Hover effects, transitions, and loading animations
- **Custom Alerts**: Beautiful modal dialogs for user notifications
- **Playlist Images**: Support for custom cover images (.png files)

### 📱 Navigation & Controls
- **Home Button**: Refresh and return to playlist selection
- **Mobile-Friendly**: Collapsible sidebar with touch-friendly controls
- **Visual Feedback**: Currently playing folder and naat are highlighted
- **Progress Bar**: Interactive seek bar with live time updates

### 🛠️ Developer Features
- **VS Code Live Preview Support**: Works seamlessly with VS Code's live preview
- **CORS Enabled**: Proper cross-origin resource sharing for development
- **Error Handling**: Comprehensive error messages and fallbacks
- **Modular Code**: Clean, maintainable JavaScript architecture
- **Performance Optimized**: Minified JavaScript for faster loading
- **SEO Ready**: Meta descriptions and semantic HTML structure
- **Accessibility Compliant**: Main landmarks and screen reader friendly

## 🚀 Quick Start

### Prerequisites
- **Node.js** (version 14 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)

### Installation

1. **Clone or Download** the Naatify project to your computer

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Start the Server**
   ```bash
   node server.js
   ```

   You should see:
   ```
   Server running at http://localhost:3001
   Naats folder: h:\Sigma Web Development\Naatify\Naats
   ```

4. **Open the Application**
   - **Direct Access**: Open `http://localhost:3001` in your browser
   - **VS Code Live Preview**: Use VS Code's "Show Preview" button (fully supported!)

## 📁 Folder Structure

```
Naatify/
├── 📁 Naats/                          # Your music library
│   ├── 🎵 Ilahi Teri Chokhat Per.mp3
│   ├── 🎵 Meetha Meetha Pyara Pyara.mp3
│   ├── 📁 junaid jamshed/             # Artist folders
│   │   ├── 🖼️ junaid jamshed.png      # Cover image (optional)
│   │   ├── 🎵 Ilahi Teri Chokhat Per.mp3
│   │   └── 🎵 Mera Dil Badal De.mp3
│   └── 📁 [other artist folders]/
├── 🌐 index.html                      # Main HTML file (SEO & accessibility optimized)
├── 🎨 style.css                       # Styling (dark theme + responsive)
├── ⚡ script.js                        # Source JavaScript
├── ⚡ script.min.js                    # Minified JavaScript (for production)
├── 🖥️ server.js                        # Node.js Express server
├── 📦 package.json                     # Dependencies
└── 📖 README.md                        # This file
```

## 🎼 How to Add More Naats

### Adding Music Files
1. **Create Artist Folders**: Create new folders in the `Naats/` directory (e.g., `Naats/My Favorite Naats/`)
2. **Add MP3 Files**: Place your `.mp3` naat files in the artist folders
3. **Optional Cover Images**: Add a `.png` file with the same name as the folder for cover art
4. **Refresh**: The new playlists automatically appear as cards!

### Example Structure
```
Naats/
├── 📁 "New Artist"/
│   ├── 🖼️ "New Artist.png"        # Cover image (optional)
│   ├── 🎵 naat1.mp3
│   ├── 🎵 naat2.mp3
│   └── 🎵 naat3.mp3
```

## ⌨️ Keyboard Shortcuts & Controls

### Playback Controls
- **Spacebar**: Play/Pause current naat
- **← Left Arrow**: Previous naat
- **→ Right Arrow**: Next naat
- **↑ Up Arrow**: Scroll naat list up
- **↓ Down Arrow**: Scroll naat list down

### Player Controls
- **Click Progress Bar**: Jump to any position in the current naat
- **Play/Pause Button**: Main playback control
- **Previous/Next Buttons**: Navigate through playlist

## 🔧 Advanced Configuration

### Changing Server Port
Edit `server.js` and change:
```javascript
const PORT = 3001;  // Change this number
```

### Customizing Colors
Edit `style.css` to modify the color scheme:
```css
/* Main accent colors */
--primary-blue: #578bfc;
--accent-cyan: #25dff8;
--dark-bg: #121212;
```

## 🐛 Troubleshooting

### ❌ Cards Not Showing Up
- **Server Running?**: Ensure `node server.js` is running and shows "Server running at http://localhost:3001"
- **MP3 Files Present?**: Check that folders contain `.mp3` files
- **Console Errors?**: Open browser console (F12) → Console tab
- **API Working?**: Visit `http://localhost:3001/api/folders` directly

### ❌ Audio Not Playing
- **Valid MP3s?**: Ensure files are valid `.mp3` format
- **File Paths?**: Avoid special characters in folder/file names
- **Browser Support?**: Test in Chrome/Firefox for best results

### ❌ VS Code Live Preview Issues
- **CORS Errors?**: Server automatically handles cross-origin requests
- **Port Conflicts?**: VS Code uses port 3000, server uses 3001
- **API Calls Failing?**: Check console for "Failed to fetch" errors

### ❌ Search Not Working
- **Playlist Loaded?**: Search only works within currently selected playlist
- **No Results?**: Check spelling and try partial names (e.g., "ilahi")
- **Input Field?**: Click search icon to activate search mode

### ❌ Server Won't Start
- **Node.js Installed?**: Run `node --version` (should show version)
- **Dependencies?**: Run `npm install` to install packages
- **Port Available?**: Check if port 3001 is used by another app
- **Path Issues?**: Ensure you're in the correct project directory

### ❌ Images Not Showing
- **PNG Files?**: Ensure cover images are `.png` format
- **Naming?**: Image should match folder name exactly
- **Case Sensitive?**: Server handles case-insensitive matching
- **Path Issues?**: Images should be in the same folder as MP3s

## 🛠️ Technical Details

### Backend Architecture
- **Framework**: Node.js + Express.js
- **CORS**: Enabled for cross-origin requests
- **Static Serving**: Automatic file serving with proper MIME types
- **API Endpoints**:
  - `GET /api/folders` - Returns playlist data with images
  - `GET /api/files/:folder` - Returns files in specific folder

### Frontend Architecture
- **Vanilla JavaScript**: No frameworks, pure ES6+ JavaScript
- **HTML5 Audio API**: Native browser audio playback
- **Responsive CSS**: Mobile-first design with breakpoints
- **Modern ES6 Features**: Async/await, template literals, arrow functions

### Security & Performance
- **CORS Protection**: Configured origins for development safety
- **Error Boundaries**: Comprehensive try/catch blocks
- **Memory Management**: Proper audio element cleanup
- **Performance**: Lazy loading and efficient DOM manipulation

### Browser Compatibility
- ✅ Chrome 70+
- ✅ Firefox 65+
- ✅ Safari 12+
- ✅ Edge 79+
- ❌ Internet Explorer (not supported)

## 📊 API Reference

### Get Folders
```http
GET /api/folders
```

**Response:**
```json
[
  {
    "name": "Junaid Jamshed",
    "path": "Junaid Jamshed",
    "count": 3,
    "files": ["naat1.mp3", "naat2.mp3", "naat3.mp3"],
    "img": "Naats/Junaid Jamshed/Junaid Jamshed.png"
  }
]
```

### Get Files (Optional)
```http
GET /api/files/:folderName
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

ISC License - Feel free to use and modify for personal and commercial projects.

## 🙏 Acknowledgments

- Built with ❤️ for the Islamic community
- Special thanks to all the Naat artists and reciters
- Inspired by the beauty of Islamic music

---

**🎵 May Allah bless you with the peace and tranquility of beautiful Naats! 🌙**

---

*For support or questions, feel free to reach out!*
