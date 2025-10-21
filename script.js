// Game State
let gameState = {
    money: 0,
    casesOpened: 0,
    totalValue: 0,
    clickValue: 1,
    inventory: [],
    upgrades: {
        autoClicker: { level: 0, cost: 50, multiplier: 1 },
        clickPower: { level: 0, cost: 100, multiplier: 2 },
        luckBoost: { level: 0, cost: 500, multiplier: 1.5 }
    }
};

const cases = [
    {
        id: 1,
        name: "Basic Case",
        icon: "📦",
        price: 10,
        items: [
            { name: "AK-47 | Redline", rarity: "classified", price: 50, icon: "🔫" },
            { name: "M4A4 | Asiimov", rarity: "covert", price: 100, icon: "🔫" },
            { name: "AWP | Dragon Lore", rarity: "covert", price: 150, icon: "🔫" },
            { name: "Glock-18 | Water", rarity: "consumer", price: 5, icon: "🔫" },
            { name: "USP-S | Guardian", rarity: "milspec", price: 15, icon: "🔫" },
            { name: "P90 | Asiimov", rarity: "restricted", price: 30, icon: "🔫" },
            { name: "Desert Eagle | Blaze", rarity: "restricted", price: 35, icon: "🔫" },
            { name: "Knife | Karambit", rarity: "knife", price: 500, icon: "🔪" }
        ]
    },
    {
        id: 2,
        name: "Premium Case",
        icon: "💎",
        price: 50,
        items: [
            { name: "AK-47 | Fire Serpent", rarity: "covert", price: 200, icon: "🔫" },
            { name: "M4A1-S | Hyper Beast", rarity: "covert", price: 180, icon: "🔫" },
            { name: "AWP | Medusa", rarity: "covert", price: 300, icon: "🔫" },
            { name: "Glock-18 | Fade", rarity: "classified", price: 80, icon: "🔫" },
            { name: "Desert Eagle | Golden Koi", rarity: "classified", price: 90, icon: "🔫" },
            { name: "P250 | Nuclear Threat", rarity: "industrial", price: 40, icon: "🔫" },
            { name: "Five-SeveN | Case Hardened", rarity: "milspec", price: 25, icon: "🔫" },
            { name: "Knife | Butterfly", rarity: "knife", price: 800, icon: "🔪" }
        ]
    },
    {
        id: 3,
        name: "Elite Case",
        icon: "👑",
        price: 150,
        items: [
            { name: "AK-47 | Wild Lotus", rarity: "covert", price: 500, icon: "🔫" },
            { name: "M4A4 | Howl", rarity: "covert", price: 600, icon: "🔫" },
            { name: "AWP | Gungnir", rarity: "covert", price: 700, icon: "🔫" },
            { name: "Glock-18 | Gamma Doppler", rarity: "classified", price: 150, icon: "🔫" },
            { name: "USP-S | Kill Confirmed", rarity: "classified", price: 120, icon: "🔫" },
            { name: "P90 | Death by Kitty", rarity: "restricted", price: 100, icon: "🔫" },
            { name: "Desert Eagle | Printstream", rarity: "classified", price: 130, icon: "🔫" },
            { name: "Knife | Talon", rarity: "knife", price: 1500, icon: "🔪" }
        ]
    }
];

// Upgrades Data
const upgradesData = [
    {
        id: 'autoClicker',
        name: 'Auto Clicker',
        icon: '🤖',
        description: 'Kiếm tiền tự động mỗi giây',
        baseCost: 50,
        costMultiplier: 1.5,
        effect: (level) => level * 1
    },
    {
        id: 'clickPower',
        name: 'Click Power',
        icon: '💪',
        description: 'Tăng tiền mỗi click',
        baseCost: 100,
        costMultiplier: 2,
        effect: (level) => level * 2
    },
    {
        id: 'luckBoost',
        name: 'Luck Boost',
        icon: '🍀',
        description: 'Tăng cơ hội nhận item hiếm',
        baseCost: 500,
        costMultiplier: 3,
        effect: (level) => level * 0.5
    }
];

// Rarity chances
const rarityChances = {
    consumer: 0.799,
    industrial: 0.159,
    milspec: 0.032,
    restricted: 0.0064,
    classified: 0.0032,
    covert: 0.0006,
    knife: 0.0002
};

