// Birthday Cake Decorator
class CakeDecorator {
    constructor() {
        this.cakeContainer = document.getElementById('cakeContainer');
        this.decorationZone = document.getElementById('decorationZone');
        this.cakeSvg = document.getElementById('cakeSvg');
        this.decorations = [];
        this.selectedDecoration = null;
        this.draggedElement = null;
        this.glowInterval = null;
        this.isLit = false;
        
        this.settings = {
            cakeSize: 1,
            cakeFlavor: 'vanilla',
            glowEnabled: false,
            flickerEnabled: false
        };
        
        this.init();
    }
    
    init() {
        this.setupDragAndDrop();
        this.setupControls();
        this.setupInteractions();
    }
    
    setupDragAndDrop() {
        const decorationItems = document.querySelectorAll('.decoration-item');
        
        decorationItems.forEach(item => {
            item.addEventListener('dragstart', (e) => {
                this.draggedElement = e.target;
                e.dataTransfer.effectAllowed = 'copy';
                e.dataTransfer.setData('text/html', e.target.innerHTML);
            });
        });
        
        this.decorationZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'copy';
        });
        
        this.decorationZone.addEventListener('drop', (e) => {
            e.preventDefault();
            if (this.draggedElement) {
                const rect = this.decorationZone.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                this.addDecoration(
                    this.draggedElement.dataset.type,
                    x,
                    y
                );
            }
        });
        
        // Click to add decoration
        decorationItems.forEach(item => {
            item.addEventListener('click', () => {
                const rect = this.decorationZone.getBoundingClientRect();
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                this.addDecoration(
                    item.dataset.type,
                    centerX,
                    centerY
                );
            });
        });
    }
    
    addDecoration(type, x, y) {
        const decoration = document.createElement('div');
        decoration.className = 'decoration';
        decoration.dataset.type = type;
        
        // Get emoji based on type
        const emojis = {
            'candle-pink': '🕯️',
            'candle-blue': '🔵',
            'candle-green': '🟢',
            'candle-gold': '🟡',
            'candle-rainbow': '🌈',
            'candle-number': '🎂',
            'strawberry': '🍓',
            'blueberry': '🫐',
            'cherry': '🍒',
            'chocolate': '🍫',
            'sprinkles': '✨',
            'frosting': '🧁',
            'balloon': '🎈',
            'gift': '🎁',
            'party': '🎉',
            'confetti': '🎊',
            'star': '⭐',
            'heart': '❤️'
        };
        
        decoration.textContent = emojis[type] || '🎂';
        decoration.style.left = x + 'px';
        decoration.style.top = y + 'px';
        
        // Make draggable
        this.makeDraggable(decoration);
        
        // Add click to select
        decoration.addEventListener('click', (e) => {
            e.stopPropagation();
            this.selectDecoration(decoration);
        });
        
        // Add delete on double click
        decoration.addEventListener('dblclick', () => {
            decoration.remove();
            this.decorations = this.decorations.filter(d => d !== decoration);
        });
        
        this.decorationZone.appendChild(decoration);
        this.decorations.push(decoration);
    }
    
    makeDraggable(element) {
        let isDragging = false;
        let currentX, currentY, initialX, initialY;
        
        element.addEventListener('mousedown', (e) => {
            if (e.target === element || element.contains(e.target)) {
                isDragging = true;
                element.classList.add('dragging');
                initialX = e.clientX - element.offsetLeft;
                initialY = e.clientY - element.offsetTop;
            }
        });
        
        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                e.preventDefault();
                currentX = e.clientX - initialX;
                currentY = e.clientY - initialY;
                
                const rect = this.decorationZone.getBoundingClientRect();
                currentX = Math.max(0, Math.min(currentX, rect.width - 40));
                currentY = Math.max(0, Math.min(currentY, rect.height - 40));
                
                element.style.left = currentX + 'px';
                element.style.top = currentY + 'px';
            }
        });
        
        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                element.classList.remove('dragging');
            }
        });
    }
    
    selectDecoration(decoration) {
        // Deselect previous
        if (this.selectedDecoration) {
            this.selectedDecoration.classList.remove('selected');
        }
        
        // Select new
        this.selectedDecoration = decoration;
        decoration.classList.add('selected');
        
        // Delete selected with Delete key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Delete' && this.selectedDecoration) {
                this.selectedDecoration.remove();
                this.decorations = this.decorations.filter(d => d !== this.selectedDecoration);
                this.selectedDecoration = null;
            }
        }, { once: true });
    }
    
    setupControls() {
        // Cake size
        const sizeSlider = document.getElementById('cakeSize');
        const sizeValue = document.getElementById('cakeSizeValue');
        sizeSlider.addEventListener('input', (e) => {
            this.settings.cakeSize = parseFloat(e.target.value);
            sizeValue.textContent = Math.round(this.settings.cakeSize * 100) + '%';
            this.cakeSvg.style.transform = `scale(${this.settings.cakeSize})`;
            this.cakeSvg.style.transformOrigin = 'center top';
        });
        
        // Cake flavor
        document.getElementById('cakeFlavor').addEventListener('change', (e) => {
            this.settings.cakeFlavor = e.target.value;
            this.updateCakeFlavor();
        });
        
        // Light button
        document.getElementById('lightBtn').addEventListener('click', () => {
            this.toggleLight();
        });
        
        // Glow effect
        document.getElementById('enableGlow').addEventListener('change', (e) => {
            this.settings.glowEnabled = e.target.checked;
            this.updateGlow();
        });
        
        // Flicker effect
        document.getElementById('enableAnimation').addEventListener('change', (e) => {
            this.settings.flickerEnabled = e.target.checked;
            this.updateFlicker();
        });
        
        // Clear button
        document.getElementById('clearBtn').addEventListener('click', () => {
            if (confirm('Clear all decorations?')) {
                this.decorations.forEach(dec => dec.remove());
                this.decorations = [];
                this.selectedDecoration = null;
            }
        });
        
        // Export button
        document.getElementById('exportBtn').addEventListener('click', () => {
            this.exportCake();
        });
    }
    
    setupInteractions() {
        // Click outside to deselect
        this.decorationZone.addEventListener('click', (e) => {
            if (e.target === this.decorationZone) {
                if (this.selectedDecoration) {
                    this.selectedDecoration.classList.remove('selected');
                    this.selectedDecoration = null;
                }
            }
        });
    }
    
    updateCakeFlavor() {
        this.cakeContainer.className = 'cake-container flavor-' + this.settings.cakeFlavor;
    }
    
    toggleLight() {
        this.isLit = !this.isLit;
        const glowEffect = document.getElementById('candleGlow');
        const flames = document.querySelectorAll('.flame');
        
        if (this.isLit) {
            glowEffect.style.opacity = '0.5';
            flames.forEach(flame => flame.style.display = 'block');
            if (this.settings.flickerEnabled) {
                this.startFlicker();
            }
        } else {
            glowEffect.style.opacity = '0';
            this.stopFlicker();
        }
    }
    
    updateGlow() {
        const glowEffect = document.getElementById('candleGlow');
        if (this.settings.glowEnabled && this.isLit) {
            glowEffect.style.opacity = '0.5';
        } else {
            glowEffect.style.opacity = '0';
        }
    }
    
    updateFlicker() {
        if (this.settings.flickerEnabled && this.isLit) {
            this.startFlicker();
        } else {
            this.stopFlicker();
        }
    }
    
    startFlicker() {
        this.stopFlicker();
        const flames = document.querySelectorAll('.flame');
        flames.forEach(flame => flame.classList.add('flickering'));
        
        this.glowInterval = setInterval(() => {
            const glowEffect = document.getElementById('candleGlow');
            const randomOpacity = 0.3 + Math.random() * 0.3;
            glowEffect.style.opacity = randomOpacity;
        }, 100);
    }
    
    stopFlicker() {
        if (this.glowInterval) {
            clearInterval(this.glowInterval);
            this.glowInterval = null;
        }
        const flames = document.querySelectorAll('.flame');
        flames.forEach(flame => flame.classList.remove('flickering'));
    }
    
    exportCake() {
        const canvas = document.createElement('canvas');
        canvas.width = 1200;
        canvas.height = 1500;
        const ctx = canvas.getContext('2d');
        
        // Draw background
        ctx.fillStyle = '#fff5f5';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw cake
        ctx.fillStyle = '#F5DEB3';
        // Bottom tier
        ctx.fillRect(200, 700, 800, 300);
        // Middle tier
        ctx.fillRect(300, 500, 600, 200);
        // Top tier
        ctx.fillRect(400, 350, 400, 150);
        
        // Draw decorations
        this.decorations.forEach(dec => {
            const rect = dec.getBoundingClientRect();
            const zoneRect = this.decorationZone.getBoundingClientRect();
            const x = (rect.left - zoneRect.left) * (canvas.width / zoneRect.width);
            const y = (rect.top - zoneRect.top) * (canvas.height / zoneRect.height);
            
            ctx.font = '60px Arial';
            ctx.fillText(dec.textContent, x, y);
        });
        
        // Convert to image and download
        canvas.toBlob((blob) => {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'birthday-cake.png';
            a.click();
            URL.revokeObjectURL(url);
        });
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new CakeDecorator();
});
