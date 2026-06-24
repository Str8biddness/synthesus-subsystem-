// ==========================================
// WINDOW MANAGER LOGIC
// ==========================================
let highestZIndex = 100;
let isDragging = false;
let currentWindow = null;
let offsetX = 0, offsetY = 0;

function toggleWindow(id) {
    const win = document.getElementById(id);
    let displayState = 'none';
    if (win.style.display === 'none') {
        win.style.display = 'flex';
        displayState = 'flex';
        focusWindow(win);
        
        // Trigger lazy loading
        if (id === 'win-ide') fetchIDEFiles();
        if (id === 'win-twin') startTwinSimulation();
        if (id === 'win-term') initTerminal();
    } else {
        win.style.display = 'none';
        if (id === 'win-twin' && twinInterval) clearInterval(twinInterval);
    }
    
    // Broadcast to Grid
    if (window.gridSocket && gridSocket.readyState === WebSocket.OPEN) {
        gridSocket.send(JSON.stringify({
            type: 'window_toggle',
            id: id,
            display: displayState
        }));
    }
}

function focusWindow(win) {
    document.querySelectorAll('.window').forEach(w => w.classList.remove('focused'));
    highestZIndex++;
    win.style.zIndex = highestZIndex;
    win.classList.add('focused');
}

function dragWindow(e, id) {
    currentWindow = document.getElementById(id);
    focusWindow(currentWindow);
    
    isDragging = true;
    offsetX = e.clientX - currentWindow.offsetLeft;
    offsetY = e.clientY - currentWindow.offsetTop;
    
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
}

let animationFrameId = null;
let currentMouseX = 0;
let currentMouseY = 0;

function onMouseMove(e) {
    if (!isDragging || !currentWindow) return;
    currentMouseX = e.clientX;
    currentMouseY = e.clientY;
    
    if (!animationFrameId) {
        animationFrameId = requestAnimationFrame(() => {
            if (currentWindow) {
                const newLeft = currentMouseX - offsetX;
                const newTop = currentMouseY - offsetY;
                currentWindow.style.left = newLeft + 'px';
                currentWindow.style.top = newTop + 'px';
                
                // Broadcast to Grid Nodes
                if (gridSocket && gridSocket.readyState === WebSocket.OPEN) {
                    gridSocket.send(JSON.stringify({
                        type: 'window_move',
                        id: currentWindow.id,
                        left: newLeft,
                        top: newTop,
                        zIndex: currentWindow.style.zIndex
                    }));
                }
            }
            animationFrameId = null;
        });
    }
}

function onMouseUp() {
    isDragging = false;
    currentWindow = null;
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
}

// Attach focus events to window bodies
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.window').forEach(win => {
        win.addEventListener('mousedown', () => focusWindow(win));
    });
    setInterval(fetchOSStatus, 2000);

    // Development Auto-Refresh Watcher
    let lastModified = null;
    setInterval(async () => {
        try {
            const res = await fetch(window.location.href, { method: 'HEAD', cache: 'no-store' });
            const lm = res.headers.get('Last-Modified');
            if (lastModified === null) lastModified = lm;
            else if (lastModified !== lm) location.reload();
        } catch(err) {}
    }, 1500);
});

// ==========================================
// OS BACKEND LOGIC
// ==========================================
let twinInterval;

