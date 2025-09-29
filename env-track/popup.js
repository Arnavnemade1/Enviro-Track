class EnviroTrackPopup {
  constructor() {
    this.stats = null;
    this.platformInfo = {};
    this.init();
  }

  init() {
    this.loadStats();
    this.setupEventListeners();
    this.startAutoRefresh();
  }

  setupEventListeners() {
    document.getElementById('trackingToggle').addEventListener('click', () => {
      this.toggleTracking();
    });

    document.getElementById('resetBtn').addEventListener('click', () => {
      this.resetData();
    });

    document.getElementById('historyBtn').addEventListener('click', () => {
      this.showHistory();
    });

    document.getElementById('settingsBtn').addEventListener('click', () => {
      this.showSettings();
    });

    document.getElementById('closeInsights').addEventListener('click', () => {
      this.closeInsights();
    });
  }

  loadStats() {
    chrome.storage.local.get(['dailyStats'], (result) => {
      this.stats = result.dailyStats || {
        requests: 0,
        totalTime: 0,
        energyUsed: 0,
        co2Footprint: 0,
        sites: {},
        hourlyData: Array(24).fill(0),
        isTracking: true
      };
      this.updateDisplay();
    });
  }

  updateDisplay() {
    this.updateQuickStats();
    this.updateImpactBar();
    this.updatePlatformsList();
    this.updateTrackingToggle();
  }

  updateQuickStats() {
    document.getElementById('totalRequests').textContent = this.stats.requests;

    const energy = this.stats.energyUsed;
    let energyDisplay;
    if (energy < 0.001) {
      energyDisplay = `${(energy * 1000000).toFixed(0)}µWh`;
    } else if (energy < 1) {
      energyDisplay = `${(energy * 1000).toFixed(2)}mWh`;
    } else {
      energyDisplay = `${energy.toFixed(3)}kWh`;
    }
    document.getElementById('totalEnergy').textContent = energyDisplay;

    const co2 = Math.round(this.stats.co2Footprint);
    document.getElementById('totalCO2').textContent = `${co2}g`;

    const treeMinutes = (this.stats.co2Footprint / 0.06).toFixed(1);
    document.getElementById('treeTime').textContent = `${treeMinutes}m`;
  }

  updateImpactBar() {
    const co2 = this.stats.co2Footprint;
    const impactFill = document.getElementById('impactFill');
    const impactLevel = document.getElementById('impactLevel');

    let percentage = Math.min(100, (co2 / 200) * 100);
    impactFill.style.width = `${percentage}%`;

    impactLevel.classList.remove('low', 'moderate', 'high');
    
    if (co2 < 50) {
      impactLevel.textContent = 'Minimal';
      impactLevel.classList.add('low');
    } else if (co2 < 150) {
      impactLevel.textContent = 'Moderate';
      impactLevel.classList.add('moderate');
    } else {
      impactLevel.textContent = 'Significant';
      impactLevel.classList.add('high');
    }
  }

  updatePlatformsList() {
    const platformsList = document.getElementById('platformsList');
    const platformsCount = document.getElementById('platformsCount');
    const sites = this.stats.sites;

    const sortedSites = Object.entries(sites)
      .sort(([, a], [, b]) => b.count - a.count);

    if (sortedSites.length === 0) {
      platformsList.innerHTML = `
        <div class="empty-state">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
            <path d="M12 8V12M12 16H12.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
          <p>No AI platforms used today</p>
        </div>
      `;
      platformsCount.textContent = '0 Active';
      return;
    }

    platformsCount.textContent = `${sortedSites.length} Active`;

    platformsList.innerHTML = sortedSites.map(([site, data]) => {
      return this.createPlatformItem(site, data);
    }).join('');

    document.querySelectorAll('.platform-item').forEach(item => {
      item.addEventListener('click', () => {
        const site = item.dataset.site;
        this.showPlatformInsights(site);
      });
    });
  }

  createPlatformItem(site, data) {
    chrome.runtime.sendMessage({ action: 'getPlatformInfo', site }, (response) => {
      if (response && response.platform) {
        this.platformInfo[site] = response.platform;
      }
    });

    const platform = this.platformInfo[site];
    const color = platform ? platform.color : '#64748b';
    const gradient = platform ? platform.gradient : 'linear-gradient(135deg, #64748b 0%, #475569 100%)';
    const name = platform ? platform.name : this.formatSiteName(site);
    const avgTime = (data.totalTime / data.count / 1000).toFixed(2);
    const energyMwh = (data.energy * 1000).toFixed(2);

    return `
      <div class="platform-item" data-site="${site}">
        <div class="platform-color" style="background: ${gradient}">
          ${name.substring(0, 2).toUpperCase()}
        </div>
        <div class="platform-info">
          <div class="platform-name">${name}</div>
          <div class="platform-stats">${data.count} requests • ${avgTime}s avg • ${energyMwh}mWh</div>
        </div>
        <svg class="platform-arrow" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
    `;
  }

  formatSiteName(site) {
    return site
      .replace('www.', '')
      .replace('.com', '')
      .replace('.ai', '')
      .split('.')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  showPlatformInsights(site) {
    const platform = this.platformInfo[site];
    if (!platform) return;

    const siteData = this.stats.sites[site];
    const insightsSection = document.getElementById('insightsSection');
    const insightContent = document.getElementById('insightContent');

    const avgTime = (siteData.totalTime / siteData.count / 1000).toFixed(2);
    const energyMwh = (siteData.energy * 1000).toFixed(3);
    const co2 = (siteData.energy * 0.475 * 1000).toFixed(1);

    insightContent.innerHTML = `
      <div class="insight-header">
        <div class="insight-platform-icon" style="background: ${platform.gradient}">
          ${platform.name.substring(0, 2).toUpperCase()}
        </div>
        <div class="insight-platform-info">
          <h3>${platform.name}</h3>
          <p>${platform.provider} • ${platform.modelType}</p>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 16px;">
        <div style="background: var(--bg-primary); padding: 12px; border-radius: 8px; border: 1px solid var(--border);">
          <div style="font-size: 11px; color: var(--text-muted); margin-bottom: 4px;">AVG TIME</div>
          <div style="font-size: 18px; font-weight: 700; color: var(--text-primary);">${avgTime}s</div>
        </div>
        <div style="background: var(--bg-primary); padding: 12px; border-radius: 8px; border: 1px solid var(--border);">
          <div style="font-size: 11px; color: var(--text-muted); margin-bottom: 4px;">ENERGY</div>
          <div style="font-size: 18px; font-weight: 700; color: var(--text-primary);">${energyMwh}mWh</div>
        </div>
      </div>

      <div class="insight-description">
        <strong>About ${platform.name}:</strong><br><br>
        ${platform.description}
      </div>

      <div class="insight-factors">
        <h4>Energy Consumption Factors</h4>
        <p>${platform.energyFactors}</p>
      </div>

      <div style="margin-top: 16px; padding: 16px; background: var(--bg-primary); border-radius: 8px; border: 1px solid var(--border);">
        <div style="font-size: 12px; font-weight: 600; color: var(--text-secondary); margin-bottom: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Environmental Impact</div>
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px;">
          <div>
            <div style="font-size: 11px; color: var(--text-muted); margin-bottom: 4px;">CO₂ Generated</div>
            <div style="font-size: 16px; font-weight: 700; color: #f56565;">${co2}g</div>
          </div>
          <div>
            <div style="font-size: 11px; color: var(--text-muted); margin-bottom: 4px;">Tree Absorption Time</div>
            <div style="font-size: 16px; font-weight: 700; color: #48bb78;">${(co2 / 0.06).toFixed(1)}min</div>
          </div>
        </div>
      </div>
    `;

    insightsSection.style.display = 'block';
    insightsSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  closeInsights() {
    document.getElementById('insightsSection').style.display = 'none';
  }

  updateTrackingToggle() {
    const toggle = document.getElementById('trackingToggle');
    if (this.stats.isTracking) {
      toggle.classList.add('active');
    } else {
      toggle.classList.remove('active');
    }
  }

  toggleTracking() {
    this.stats.isTracking = !this.stats.isTracking;
    chrome.storage.local.set({ dailyStats: this.stats });
    this.updateTrackingToggle();
  }

  resetData() {
    if (!confirm('Are you sure you want to reset all data for today? This action cannot be undone.')) {
      return;
    }

    chrome.storage.local.get(['dailyStats'], (result) => {
      const currentTracking = result.dailyStats ? result.dailyStats.isTracking : true;
      
      this.stats = {
        requests: 0,
        totalTime: 0,
        energyUsed: 0,
        co2Footprint: 0,
        sites: {},
        hourlyData: Array(24).fill(0),
        isTracking: currentTracking
      };

      chrome.storage.local.set({ dailyStats: this.stats }, () => {
        this.updateDisplay();
        this.closeInsights();
      });
    });
  }

  showHistory() {
    chrome.storage.local.get(['history'], (result) => {
      const history = result.history || [];
      
      if (history.length === 0) {
        alert('No historical data available yet. Data will be saved at midnight each day.');
        return;
      }

      let historyText = 'Historical Data (Last 30 Days):\n\n';
      
      history.slice(-7).reverse().forEach(entry => {
        const date = new Date(entry.date).toLocaleDateString();
        const stats = entry.stats;
        historyText += `${date}:\n`;
        historyText += `  Requests: ${stats.requests}\n`;
        historyText += `  Energy: ${(stats.energyUsed * 1000).toFixed(2)}mWh\n`;
        historyText += `  CO₂: ${Math.round(stats.co2Footprint)}g\n\n`;
      });

      alert(historyText);
    });
  }

  showSettings() {
    alert('Settings panel coming soon!\n\nFeatures:\n- Custom CO₂ conversion rates\n- Export data\n- Notifications\n- Theme customization');
  }

  startAutoRefresh() {
    setInterval(() => {
      this.loadStats();
    }, 3000);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new EnviroTrackPopup();
});font-size: 11px; color: var(--text-muted); margin-bottom: 4px;">REQUESTS</div>
          <div style="font-size: 18px; font-weight: 700; color: var(--text-primary);">${siteData.count}</div>
        </div>
        <div style="background: var(--bg-primary); padding: 12px; border-radius: 8px; border: 1px solid var(--border);">
          <div style="
