# Synthesus Enterprise Subsystem (Planetary OS)

The Synthesus Enterprise Subsystem is a native Linux overlay providing a unified Dashboard, Terminal Multiplexer, and AI Assistant bridge. It runs securely on the host kernel via PyBind11 and systemd, serving an immersive React-style vanilla JS frontend designed for system telemetry, cognitive orchestration, and root-level PTY access.

## Architecture
The subsystem is composed of two primary layers:

### 1. The Subsystem Frontend (`/frontend`)
An elegant, dynamic dashboard built with Vanilla JS, HTML5, and CSS3, previously styled with sci-fi elements but recently converted to professional enterprise terminology.
- **Hyperspace Aesthetics:** Features an animated starfield, warp effects, and a sleek dark-slate glassmorphism design.
- **Dynamic Window Management:** Draggable, resizable diagnostic windows for Predictive Telemetry, AI Orchestration (ONNX), File Explorer, and more.
- **Terminal Multiplexer:** Integrates `xterm.js` with full WebSocket support. Features a `[+]` button to dynamically spawn independent parallel terminal instances.

### 2. The Core Daemon (`/backend`)
A native Python background process (`aivm_core_daemon.py`) designed to interface with the `Synthesus Quadbrain` (a multi-agent ONNX routing engine) and manage system-level IPC operations.
- **Flask-Based Server:** Runs continuously via `aivm-daemon.service` on port 8080.
- **Dynamic PTY Generation:** Bypasses basic static terminals by multiplexing WebSocket connections (`/pty?session_id=...`). Each frontend tab requests a unique session, and the backend spins up an isolated `pty.fork()` bash shell.
- **AI Routing & Sandboxing:** Intercepts frontend chat messages, forwards them to the Quadbrain, and presents multi-step `TerminalActionPlan` payloads back to the frontend for Admin approval before native execution.

## Deployment & Installation

Because the Subsystem consists of a systemd daemon and web assets, a deployment script is provided to safely copy files to their active system paths.

1. **Modify Files Locally**: Edit your code inside this repository.
2. **Deploy to System**: Run the deploy script to push the repo files into the live Linux environment.

```bash
sudo ./install.sh
```

**What `install.sh` does:**
- Overwrites `/home/dakin/Synthesus_Desktop_Env` with the local `./frontend` folder.
- Copies `./backend/aivm_core_daemon.py` to `/opt/synthesus/sos_daemon/aivm_core_daemon.py`.
- Triggers a `systemctl daemon-reload` and restarts the `aivm-daemon` service to apply changes.

## License
Proprietary & Confidential - Synthesus Planetary OS
