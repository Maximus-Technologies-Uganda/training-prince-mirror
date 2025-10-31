// Formatting utilities for UI components
export function createFormatter() {
  return {
    formatNumber: (value, precision = 1) => {
      if (!Number.isFinite(value)) {
        return '0';
      }
      
      const rounded = Number(value.toFixed(precision));
      return String(rounded);
    },
    
    formatTemperature: (value, unit, precision = 1) => {
      const formatted = createFormatter().formatNumber(value, precision);
      return `${formatted}°${unit}`;
    },
    
    formatCurrency: (value, currency = 'USD', precision = 2) => {
      if (!Number.isFinite(value)) {
        return '$0.00';
      }
      
      const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: precision,
        maximumFractionDigits: precision,
      });
      
      return formatter.format(value);
    },
    
    formatPercentage: (value, precision = 1) => {
      if (!Number.isFinite(value)) {
        return '0%';
      }
      
      const formatted = createFormatter().formatNumber(value, precision);
      return `${formatted}%`;
    },
    
    formatDate: (date, options = {}) => {
      if (!date) {
        return '';
      }
      
      const dateObj = date instanceof Date ? date : new Date(date);
      
      if (isNaN(dateObj.getTime())) {
        return 'Invalid Date';
      }
      
      const defaultOptions = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      };
      
      const formatOptions = { ...defaultOptions, ...options };
      
      return new Intl.DateTimeFormat('en-US', formatOptions).format(dateObj);
    },
    
    formatTime: (date, options = {}) => {
      if (!date) {
        return '';
      }
      
      const dateObj = date instanceof Date ? date : new Date(date);
      
      if (isNaN(dateObj.getTime())) {
        return 'Invalid Time';
      }
      
      const defaultOptions = {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      };
      
      const formatOptions = { ...defaultOptions, ...options };
      
      return new Intl.DateTimeFormat('en-US', formatOptions).format(dateObj);
    },
    
    truncateText: (text, maxLength = 50, suffix = '...') => {
      if (!text || typeof text !== 'string') {
        return '';
      }
      
      if (text.length <= maxLength) {
        return text;
      }
      
      return text.substring(0, maxLength - suffix.length) + suffix;
    },
    
    capitalizeFirst: (text) => {
      if (!text || typeof text !== 'string') {
        return '';
      }
      
      return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
    },
    
    capitalizeWords: (text) => {
      if (!text || typeof text !== 'string') {
        return '';
      }
      
      return text.split(' ').map(word => createFormatter().capitalizeFirst(word)).join(' ');
    },
    
    formatFileSize: (bytes) => {
      if (!Number.isFinite(bytes) || bytes < 0) {
        return '0 B';
      }
      
      const units = ['B', 'KB', 'MB', 'GB', 'TB'];
      let size = bytes;
      let unitIndex = 0;
      
      while (size >= 1024 && unitIndex < units.length - 1) {
        size /= 1024;
        unitIndex++;
      }
      
      const formatted = createFormatter().formatNumber(size, 1);
      return `${formatted} ${units[unitIndex]}`;
    },
  };
}

export function createInputFormatter() {
  return {
    formatNumericInput: (input) => {
      if (!input || typeof input !== 'string') {
        return '';
      }
      
      // Remove non-numeric characters except decimal point and negative sign
      const cleaned = input.replace(/[^0-9.-]/g, '');
      
      // Ensure only one decimal point
      const parts = cleaned.split('.');
      if (parts.length > 2) {
        return parts[0] + '.' + parts.slice(1).join('');
      }
      
      // Ensure negative sign is only at the beginning
      if (cleaned.includes('-')) {
        const negativeIndex = cleaned.indexOf('-');
        if (negativeIndex !== 0) {
          return '-' + cleaned.replace(/-/g, '');
        }
      }
      
      return cleaned;
    },
    
    formatPhoneNumber: (input) => {
      if (!input || typeof input !== 'string') {
        return '';
      }
      
      // Remove all non-numeric characters
      const cleaned = input.replace(/\D/g, '');
      
      // Format as (XXX) XXX-XXXX
      if (cleaned.length >= 10) {
        return `(${cleaned.substring(0, 3)}) ${cleaned.substring(3, 6)}-${cleaned.substring(6, 10)}`;
      } else if (cleaned.length >= 6) {
        return `(${cleaned.substring(0, 3)}) ${cleaned.substring(3, 6)}-${cleaned.substring(6)}`;
      } else if (cleaned.length >= 3) {
        return `(${cleaned.substring(0, 3)}) ${cleaned.substring(3)}`;
      } else {
        return cleaned;
      }
    },
    
    formatCreditCard: (input) => {
      if (!input || typeof input !== 'string') {
        return '';
      }
      
      // Remove all non-numeric characters
      const cleaned = input.replace(/\D/g, '');
      
      // Format as XXXX XXXX XXXX XXXX
      const groups = cleaned.match(/.{1,4}/g) || [];
      return groups.join(' ').substring(0, 19); // Max 16 digits + 3 spaces
    },
  };
}

export function createDisplayFormatter() {
  return {
    formatList: (items, options = {}) => {
      if (!Array.isArray(items) || items.length === 0) {
        return options.emptyText || 'No items';
      }
      
      const separator = options.separator || ', ';
      const maxItems = options.maxItems || items.length;
      const suffix = options.suffix || '';
      
      const displayItems = items.slice(0, maxItems);
      let result = displayItems.join(separator);
      
      if (items.length > maxItems) {
        const remaining = items.length - maxItems;
        result += ` and ${remaining} more`;
      }
      
      return result + suffix;
    },
    
    formatCount: (count, singular, plural) => {
      if (!Number.isFinite(count) || count < 0) {
        return `0 ${plural}`;
      }
      
      if (count === 1) {
        return `1 ${singular}`;
      }
      
      return `${count} ${plural}`;
    },
    
    formatRange: (min, max, unit = '') => {
      if (!Number.isFinite(min) || !Number.isFinite(max)) {
        return '';
      }
      
      const formattedMin = createFormatter().formatNumber(min);
      const formattedMax = createFormatter().formatNumber(max);
      
      return `${formattedMin}${unit} - ${formattedMax}${unit}`;
    },
  };
}
