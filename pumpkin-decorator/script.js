// Halloween Pumpkin Decorator
class PumpkinDecorator {
    constructor() {
        this.pumpkinContainer = document.getElementById('pumpkinContainer');
        this.decorationZone = document.getElementById('decorationZone');
        this.pumpkinSvg = document.getElementById('pumpkinSvg');
        this.decorations = [];
        this.selectedDecoration = null;
        this.draggedElement = null;
        this.glowInterval = null;
        this.isLit = false;
        
        this.settings = {
            pumpkinSize: 1,
            pumpkinColor: 'orange',
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
            'eye-triangle': '🔺',
            'eye-square': '⬛',
            'eye-circle': '⭕',
            'nose-triangle': '🔻',
            'nose-circle': '⚫',
            'mouth-smile': '😊',
            'mouth-toothy': '😬',
            'mouth-frown': '😮',
            'spider': '🕷️',
            'web': '🕸️',
            'bat': '🦇',
            'ghost': '👻',
            'skull': '💀',
            'bone': '🦴',
            'candy': '🍬',
            'candy-corn': '🌽'
        };
        
        decoration.textContent = emojis[type] || '🎃';
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
        // Pumpkin size
        const sizeSlider = document.getElementById('pumpkinSize');
        const sizeValue = document.getElementById('pumpkinSizeValue');
        sizeSlider.addEventListener('input', (e) => {
            this.settings.pumpkinSize = parseFloat(e.target.value);
            sizeValue.textContent = Math.round(this.settings.pumpkinSize * 100) + '%';
            this.pumpkinSvg.style.transform = `scale(${this.settings.pumpkinSize})`;
            this.pumpkinSvg.style.transformOrigin = 'center top';
        });
        
        // Pumpkin color
        document.getElementById('pumpkinColor').addEventListener('change', (e) => {
            this.settings.pumpkinColor = e.target.value;
            this.updatePumpkinColor();
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
        document.getElementById('enableFlicker').addEventListener('change', (e) => {
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
            this.exportPumpkin();
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
    
    updatePumpkinColor() {
        this.pumpkinContainer.className = 'pumpkin-container pumpkin-' + this.settings.pumpkinColor;
    }
    
    toggleLight() {
        this.isLit = !this.isLit;
        const glowEffect = document.getElementById('glowEffect');
        
        if (this.isLit) {
            glowEffect.style.opacity = '0.6';
            if (this.settings.flickerEnabled) {
                this.startFlicker();
            }
        } else {
            glowEffect.style.opacity = '0';
            this.stopFlicker();
        }
    }
    
    updateGlow() {
        if (this.settings.glowEnabled && this.isLit) {
            document.getElementById('glowEffect').style.opacity = '0.6';
        } else {
            document.getElementById('glowEffect').style.opacity = '0';
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
        this.glowInterval = setInterval(() => {
            const glowEffect = document.getElementById('glowEffect');
            const randomOpacity = 0.3 + Math.random() * 0.5;
            glowEffect.style.opacity = randomOpacity;
        }, 100);
    }
    
    stopFlicker() {
        if (this.glowInterval) {
            clearInterval(this.glowInterval);
            this.glowInterval = null;
        }
    }
    
    exportPumpkin() {
        const canvas = document.createElement('canvas');
        canvas.width = 1200;
        canvas.height = 1350;
        const ctx = canvas.getContext('2d');
        
        // Draw background
        ctx.fillStyle = '#1a1a2e';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw pumpkin
        ctx.fillStyle = '#FF7518';
        ctx.beginPath();
        ctx.ellipse(600, 700, 350, 300, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw stem
        ctx.fillStyle = '#2D5016';
        ctx.beginPath();
        ctx.moveTo(580, 410);
        ctx.quadraticCurveTo(570, 350, 600, 320);
        ctx.quadraticCurveTo(630, 350, 620, 410);
        ctx.fill();
        
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
            a.download = 'halloween-pumpkin.png';
            a.click();
            URL.revokeObjectURL(url);
        });
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new PumpkinDecorator();
});
