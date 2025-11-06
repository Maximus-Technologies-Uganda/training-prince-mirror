// StopwatchUI Class - Timer State Management
// Imports backend modules and implements timer state management

import { createStopwatch, formatTime as backendFormatTime } from '../../../src/stopwatch/core.js';
import { exportLapsAsTable } from '../../../src/stopwatch/exporter.js';

export class StopwatchUI {
  constructor(containerElement) {
    this.container = containerElement;
    this.stopwatch = createStopwatch();
    this.state = {
      running: false,
      startTime: 0,
      elapsedTime: 0,
      laps: [],
    };
    this.displayInterval = null;

    this.initializeElements();
    this.bindEvents();
    this.loadState();
    this.updateDisplay();
  }

  initializeElements() {
    // Get DOM elements
    this.timerDisplay = this.container.querySelector('.timer-display');
    this.startBtn = this.container.querySelector('.start-btn');
    this.pauseBtn = this.container.querySelector('.pause-btn');
    this.resumeBtn = this.container.querySelector('.resume-btn');
    this.resetBtn = this.container.querySelector('.stop-btn');
    this.lapBtn = this.container.querySelector('.lap-btn');
    this.clearLapsBtn = this.container.querySelector('.clear-laps-btn');
    this.exportBtn = this.container.querySelector('.export-btn');
    this.lapsDisplay = this.container.querySelector('.laps-display');

    // Verify all elements exist
    if (
      !this.timerDisplay ||
      !this.startBtn ||
      !this.pauseBtn ||
      !this.resumeBtn ||
      !this.resetBtn ||
      !this.exportBtn ||
      !this.lapsDisplay
    ) {
      throw new Error('Required DOM elements not found');
    }
  }

  bindEvents() {
    this.startBtn.addEventListener('click', () => this.start());
    this.pauseBtn.addEventListener('click', () => this.pause());
    this.resumeBtn.addEventListener('click', () => this.resume());
    this.resetBtn.addEventListener('click', () => this.reset());
    this.lapBtn?.addEventListener('click', () => this.lap());
    this.clearLapsBtn?.addEventListener('click', () => this.clearLaps());
    this.exportBtn.addEventListener('click', () => this.exportCSV());
  }

  start() {
    if (this.state.running) return;

    this.state.running = true;
    this.state.startTime = Date.now();
    this.stopwatch.start();

    this.updateButtonStates();
    this.startDisplayUpdates();

    // Dispatch event
    this.container.dispatchEvent(new CustomEvent('timer:start'));
  }

  pause() {
    if (!this.state.running) return;

    this.state.running = false;
    this.state.elapsedTime = Date.now() - this.state.startTime;
    
    this.updateButtonStates();
    this.stopDisplayUpdates();
    this.updateDisplay();

    // Dispatch event
    this.container.dispatchEvent(new CustomEvent('timer:pause'));
  }

  resume() {
    if (this.state.running) return;

    this.state.running = true;
    this.state.startTime = Date.now() - this.state.elapsedTime;
    this.stopwatch.start();

    this.updateButtonStates();
    this.startDisplayUpdates();

    // Dispatch event
    this.container.dispatchEvent(new CustomEvent('timer:resume'));
  }

  stop() {
    if (!this.state.running) return;

    this.state.running = false;
    this.state.elapsedTime = Date.now() - this.state.startTime;
    this.stopwatch.lap(); // Record lap in backend

    // Record lap in our state
    this.recordLap();

    this.updateButtonStates();
    this.stopDisplayUpdates();
    this.updateDisplay(); // Update display with final time

    // Dispatch event
    this.container.dispatchEvent(new CustomEvent('timer:stop'));
  }

  lap() {
    if (!this.state.running) return;

    // Record the current elapsed time as a lap
    const currentLapTime = Date.now() - this.state.startTime;
    const lapData = {
      lapNumber: this.state.laps.length + 1,
      elapsedTime: currentLapTime,
      timestamp: Date.now(),
    };

    this.state.laps.push(lapData);
    this.updateLapsDisplay();
    this.saveState();

    // Dispatch event
    this.container.dispatchEvent(
      new CustomEvent('lap:recorded', {
        detail: lapData,
      }),
    );
  }

  reset() {
    this.state.running = false;
    this.state.startTime = 0;
    this.state.elapsedTime = 0;
    this.state.laps = [];
    this.stopwatch = createStopwatch(); // Create new stopwatch instance

    this.updateButtonStates();
    this.stopDisplayUpdates();
    this.updateDisplay();
    this.updateLapsDisplay();
    this.saveState();

    // Dispatch event
    this.container.dispatchEvent(new CustomEvent('timer:reset'));
  }

