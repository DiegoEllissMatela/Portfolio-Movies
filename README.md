# CineFlow — Cinematic Discovery Platform

A streaming and film discovery web application built with modern vanilla ES6+ and modular SCSS. The platform integrates the OMDb REST API with client-side caching, reactive pub/sub state synchronization, and an interactive Web Audio API waveform visualizer.

## Overview

CineFlow provides a movie catalog experience featuring discovery feeds, genre filtering, watchlist management, and detailed film pages. The application runs entirely client-side without heavy frontend framework dependencies, focusing on direct DOM manipulation, performant animations, and decoupled architecture.

## Architecture and Engineering Decisions

### 1. Decoupled Logic and Design Tokens
- `logic/`: Contains the core application state, asynchronous OMDb API service, routing controller, and pub/sub event bus.
- `design/`: Organized with BEM methodology and SCSS variables for consistent dark-theme cinematic aesthetics.

### 2. OMDb API Integration & In-Memory Caching
The `ApiService` encapsulates all network requests to OMDb. To reduce redundant network calls and prevent rate limiting:
- Search results and detailed movie metadata are stored in an in-memory cache keyed by query string and IMDb ID.
- Live search queries are debounced to ensure fluid user input without duplicate request spam.

### 3. Pub/Sub State Management
A lightweight publish-subscribe event bus manages user watchlists and notification state across views. Updates to the watchlist trigger re-renders only on subscribed components without full page reloads.

### 4. Web Audio API Waveform Synthesizer
The detail view includes an interactive audio player powered by the Web Audio API. It synthesizes dynamic commentary audio nodes and visualizes frequency waveforms on an HTML5 canvas in real time.

## Live Demo

- **Hosted on GitHub Pages:** [https://diegoellissmatela.github.io/Portfolio-Movies/](https://diegoellissmatela.github.io/Portfolio-Movies/)

## Tech Stack

- **Language:** JavaScript (ES6+ Modules)
- **Styling:** SCSS (BEM Architecture, Flexbox, CSS Grid)
- **APIs & Browser Features:** OMDb REST API, Web Audio API, HTML5 Canvas
- **Deployment:** GitHub Pages
