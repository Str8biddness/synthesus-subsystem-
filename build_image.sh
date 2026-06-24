#!/bin/bash
# build_image.sh - Package AIVM Planetary OS for Grid Resource Nodes

echo "📦 Building Unified System Image for AIVM Grid Node..."

# Create staging directory
rm -rf /tmp/aivm-node-image
mkdir -p /tmp/aivm-node-image/opt_synthesus/sos_daemon/plugins
mkdir -p /tmp/aivm-node-image/home_dakin/Synthesus_Desktop_Env
mkdir -p /tmp/aivm-node-image/etc_systemd_system

# Copy Backend Core & Plugins
echo "-> Packaging Core Daemon..."
cp /home/dakin/aivm-planetary-os/backend/aivm_core_daemon.py /tmp/aivm-node-image/opt_synthesus/sos_daemon/
cp /home/dakin/aivm-planetary-os/backend/plugins/*.py /tmp/aivm-node-image/opt_synthesus/sos_daemon/plugins/

# Copy Frontend
echo "-> Packaging UI Shell..."
cp -r /home/dakin/aivm-planetary-os/frontend/* /tmp/aivm-node-image/home_dakin/Synthesus_Desktop_Env/

# Copy Systemd Service
echo "-> Packaging System Services..."
cp /etc/systemd/system/aivm-daemon.service /tmp/aivm-node-image/etc_systemd_system/

# Create a node_deploy.sh script inside the image
cat << 'EOF' > /tmp/aivm-node-image/node_deploy.sh
#!/bin/bash
echo "Installing AIVM Unified Image on new Node..."
mkdir -p /opt/synthesus/sos_daemon
mkdir -p /home/dakin/Synthesus_Desktop_Env

cp -r ./opt_synthesus/sos_daemon/* /opt/synthesus/sos_daemon/
cp -r ./home_dakin/Synthesus_Desktop_Env/* /home/dakin/Synthesus_Desktop_Env/
cp ./etc_systemd_system/aivm-daemon.service /etc/systemd/system/

chown -R root:root /opt/synthesus/
chown -R dakin:dakin /home/dakin/Synthesus_Desktop_Env/

systemctl daemon-reload
systemctl enable aivm-daemon
systemctl start aivm-daemon
echo "Node Online."
EOF
chmod +x /tmp/aivm-node-image/node_deploy.sh

# Compress
echo "-> Compressing Unified Image..."
cd /tmp
tar -czf aivm-planetary-os-node.tar.gz aivm-node-image/
mv aivm-planetary-os-node.tar.gz /home/dakin/aivm-planetary-os/

echo "✅ Unified System Image successfully built at: /home/dakin/aivm-planetary-os/aivm-planetary-os-node.tar.gz"
