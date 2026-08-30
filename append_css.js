const fs = require('fs');

const css = `
/* =========================================================
   LIQUID GLASS SELECT COMPONENT
   ========================================================= */
.liquid-select-trigger {
    background: rgba(255, 255, 255, 0.5) !important;
    backdrop-filter: blur(12px) !important;
    -webkit-backdrop-filter: blur(12px) !important;
    border: 1px solid rgba(255, 255, 255, 0.8) !important;
    border-radius: 9999px !important;
    padding: 14px 20px !important;
    display: flex !important;
    align-items: center !important;
    justify-content: space-between !important;
    cursor: pointer !important;
    color: var(--text) !important;
    font-size: 15px !important;
    transition: all 0.3s ease !important;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05), inset 0 1px 2px rgba(255,255,255,1) !important;
}

.liquid-select-trigger.disabled {
    opacity: 0.5;
    pointer-events: none;
}

.dark-mode .liquid-select-trigger, body:not(.light-mode) .liquid-select-trigger {
    background: rgba(255, 255, 255, 0.1) !important;
    border: 1px solid rgba(255, 255, 255, 0.2) !important;
    box-shadow: 0 4px 12px rgba(0,0,0,0.2), inset 0 1px 1px rgba(255,255,255,0.2) !important;
    color: #fff !important;
}

.liquid-select-overlay {
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(0, 0, 0, 0.4);
    backdrop-filter: blur(4px);
    z-index: 99999;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.3s ease;
    display: flex;
    align-items: flex-end;
}

.liquid-select-overlay.active {
    opacity: 1;
    pointer-events: all;
}

.liquid-select-sheet {
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(20px) saturate(180%);
    -webkit-backdrop-filter: blur(20px) saturate(180%);
    width: 100%;
    max-height: 85vh;
    border-radius: 24px 24px 0 0;
    transform: translateY(100%);
    transition: transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
    display: flex;
    flex-direction: column;
    padding-bottom: env(safe-area-inset-bottom);
}

.liquid-select-overlay.active .liquid-select-sheet {
    transform: translateY(0);
}

.dark-mode .liquid-select-sheet, body:not(.light-mode) .liquid-select-sheet {
    background: rgba(20, 20, 25, 0.85);
    border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.ls-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 24px 10px;
}

.ls-header h3 {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
    color: var(--text);
}

.ls-close {
    background: rgba(128,128,128,0.2);
    border: none;
    width: 32px; height: 32px;
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    color: var(--text);
    cursor: pointer;
}

.ls-search-wrap {
    margin: 10px 24px;
    position: relative;
    display: flex;
    align-items: center;
}

.ls-search-wrap i {
    position: absolute;
    left: 16px;
    color: #888;
}

.ls-search-wrap input {
    width: 100%;
    background: rgba(128,128,128,0.15);
    border: none;
    border-radius: 12px;
    padding: 12px 16px 12px 42px;
    font-size: 16px;
    color: var(--text);
    outline: none;
}

.ls-list {
    flex: 1;
    overflow-y: auto;
    padding: 10px 24px 24px;
}

.ls-item {
    padding: 16px 0;
    border-bottom: 1px solid rgba(128,128,128,0.1);
    font-size: 16px;
    color: var(--text);
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
}

.ls-item.selected {
    color: #21a19b;
    font-weight: 600;
}

.ls-item.other-option {
    color: #E11D48;
    font-weight: 600;
}

.ls-empty {
    padding: 30px;
    text-align: center;
    color: #888;
}
`;

try {
    fs.appendFileSync('theme.css', css);
    console.log("Appended to theme.css successfully.");
} catch(e) {
    console.error("Error appending to theme.css:", e);
}