// Load game from localStorage
function loadGame() {
    const saved = localStorage.getItem('caseClickerSave');
    if (saved) {
        gameState = JSON.parse(saved);
    }
    updateUI();
}

// Save game to localStorage
function saveGame() {
    localStorage.setItem('caseClickerSave', JSON.stringify(gameState));
}

// Update UI
function updateUI() {
    document.getElementById('money').textContent = Math.floor(gameState.money).toLocaleString();
    document.getElementById('casesOpened').textContent = gameState.casesOpened.toLocaleString();
    document.getElementById('totalValue').textContent = Math.floor(gameState.totalValue).toLocaleString();
    document.getElementById('clickValue').textContent = gameState.clickValue;
    document.getElementById('inventoryCount').textContent = gameState.inventory.length;
    
    updateCasesUI();
    updateInventoryUI();
    updateUpgradesUI();
}

// Create money particle effect
function createMoneyParticle(x, y, amount) {
    const particle = document.createElement('div');
    particle.className = 'money-particle';
    particle.textContent = `+${amount}$`;
    particle.style.left = x + 'px';
    particle.style.top = y + 'px';
    document.body.appendChild(particle);
    
    setTimeout(() => {
        particle.remove();
    }, 1000);
}

// Click button handler
document.getElementById('clickBtn').addEventListener('click', function(e) {
    gameState.money += gameState.clickValue;
    createMoneyParticle(e.clientX, e.clientY, gameState.clickValue);
    updateUI();
    saveGame();
});

// Render cases
function updateCasesUI() {
    const casesGrid = document.getElementById('casesGrid');
    casesGrid.innerHTML = '';
    
    cases.forEach(caseData => {
        const caseCard = document.createElement('div');
        caseCard.className = 'case-card';
        caseCard.innerHTML = `
            <div class="case-icon">${caseData.icon}</div>
            <div class="case-name">${caseData.name}</div>
            <div class="case-price">${caseData.price}$</div>
            <button class="open-case-btn" 
                    ${gameState.money < caseData.price ? 'disabled' : ''} 
                    data-case-id="${caseData.id}">
                Mở Case
            </button>
        `;
        casesGrid.appendChild(caseCard);
    });
    
    // Add event listeners
    document.querySelectorAll('.open-case-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const caseId = parseInt(this.dataset.caseId);
            openCase(caseId);
        });
    });
}

// Open case function
function openCase(caseId) {
    const caseData = cases.find(c => c.id === caseId);
    if (!caseData || gameState.money < caseData.price) return;
    
    
    gameState.money -= caseData.price;
    gameState.casesOpened++;
    
    // Show opening animation
    const openingSection = document.getElementById('openingSection');
    openingSection.style.display = 'flex';
    
    // Generate reel items
    const reel = document.getElementById('reel');
    reel.innerHTML = '';
    
    const items = [];
    for (let i = 0; i < 50; i++) {
        items.push(getRandomItem(caseData.items));
    }
    
    // Add winner item at specific position
    const winnerItem = getRandomItemByRarity(caseData.items);
    items[45] = winnerItem;
    
    items.forEach(item => {
        const reelItem = document.createElement('div');
        reelItem.className = `reel-item rarity-${item.rarity}`;
        reelItem.innerHTML = `
            <div style="font-size: 2em;">${item.icon}</div>
            <div class="reel-item-name">${item.name}</div>
            <div class="reel-item-price">${item.price}$</div>
        `;
        reel.appendChild(reelItem);
    });
    
    // Animate reel
    setTimeout(() => {
        const offset = -(45 * 150) + (window.innerWidth / 2) - 75;
        reel.style.left = offset + 'px';
    }, 100);
    
    // Close animation and add to inventory
    setTimeout(() => {
        openingSection.style.display = 'none';
        addToInventory(winnerItem);
        updateUI();
        saveGame();
        
        // Reset reel
        reel.style.transition = 'none';
        reel.style.left = '0';
        setTimeout(() => {
            reel.style.transition = 'left 3s cubic-bezier(0.25, 0.1, 0.25, 1)';
        }, 50);
    }, 3500);
    
    updateUI();
}