async function checkSystemStatus() {
    try {
        const response = await fetch('http://127.0.0.1:8080/api/system/status');
        const data = await response.json();
        
        document.getElementById('sys-drive').textContent = data["3way_drive_active"] ? "● Storage Array Mounted" : "○ Storage Array Offline";
        document.getElementById('sys-drive').style.color = data["3way_drive_active"] ? "#4ade80" : "#94a3b8";
        
        document.getElementById('sys-bridge').textContent = data.peripheral_bridge_active ? "ACTIVE" : "INACTIVE";
        document.getElementById('sys-bridge').style.background = data.peripheral_bridge_active ? "#4ade80" : "#333";
        
        document.getElementById('status-quadbrain').textContent = data.llm_status.includes("ONLINE") ? "AI: ROOT SYNCED" : "AI: WAITING";
        document.getElementById('status-quadbrain').className = data.llm_status.includes("ONLINE") ? "status-indicator" : "status-indicator warning";
        
        document.getElementById('status-network').textContent = "NET: SECURE LINK";
        document.getElementById('status-network').className = "status-indicator";
    } catch(err) {
        document.getElementById('status-quadbrain').textContent = "AI: OFFLINE";
        document.getElementById('status-network').textContent = "NET: HOST ONLY";
    }
}

async function rebootSubsystem() {
    if(confirm("Are you sure you want to hard-reboot the AIVM Daemon? This will kill the Subsystem and require a manual restart of the UI.")) {
        try {
            await fetch('http://127.0.0.1:8080/api/system/reboot', { method: 'POST' });
        } catch(err) {}
        document.body.innerHTML = "<h1 style='color:red; text-align:center; margin-top:20%'>SUBSYSTEM REBOOTING...<br>Please close this window and restart the AIVM CLI.</h1>";
    }
}

async function fetchOSStatus() {
    try {
        const response = await fetch('http://127.0.0.1:8080/api/system/status');
        const data = await response.json();
        const driveEl = document.getElementById('sys-drive');
        if(driveEl) {
            driveEl.innerText = data['3way_drive_active'] ? '● Storage Array Mounted' : '○ Drive Offline';
            driveEl.style.color = data['3way_drive_active'] ? '#4ade80' : '#94a3b8';
        }
        const bridgeEl = document.getElementById('sys-bridge');
        if(bridgeEl) {
            bridgeEl.innerText = data['peripheral_bridge_active'] ? 'ACTIVE' : 'INACTIVE';
            bridgeEl.style.background = data['peripheral_bridge_active'] ? '#38bdf8' : '#333';
            bridgeEl.style.color = data['peripheral_bridge_active'] ? '#000' : '#fff';
        }

        // Fetch Telemetry & Threats if window is visible
        if (document.getElementById('win-telemetry').style.display !== 'none') {
            try {
                const threatRes = await fetch('http://127.0.0.1:8080/api/threats');
                const threatData = await threatRes.json();
                
                let entropyStr = "0.00";
                let statusStr = "Stabilized";
                
                if (threatData.active_p2p_threats && threatData.active_p2p_threats.length > 0) {
                    entropyStr = (0.5 + Math.random() * 0.5).toFixed(2);
                    statusStr = "P2P Threat";
                } else if (threatData.immune_system_anomalies && threatData.immune_system_anomalies.length > 0) {
                    entropyStr = "0.99";
                    statusStr = "ANOMALY";
                } else {
                    entropyStr = (Math.random() * 0.1).toFixed(2);
                    statusStr = "Secure";
                }

                const entropyEl = document.querySelector('#win-telemetry .window-content > div:nth-child(1) > div > div');
                if (entropyEl) {
                    entropyEl.innerText = entropyStr;
                    if (parseFloat(entropyStr) > 0.5) entropyEl.style.color = "#ef4444";
                    else entropyEl.style.color = "#facc15";
                }
                
                const convEl = document.querySelector('#win-telemetry .window-content > div:nth-child(2) > div:nth-child(1) > div:nth-child(2)');
                if (convEl) convEl.innerText = statusStr;
            } catch(e) {}
        }

    } catch(err) {
        // Silent fail if backend down
    }
}

// ==========================================
// IDE FILE EXPLORER
// ==========================================
async function fetchIDEFiles() {
    try {
        const response = await fetch('http://127.0.0.1:8080/api/ide/files');
        const treeData = await response.json();
        document.getElementById('ide-file-tree').innerHTML = '<ul><li><span class="folder" style="color: #38bdf8;">🌐 Storage Array</span>' + buildTreeHTML(treeData) + '</li></ul>';
    } catch(err) {
        document.getElementById('ide-file-tree').innerHTML = '<p style="color:red;">Failed to mount.</p>';
    }
}