  recordLap() {
    const lapData = {
      lapNumber: this.state.laps.length + 1,
      elapsedTime: this.state.elapsedTime,
      timestamp: Date.now(),
    };

    this.state.laps.push(lapData);
    this.updateLapsDisplay();
    this.saveState();

    // Dispatch event
    this.container.dispatchEvent(
      new CustomEvent('lap:recorded', {
        detail: lapData,
      }),
    );
  }

  updateDisplay() {
    const elapsedMs = this.state.running
      ? Date.now() - this.state.startTime
      : this.state.elapsedTime;

    this.timerDisplay.textContent = this.formatTime(elapsedMs);
  }

  formatTime(milliseconds) {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  updateButtonStates() {
    this.startBtn.disabled = this.state.running;
    this.pauseBtn.disabled = !this.state.running;
    this.resumeBtn.disabled = this.state.running;
    this.resetBtn.disabled = false;
    this.exportBtn.disabled = false;

    // Update ARIA labels for better accessibility
    if (this.state.running) {
      this.startBtn.setAttribute('aria-label', 'Stopwatch is running');
      this.pauseBtn.setAttribute('aria-label', 'Pause stopwatch');
    } else {
      this.startBtn.setAttribute('aria-label', 'Start stopwatch');
      this.pauseBtn.setAttribute('aria-label', 'Pause stopwatch (disabled)');
    }
  }

  updateLapsDisplay() {
    if (this.state.laps.length === 0) {
      this.lapsDisplay.innerHTML =
        '<div class="no-laps" role="status" aria-live="polite">No laps recorded</div>';
      return;
    }

    const lapsHtml = this.state.laps
      .map(
        (lap) =>
          `<div class="lap-item" data-testid="lap-item" role="listitem" aria-label="Lap ${lap.lapNumber}: ${this.formatTime(lap.elapsedTime)}">Lap ${lap.lapNumber}: ${this.formatTime(lap.elapsedTime)}</div>`,
      )
      .join('');

    this.lapsDisplay.innerHTML = `<div class="laps-list" role="list" aria-label="Recorded lap times">${lapsHtml}</div>`;
  }

  startDisplayUpdates() {
    this.displayInterval = setInterval(() => {
      this.updateDisplay();
    }, 10); // Update every 10ms for smooth display
  }

  stopDisplayUpdates() {
    if (this.displayInterval) {
      clearInterval(this.displayInterval);
      this.displayInterval = null;
    }
  }

  saveState() {
    try {
      const stateToSave = {
        laps: this.state.laps,
        elapsedTime: this.state.elapsedTime,
      };
      localStorage.setItem('stopwatch-ui-state', JSON.stringify(stateToSave));
    } catch (error) {
      console.warn('Failed to save state to localStorage:', error);
    }
  }

  loadState() {
    try {
      const savedState = localStorage.getItem('stopwatch-ui-state');
      if (savedState) {
        const parsed = JSON.parse(savedState);
        this.state.laps = parsed.laps || [];
        this.state.elapsedTime = parsed.elapsedTime || 0;
        this.updateLapsDisplay();
      }
    } catch (error) {
      console.warn('Failed to load state from localStorage:', error);
      this.state.laps = [];
      this.state.elapsedTime = 0;
    }
  }

  generateCSVContent() {
    // Convert our lap format to backend format
    const backendLaps = this.state.laps.map((lap) => ({ time: lap.elapsedTime }));

    // Use backend exporter to generate CSV
    const tableContent = exportLapsAsTable(backendLaps);

    // Convert tab-separated to comma-separated
    return tableContent.replace(/\t/g, ',');
  }

  exportCSV() {
    try {
      const csvContent = this.generateCSVContent();
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);

      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = 'stopwatch-laps.csv';
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);

      URL.revokeObjectURL(url);

      // Dispatch event
      this.container.dispatchEvent(new CustomEvent('csv:exported'));
    } catch (error) {
      console.error('Failed to export CSV:', error);
      alert('Failed to export CSV file. Please try again.');
    }
  }

  clearLaps() {
    this.state.laps = [];
    this.updateLapsDisplay();
    this.saveState();
    
    // Dispatch event
    this.container.dispatchEvent(new CustomEvent('laps:cleared'));
  }
}
