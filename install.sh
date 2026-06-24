#!/bin/bash
# install.sh - Deploys the AIVM Planetary OS Subsystem
if [ "$EUID" -ne 0 ]; then 
  echo "Please run as root (sudo ./install.sh)"
  exit 1
fi

echo "Installing AIVM Planetary OS Subsystem..."

# 1. Update Frontend
echo "Deploying Frontend to /home/dakin/Synthesus_Desktop_Env..."
rm -rf /home/dakin/Synthesus_Desktop_Env
cp -r ./frontend /home/dakin/Synthesus_Desktop_Env
chown -R dakin:dakin /home/dakin/Synthesus_Desktop_Env

# 2. Update Backend
echo "Deploying Backend to /opt/synthesus/sos_daemon..."
mkdir -p /opt/synthesus/sos_daemon
cp ./backend/aivm_core_daemon.py /opt/synthesus/sos_daemon/aivm_core_daemon.py
chown -R root:root /opt/synthesus/sos_daemon/

# 3. Restart Daemon
echo "Restarting aivm-daemon service..."
systemctl daemon-reload
systemctl restart aivm-daemon

echo "Installation complete. Backend daemon restarted successfully."
