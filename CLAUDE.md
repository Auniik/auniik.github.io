# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a personal portfolio website (auniik.github.io) for Anik Datta, a Software Engineer. It's a static website built with HTML, CSS, and JavaScript that showcases professional experience, projects, and contact information.

## Architecture

The website follows a simple static site architecture with dynamic content loading:

- **Static Foundation**: Built with HTML5, CSS3, and vanilla JavaScript
- **Dynamic Content**: Uses `data.json` for content management and `main.js` for dynamic loading
- **jQuery Dependencies**: Relies on jQuery and several plugins for UI interactions
- **Single Page Application**: Uses tabs/sections for navigation without page refreshes

## Key Files and Structure

### Core Files
- `index.html` - Main HTML template with sections for Profile, Resume, Projects, Papers, and Contact
- `data.json` - Central data store containing all dynamic content (employment, education, projects, contact info)
- `js/main.js` - Modern JavaScript for dynamic content loading from data.json
- `js/custom.js` - jQuery-based legacy code for UI interactions and animations

### Styling
- `css/style.css` - Main stylesheet (has recent modifications)
- `css/reset.css` - CSS reset
- `css/font.css` - Font definitions
- `css/prettyPhoto.css` - Photo gallery styling

### Content Organization
- `projects/` - Project screenshots organized by category (web, hospitalerp, retail, etc.)
- `papers/` - Academic papers and research documents
- `cv/` - Resume/CV files in PDF format
- `images/` - Site images and assets

## Development Workflow

### No Build Process
This is a static website with no build tools, package managers, or compilation steps. Changes are made directly to source files.

### Content Updates
- **Dynamic Content**: Edit `data.json` to update employment, education, projects, and contact information
- **Static Content**: Edit `index.html` directly for structural changes
- **Styling**: Modify CSS files directly

### Testing
- Simply open `index.html` in a browser or serve the directory with any static file server
- No automated testing framework is present

## Data Structure

The `data.json` file contains structured data for:
- `profile` - Personal information and social links
- `employment` - Work experience with duration, company, and descriptions
- `education` - Educational background
- `projects` - Portfolio projects with images, categories, and descriptions
- `contact` - Contact information

## JavaScript Architecture

### Modern Layer (`main.js`)
- Fetches data from `data.json` on page load
- Populates DOM elements with dynamic content
- Uses modern JavaScript (ES6+) with fetch API

### Legacy Layer (`custom.js`)
- jQuery-based code for UI interactions
- Handles animations, tabs, portfolio filtering
- Manages photo galleries and contact forms

## Key Dependencies

### JavaScript Libraries
- jQuery (core dependency)
- jquery.easytabs.min.js - Tab navigation
- jquery.isotope.min.js - Portfolio filtering
- jquery.prettyPhoto.js - Photo gallery
- jquery.carouFredSel-6.2.1.js - Carousel functionality

### External Services
- Google Maps API (for contact section)
- Google Fonts (Open Sans, PT Serif)

## Deployment

This is a GitHub Pages site. Changes pushed to the repository are automatically deployed to auniik.github.io.

## Common Tasks

### Adding New Projects
1. Add project images to appropriate subfolder in `projects/`
2. Update `data.json` with new project entry including class, image paths, title, category, and description
3. The project will automatically appear in the portfolio section

### Updating Resume/CV
1. Replace files in `cv/` directory
2. Update `data.json` employment and education sections
3. The resume section will automatically reflect changes

### Modifying Styling
- Edit `css/style.css` for layout and visual changes
- Changes are immediately visible after refresh

## Notes

- The website includes both static content in HTML and dynamic content loaded from JSON
- Some project entries in the HTML are commented out but still present in data.json
- The contact form references a PHP backend (`php/contact.php`) that may not be functional in the current setup
- Google Maps integration is present but may need API key updates