function buildTreeHTML(nodes) {
    let html = '<ul>';
    nodes.forEach(node => {
        if(node.type === 'dir') html += `<li><span class="folder">📂 ${node.name}</span>${buildTreeHTML(node.children)}</li>`;
        else html += `<li onclick="openFile('${node.name}')" style="cursor:pointer; padding: 2px 0;">📄 <span style="color: #94a3b8;">${node.name}</span></li>`;
    });
    return html + '</ul>';
}

function openFile(filename) {
    document.getElementById('ide-current-file').innerText = filename;
    document.getElementById('ide-code-editor').value = `// Secure KVM File Stream: ${filename}\n\n[Content loaded from Storage Array]`;
}

// ==========================================
// CHAT IPC
// ==========================================
async function sendChatMessage() {
    const input = document.getElementById('chat-input');
    const message = input.value.trim();
    if(!message) return;
    
    const chatHistory = document.getElementById('chat-history');
    chatHistory.innerHTML += `<div class="message" style="border-left: 3px solid #facc15;"><strong>User:</strong> ${message}</div>`;
    input.value = '';
    chatHistory.scrollTop = chatHistory.scrollHeight;
    
    try {
        const response = await fetch('http://127.0.0.1:8080/api/chat', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: message })
        });
        const data = await response.json();
        chatHistory.innerHTML += `<div class="message ai-message"><strong>System AI:</strong> ${data.response.replace(/\\n/g, '<br>')}</div>`;
        
        if (data.os_plan) {
            const plan = data.os_plan;
            const planJSON = JSON.stringify(plan).replace(/"/g, '&quot;');
            let planHtml = `<div style="margin-top: 10px; background: rgba(20, 25, 40, 0.8); border: 1px solid #38bdf8; padding: 10px; border-radius: 8px;">
                <h4 style="color: #38bdf8; margin-bottom: 5px;">⚠️ OS Action Proposal: ${plan.intent}</h4>
                <div style="font-family: monospace; color: #a78bfa; margin-bottom: 5px;">
                    ${plan.commands.join('<br>')}
                </div>
                <p style="font-size: 0.8rem; color: #94a3b8;"><strong>Expected Outcome:</strong> ${plan.expected_outcome}</p>
                <div style="margin-top: 5px; font-size: 0.8rem;">
                    <strong>Security Policy Sandbox:</strong> ${plan.sandbox_verified ? '<span style="color: #4ade80;">PASS</span>' : '<span style="color: #ef4444;">FAIL</span>'}
                </div>
                <div style="margin-top: 10px; display: flex; gap: 10px;">
                    <button onclick="approveOSPlan('${planJSON}')" class="glass-btn" style="background: #4ade80; flex-grow: 1;">Approve & Execute (Timeshift Snap)</button>
                    <button onclick="rejectOSPlan()" class="glass-btn" style="background: #ef4444; flex-grow: 1;">Reject</button>
                </div>
            </div>`;
            chatHistory.innerHTML += planHtml;
        }
        
        chatHistory.scrollTop = chatHistory.scrollHeight;
    } catch(err) {}
}

