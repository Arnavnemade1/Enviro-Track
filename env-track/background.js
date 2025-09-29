const AI_PLATFORMS = {
  'chatgpt.com': {
    name: 'ChatGPT',
    baseEnergy: 0.0006,
    provider: 'OpenAI',
    modelType: 'GPT-4 / GPT-4o',
    color: '#10a37f',
    gradient: 'linear-gradient(135deg, #10a37f 0%, #0d8a6b 100%)',
    description: 'OpenAI\'s flagship conversational AI powered by GPT-4 and GPT-4o models. These are some of the largest and most capable language models available, requiring substantial computational resources for inference. Each query processes billions of parameters through multiple transformer layers, consuming significant energy across distributed GPU clusters.',
    energyFactors: 'High token generation rates, multi-modal processing capabilities (text and images), extensive context windows up to 128k tokens, real-time streaming responses, and comprehensive safety filtering systems all contribute to increased energy consumption. The model architecture requires massive parallel processing across multiple high-performance GPUs.'
  },
  'claude.ai': {
    name: 'Claude',
    baseEnergy: 0.0005,
    provider: 'Anthropic',
    modelType: 'Claude Sonnet 4 / Opus 4',
    color: '#D97757',
    gradient: 'linear-gradient(135deg, #D97757 0%, #c45d3e 100%)',
    description: 'Anthropic\'s Claude family represents state-of-the-art language models designed with Constitutional AI principles for enhanced safety and reliability. Claude Sonnet and Opus variants feature sophisticated reasoning capabilities with extended context windows exceeding 200k tokens. The models excel at complex analytical tasks requiring substantial computational power.',
    energyFactors: 'Extended context processing capabilities, constitutional AI safety verification layers, detailed multi-step reasoning chains, and comprehensive conversation memory all demand significant computational resources. However, Anthropic\'s efficient architecture design and optimized inference pipelines help reduce per-query energy impact compared to similarly capable models.'
  },
  'gemini.google.com': {
    name: 'Gemini',
    baseEnergy: 0.0004,
    provider: 'Google',
    modelType: 'Gemini Pro / Ultra',
    color: '#4285f4',
    gradient: 'linear-gradient(135deg, #4285f4 0%, #3367d6 100%)',
    description: 'Google\'s Gemini represents a new generation of natively multimodal AI models built on Google\'s advanced infrastructure. Leveraging custom TPU acceleration and Google\'s globally distributed data centers, Gemini achieves impressive performance with relatively optimized energy usage. The unified architecture seamlessly processes text, images, video, and code.',
    energyFactors: 'Google\'s proprietary TPU (Tensor Processing Unit) hardware provides highly energy-efficient inference compared to traditional GPU architectures. Multimodal processing, massive pre-training datasets, and real-time response generation still require significant power, but infrastructure optimization and hardware-software co-design substantially reduce the per-query environmental footprint.'
  },
  'chat.deepseek.com': {
    name: 'DeepSeek',
    baseEnergy: 0.0003,
    provider: 'DeepSeek AI',
    modelType: 'DeepSeek V2 / V3',
    color: '#7c3aed',
    gradient: 'linear-gradient(135deg, #7c3aed 0%, #6025d0 100%)',
    description: 'DeepSeek is an emerging AI platform focusing on efficient, high-performance language models with cost-effective inference. Their V2 and V3 architectures employ advanced mixture-of-experts (MoE) design to activate only relevant neural pathways for each query, significantly reducing computational overhead while maintaining competitive performance.',
    energyFactors: 'Sparse mixture-of-experts architecture dramatically reduces active parameters per query, with only a fraction of the model\'s capacity engaged for any given task. Efficient training techniques, optimized inference pipelines, and strategic parameter allocation result in lower energy consumption while maintaining strong performance across diverse tasks. The MoE approach provides superior energy efficiency compared to dense transformer models.'
  },
  'www.copilot.com': {
    name: 'Copilot',
    baseEnergy: 0.0005,
    provider: 'Microsoft',
    modelType: 'GPT-4 Turbo',
    color: '#0078d4',
    gradient: 'linear-gradient(135deg, #0078d4 0%, #005a9e 100%)',
    description: 'Microsoft Copilot integrates advanced GPT-4 models with Bing search capabilities and Microsoft\'s comprehensive ecosystem. The platform combines large language model inference with real-time web search, image generation via DALL-E, and productivity tool integration. This multi-service architecture creates additional computational demands beyond basic text generation.',
    energyFactors: 'Integrated web search functionality requires additional API calls and processing power. Multi-service architecture combining chat, search, and creative tools, real-time information retrieval and verification, cross-platform synchronization, and enterprise-grade security all contribute to elevated energy usage per interaction. Each query may trigger multiple AI systems simultaneously.'
  },
  'grok.com': {
    name: 'Grok',
    baseEnergy: 0.0005,
    provider: 'xAI',
    modelType: 'Grok-2',
    color: '#1DA1F2',
    gradient: 'linear-gradient(135deg, #1DA1F2 0%, #0d8ecf 100%)',
    description: 'xAI\'s Grok is engineered for real-time information access with distinctive personality-driven responses. Built with emphasis on truthfulness and current events understanding, Grok processes queries with real-time X (Twitter) integration for up-to-the-moment context. The model balances conversational engagement with factual accuracy through sophisticated inference patterns.',
    energyFactors: 'Real-time social media data integration and processing, extended context windows for conversation continuity, personality-driven response generation requiring additional inference layers, and continuous learning from current events all demand substantial computational resources. Large-scale GPU clusters simultaneously handle language understanding, real-time data ingestion, and contextual synthesis.'
  },
  'poe.com': {
    name: 'Poe',
    baseEnergy: 0.0004,
    provider: 'Quora',
    modelType: 'Multiple Models',
    color: '#e74c3c',
    gradient: 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)',
    description: 'Poe serves as a unified platform providing access to multiple AI models including GPT-4, Claude, and various specialized models. This aggregation approach allows users to leverage different AI capabilities through a single interface, with each query routed to the appropriate model based on user selection.',
    energyFactors: 'Platform overhead for routing and managing multiple model backends, potential parallel queries to different models, infrastructure for managing API calls to various AI providers, and comprehensive conversation storage and retrieval systems all contribute to energy consumption beyond the base model inference costs.'
  },
  'perplexity.ai': {
    name: 'Perplexity',
    baseEnergy: 0.0004,
    provider: 'Perplexity AI',
    modelType: 'Custom LLM + Search',
    color: '#20808d',
    gradient: 'linear-gradient(135deg, #20808d 0%, #196770 100%)',
    description: 'Perplexity AI combines large language models with advanced search capabilities to provide real-time, cited answers. The platform excels at research-oriented queries by synthesizing information from multiple sources, providing transparent citations, and maintaining accuracy through continuous web access.',
    energyFactors: 'Real-time web crawling and indexing, multiple search API calls per query, source verification and ranking algorithms, citation generation and formatting, and synthesis of information from diverse sources all require significant additional processing power beyond standard language model inference.'
  },
  'character.ai': {
    name: 'Character.AI',
    baseEnergy: 0.0003,
    provider: 'Character AI',
    modelType: 'Custom Character Models',
    color: '#9b59b6',
    gradient: 'linear-gradient(135deg, #9b59b6 0%, #8e44ad 100%)',
    description: 'Character.AI specializes in conversational AI with distinct personalities and personas. The platform uses optimized models fine-tuned for engaging, character-consistent dialogue rather than maximum scale, resulting in more efficient energy usage while maintaining high-quality conversational experiences.',
    energyFactors: 'Efficient model architecture optimized for dialogue, character consistency layers requiring additional processing, conversation memory and personality maintenance, but generally smaller model sizes compared to general-purpose LLMs result in moderate energy consumption.'
  },
  'huggingface.co': {
    name: 'Hugging Face',
    baseEnergy: 0.0003,
    provider: 'Hugging Face',
    modelType: 'Various Open Models',
    color: '#f59e0b',
    gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    description: 'Hugging Face provides access to thousands of open-source AI models with varying sizes and capabilities. The platform serves as a hub for model inference, fine-tuning, and deployment, with energy consumption highly dependent on the specific model being utilized.',
    energyFactors: 'Energy usage varies dramatically based on model selection, from efficient small models to large-scale transformers. Platform infrastructure for model loading, API management, and shared GPU resources contributes to overall consumption. Community-driven optimization efforts often result in more efficient implementations.'
  },
  'replicate.com': {
    name: 'Replicate',
    baseEnergy: 0.0004,
    provider: 'Replicate',
    modelType: 'Cloud AI Infrastructure',
    color: '#6366f1',
    gradient: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
    description: 'Replicate provides cloud infrastructure for running AI models at scale, supporting everything from image generation to large language models. The platform handles model deployment, scaling, and inference across distributed computing resources.',
    energyFactors: 'Cold start initialization for on-demand models, distributed inference across cloud GPUs, model loading and caching overhead, multi-tenant infrastructure management, and support for compute-intensive tasks like image generation and video processing all contribute to energy consumption patterns.'
  }
};

