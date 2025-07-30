# LinkBlitzer

A simple, lightweight web app that allows you to create a single URL that opens multiple URLs in separate tabs. Perfect for daily workflows, research sessions, or sharing collections of links.

## Features

- **Single Link, Multiple Tabs**: Create one URL that opens many URLs
- **Real-time Validation**: URLs are validated as you type
- **Copy to Clipboard**: One-click copying of generated links
- **Auto-redirect**: Generated links automatically open URLs and redirect back
- **Smart Popup Detection**: Automatically detects and guides users through popup setup
- **Browser-Specific Instructions**: Tailored guidance for Chrome, Firefox, Safari, and Edge
- **Dark Mode Support**: Automatically follows your system's dark/light theme preference
- **TypeScript**: Fully typed codebase for better DX and reliability
- **Minimal Design**: Clean, fast-loading interface with smooth theme transitions
- **No Dependencies**: Pure HTML, CSS, and TypeScript (compiles to vanilla JS)

## Development

LinkBlitzer is built with TypeScript for better development experience while maintaining zero runtime dependencies.

### Project Structure

```
LinkBlitzer/
├── src/
│   ├── index.ts        # Main application entry point
│   ├── utils.ts        # URL validation and utility functions
│   └── popups.ts       # Popup detection and browser guidance
├── index.html          # Main HTML file
├── styles.css          # Styling with dark mode support
├── main.js             # Built JavaScript (generated from TypeScript)
├── public/
│   └── favicon.ico     # Site favicon
├── dist/               # Production build output (generated)
├── tsconfig.json       # TypeScript configuration
├── vite.config.js      # Build configuration
└── package.json        # Dependencies and scripts
```

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

1. Visit your LinkBlitzer site (e.g., `yoursite.com`)
2. The app will automatically test popup permissions
3. If popups are blocked, follow the browser-specific instructions shown
4. Enter URLs (one per line) in the text area
5. Copy the generated link when all URLs are valid
6. Share the link with anyone

### Opening Links

1. Visit a generated LinkBlitzer URL
2. All URLs will automatically open in new tabs
3. Page redirects back to clean URL for creating more links

## Browser Support

LinkBlitzer includes built-in support and guidance for:

- **Chrome/Chromium**: Settings → Privacy and security → Site settings → Pop-ups and redirects
- **Firefox**: Settings → Privacy & Security → Permissions → Pop-up windows exceptions
- **Safari**: Settings → Websites → Pop-up Windows → Allow for site
- **Microsoft Edge**: Settings → Cookies and site permissions → Pop-ups and redirects

Each browser shows specific step-by-step instructions with links to official documentation.

**Dark Mode Support:**

- Automatic detection via `prefers-color-scheme` CSS media query
- Works in all modern browsers (Chrome 76+, Firefox 67+, Safari 12.1+, Edge 79+)
- Respects system settings on macOS, Windows, iOS, and Android

**TypeScript Support:**

- Modern browsers with ES2020+ support
- Graceful fallback for older browsers through Vite's transpilation

## Usage Examples

**Root URL (Create Mode):**

```
https://myapp.com
```

**Generated LinkBlitzer URL:**

```
https://myapp.com?urls=https%3A//example.com%7Chttps%3A//google.com%7Chttps%3A//github.com
```

## Technical Details

- **TypeScript**: Fully typed codebase with strict mode enabled
- **Build System**: Vite for fast development and optimized production builds
- **URL Validation**: Uses native `URL()` constructor for validation
- **Query Parameters**: URLs encoded using `URLSearchParams`
- **Clipboard API**: Modern clipboard API with fallback
- **Popup Detection**: Cross-browser popup permission testing
- **User Agent Detection**: Automatic browser identification for tailored instructions
- **Theme System**: CSS custom properties with automatic dark mode switching
- **Popup Prevention**: Staggered opening to avoid popup blockers
- **Auto-redirect**: Cleans URL after opening tabs
- **Module System**: Clean ES modules with TypeScript interfaces

## Browser Compatibility

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Popup detection works across all major browsers with browser-specific handling
- Dark mode supported in all browsers with `prefers-color-scheme` support
- TypeScript compiles to ES2020 for broad compatibility
- Clipboard functionality requires HTTPS in production
- JavaScript must be enabled

## Deployment

This is a static web app that can be deployed anywhere:

1. **Build for production**: `npm run build`
2. **Upload files**: Deploy the entire `dist/` directory contents to any static host
3. **Configure server**: Optional routing configuration for better UX

### Build for Production

```bash
npm run build
```

This creates a production-ready `dist/` directory (≈6.4KB main.js, ≈2.6KB gzipped) with:

- TypeScript compiled to optimized JavaScript
- All modules bundled into a single file
- Code minification and tree-shaking
- Source maps for debugging
- CSS extracted and optimized

## Security Considerations

- All URLs open in new tabs (`_blank`)
- URLs are validated before opening
- Popup testing uses minimal, temporary windows that are immediately closed
- No server-side processing required
- No data storage or cookies used
- Page redirects to clean URL after opening tabs
- Official browser documentation links for security
- TypeScript provides compile-time safety

## Troubleshooting

### Development Issues

- **TypeScript errors**: Run `npm run type-check` to see detailed error messages
- **Build failures**: Ensure all TypeScript files compile without errors
- **Module import errors**: Check file paths and exports in TypeScript files

### Popups Still Not Working?

1. Check the banner at the top of the app - it will show your current popup status
2. Click "Retest" after making browser changes
3. Follow the browser-specific instructions shown
4. Ensure you're accessing the site via `http://` or `https://` (not `file://`)
5. Some browsers require clicking "Allow" on the popup notification

### Generated Links Not Working?

- Ensure the receiving browser allows popups for your domain
- Check that URLs are properly formatted with `http://` or `https://`
- Verify the site is accessed via a web server, not as a local file

### Dark Mode Issues?

- Dark mode automatically follows your system preference
- Toggle your system's dark mode to see the theme change
- Older browsers may not support `prefers-color-scheme` and will show light mode
- Theme transitions are smooth and should not cause layout shifts

## License

MIT License - see [LICENSE.md](LICENSE.md) for details.

## Contributing

This project welcomes contributions:

1. Fork the repository
2. Create a feature branch
3. Make your changes in TypeScript (`src/` directory)
4. Run `npm run type-check` to verify types
5. Test with `npm run dev`
6. Submit a pull request

Keep the code simple, fast, and dependency-free!