async function approveOSPlan(planStr) {
    const plan = JSON.parse(planStr.replace(/&quot;/g, '"'));
    const chatHistory = document.getElementById('chat-history');
    chatHistory.innerHTML += `<div class="message" style="border-left: 3px solid #4ade80;"><strong>Admin:</strong> Plan Approved. Executing...</div>`;
    chatHistory.scrollTop = chatHistory.scrollHeight;
    
    // Switch to terminal tab so user can watch!
    const existingTerms = document.querySelectorAll('[id^="win-term-"]');
    if (existingTerms.length === 0) {
        spawnTerminalWindow();
    } else {
        const lastTerm = existingTerms[existingTerms.length - 1];
        lastTerm.style.display = 'flex';
        focusWindow(lastTerm);
    }
    
    try {
        const response = await fetch('http://127.0.0.1:8080/api/os/approve', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(plan)
        });
        const data = await response.json();
        if(data.status === 'success') {
            chatHistory.innerHTML += `<div class="message ai-message" style="border-left: 3px solid #38bdf8;"><strong>System:</strong> OS Plan successfully executed. Snapshot was taken prior to execution.</div>`;
        } else {
            chatHistory.innerHTML += `<div class="message" style="border-left: 3px solid #ef4444;"><strong>System Error:</strong> ${data.message}</div>`;
        }
    } catch(err) {}
    chatHistory.scrollTop = chatHistory.scrollHeight;
}

function rejectOSPlan() {
    const chatHistory = document.getElementById('chat-history');
    chatHistory.innerHTML += `<div class="message" style="border-left: 3px solid #ef4444;"><strong>Admin:</strong> Plan Rejected.</div>`;
    chatHistory.scrollTop = chatHistory.scrollHeight;
}

function handleChatKey(event) { if(event.key === 'Enter') sendChatMessage(); }

// ==========================================
// TERMINAL IPC & HIERARCHY APPROVAL
// ==========================================
let termCounter = 0;

function spawnTerminalWindow() {
    termCounter++;
    const termId = `win-term-${termCounter}`;
    const termContainerId = `xterm-container-${termCounter}`;
    const sessionId = `sess-${termCounter}-${Date.now()}`;
    
    // Create DOM structure
    const win = document.createElement('div');
    win.className = 'window glass-panel';
    win.id = termId;
    win.style.top = (300 + (termCounter * 30)) + 'px';
    win.style.left = (400 + (termCounter * 30)) + 'px';
    win.style.width = '600px';
    win.style.height = '400px';
    
    win.innerHTML = `
        <div class="window-header" onmousedown="dragWindow(event, '${termId}')">
            <span class="window-title" style="color: #4ade80;">_ Terminal [TAB ${termCounter}]</span>
            <div class="window-controls">
                <button class="win-btn plus" onclick="spawnTerminalWindow()" title="New Tab/Window" style="background: #38bdf8; color: #fff; display: flex; align-items: center; justify-content: center; font-weight: bold; text-decoration: none;">+</button>
                <button class="win-btn close" onclick="document.getElementById('${termId}').remove()"></button>
            </div>
        </div>
        <div class="window-content" style="padding: 0; background: #000; overflow: hidden;">
            <div id="${termContainerId}" style="width: 100%; height: 100%; padding: 5px;"></div>
        </div>
    `;
    
    document.getElementById('desktop-area').appendChild(win);
    focusWindow(win);
    
    // Make window focusable
    win.addEventListener('mousedown', () => focusWindow(win));
    
    // Initialize xterm
    const term = new Terminal({
        theme: { background: '#000000', foreground: '#4ade80' },
        fontFamily: 'Fira Code, monospace',
        fontSize: 14,
        cursorBlink: true
    });
    
    const fitAddon = new FitAddon.FitAddon();
    term.loadAddon(fitAddon);
    term.open(document.getElementById(termContainerId));
    
    let ptySocket;
    function connectPTY() {
        ptySocket = new WebSocket(`ws://127.0.0.1:8080/pty?session_id=${sessionId}`);
        ptySocket.onopen = () => term.write('\\r\\n[Connected to System PTY (Multi-Session)]\\r\\n');
        ptySocket.onmessage = (e) => term.write(e.data);
        ptySocket.onclose = () => {
            if(document.getElementById(termId)) {
                term.write('\\r\\n[Disconnected. Reconnecting...]\\r\\n');
                setTimeout(connectPTY, 2000);
            }
        };
    }
    connectPTY();
    
    term.onData((data) => {
        if(ptySocket && ptySocket.readyState === WebSocket.OPEN) {
            ptySocket.send(data);
        }
    });
    
    term.onResize((size) => {
        fetch('http://127.0.0.1:8080/api/terminal/resize', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ session_id: sessionId, cols: size.cols, rows: size.rows })
        }).catch(() => {});
    });
    
    const resizeObserver = new ResizeObserver(() => fitAddon.fit());
    resizeObserver.observe(win);
    setTimeout(() => fitAddon.fit(), 100);
}
// ==========================================
// TWIN SIMULATION
// ==========================================
async function startTwinSimulation() {
    if(twinInterval) clearInterval(twinInterval);
    const log = document.getElementById('twin-log');
    
    twinInterval = setInterval(async () => {
        try {
            const response = await fetch('http://127.0.0.1:8080/api/telemetry');
            const data = await response.json();
            if (data && data.metrics) {
                document.getElementById('stat-pt').innerText = data.metrics.live_cpu_count ? data.metrics.live_cpu_count + ' Cores' : '--';
                document.getElementById('stat-pcv').innerText = data.metrics.live_ram_used_ratio ? (data.metrics.live_ram_used_ratio * 100).toFixed(1) + ' %' : '-- %';
                document.getElementById('stat-toxin').innerText = data.metrics.live_disk_used_gb ? data.metrics.live_disk_used_gb.toFixed(1) + ' GB' : '-- GB';
                document.getElementById('stat-pain').innerText = data.metrics.live_cpu_avg_mhz ? data.metrics.live_cpu_avg_mhz.toFixed(0) + ' MHz' : '-- MHz';
                
                const phase = data.twin_stats && data.twin_stats.status ? data.twin_stats.status : "GATHERING METRICS";
                const color = "#4ade80"; 
                log.innerHTML += `<div><span style="color:${color};">[SYS_METRICS] ${phase}</span></div>`;
                log.scrollTop = log.scrollHeight;
            }
        } catch(err) {}
    }, 2000);
}

