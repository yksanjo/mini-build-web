// Easter Egg Decorator
class EggDecorator {
    constructor() {
        this.eggContainer = document.getElementById('eggContainer');
        this.decorationZone = document.getElementById('decorationZone');
        this.eggSvg = document.getElementById('eggSvg');
        this.decorations = [];
        this.selectedDecoration = null;
        this.draggedElement = null;
        this.selectedColor = '#FF6B6B';
        
        this.settings = {
            eggSize: 1,
            eggColor: 'natural'
        };
        
        this.init();
    }
    
    init() {
        this.setupDragAndDrop();
        this.setupControls();
        this.setupColorPicker();
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
            'stripes': '〰️',
            'zigzag': '⚡',
            'dots': '🔴',
            'spirals': '🌀',
            'flowers': '🌸',
            'chevron': '🏾',
            'bunny': '🐰',
            'chick': '🐣',
            'carrot': '🥕',
            'basket': '🧺',
            'egg': '🥚',
            'tulip': '🌷',
            'butterfly': '🦋',
            'rainbow': '🌈',
            'sparkle': '✨',
            'star': '⭐',
            'heart': '❤️',
            'flower': '🌼',
            'ribbon': '🎀',
            'bow': '🎀'
        };
        
        decoration.textContent = emojis[type] || '🥚';
        decoration.style.left = x + 'px';
        decoration.style.top = y + 'px';
        
        // Apply selected color
        decoration.style.color = this.selectedColor;
        
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
        // Egg size
        const sizeSlider = document.getElementById('eggSize');
        const sizeValue = document.getElementById('eggSizeValue');
        sizeSlider.addEventListener('input', (e) => {
            this.settings.eggSize = parseFloat(e.target.value);
            sizeValue.textContent = Math.round(this.settings.eggSize * 100) + '%';
            this.eggSvg.style.transform = `scale(${this.settings.eggSize})`;
            this.eggSvg.style.transformOrigin = 'center top';
        });
        
        // Egg color
        document.getElementById('eggColor').addEventListener('change', (e) => {
            this.settings.eggColor = e.target.value;
            this.updateEggColor();
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
            this.exportEgg();
        });
    }
    
    setupColorPicker() {
        const colorSwatches = document.querySelectorAll('.color-swatch');
        
        colorSwatches.forEach(swatch => {
            swatch.addEventListener('click', () => {
                // Remove selected class from all
                colorSwatches.forEach(s => s.classList.remove('selected'));
                // Add to clicked
                swatch.classList.add('selected');
                // Update selected color
                this.selectedColor = swatch.dataset.color;
            });
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
    
    updateEggColor() {
        this.eggContainer.className = 'egg-container color-' + this.settings.eggColor;
    }
    
    exportEgg() {
        const canvas = document.createElement('canvas');
        canvas.width = 900;
        canvas.height = 1200;
        const ctx = canvas.getContext('2d');
        
        // Draw background
        ctx.fillStyle = '#e0f7fa';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw egg
        ctx.fillStyle = '#F5DEB3';
        ctx.beginPath();
        ctx.ellipse(450, 550, 250, 350, 0, 0, Math.PI * 2);
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
            a.download = 'easter-egg.png';
            a.click();
            URL.revokeObjectURL(url);
        });
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new EggDecorator();
});
