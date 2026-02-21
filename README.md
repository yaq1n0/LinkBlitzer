# LinkBlitzer

A simple, lightweight web utility that allows you to create a single URL that opens multiple URLs in separate tabs.
Perfect for daily workflows, research sessions, or sharing collections of links.

## Features

- **Single Link, Multiple Tabs**: Create one URL that opens many URLs
- **Optimistic URL validation**: URLs are optimistically validated as you type
- **Copy to Clipboard**: One-click copying of generated links
- **Auto-redirect**: Generated links automatically open URLs and redirect back
- **Smart Popup Detection**: Automatically detects and guides users through popup setup
- **Browser-Specific Instructions**: Tailored guidance for Chrome, Firefox, Safari, and Edge
- **Dark Mode Support**: Automatically follows your system's dark/light theme preference
- **Minimal Design**: Clean, fast-loading interface with smooth theme transitions
- **No Dependencies**: Pure HTML, CSS, and TypeScript (compiles to vanilla JS)

### Local Development

```bash
# Install dependencies
npm install

# Start development server (serves TypeScript directly)
npm run dev

# Type check without building
npm run type-check

# Build for production (TypeScript → dist/)
npm run build

# Preview production build
npm run preview

# Format code with Prettier
npm run prettier
```

The development server at `http://localhost:3000` includes:

- **Hot module reloading** for instant TypeScript updates
- **Type checking** in your editor with full IntelliSense
- **Source maps** for debugging TypeScript in browser dev tools
- **All features working** including popup detection

### TypeScript Benefits

- **Type Safety**: Catch errors at compile time
- **Better IDE Support**: Auto-completion, refactoring, navigation
- **Self-Documenting**: Interfaces and types serve as documentation
- **Modular Architecture**: Clean separation of concerns
- **Zero Runtime Cost**: Compiles to optimized vanilla JavaScript

## How It Works

### Smart Popup Management

LinkBlitzer automatically detects if popups are blocked and provides:

- **Visual status banners**: Green "READY TO BLITZ" when popups work, red warning when blocked
- **Browser-specific instructions**: Tailored steps for your specific browser (Chrome, Firefox, Safari, Edge)
- **One-click testing**: Retest popup permissions after making changes
- **Link generation control**: Only allows creating links when popups are properly enabled

### Automatic Dark Mode

- **System integration**: Automatically follows your device's dark/light mode setting
- **Smooth transitions**: Clean animations when switching between themes
- **Optimized colors**: Carefully selected dark mode palette that's easy on the eyes
- **Consistent branding**: Popup banners remain vibrant and readable in both themes

### Creating Links

1. Visit `linkblitzer.com`
2. The app will automatically test popup permissions
3. If popups are blocked, follow the browser-specific instructions shown
4. Enter URLs (one per line) in the text area
5. Copy the generated link when all URLs are valid
6. Share the link with anyone (they will also have to enable popups for things to work)

### Opening Links

1. Visit a generated LinkBlitzer URL (make sure that popups are enabled)
2. All URLs will automatically open in new tabs
3. Page redirects back to clean URL for creating more links

## Browser Support

LinkBlitzer includes built-in support and guidance for:

- **Chrome/Chromium**: Settings → Privacy and security → Site settings → Pop-ups and redirects
- **Firefox**: Settings → Privacy & Security → Permissions → Pop-up windows exceptions
- **Safari**: Settings → Websites → Pop-up Windows → Allow for site
- **Microsoft Edge**: Settings → Cookies and site permissions → Pop-ups and redirects

Each browser shows specific step-by-step instructions with links to official documentation.

## Usage Examples

**Base URL (Create Mode):**

```
https://{localhost:3000|linkblitzer.com}
```

**Generated LinkBlitzer URL:**

```
https://{localhost:3000|linkblitzer.com}?urls=https%3A//example.com%7Chttps%3A//google.com%7Chttps%3A//github.com
```

## License

MIT License - see [LICENSE.md](LICENSE.md) for details.
