(() => {
  const KEY_PREFIX = "b44_chat_dir__";
  const HOST_ID = "b44-rtl-toggle-host"; // This is the host element

  const STATE = {
    mode: "ltr",
    root: null,
    composer: null,
    button: null, // This will now be the HOST element
    anchor: null,
    resizeObs: null,
  };

  // --- Addition ---
  // Classic copy icon SVG
  const COPY_ICON_SVG = `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
    </svg>
  `;
  // -----------------

  const isEl = (n) => n && n.nodeType === 1;
  const key = () => KEY_PREFIX + location.origin;

  // ------- Storage (No change) -------
  async function loadMode() {
    try {
      const obj = await chrome.storage.local.get(key());
      const v = obj[key()];
      if (v === "rtl" || v === "ltr") {
        STATE.mode = v;
      }
    } catch (e) {
      // Error loading mode
    }
  }
  async function saveMode(v) {
    try { 
      await chrome.storage.local.set({ [key()]: v }); 
    } catch (e) {
      // Error saving mode
    }
  }

  // ------- Utilities (No change) -------
  const debounce = (fn, ms=120) => {
    let t; return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
  };
  const isVisible = (el) => {
    if (!el) return false;
    const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0;
  };

  function findComposer() {
    const cands = Array.from(document.querySelectorAll('textarea,[contenteditable="true"]'));
    const preferred = cands.find(el => el && isVisible(el) &&
      /write|type|message|שליחה|הקלד|כתוב/i.test(el.getAttribute("placeholder") || el.ariaLabel || ""));
    return preferred || cands.find(isVisible) || null;
  }

  function findSendButton() {
    if (!STATE.composer) return null;
    const container = STATE.composer.closest("div") || STATE.composer.parentElement;
    if (!container) return null;
    const buttons = Array.from(container.querySelectorAll('button,[role="button"]')).filter(isVisible);
    let best = null, bestScore = -Infinity;
    const cRect = container.getBoundingClientRect();
    for (const b of buttons) {
      const r = b.getBoundingClientRect();
      const hasSvg = !!b.querySelector("svg");
      const rightness = r.right;
      const sizePenalty = Math.max(0, (r.width * r.height) - 2500) * 0.002;
      const svgBonus = hasSvg ? 40 : 0;
      const score = rightness + svgBonus - sizePenalty - Math.abs(r.top - cRect.top) * 0.5;
      if (!best || score > bestScore) { best = b; bestScore = score; }
    }
    return best || null;
  }

  function findRoot() {
    const composer = findComposer();
    if (!composer) return null;
    let cur = composer.parentElement;
    while (cur && cur !== document.body) {
      const r = cur.getBoundingClientRect();
      if (r.height > 240 && r.width > 320) return cur;
      cur = cur.parentElement;
    }
    return composer.parentElement || null;
  }

  function ensureRootAndAnchor() {
    STATE.composer = findComposer();
    if (!STATE.composer) return false;
    STATE.root = findRoot();
    if (!STATE.root) return false;
    if (getComputedStyle(STATE.root).position === "static") STATE.root.style.position = "relative";
    STATE.root.classList.add("b44-chat-root");
    STATE.anchor = findSendButton() || STATE.composer;
    return !!STATE.anchor;
  }

  // ------- Icon & Button (Fully upgraded) -------
  function makeButton() {
    let host = document.getElementById(HOST_ID);
    if (!host) {
      host = document.createElement("div");
      host.id = HOST_ID;
      
      // 1. Create the isolated bubble
      const shadowRoot = host.attachShadow({ mode: 'open' });

      // 2. Create the internal button
      const button = document.createElement("button");
      button.className = "b44-rtl-toggle-inner";
      button.type = "button";
      button.title = "Toggle RTL/LTR";
      button.setAttribute("aria-label", "Toggle RTL/LTR");

      // ===============================================================
      // --- 3. Define Icon Variables (Edit settings here) ---
      // ===============================================================
      const ICON_STROKE_WIDTH = 1;
      const ICON_MAX_WIDTH = 16;
      const ICON_HEIGHT = 14;
      const ICON_LINE_1_WIDTH = 16;
      const ICON_LINE_2_WIDTH = 12;
      const ICON_LINE_3_WIDTH = 6;
      const ICON_LINE_1_Y = 1;  // Y pos top line
      const ICON_LINE_2_Y = 7;  // Y pos middle line
      const ICON_LINE_3_Y = 13; // Y pos bottom line
      
      // Assemble the viewBox from variables
      const ICON_VIEWBOX = `0 0 ${ICON_MAX_WIDTH} ${ICON_HEIGHT}`;
      // ===============================================================

      // 4. Define the SVG icon using variables
      const iconSVG = `
        <svg class="icon-svg" 
             xmlns="http://www.w3.org/2000/svg" 
             viewBox="${ICON_VIEWBOX}" 
             preserveAspectRatio="xMidYMid meet">
          
          <line x1="0" y1="${ICON_LINE_1_Y}" x2="${ICON_LINE_1_WIDTH}" y2="${ICON_LINE_1_Y}" stroke-width="${ICON_STROKE_WIDTH}" />
          <line x1="0" y1="${ICON_LINE_2_Y}" x2="${ICON_LINE_2_WIDTH}" y2="${ICON_LINE_2_Y}" stroke-width="${ICON_STROKE_WIDTH}" />
          <line x1="0" y1="${ICON_LINE_3_Y}" x2="${ICON_LINE_3_WIDTH}" y2="${ICON_LINE_3_Y}" stroke-width="${ICON_STROKE_WIDTH}" />
        
        </svg>
      `;
      button.innerHTML = iconSVG;

      // 5. Load the isolated CSS into the bubble
      const styleLink = document.createElement('link');
      styleLink.rel = 'stylesheet';
      styleLink.href = chrome.runtime.getURL('button_styles.css');
      shadowRoot.appendChild(styleLink);
      
      // 6. Add the internal button to the bubble
      shadowRoot.appendChild(button);

      // 7. Add listener to the internal button
      button.addEventListener("click", async (e) => {
        e.preventDefault();
        e.stopPropagation();
        const next = STATE.mode === "rtl" ? "ltr" : "rtl";
        applyMode(next);
        await saveMode(next);
        positionButton(); // Call reposition
      });
    }
    STATE.button = host; // Save the host to STATE
    reflectIconState();
    return host;
  }

  function reflectIconState() {
    if (STATE.button && STATE.button.shadowRoot) {
        // Find the internal button and set the state on it
        const internalButton = STATE.button.shadowRoot.querySelector('.b44-rtl-toggle-inner');
        if (internalButton) {
          internalButton.dataset.mode = STATE.mode;
        }
    }
  }

  // --- Diagnostic functions removed ---

  function applyMode(mode) {
    STATE.mode = mode;
    const root = STATE.root || findRoot();
    if (!root) {
      return;
    }
    // Toggle chat direction (this still happens on the main page)
    root.classList.toggle("b44-chat-rtl", STATE.mode === "rtl");
    root.classList.toggle("b44-chat-ltr", STATE.mode === "ltr");
    
    // Mark nodes so CSS applies (still relevant for page_styles.css)
    Array.from(root.querySelectorAll("p,div,span,li,ol,ul,blockquote,pre,code,mark,em,strong,small,button,textarea,[contenteditable='true']"))
      .forEach(n => n.setAttribute("data-b44-mark", "1"));
      
    // Show the correct icon (inside the Shadow DOM)
    reflectIconState();
  }

  // ------- Precise positioning (Slightly updated) -------
  function positionButton() {
    if (!STATE.root || !STATE.anchor || !STATE.button) {
      return;
    }
    const container = STATE.composer.closest("div") || STATE.composer.parentElement || STATE.root;
    if (!isEl(container)) {
      return;
    }
    const cRect = container.getBoundingClientRect();
    const aRect = STATE.anchor.getBoundingClientRect();
    const spacing = 6; // px under the arrow

    const left = aRect.left - cRect.left;
    const width = aRect.width;
    const top = aRect.bottom - cRect.top + spacing;

    // Set the style on the host (the bubble)
    // We add position: absolute to ensure it floats
    STATE.button.style.position = "absolute"; 
    STATE.button.style.left = `${Math.round(left)}px`;
    STATE.button.style.top  = `${Math.round(top)}px`;
    STATE.button.style.width = `${Math.round(width)}px`;
    // Set a fixed height from the old CSS
    STATE.button.style.height = "22px"; 
    
  }

  // ------- 🚀 New Function: Add Copy Buttons -------
  function injectCopyButtons() {
    // Use the precise selector from the previous solution
    const codeBlocks = document.querySelectorAll('.b44-chat-root :is(pre:has(> code[class^="language-"]), code[class^="language-"])');
    
    for (const block of codeBlocks) {
      // Mark the outer block (pre) to prevent duplicates
      const parentPre = block.tagName === 'PRE' ? block : block.closest('pre');
      if (parentPre.dataset.b44CopyAdded) {
        continue; // Already added a button
      }
      parentPre.dataset.b44CopyAdded = "true";

      const btn = document.createElement("button");
      btn.className = "b44-copy-button";
      btn.innerHTML = COPY_ICON_SVG;
      btn.setAttribute("aria-label", "Copy code");
      btn.title = "Copy code";

      btn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();

        // Find the inner <code> element, or use the block itself
        const codeElement = parentPre.querySelector('code') || parentPre;
        const textToCopy = codeElement.textContent || "";
        
        navigator.clipboard.writeText(textToCopy).then(() => {
          btn.classList.add("copied");
          // Replace icon with a checkmark
          btn.innerHTML = "✓"; 
          setTimeout(() => {
            btn.classList.remove("copied");
            // Restore original icon
            btn.innerHTML = COPY_ICON_SVG; 
          }, 2000);
        }).catch(err => {
          // Failed to copy
        });
      });

      // Add the button to the PRE
      parentPre.appendChild(btn);
    }
  }

  // ------- Initialization (Slightly upgraded) -------
  function tryInitialize() {
    if (STATE.button && document.getElementById(HOST_ID)) {
      injectCopyButtons(); // Also run on existing button
      return true;
    }
    
    if (ensureRootAndAnchor()) {
      const container = STATE.composer.closest("div") || STATE.composer.parentElement || STATE.root;
      if (isEl(container)) {
        const btn = makeButton(); // 'btn' is now the host
        if (!btn.parentElement) {
          container.appendChild(btn);
        }
        applyMode(STATE.mode);
        positionButton();

        // --- Addition ---
        injectCopyButtons(); // Initial run for copy buttons

        if (STATE.resizeObs) try { STATE.resizeObs.disconnect(); } catch {}
        try {
          STATE.resizeObs = new ResizeObserver(debounce(() => {
            positionButton();
          }, 80));
          STATE.resizeObs.observe(STATE.anchor);
        } catch (e) {
          // Error setting up ResizeObserver
        }
        window.addEventListener("scroll", debounce(() => {
          positionButton();
        }, 120), { passive: true });

        return true;
      }
    }
    return false;
  }

  async function init() {
    await loadMode();
    
    if (tryInitialize()) {
      // Immediate initialization successful
    }
    
    const observer = new MutationObserver(debounce(() => {
      // Run both functions on DOM change
      if (!STATE.button || !document.getElementById(HOST_ID)) {
        tryInitialize(); // Try to re-init if button is gone
      }
      injectCopyButtons(); // Always look for new code blocks
    }, 300)); // Increased debounce slightly
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
    
    // No need for a timeout, keep observing
  }

  init();
})();