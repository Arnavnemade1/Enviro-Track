// Popup script for AI Environmental Impact Tracker

const AI_PLATFORMS = {
  'chatgpt.com': { name: 'ChatGPT', icon: '🤖' },
  'claude.ai': { name: 'Claude', icon: '🧠' },
  'gemini.google.com': { name: 'Gemini', icon: '♊' },
  'chat.deepseek.com': { name: 'DeepSeek', icon: '🔍' },
  'www.copilot.com': { name: 'Copilot', icon: '👨‍💻' },
  'grok.com': { name: 'Grok', icon: '🚀' },
  'poe.com': { name: 'Poe', icon: '💭' },
  'perplexity.ai': { name: 'Perplexity', icon: '🔎' },
  'character.ai': { name: 'Character.AI', icon: '🎭' },
  'huggingface.co': { name: 'Hugging Face', icon: '🤗' },
  'replicate.com': { name: 'Replicate', icon: '🔄' }
};

class PopupUI {
  constructor() {
    this.stats = null;
    this.isTracking = true;
    this.init();
  }

  async init() {
    try {
      await this.loadStats();
      this.render();
      this.bindEvents();
      
      // Refresh every 5 seconds
      setInterval(() => {
        this.loadStats();
        this.render();
      }, 5000);
      
    } catch (error) {
      console.error('Failed to initialize popup:', error);
      this.showError();
    }
  }

  async loadStats() {
    return new Promise((resolve) => {
      chrome.runtime.sendMessage({ action: 'getStats' }, (response) => {
        if (chrome.runtime.lastError) {
          console.error('Error loading stats:', chrome.runtime.lastError);
          this.stats = this.getDefaultStats();
        } else {
          this.stats = response?.stats || this.getDefaultStats();
          this.isTracking = this.stats.isTracking !== false;
        }
        resolve();
      });
    });
  }

  getDefaultStats() {
    return {
      requests: 0,
      totalTime: 0,
      energyUsed: 0,
      co2Footprint: 0,
      sites: {},
      isTracking: true
    };
  }

  render() {
    document.getElementById('loading').style.display = 'none';
    document.getElementById('content').style.display = 'block';

    // Update tracking status
    this.updateTrackingStatus();

    // Update request count
    document.getElementById('requestCount').textContent = this.stats.requests;

    // Update average response time
    const avgTime = this.stats.requests > 0 
      ? Math.round(this.stats.totalTime / this.stats.requests)
      : 0;
    document.getElementById('avgResponseTime').textContent = avgTime;

    // Update energy consumption (convert from kWh to Wh)
    const energyWh = (this.stats.energyUsed * 1000).toFixed(2);
    document.getElementById('energyValue').textContent = energyWh;
    
    // Energy progress bar (max at 100 Wh for visualization)
    const energyPercent = Math.min((parseFloat(energyWh) / 100) * 100, 100);
    document.getElementById('energyProgress').style.width = `${energyPercent}%`;

    // Update carbon footprint
    const carbonGrams = this.stats.co2Footprint.toFixed(1);
    document.getElementById('carbonValue').textContent = carbonGrams;
    document.getElementById('carbonComparison').innerHTML = 
      this.getCarbonComparison(parseFloat(carbonGrams));

    // Update website breakdown
    this.renderWebsiteBreakdown();
  }

  updateTrackingStatus() {
    const indicator = document.getElementById('statusIndicator');
    const statusText = document.getElementById('statusText');
    const toggleBtn = document.getElementById('toggleTracking');

    if (this.isTracking) {
      indicator.classList.remove('paused');
      statusText.textContent = 'Tracking Active';
      toggleBtn.textContent = 'Pause Tracking';
    } else {
      indicator.classList.add('paused');
      statusText.textContent = 'Tracking Paused';
      toggleBtn.textContent = 'Resume Tracking';
    }
  }

