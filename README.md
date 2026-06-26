# 🌌 AIVM Planetary OS: God-Mode Subsystem

**A Browser-Native, Air-Gapped Single System Image (SSI) for AI Compute Clusters.**

[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)
[![Status: Active](https://img.shields.io/badge/Status-Active-brightgreen.svg)]()

The AIVM Planetary OS is a zero-installation abstraction layer that physically merges multiple isolated Linux machines into a **Single System Image (SSI)** across an air-gapped local network. It operates entirely via WebSockets and the browser, bypassing the need for invasive Linux kernel modifications.

---

## 🔥 Features

### 1. Browser-Native Virtual Peripheral Bridge (Edge-Hopping)
Seamlessly bridge your physical mouse across multiple monitors connected to entirely different computers. No `pynput`, no Wayland conflicts, and no X11 crashes. 
* Hover over the glowing blue "Hop Zone" on your Master Node and click.
* Your cursor instantly unlocks and traverses to the physical screen of your Resource Node.

### 2. Unified Resource Pool (Telemetry Engine)
Stop monitoring servers individually. The God-Mode UI continuously polls live telemetry from across your entire distributed network (CPU Cores, RAM, Disk, MHz) and mathematically combines it into a single Dashboard.

### 3. God-Mode WebSocket Terminal
A highly secure, browser-native PTY (Pseudo-Terminal) environment that routes through the `aivm-daemon`. Execute bash scripts, launch neural tasks, and manage your cluster completely from the God-Mode UI.

### 4. Zero-Friction Worker Deployment
Connecting a new machine to your compute cluster takes precisely one word: `node`. 
The worker instantly slaves its physical monitor to the Master Node's Grid WebSocket.

---

## 🚀 Installation & Deployment

### 1. Master Node Setup
Run the automated installation script on your primary machine:

```bash
git clone https://github.com/Str8biddness/synthesus-subsystem-.git
cd synthesus-subsystem-
sudo chmod +x install.sh
sudo ./install.sh
```

**Access the UI:** Open a browser (Chrome/Firefox) and navigate to `http://127.0.0.1:8080`.

### 2. Resource Node (Worker) Setup
To slave a second machine to the Master Node and establish a contiguous desktop:
1. Ensure the Resource Node is on the same local network (e.g., `192.168.x.x`).
2. Run the deployment script on the Resource Node:

```bash
git clone https://github.com/Str8biddness/synthesus-subsystem-.git
cd synthesus-subsystem-
sudo chmod +x install.sh
sudo ./install.sh
```
3. Type the launch command in the terminal:
```bash
node
```
*The Resource Node will instantly open a full-screen browser, connect to the Master Node, and merge the UIs into a contiguous God-Mode Desktop.*

---

## 🛡️ License & Commercial Use

This software is released under the **GNU General Public License v3.0 (GPL-3.0)**. 
Any modifications or derivative works must be made open-source. For commercial enterprise licensing, white-labeling, or Acqui-hire inquiries, please contact the author directly.

---
*Welcome to God-Mode.*
