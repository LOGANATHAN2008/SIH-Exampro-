class LiquidSelect {
    constructor(selectElementId, title = "Select Option", isSearchable = true) {
        this.selectEl = document.getElementById(selectElementId);
        if (!this.selectEl) return;
        
        this.title = title;
        this.isSearchable = isSearchable;
        this.options = [];
        this.value = this.selectEl.value;
        
        this.init();
        this.selectEl.liquidSelect = this;
    }

    init() {
        // Hide native select
        this.selectEl.style.display = 'none';

        // Create trigger button
        this.triggerBtn = document.createElement('div');
        this.triggerBtn.className = 'liquid-select-trigger';
        this.triggerBtn.innerHTML = \`<span class="liquid-select-text">\${this.selectEl.options[this.selectEl.selectedIndex]?.text || this.title}</span><i class="fas fa-chevron-down"></i>\`;
        
        this.selectEl.parentNode.insertBefore(this.triggerBtn, this.selectEl.nextSibling);

        // Bind events
        this.triggerBtn.addEventListener('click', () => {
            if (this.selectEl.disabled) return;
            this.openModal();
        });

        // Sync if native select changes programmatically
        this.selectEl.addEventListener('change', () => {
            this.updateTriggerText();
        });
        
        // Setup modal if not exists
        if (!document.getElementById('liquid-select-modal')) {
            this.createModal();
        }
    }

    updateTriggerText() {
        const textEl = this.triggerBtn.querySelector('.liquid-select-text');
        textEl.textContent = this.selectEl.options[this.selectEl.selectedIndex]?.text || this.title;
        if (this.selectEl.disabled) {
            this.triggerBtn.classList.add('disabled');
        } else {
            this.triggerBtn.classList.remove('disabled');
        }
    }

    refreshOptions() {
        this.options = Array.from(this.selectEl.options).map(opt => ({
            value: opt.value,
            text: opt.text,
            disabled: opt.disabled
        }));
        this.updateTriggerText();
    }

    createModal() {
        const modalHtml = \`
            <div id="liquid-select-modal" class="liquid-select-overlay">
                <div class="liquid-select-sheet">
                    <div class="ls-header">
                        <h3 id="ls-title">Select</h3>
                        <button class="ls-close"><i class="fas fa-times"></i></button>
                    </div>
                    <div class="ls-search-wrap" id="ls-search-wrap">
                        <i class="fas fa-search"></i>
                        <input type="text" id="ls-search" placeholder="Search...">
                    </div>
                    <div class="ls-list" id="ls-list"></div>
                </div>
            </div>
        \`;
        document.body.insertAdjacentHTML('beforeend', modalHtml);

        const modal = document.getElementById('liquid-select-modal');
        const closeBtn = modal.querySelector('.ls-close');
        
        closeBtn.addEventListener('click', () => this.closeModal());
        modal.addEventListener('click', (e) => {
            if (e.target === modal) this.closeModal();
        });
    }

    openModal() {
        this.refreshOptions();
        const modal = document.getElementById('liquid-select-modal');
        const titleEl = document.getElementById('ls-title');
        const searchWrap = document.getElementById('ls-search-wrap');
        const searchInput = document.getElementById('ls-search');
        const listEl = document.getElementById('ls-list');

        titleEl.textContent = this.title;
        searchWrap.style.display = this.isSearchable ? 'flex' : 'none';
        searchInput.value = '';

        this.renderList(listEl, this.options);

        modal.classList.add('active');
        
        if (this.isSearchable) {
            searchInput.oninput = (e) => {
                const term = e.target.value.toLowerCase();
                const filtered = this.options.filter(o => o.text.toLowerCase().includes(term) || o.value === '__other__');
                this.renderList(listEl, filtered);
            };
            setTimeout(() => searchInput.focus(), 300);
        }
        
        // Store current instance to handle selection
        window._activeLiquidSelect = this;
    }

    renderList(listEl, options) {
        listEl.innerHTML = '';
        if (options.length === 0) {
            listEl.innerHTML = '<div class="ls-empty">No results found</div>';
            return;
        }

        options.forEach(opt => {
            if (opt.disabled && opt.value === "") return; // Skip placeholder
            
            const item = document.createElement('div');
            item.className = 'ls-item';
            if (opt.value === this.selectEl.value) item.classList.add('selected');
            if (opt.value === '__other__') item.classList.add('other-option');
            
            item.innerHTML = \`<span>\${opt.text}</span>\${opt.value === this.selectEl.value ? '<i class="fas fa-check"></i>' : ''}\`;
            
            item.addEventListener('click', () => {
                this.selectEl.value = opt.value;
                this.updateTriggerText();
                this.closeModal();
                
                // Trigger change event for chained selects
                const event = new Event('change', { bubbles: true });
                this.selectEl.dispatchEvent(event);
            });
            listEl.appendChild(item);
        });
    }

    closeModal() {
        const modal = document.getElementById('liquid-select-modal');
        modal.classList.remove('active');
        window._activeLiquidSelect = null;
    }
}
