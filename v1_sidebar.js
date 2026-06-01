/**
 * =================================================================
 * VITE-MOSAIC SIDEBAR SYSTEM v1.0 - JavaScript
 * Complete JavaScript functionality for sidebar and indicator components
 * =================================================================
 */

class SidebarSystem {
  constructor() {
    this.isHovered = false;
    this.sidebar = null;
    this.indicator = null;
    this.trigger = null;
    this.tocItems = [];
    this.debugMode = false;
    this.contentObserver = null;
    this.init();
  }

  /**
   * Initialize the sidebar system
   */
  init() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setup());
    } else {
      this.setup();
    }
  }

  /**
   * Setup sidebar elements and event listeners
   */
  setup() {
    this.findElements();
    this.setupEventListeners();
    this.initializeTOC();
    this.initializeFontLoader();
    this.initializeVersionInfo();
    this.sizeLogos();

    console.log('✓ Sidebar system initialized');
  }

  /**
   * Pin logo dimensions via inline !important so NO stylesheet — and no browser-specific SVG
   * intrinsic sizing (Safari / RStudio Viewer ignore CSS width on an <img> with intrinsic dims and
   * blow the logo out to max-width) — can break them. This is the single source of truth for logo
   * size; the .sidebarLogo CSS rule is only a pre-JS fallback to avoid a flash.
   */
  sizeLogos() {
    const set = (el, props) => { if (!el) return; for (const k in props) el.style.setProperty(k, props[k], 'important'); };
    set(document.querySelector('.sidebarLogo'), { width: '9rem', 'max-width': '9rem', height: 'auto' });
    document.querySelectorAll('.socialLogo').forEach((l) => set(l, { width: '1.25rem', height: '1.25rem' }));
    document.querySelectorAll('.techLogo').forEach((l) => set(l, { height: '1.5rem', width: 'auto' }));
  }

  /**
   * Find sidebar DOM elements
   */
  findElements() {
    this.sidebar = document.querySelector('.sidebar');
    this.indicator = document.querySelector('.sidebarIndicator');
    this.trigger = document.querySelector('.sidebarTrigger');
    
    if (!this.sidebar) {
      console.warn('Sidebar element not found');
      return;
    }
  }

  /**
   * Setup event listeners for hover interactions
   */
  setupEventListeners() {
    if (!this.sidebar || !this.indicator || !this.trigger) return;

    // Mouse enter/leave for trigger area
    this.trigger.addEventListener('mouseenter', () => this.showSidebar());
    this.trigger.addEventListener('mouseleave', () => this.hideSidebar());

    // Mouse enter/leave for sidebar itself
    this.sidebar.addEventListener('mouseenter', () => this.showSidebar());
    this.sidebar.addEventListener('mouseleave', () => this.hideSidebar());

    // Keyboard accessibility
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isHovered) {
        this.hideSidebar();
      }
    });
  }

  /**
   * Show sidebar and indicator
   */
  showSidebar() {
    this.isHovered = true;
    this.sidebar?.classList.add('active');
    this.indicator?.classList.add('active');
    
    // Dispatch custom event
    document.dispatchEvent(new CustomEvent('sidebarShown', {
      detail: { isHovered: this.isHovered }
    }));
  }

  /**
   * Hide sidebar and indicator
   */
  hideSidebar() {
    this.isHovered = false;
    this.sidebar?.classList.remove('active');
    this.indicator?.classList.remove('active');
    
    // Dispatch custom event
    document.dispatchEvent(new CustomEvent('sidebarHidden', {
      detail: { isHovered: this.isHovered }
    }));
  }

  /**
   * Initialize Table of Contents functionality
   */
  initializeTOC() {
    // Scan the page for headings and generate TOC items automatically
    this.tocItems = this.scanPageForHeadings();
    
    this.renderTOC();
    this.setupTOCEventListeners();
    
    // Set up observer to re-scan if content changes
    this.setupContentObserver();
  }

  /**
   * Scan the page for H2 and below headings to generate TOC
   */
  scanPageForHeadings() {
    const headings = document.querySelectorAll('h2, h3, h4, h5, h6');
    const tocItems = [];
    
    headings.forEach((heading, index) => {
      // Get or generate an ID for the heading
      let id = heading.id;
      if (!id) {
        // Generate ID from heading text
        id = this.generateIdFromText(heading.textContent, index);
        heading.id = id;
      }
      
      // Determine the level (H2 = level 1, H3 = level 2, etc.)
      const tagLevel = parseInt(heading.tagName.charAt(1));
      let tocLevel = tagLevel - 1; // H2 becomes level 1, H3 becomes level 2, etc.
      
      // Special case: treat H3 headers containing "instructions" as level 1 (same as H2)
      if (tagLevel === 3 && heading.textContent.toLowerCase().includes('instructions')) {
        tocLevel = 1; // Treat as same level as H2
        console.log(`✓ Special case: H3 "instructions" header treated as level 1`);
      }
      
      // Get the heading text
      const title = heading.textContent.trim();
      
      // Skip TOC-related headings (similar to how we skip H1)
      const titleLower = title.toLowerCase();
      const skipTitles = [
        'table of contents',
        'toc',
        'contents',
        'table-of-contents'
      ];
      
      const shouldSkip = skipTitles.some(skipTitle => 
        titleLower === skipTitle || 
        titleLower.includes(skipTitle)
      );
      
      // Only add if we have valid content and it's not a TOC heading
      if (title && !shouldSkip) {
        tocItems.push({
          id: id,
          title: title,
          level: tocLevel,
          element: heading
        });
      } else if (title && shouldSkip) {
        console.log(`⚠ Skipping TOC-related heading: "${title}"`);
      }
    });
    
    console.log(`✓ Found ${tocItems.length} headings for TOC`);
    return tocItems;
  }

  /**
   * Generate a URL-friendly ID from text
   */
  generateIdFromText(text, fallbackIndex) {
    if (!text) return `heading-${fallbackIndex}`;
    
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/--+/g, '-') // Replace multiple hyphens with single
      .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
  }

  /**
   * Setup content observer to re-scan for headings when content changes
   */
  setupContentObserver() {
    // Only observe if MutationObserver is available
    if (typeof MutationObserver === 'undefined') return;
    
    const observer = new MutationObserver((mutations) => {
      let shouldRescan = false;
      
      mutations.forEach((mutation) => {
        // Check if headings were added or removed
        if (mutation.type === 'childList') {
          const addedHeadings = Array.from(mutation.addedNodes)
            .filter(node => node.nodeType === Node.ELEMENT_NODE)
            .some(node => node.matches('h2, h3, h4, h5, h6') || node.querySelector('h2, h3, h4, h5, h6'));
          
          const removedHeadings = Array.from(mutation.removedNodes)
            .filter(node => node.nodeType === Node.ELEMENT_NODE)
            .some(node => node.matches('h2, h3, h4, h5, h6') || node.querySelector('h2, h3, h4, h5, h6'));
          
          if (addedHeadings || removedHeadings) {
            shouldRescan = true;
          }
        }
      });
      
      if (shouldRescan) {
        console.log('🔄 Content changed, re-scanning headings...');
        this.refreshTOC();
      }
    });
    
    // Observe the main content area, or body if no specific area is found
    const observeTarget = document.querySelector('main, .main-content, .content, #content') || document.body;
    
    observer.observe(observeTarget, {
      childList: true,
      subtree: true
    });
    
    this.contentObserver = observer;
  }

  /**
   * Refresh the TOC by re-scanning the page
   */
  refreshTOC() {
    this.tocItems = this.scanPageForHeadings();
    this.renderTOC();
    this.setupTOCEventListeners();
    
    // Dispatch custom event
    document.dispatchEvent(new CustomEvent('tocRefreshed', {
      detail: { items: this.tocItems }
    }));
  }

  /**
   * Render Table of Contents HTML
   */
  renderTOC() {
    const tocContainer = document.querySelector('.tocContainer');
    if (!tocContainer) return;

    const tocHTML = `
      <div class="tocScrollArea">
        <ul class="tocList">
          ${this.tocItems.map(item => `
            <li class="tocItem level${item.level}">
              <a href="#${item.id}" class="tocLink" data-target="${item.id}">
                ${item.title}
              </a>
            </li>
          `).join('')}
        </ul>
      </div>
    `;

    tocContainer.innerHTML = tocHTML;
  }

  /**
   * Setup TOC click event listeners
   */
  setupTOCEventListeners() {
    const tocLinks = document.querySelectorAll('.tocLink');
    tocLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('data-target');
        this.scrollToSection(targetId);
      });
    });
  }

  /**
   * Smooth scroll to section
   */
  scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
      
      // Dispatch custom event
      document.dispatchEvent(new CustomEvent('tocSectionChanged', {
        detail: { sectionId, element }
      }));
    }
  }

  /**
   * Initialize font loading system
   */
  initializeFontLoader() {
    const fontFamilies = [
      'TT Commons Pro Mono',
      'Minion Pro', 
      'Helvetica Neue LT Com',
      'Neue Haas Display'
    ];

    const checkFontsLoaded = async () => {
      try {
        await document.fonts.ready;
        
        const fontChecks = fontFamilies.map(family => {
          return document.fonts.check(`1em "${family}"`);
        });

        const loadedCount = fontChecks.filter(Boolean).length;
        const percentage = Math.round((loadedCount / fontFamilies.length) * 100);
        
        if (percentage >= 75) {
          document.documentElement.classList.add('fonts-loaded');
          console.log(`✓ Custom fonts loaded (${loadedCount}/${fontFamilies.length})`);
        } else if (percentage >= 50) {
          document.documentElement.classList.add('fonts-partial');
          console.log(`⚠ Custom fonts partially loaded (${loadedCount}/${fontFamilies.length})`);
        } else {
          document.documentElement.classList.add('fonts-failed');
          console.log(`✗ Custom fonts failed to load (${loadedCount}/${fontFamilies.length})`);
        }

        // Dispatch custom event
        window.dispatchEvent(new CustomEvent('fontsLoaded', {
          detail: { percentage, loadedCount, totalCount: fontFamilies.length }
        }));
      } catch (error) {
        console.log('✗ Font loading check failed:', error);
        document.documentElement.classList.add('fonts-failed');
      }
    };

    setTimeout(checkFontsLoaded, 500);
  }

  /**
   * Initialize version information
   */
  initializeVersionInfo() {
    const versionElement = document.querySelector('.sidebarSubtitle');
    if (!versionElement) return;

    const version = this.generateVersionString();
    versionElement.textContent = version;

    // Add developer pill if in development
    if (this.isDevelopment()) {
      const versionContainer = document.querySelector('.versionContainer');
      if (versionContainer) {
        const developerPill = document.createElement('div');
        developerPill.className = 'developerPill';
        developerPill.textContent = 'DEVELOPER';
        versionContainer.appendChild(developerPill);
      }
    }
  }

  /**
   * Generate version string
   */
  generateVersionString() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    
    return `v1.0.0-${year}${month}${day}-${hours}${minutes}`;
  }

  /**
   * Check if in development mode
   */
  isDevelopment() {
    return location.hostname === 'localhost' || 
           location.hostname === '127.0.0.1' || 
           location.hostname === '' ||
           location.port !== '';
  }

  /**
   * Toggle debug mode
   */
  toggleDebugMode() {
    this.debugMode = !this.debugMode;
    document.body.classList.toggle('debugEnabled', this.debugMode);
    
    console.log(this.debugMode ? '🔍 Debug mode enabled' : '📝 Debug mode disabled');
    
    // Dispatch custom event
    document.dispatchEvent(new CustomEvent('debugModeToggled', {
      detail: { debugMode: this.debugMode }
    }));
  }

  /**
   * Update TOC items dynamically
   */
  updateTOCItems(newItems) {
    this.tocItems = newItems;
    this.renderTOC();
    this.setupTOCEventListeners();
  }

  /**
   * Manually refresh TOC (useful for dynamically loaded content)
   */
  refreshTOCManually() {
    console.log('🔄 Manually refreshing TOC...');
    this.refreshTOC();
  }

  /**
   * Add a new heading to the page and update TOC
   */
  addHeading(level, text, targetElement) {
    if (!targetElement) {
      console.warn('Target element not provided for adding heading');
      return;
    }
    
    const heading = document.createElement(`h${level}`);
    heading.textContent = text;
    heading.id = this.generateIdFromText(text, Date.now());
    
    targetElement.appendChild(heading);
    
    // Refresh TOC after adding
    setTimeout(() => this.refreshTOC(), 100);
    
    return heading;
  }

  /**
   * Get current sidebar state
   */
  getState() {
    return {
      isHovered: this.isHovered,
      debugMode: this.debugMode,
      tocItems: this.tocItems,
      version: this.generateVersionString()
    };
  }

  /**
   * Destroy sidebar system
   */
  destroy() {
    // Remove event listeners
    this.trigger?.removeEventListener('mouseenter', this.showSidebar);
    this.trigger?.removeEventListener('mouseleave', this.hideSidebar);
    this.sidebar?.removeEventListener('mouseenter', this.showSidebar);
    this.sidebar?.removeEventListener('mouseleave', this.hideSidebar);
    
    // Disconnect content observer
    if (this.contentObserver) {
      this.contentObserver.disconnect();
      this.contentObserver = null;
    }
    
    // Remove classes
    this.sidebar?.classList.remove('active');
    this.indicator?.classList.remove('active');
    
    console.log('✓ Sidebar system destroyed');
  }
}

