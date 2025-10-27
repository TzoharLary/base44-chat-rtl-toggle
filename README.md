# Base44 Chat RTL Toggle

A Chrome extension that adds RTL (Right-to-Left) / LTR (Left-to-Right) text direction toggle functionality to Base44 chat applications, with code copy buttons and proper list formatting.

## Features

### 🔄 RTL/LTR Toggle
- **One-click toggle** between Right-to-Left and Left-to-Right text directions
- **Persistent settings** - Your preference is saved and restored across sessions
- **Smart positioning** - The toggle button automatically positions itself near the send button
- **Visual feedback** - Icon flips to indicate current mode (RTL vs LTR)

### 📋 Code Block Enhancements
- **Copy buttons** automatically appear on hover over code blocks
- **Visual confirmation** with checkmark feedback when code is copied
- **Proper LTR handling** - Code blocks remain left-to-right even in RTL mode

### 📝 List Formatting
- **Fixed list alignment** - Bullets and numbers display correctly in RTL mode
- **Natural indentation** - Lists maintain proper spacing and hierarchy

### 🛡️ Technical Excellence
- **Shadow DOM isolation** - Styles are completely isolated from the page
- **Automatic positioning** - Button repositions on window resize and scroll
- **Zero conflicts** - Won't interfere with existing page functionality

## Installation

### From Source

1. **Download or clone this repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/base44-chat-rtl-toggle.git
   ```

2. **Open Chrome Extensions page**
   - Navigate to `chrome://extensions/`
   - Enable "Developer mode" (top right corner)

3. **Load the extension**
   - Click "Load unpacked"
   - Select the extension directory

4. **Verify installation**
   - Visit a Base44 chat page (e.g., `app.base44.com`)
   - Look for the toggle button near the send button

## Usage

### Toggle Text Direction

1. Open any Base44 chat interface
2. Look for the RTL/LTR toggle button positioned near the send button
3. Click the button to switch between RTL and LTR modes
4. The icon will flip to indicate the current mode
5. Your preference is automatically saved

### Copy Code Blocks

1. Hover over any code block in the chat
2. A copy button will appear in the top-right corner
3. Click to copy the code to your clipboard
4. A checkmark (✓) appears to confirm the copy

## Supported Domains

This extension works on the following Base44 domains:
- `app.base44.com`
- `*.base44.app`
- `*.base44.dev`
- `*.base44.io`

## File Structure

```
.
├── manifest.json        # Extension configuration
├── content.js          # Main functionality and logic
├── button_styles.css   # Isolated button styles (Shadow DOM)
├── page_styles.css     # Page-level text direction styles
└── README.md           # This file
```

## How It Works

### Architecture

- **Shadow DOM**: The toggle button uses Shadow DOM for complete style isolation
- **MutationObserver**: Automatically detects new chat messages and code blocks
- **ResizeObserver**: Keeps the button positioned correctly
- **Chrome Storage API**: Persists user preferences

### Key Components

1. **Toggle Button** (`content.js`)
   - Dynamically created with Shadow DOM
   - SVG icon that flips based on mode
   - Smart positioning near send button

2. **Text Direction** (`page_styles.css`)
   - Applies RTL/LTR to chat messages
   - Maintains LTR for code blocks
   - Fixes list alignment

3. **Copy Functionality** (`content.js`)
   - Injects copy buttons into code blocks
   - Clipboard API integration
   - Visual feedback system

## Development

### Customizing the Toggle Icon

Edit the icon variables in `content.js`:

```javascript
const ICON_STROKE_WIDTH = 1;
const ICON_MAX_WIDTH = 16;
const ICON_HEIGHT = 14;
const ICON_LINE_1_WIDTH = 16;
const ICON_LINE_2_WIDTH = 12;
const ICON_LINE_3_WIDTH = 6;
```

### Modifying Button Styles

Edit `button_styles.css` to change the button appearance:

```css
.b44-rtl-toggle-inner {
  border-radius: 6px;
  /* Add your custom styles */
}
```

### Adjusting Text Direction Rules

Modify `page_styles.css` to customize text direction behavior:

```css
.b44-chat-root.b44-chat-rtl {
  direction: rtl !important;
}
```

## Browser Compatibility

- **Chrome**: Version 88+ (Manifest V3 support required)
- **Edge**: Version 88+ (Chromium-based)
- **Brave**: Latest version
- **Other Chromium browsers**: Should work with Manifest V3 support

## Permissions

This extension requires:

- **storage**: To save your RTL/LTR preference
- **host_permissions**: To inject functionality into Base44 domains

## Privacy

- **No data collection**: This extension does not collect or transmit any user data
- **Local storage only**: Preferences are stored locally on your device
- **No external connections**: All functionality is client-side

## Troubleshooting

### Button not appearing
- Refresh the page
- Check that you're on a supported Base44 domain
- Ensure the extension is enabled in `chrome://extensions/`

### Toggle not working
- Clear browser cache
- Reload the extension
- Check browser console for errors

### Code copy not working
- Ensure clipboard permissions are granted
- Try refreshing the page
- Check that the code block has the proper class structure

## Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the MIT License.

## Version History

### v2.1.0 (Current)
- Shadow DOM implementation for complete style isolation
- Added code block copy buttons
- Fixed list alignment in RTL mode
- Improved button positioning stability
- Enhanced visual feedback

### Earlier Versions
- Basic RTL/LTR toggle functionality
- Initial code block handling

## Credits

Developed for use with Base44 chat applications.

## Support

If you encounter any issues or have suggestions, please:
1. Check the [Issues](https://github.com/YOUR_USERNAME/base44-chat-rtl-toggle/issues) page
2. Create a new issue with detailed information
3. Include browser version and steps to reproduce

---

**Note**: Replace `YOUR_USERNAME` in URLs with your actual GitHub username after uploading to GitHub.
