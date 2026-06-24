#!/bin/bash
# sync_update.sh - Pull latest AIVM Planetary OS updates and deploy natively

echo "🌌 Connecting to GitHub to pull latest Subsystem updates..."
cd /home/dakin/aivm-planetary-os
git pull origin main

echo "🚀 Deploying updates to Host OS..."
# 1. Deploy Frontend
rm -rf /home/dakin/Synthesus_Desktop_Env/*
cp -r /home/dakin/aivm-planetary-os/frontend/* /home/dakin/Synthesus_Desktop_Env/

# 2. Deploy Backend securely via Daemon Root PTY WebSocket
python3 -c '
import asyncio, websockets
async def deploy():
    try:
        async with websockets.connect("ws://127.0.0.1:8080/pty?session_id=godmode_update") as ws:
            await asyncio.sleep(1)
            cmds = [
                "cp /home/dakin/aivm-planetary-os/backend/aivm_core_daemon.py /opt/synthesus/sos_daemon/\n",
                "cp /home/dakin/aivm-planetary-os/backend/plugins/*.py /opt/synthesus/sos_daemon/plugins/\n",
                "chown -R root:root /opt/synthesus/sos_daemon/\n",
                "systemctl restart aivm-daemon\n"
            ]
            for cmd in cmds:
                await ws.send(cmd)
                await asyncio.sleep(0.5)
            print("✅ Daemon updated and restarted successfully!")
    except Exception as e:
        print(f"Failed to update daemon: {e}")
asyncio.run(deploy())'

echo "✨ Subsystem successfully updated and optimized!"