/**
 * =================================================================
 * UTILITY FUNCTIONS
 * =================================================================
 */

/**
 * Create sidebar HTML structure
 */
function createSidebarHTML() {
  return `
    <!-- Sidebar Trigger Area -->
    <div class="sidebarTrigger" data-debug-component="sidebar-trigger"></div>
    
    <!-- Main Sidebar -->
    <aside class="sidebar" data-debug-component="sidebar-container">
      <div class="sidebarContent" data-debug-component="sidebar-content">
        
        <!-- Sidebar Header -->
        <div class="sidebarHeader" data-debug-component="sidebar-header">
          <div class="sidebarHeaderLeft">
            <img src="https://cdn.jsdelivr.net/gh/analoginterface/mosaics@main/logos/primary-wordmark_black_mosaic.svg" 
                 alt="Mosaic Analytics" 
                 class="sidebarLogo" 
                 data-debug-component="sidebar-logo"
                 draggable="false"
                 onerror="this.src='https://via.placeholder.com/200x60/333333/FFFFFF?text=MOSAIC'">
            
            <!-- Version and Social Links on same horizontal plane -->
            <div class="versionSocialRow">
              <div class="versionContainer">
                <p class="sidebarSubtitle" data-debug-component="sidebar-subtitle">v1.0.0</p>
              </div>
              
              <div class="socialLinks">
                <a href="https://github.com/analoginterface" target="_blank" rel="noopener noreferrer" title="GitHub Profile">
                  <img src="https://cdn.jsdelivr.net/gh/analoginterface/mosaics@main/github-logo.svg" 
                       alt="GitHub" 
                       class="socialLogo github"
                       draggable="false"
                       onerror="this.src='https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png'">
                </a>
                <a href="https://www.linkedin.com/in/c0lin-mcc0rmick" target="_blank" rel="noopener noreferrer" title="LinkedIn Profile">
                  <img src="https://cdn.jsdelivr.net/gh/analoginterface/mosaics@main/linkedin-logo.svg" 
                       alt="LinkedIn" 
                       class="socialLogo linkedin"
                       draggable="false"
                       onerror="this.src='https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/linkedin.svg'">
                </a>
              </div>
            </div>
          </div>
          
          <div class="techStack">
                         <a href="https://cran.rstudio.com/" target="_blank" rel="noopener noreferrer" title="Visit CRAN R Archive Network">
               <img src="https://www.r-project.org/logo/Rlogo.png" 
                    alt="R" 
                    class="techLogo react" 
                    title="Built with R"
                    draggable="false"
                    onerror="this.src='https://cdn.jsdelivr.net/gh/analoginterface/mosaics@main/r-logo.png'">
             </a>
             <a href="https://rmarkdown.rstudio.com/" target="_blank" rel="noopener noreferrer" title="Visit R Markdown Official Site">
               <img src="https://rmarkdown.rstudio.com/docs/reference/figures/logo.png" 
                    alt="RMarkdown" 
                    class="techLogo vite" 
                    title="Built with R Markdown"
                    draggable="false"
                    onerror="this.src='https://bookdown.org/yihui/rmarkdown/images/hex-rmarkdown.png'">
             </a>
          </div>
        </div>
        
        <!-- Sidebar Content -->
        <div class="sidebarContent" data-debug-component="sidebar-main-content">
          <h3 class="tocTitle">TABLE OF CONTENTS</h3>
          
          <div class="tocWrapper">
            <div class="tocContainer">
              <!-- TOC will be dynamically populated -->
            </div>
          </div>
        </div>
        
      </div>
    </aside>
    
    <!-- Sidebar Indicator -->
    <div class="sidebarIndicator" data-debug-component="sidebar-indicator">
      <div class="middleDot"></div>
    </div>
  `;
}