// Get random item based on rarity
function getRandomItemByRarity(items) {
    const luckMultiplier = 1 + (gameState.upgrades.luckBoost.level * 0.1);
    const rand = Math.random() / luckMultiplier;
    
    let cumulative = 0;
    for (const [rarity, chance] of Object.entries(rarityChances)) {
        cumulative += chance;
        if (rand <= cumulative) {
            const rarityItems = items.filter(item => item.rarity === rarity);
            if (rarityItems.length > 0) {
                return rarityItems[Math.floor(Math.random() * rarityItems.length)];
            }
        }
    }
    
    return items[0];
}

// Get random item (for reel)
function getRandomItem(items) {
    return items[Math.floor(Math.random() * items.length)];
}

// Add item to inventory
function addToInventory(item) {
    gameState.inventory.push({
        ...item,
        id: Date.now() + Math.random()
    });
    gameState.totalValue += item.price;
}

function updateInventoryUI() {
    const inventoryGrid = document.getElementById('inventoryGrid');
    
    if (gameState.inventory.length === 0) {
        inventoryGrid.innerHTML = '<p class="empty-inventory">Chưa có item nào. Hãy mở case!</p>';
        return;
    }
    
    inventoryGrid.innerHTML = '';
    
    gameState.inventory.forEach(item => {
        const invItem = document.createElement('div');
        invItem.className = `inventory-item rarity-${item.rarity}`;
        invItem.innerHTML = `
            <div class="inventory-item-icon">${item.icon}</div>
            <div class="inventory-item-name">${item.name}</div>
            <div class="inventory-item-price">${item.price}$</div>
        `;
        invItem.addEventListener('click', () => sellItem(item.id));
        inventoryGrid.appendChild(invItem);
    });
}

// Sell single item
function sellItem(itemId) {
    const itemIndex = gameState.inventory.findIndex(item => item.id === itemId);
    if (itemIndex === -1) return;
    
    const item = gameState.inventory[itemIndex];
    gameState.money += item.price;
    gameState.totalValue -= item.price;
    gameState.inventory.splice(itemIndex, 1);
    
    updateUI();
    saveGame();
}

// Sell all items
document.getElementById('sellAllBtn').addEventListener('click', () => {
    if (gameState.inventory.length === 0) return;
    
    gameState.inventory.forEach(item => {
        gameState.money += item.price;
    });
    
    gameState.inventory = [];
    gameState.totalValue = 0;
    
    updateUI();
    saveGame();
});

// Update upgrades UI
function updateUpgradesUI() {
    const upgradesGrid = document.getElementById('upgradesGrid');
    upgradesGrid.innerHTML = '';
    
    upgradesData.forEach(upgrade => {
        const level = gameState.upgrades[upgrade.id].level;
        const cost = Math.floor(upgrade.baseCost * Math.pow(upgrade.costMultiplier, level));
        
        const upgradeCard = document.createElement('div');
        upgradeCard.className = 'upgrade-card';
        upgradeCard.innerHTML = `
            <div class="upgrade-icon">${upgrade.icon}</div>
            <div class="upgrade-name">${upgrade.name}</div>
            <div class="upgrade-description">${upgrade.description}</div>
            <div class="upgrade-level">Level: ${level}</div>
            <div class="upgrade-cost">Cost: ${cost.toLocaleString()}$</div>
            <button class="buy-upgrade-btn" 
                    ${gameState.money < cost ? 'disabled' : ''}
                    data-upgrade-id="${upgrade.id}">
                Nâng cấp
            </button>
        `;
        upgradesGrid.appendChild(upgradeCard);
    });
    
    // Add event listeners
    document.querySelectorAll('.buy-upgrade-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const upgradeId = this.dataset.upgradeId;
            buyUpgrade(upgradeId);
        });
    });
}

// Buy upgrade
function buyUpgrade(upgradeId) {
    const upgrade = upgradesData.find(u => u.id === upgradeId);
    if (!upgrade) return;
    
    const level = gameState.upgrades[upgradeId].level;
    const cost = Math.floor(upgrade.baseCost * Math.pow(upgrade.costMultiplier, level));
    
    if (gameState.money < cost) return;
    
    gameState.money -= cost;
    gameState.upgrades[upgradeId].level++;
    
    // Update click value
    if (upgradeId === 'clickPower') {
        gameState.clickValue = 1 + upgrade.effect(gameState.upgrades[upgradeId].level);
    }
    
    updateUI();
    saveGame();
}

