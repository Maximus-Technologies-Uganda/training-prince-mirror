// StopwatchUI Class - Timer State Management
// Imports backend modules and implements timer state management

import { Stopwatch } from '../../../src/stopwatch/core.js';
import { CSVExporter } from '../../../src/stopwatch/exporter.js';

export class StopwatchUI {
  constructor(containerElement) {
    this.container = containerElement;
    this.stopwatch = new Stopwatch();
    this.state = {
      running: false,
      startTime: 0,
      elapsedTime: 0,
      laps: []
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
    this.stopBtn = this.container.querySelector('.stop-btn');
    this.resetBtn = this.container.querySelector('.reset-btn');
    this.exportBtn = this.container.querySelector('.export-btn');
    this.lapsDisplay = this.container.querySelector('.laps-display');
    
    // Verify all elements exist
    if (!this.timerDisplay || !this.startBtn || !this.stopBtn || 
        !this.resetBtn || !this.exportBtn || !this.lapsDisplay) {
      throw new Error('Required DOM elements not found');
    }
  }

  bindEvents() {
    this.startBtn.addEventListener('click', () => this.start());
    this.stopBtn.addEventListener('click', () => this.stop());
    this.resetBtn.addEventListener('click', () => this.reset());
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

  stop() {
    if (!this.state.running) return;
    
    this.state.running = false;
    this.state.elapsedTime = Date.now() - this.state.startTime;
    this.stopwatch.stop();
    
    // Record lap
    this.recordLap();
    
    this.updateButtonStates();
    this.stopDisplayUpdates();
    
    // Dispatch event
    this.container.dispatchEvent(new CustomEvent('timer:stop'));
  }

  reset() {
    this.state.running = false;
    this.state.startTime = 0;
    this.state.elapsedTime = 0;
    this.state.laps = [];
    this.stopwatch.reset();
    
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
      timestamp: Date.now()
    };
    
    this.state.laps.push(lapData);
    this.updateLapsDisplay();
    this.saveState();
    
    // Dispatch event
    this.container.dispatchEvent(new CustomEvent('lap:recorded', { 
      detail: lapData 
    }));
  }

  updateDisplay() {
    const elapsedMs = this.state.running ? 
      Date.now() - this.state.startTime : 
      this.state.elapsedTime;
    
    this.timerDisplay.textContent = this.formatTime(elapsedMs);
  }

  formatTime(milliseconds) {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const hundredths = Math.floor((milliseconds % 1000) / 10);
    
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${hundredths.toString().padStart(2, '0')}`;
  }

  updateButtonStates() {
    this.startBtn.disabled = this.state.running;
    this.stopBtn.disabled = !this.state.running;
    this.resetBtn.disabled = false;
    this.exportBtn.disabled = false;
  }

  updateLapsDisplay() {
    if (this.state.laps.length === 0) {
      this.lapsDisplay.innerHTML = '<div class="no-laps">No laps recorded</div>';
      return;
    }
    
    const lapsHtml = this.state.laps.map(lap => 
      `<div class="lap-item">Lap ${lap.lapNumber}: ${this.formatTime(lap.elapsedTime)}</div>`
    ).join('');
    
    this.lapsDisplay.innerHTML = lapsHtml;
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
        elapsedTime: this.state.elapsedTime
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
    const headers = ['Lap Number', 'Elapsed Time'];
    const rows = this.state.laps.map(lap => [
      lap.lapNumber.toString(),
      this.formatTime(lap.elapsedTime)
    ]);
    
    const csvRows = [headers, ...rows];
    return CSVExporter.exportLaps(this.state.laps);
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
}
