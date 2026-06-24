import os
import sys
import pty
import asyncio
import threading
import subprocess
import select
from flask import Flask, send_from_directory, jsonify, request
from flask_cors import CORS
from flask_sock import Sock

# Load Synthesus Quadbrain
sys.path.append("/home/dakin/synthesus-ultra/packages")
for pkg in ["core", "reasoning", "knowledge", "kernel", "organs", "characters", "api"]:
    sys.path.append(f"/home/dakin/synthesus-ultra/packages/{pkg}")
try:
    from core.quadbrain_master import QuadbrainMaster
    quadbrain = QuadbrainMaster()
    kernel_status = "Synthesus QuadBrain Master: ONLINE & INTEGRATED (ROOT)"
except Exception as e:
    quadbrain = None
    kernel_status = f"Quadbrain Failed: {e}"

app = Flask(__name__, static_folder='/home/dakin/Synthesus_Desktop_Env')
CORS(app)
sock = Sock(app)

@app.route('/')
def serve_index():
    return send_from_directory('/home/dakin/Synthesus_Desktop_Env', 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory('/home/dakin/Synthesus_Desktop_Env', path)

@app.route('/api/system/status', methods=['GET'])
def get_status():
    return jsonify({
        "3way_drive_active": True,
        "peripheral_bridge_active": True,
        "llm_status": kernel_status
    })

@app.route('/api/system/reboot', methods=['POST'])
def reboot_system():
    # Kill the aivm-daemon to trigger an immediate restart via systemd
    subprocess.Popen(['systemctl', 'restart', 'aivm-daemon'])
    return jsonify({"status": "rebooting"})

@app.route('/api/chat', methods=['POST'])
def chat_with_llm():
    data = request.json
    intent_string = data.get('message', '')
    if quadbrain:
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        result = loop.run_until_complete(quadbrain.think(intent_string))
        loop.close()
        return jsonify({"response": result.get("answer", "No answer generated."), "os_plan": result.get("os_plan")})
    return jsonify({"response": "QuadBrain offline. Root mode active."})

@app.route('/api/os/approve', methods=['POST'])
def approve_os_plan():
    data = request.json
    try:
        from core.root_terminal import SafeRootTerminal, TerminalActionPlan
        t_plan = TerminalActionPlan(
            plan_id=data.get('plan_id', ''),
            intent=data.get('intent', ''),
            commands=data.get('commands', []),
            expected_outcome=data.get('expected_outcome', ''),
            sandbox_verified=data.get('sandbox_verified', False),
            sandbox_logs=data.get('sandbox_logs', ''),
            admin_approved=True  # Explicit approval
        )
        safe_terminal = SafeRootTerminal(ws_url="ws://127.0.0.1:8080/pty")
        
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        
        # 1. Take Rollback Snapshot
        snapshot_success = loop.run_until_complete(safe_terminal.create_rollback_checkpoint(t_plan))
        if not snapshot_success:
            loop.close()
            return jsonify({"status": "error", "message": "Failed to create Timeshift rollback snapshot! Aborting execution for safety."})
            
        # 2. Execute natively
        loop.run_until_complete(safe_terminal.execute_live(t_plan))
        loop.close()
        return jsonify({"status": "success", "message": "Plan executed successfully."})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)})

@app.route('/api/ide/files', methods=['GET'])
def list_files():
    base_dir = os.path.expanduser('~dakin') # Show Dakin's home
    def build_tree(dir_path, depth=0):
        if depth > 1: return []
        tree = []
        try:
            for item in os.listdir(dir_path):
                if item.startswith('.'): continue
                full_path = os.path.join(dir_path, item)
                if os.path.isdir(full_path):
                    tree.append({"name": item, "type": "dir", "children": build_tree(full_path, depth+1)})
                else:
                    tree.append({"name": item, "type": "file"})
        except Exception:
            pass
        return tree
    return jsonify([{"name": "Host OS User Directory", "type": "dir", "children": build_tree(base_dir)}])

pty_sessions = {}

@app.route('/api/terminal/resize', methods=['POST'])
def resize_pty():
    global pty_sessions
    data = request.json
    session_id = data.get('session_id', 'default')
    master_fd = pty_sessions.get(session_id)
    
    if master_fd is None:
        return jsonify({"status": "error", "message": "PTY not connected"})
    
    cols = data.get('cols', 80)
    rows = data.get('rows', 24)
    
    try:
        import struct, fcntl, termios
        winsize = struct.pack("HHHH", rows, cols, 0, 0)
        fcntl.ioctl(master_fd, termios.TIOCSWINSZ, winsize)
        return jsonify({"status": "success"})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)})

# --- PTY WEB SOCKET BRIDGE ---
@sock.route('/pty')
def pty_shell(ws):
    global pty_sessions
    session_id = request.args.get('session_id', 'default')
    import fcntl
    import termios
    import struct
    
    # Create pseudo-terminal
    master, slave = pty.openpty()
    pty_sessions[session_id] = master
    
    # Set terminal size to 80 cols, 24 rows so TUIs don't render 0x0
    winsize = struct.pack("HHHH", 24, 80, 0, 0)
    fcntl.ioctl(master, termios.TIOCSWINSZ, winsize)
    
    # Set terminal environment
    env = os.environ.copy()
    env['TERM'] = 'xterm-256color'
    env['HOME'] = '/root'
    
    # Spawn bash
    p = subprocess.Popen(
        ['/bin/bash', '-i'],
        preexec_fn=os.setsid,
        stdin=slave,
        stdout=slave,
        stderr=slave,
        env=env,
        cwd='/root'
    )
    os.close(slave)
    
    import codecs
    decoder = codecs.getincrementaldecoder('utf8')('replace')
    
    def read_from_pty():
        while p.poll() is None:
            r, _, _ = select.select([master], [], [], 0.1)
            if r:
                try:
                    output = os.read(master, 1024)
                    if output:
                        text = decoder.decode(output)
                        if text:
                            ws.send(text)
                except OSError:
                    break
                    
    # Start thread to read from PTY and send to WebSocket
    t = threading.Thread(target=read_from_pty, daemon=True)
    t.start()
    
    # Read from WebSocket and write to PTY
    try:
        while p.poll() is None:
            data = ws.receive()
            if data is None:
                break
            os.write(master, data.encode('utf-8'))
    except Exception:
        pass
    finally:
        try:
            p.terminate()
            os.close(master)
            if session_id in pty_sessions:
                del pty_sessions[session_id]
        except Exception:
            pass

if __name__ == '__main__':
    # Listen on all interfaces to act as the God-Mode backend
    app.run(host='0.0.0.0', port=8080, debug=False, use_reloader=False)