const requestTimings = new Map();
let dailyStats = {
  requests: 0,
  totalTime: 0,
  energyUsed: 0,
  co2Footprint: 0,
  sites: {},
  hourlyData: Array(24).fill(0),
  isTracking: true
};

function isAIPlatform(url) {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.replace('www.', '');
    
    if (AI_PLATFORMS[hostname]) return hostname;
    
    const aiPatterns = [
      /chat\./i,
      /ai\./i,
      /gpt/i,
      /llm/i,
      /assistant/i,
      /bot\./i,
      /claude/i,
      /gemini/i,
      /copilot/i
    ];
    
    if (aiPatterns.some(pattern => pattern.test(hostname))) {
      return hostname;
    }
    
    return null;
  } catch (e) {
    return null;
  }
}

function calculateEnergy(responseTime, site, statusCode) {
  const platform = AI_PLATFORMS[site];
  const baseEnergy = platform ? platform.baseEnergy : 0.0003;
  
  const timeMultiplier = Math.log(responseTime / 1000 + 1) / Math.log(10) + 1;
  const statusMultiplier = statusCode >= 200 && statusCode < 300 ? 1.0 : 0.3;
  
  return baseEnergy * timeMultiplier * statusMultiplier;
}

chrome.webRequest.onBeforeRequest.addListener(
  (details) => {
    chrome.storage.local.get(['dailyStats'], (result) => {
      if (result.dailyStats && !result.dailyStats.isTracking) return;
      
      const site = isAIPlatform(details.url);
      if (site && (details.type === 'xmlhttprequest' || details.type === 'fetch')) {
        requestTimings.set(details.requestId, {
          startTime: Date.now(),
          site: site,
          url: details.url
        });
      }
    });
  },
  { urls: ["<all_urls>"] }
);