/**
 * Initialize sidebar system with custom options
 */
function initializeSidebar(options = {}) {
  const sidebar = new SidebarSystem();
  
  // Apply custom options
  if (options.tocItems) {
    // Override automatic scanning with manual TOC items
    sidebar.updateTOCItems(options.tocItems);
  }
  
  if (options.debugMode) {
    sidebar.toggleDebugMode();
  }
  
  return sidebar;
}

/**
 * Quick setup function for basic usage
 */
function setupBasicSidebar() {
  // Create sidebar HTML if it doesn't exist
  const existingSidebar = document.querySelector('.sidebar');
  if (!existingSidebar) {
    const container = document.body;
    container.insertAdjacentHTML('beforeend', createSidebarHTML());
  }
  
  // Initialize sidebar system
  return initializeSidebar();
}

/**
 * =================================================================
 * GLOBAL INITIALIZATION
 * =================================================================
 */

// Auto-initialize if sidebar elements are present
// The system will automatically scan for H2-H6 headings and generate TOC
document.addEventListener('DOMContentLoaded', () => {
  const hasSidebar = document.querySelector('.sidebar');
  const hasTrigger = document.querySelector('.sidebarTrigger');
  
  if (hasSidebar && hasTrigger) {
    window.sidebarSystem = new SidebarSystem();
  }
});

// Global API
window.SidebarSystem = SidebarSystem;
window.initializeSidebar = initializeSidebar;
window.setupBasicSidebar = setupBasicSidebar;
window.createSidebarHTML = createSidebarHTML;

// Debug hotkey (Ctrl+Shift+D)
document.addEventListener('keydown', (e) => {
  if (e.ctrlKey && e.shiftKey && e.key === 'D') {
    if (window.sidebarSystem) {
      window.sidebarSystem.toggleDebugMode();
    }
  }
});

console.log('✓ Sidebar system JavaScript loaded'); 