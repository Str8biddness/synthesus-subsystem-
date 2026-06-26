#!/bin/bash
# AIVM Planetary OS - Automated Deployment Script

echo "🌌 Initializing AIVM Planetary OS Installation..."

if [ "$EUID" -ne 0 ]; then
  echo "❌ Please run as root (sudo ./install.sh)"
  exit 1
fi

echo "📦 Installing Dependencies..."
apt-get update -y
apt-get install -y python3-pip python3-venv git g++ xdotool
pip3 install flask flask-sock psutil websockets --break-system-packages

echo "🔧 Setting up the AIVM Daemon..."
cat << 'EOF' > /etc/systemd/system/aivm-daemon.service
[Unit]
Description=AIVM Planetary OS Root Daemon
After=network.target

[Service]
ExecStart=/usr/bin/python3 /opt/synthesus/sos_daemon/aivm_core_daemon.py
WorkingDirectory=/opt/synthesus/sos_daemon
Restart=always
User=root

[Install]
WantedBy=multi-user.target
EOF

mkdir -p /opt/synthesus/sos_daemon
cp backend/aivm_core_daemon.py /opt/synthesus/sos_daemon/

echo "🛠️ Compiling Peripheral Bridge..."
g++ backend/cluster_node.cpp -o /opt/synthesus/cluster_node
chmod +x /opt/synthesus/cluster_node

systemctl daemon-reload
systemctl enable aivm-daemon.service
systemctl restart aivm-daemon.service

echo "🖥️ Setting up the UI..."
chmod +x node
ln -sf $(pwd)/node /usr/local/bin/node

echo "✅ AIVM Planetary OS Installation Complete!"
echo "To access the God-Mode Subsystem locally, open a browser and navigate to:"
echo "👉 http://127.0.0.1:8080"
echo "To link a Resource Node, go to your second machine, clone this repo, and type: node"