  getCarbonComparison(carbonGrams) {
    const PHONE_CHARGE_CO2 = 8.8; // grams of CO2 per phone charge
    const KM_DRIVING_CO2 = 120; // grams of CO2 per km of car driving

    if (carbonGrams < PHONE_CHARGE_CO2) {
      return `Less than <strong>1 phone charge</strong>`;
    }

    const phoneCharges = Math.round(carbonGrams / PHONE_CHARGE_CO2);
    
    if (phoneCharges < 10) {
      return `Equivalent to charging a phone <strong>${phoneCharges} time${phoneCharges > 1 ? 's' : ''}</strong>`;
    } else if (phoneCharges < 100) {
      return `Equivalent to <strong>${phoneCharges} phone charges</strong>`;
    } else {
      const kmDriving = (carbonGrams / KM_DRIVING_CO2).toFixed(1);
      return `Equivalent to <strong>${kmDriving} km</strong> of car driving`;
    }
  }

  renderWebsiteBreakdown() {
    const container = document.getElementById('websiteBreakdown');
    const sites = this.stats.sites || {};
    
    if (Object.keys(sites).length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">🔍</div>
          <p>No AI platforms used today</p>
        </div>
      `;
      return;
    }

    // Sort sites by request count
    const sortedSites = Object.entries(sites)
      .sort(([, a], [, b]) => b.count - a.count)
      .slice(0, 5); // Top 5

    container.innerHTML = '';

    sortedSites.forEach(([domain, siteStats]) => {
      const platform = AI_PLATFORMS[domain] || { name: domain, icon: '🔗' };
      const energyWh = (siteStats.energy * 1000).toFixed(2);
      const avgTime = Math.round(siteStats.totalTime / siteStats.count);

      const item = document.createElement('div');
      item.className = 'website-item';
      item.innerHTML = `
        <div class="website-name">
          <span>${platform.icon}</span>
          <span>${platform.name}</span>
        </div>
        <div class="website-stats">
          <div><strong>${siteStats.count}</strong> requests</div>
          <div style="font-size: 10px; opacity: 0.8;">${energyWh} Wh · ${avgTime}ms avg</div>
        </div>
      `;

      container.appendChild(item);
    });
  }

  bindEvents() {
    // Toggle tracking button
    document.getElementById('toggleTracking').addEventListener('click', async () => {
      try {
        chrome.runtime.sendMessage({ action: 'toggleTracking' }, (response) => {
          if (response && response.isTracking !== undefined) {
            this.isTracking = response.isTracking;
            this.updateTrackingStatus();
          }
        });
      } catch (error) {
        console.error('Failed to toggle tracking:', error);
      }
    });

    // Reset stats button
    document.getElementById('resetStats').addEventListener('click', async () => {
      if (confirm('Are you sure you want to reset all statistics? This action cannot be undone.')) {
        try {
          chrome.runtime.sendMessage({ action: 'resetStats' }, async (response) => {
            if (response && response.success) {
              await this.loadStats();
              this.render();
              
              // Show feedback
              const btn = document.getElementById('resetStats');
              const originalText = btn.textContent;
              btn.textContent = '✓ Statistics Reset!';
              btn.style.background = 'rgba(76, 175, 80, 0.3)';
              btn.style.borderColor = 'rgba(76, 175, 80, 0.5)';
              
              setTimeout(() => {
                btn.textContent = originalText;
                btn.style.background = '';
                btn.style.borderColor = '';
              }, 2000);
            }
          });
        } catch (error) {
          console.error('Failed to reset stats:', error);
        }
      }
    });
  }

  showError() {
    document.getElementById('loading').innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">⚠️</div>
        <p>Failed to load statistics</p>
        <p style="font-size: 11px; margin-top: 8px; opacity: 0.7;">Please try again later</p>
      </div>
    `;
  }
}

// Initialize popup when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new PopupUI();
  });
} else {
  new PopupUI();
}