// Auto clicker functionality
setInterval(() => {
    const autoClickLevel = gameState.upgrades.autoClicker.level;
    if (autoClickLevel > 0) {
        const autoClickUpgrade = upgradesData.find(u => u.id === 'autoClicker');
        gameState.money += autoClickUpgrade.effect(autoClickLevel);
        updateUI();
        saveGame();
    }
}, 1000);

// Auto save every 10 seconds
setInterval(() => {
    saveGame();
}, 10000);

// Initialize game
function initGame() {
    loadGame();
    updateUI();
}

// Start game when page loads
window.addEventListener('load', initGame);

// Reset game function (optional - for debugging)
function resetGame() {
    if (confirm('Bạn có chắc muốn reset game? Tất cả tiến trình sẽ bị mất!')) {
        localStorage.removeItem('caseClickerSave');
        gameState = {
            money: 0,
            casesOpened: 0,
            totalValue: 0,
            clickValue: 1,
            inventory: [],
            upgrades: {
                autoClicker: { level: 0, cost: 50, multiplier: 1 },
                clickPower: { level: 0, cost: 100, multiplier: 2 },
                luckBoost: { level: 0, cost: 500, multiplier: 1.5 }
            }
        };
        updateUI();
        alert('Game đã được reset!');
    }
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Space bar for clicking
    if (e.code === 'Space') {
        e.preventDefault();
        document.getElementById('clickBtn').click();
    }
    
    // Press 1, 2, 3 to open cases
    if (e.key === '1' && gameState.money >= cases<a href="" class="citation-link" target="_blank" style="vertical-align: super; font-size: 0.8em; margin-left: 3px;">[0]</a>.price) {
        openCase(1);
    }
    if (e.key === '2' && gameState.money >= cases<a href="" class="citation-link" target="_blank" style="vertical-align: super; font-size: 0.8em; margin-left: 3px;">[1]</a>.price) {
        openCase(2);
    }
    if (e.key === '3' && gameState.money >= cases<a href="" class="citation-link" target="_blank" style="vertical-align: super; font-size: 0.8em; margin-left: 3px;">[2]</a>.price) {
        openCase(3);
    }
    
    // Press S to sell all
    if (e.key === 's' || e.key === 'S') {
        document.getElementById('sellAllBtn').click();
    }
});

// Prevent context menu on buttons
document.addEventListener('contextmenu', (e) => {
    if (e.target.tagName === 'BUTTON') {
        e.preventDefault();
    }
});

// Add visual feedback for clicks
document.getElementById('clickBtn').addEventListener('mousedown', function() {
    this.style.transform = 'translateY(0) scale(0.95)';
});

document.getElementById('clickBtn').addEventListener('mouseup', function() {
    this.style.transform = '';
});

// Bonus: Daily reward system
function checkDailyReward() {
    const lastReward = localStorage.getItem('lastDailyReward');
    const today = new Date().toDateString();
    
    if (lastReward !== today) {
        const bonus = 100;
        gameState.money += bonus;
        localStorage.setItem('lastDailyReward', today);
        
        // Show notification
        alert(`🎁 Phần thưởng hàng ngày: +${bonus}$`);
        updateUI();
        saveGame();
    }
}

// Check daily reward on load
setTimeout(checkDailyReward, 1000);

// Console commands for debugging (optional)
window.addMoney = (amount) => {
    gameState.money += amount;
    updateUI();
    saveGame();
    console.log(`Added ${amount}$ to your balance`);
};

window.resetGameData = resetGame;

console.log('%c🎮 CS:GO Case Clicker', 'font-size: 20px; color: #ffd700; font-weight: bold;');
console.log('%cGame loaded successfully!', 'color: #4ade80;');
console.log('%cTips:', 'color: #ffd700; font-weight: bold;');
console.log('- Press SPACE to click');
console.log('- Press 1, 2, 3 to open cases');
console.log('- Press S to sell all items');
console.log('%cDebug commands:', 'color: #ff6b6b; font-weight: bold;');
console.log('- addMoney(amount) - Add money');
console.log('- resetGameData() - Reset game');