chrome.webRequest.onCompleted.addListener(
  (details) => {
    const timing = requestTimings.get(details.requestId);
    if (timing) {
      const responseTime = Date.now() - timing.startTime;
      const energy = calculateEnergy(responseTime, timing.site, details.statusCode);
      
      chrome.storage.local.get(['dailyStats'], (result) => {
        const stats = result.dailyStats || dailyStats;
        
        stats.requests++;
        stats.totalTime += responseTime;
        stats.energyUsed += energy;
        stats.co2Footprint += energy * 0.475 * 1000;
        
        if (!stats.sites[timing.site]) {
          stats.sites[timing.site] = {
            count: 0,
            totalTime: 0,
            energy: 0,
            lastUsed: Date.now()
          };
        }
        
        stats.sites[timing.site].count++;
        stats.sites[timing.site].totalTime += responseTime;
        stats.sites[timing.site].energy += energy;
        stats.sites[timing.site].lastUsed = Date.now();
        
        const hour = new Date().getHours();
        stats.hourlyData[hour]++;
        
        chrome.storage.local.set({ dailyStats: stats });
      });
      
      requestTimings.delete(details.requestId);
    }
  },
  { urls: ["<all_urls>"] }
);

chrome.alarms.create('dailyReset', { 
  when: getNextMidnight(),
  periodInMinutes: 1440 
});

function getNextMidnight() {
  const now = new Date();
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0);
  return midnight.getTime();
}

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'dailyReset') {
    chrome.storage.local.get(['dailyStats', 'history'], (result) => {
      const history = result.history || [];
      const currentStats = result.dailyStats || dailyStats;
      
      history.push({ 
        date: new Date().toISOString(), 
        stats: JSON.parse(JSON.stringify(currentStats))
      });
      
      chrome.storage.local.set({ 
        history: history.slice(-30),
        dailyStats: {
          requests: 0,
          totalTime: 0,
          energyUsed: 0,
          co2Footprint: 0,
          sites: {},
          hourlyData: Array(24).fill(0),
          isTracking: currentStats.isTracking
        }
      });
    });
  }
});

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ dailyStats, history: [] });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getPlatformInfo') {
    const platform = AI_PLATFORMS[request.site];
    sendResponse({ platform });
  }
  return true;
});