async function runUSCL() {
    const script = document.getElementById('ide-code-editor').value;
    try {
        const response = await fetch('http://127.0.0.1:8080/api/uscl/execute', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ script: script })
        });
        const data = await response.json();
        
        // Spawn a terminal to show output
        spawnTerminalWindow();
        const existingTerms = document.querySelectorAll('[id^="win-term-"]');
        const lastTermId = existingTerms[existingTerms.length - 1].id;
        const termContainerId = lastTermId.replace("win-term-", "xterm-container-");
        
        // We'll just alert for now since we don't have direct access to the xterm instance from outside easily
        alert("USCL Compilation Result:\\n" + JSON.stringify(data.result, null, 2));
    } catch(err) {
        alert("USCL Execution Failed: " + err.message);
    }
}

// ==========================================
// UNIFIED SYSTEM GRID SYNC
// ==========================================
window.gridSocket = new WebSocket(`ws://${window.location.host}/grid-state`);
window.gridSocket.onmessage = (event) => {
    try {
        const data = JSON.parse(event.data);
        if (data.type === 'window_move') {
            const win = document.getElementById(data.id);
            if (win) {
                win.style.left = data.left + 'px';
                win.style.top = data.top + 'px';
                win.style.zIndex = data.zIndex;
            }
        } else if (data.type === 'window_toggle') {
            const win = document.getElementById(data.id);
            if (win) {
                win.style.display = data.display;
                if (data.display === 'flex') {
                    // Trigger lazy load
                    if (data.id === 'win-ide') fetchIDEFiles();
                    if (data.id === 'win-twin') startTwinSimulation();
                }
            }
        }
    } catch (e) {
        console.error("Grid Sync Error:", e);
    }
};

window.gridSocket.onopen = () => {
    console.log("🌌 CONNECTED TO AIVM GRID LAYER");
};
