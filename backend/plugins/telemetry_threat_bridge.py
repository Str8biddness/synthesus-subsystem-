import os
import time
import socket
import json
import logging
import threading
import hmac
import hashlib
import shutil
from typing import Dict, Any, List, Optional
from pathlib import Path

logger = logging.getLogger(__name__)

class TelemetryThreatBridge:
    """
    Standalone plugin exposing:
    - Real system CPU/Mem/Disk + Twin stats.
    - Active GhostNet P2P threats and Immune System anomalies.
    """
    def __init__(self, 
                 ghostnet_port: int = 20260, 
                 node_id: str = "ghostkey_primary", 
                 secret_key: str = "GHOSTKEY_INSECURE_DEFAULT",
                 immune_root_dir: str = ".", 
                 signature_file: str = "data/immune_signatures.json"):
        
        # --- Telemetry config ---
        self.proc_root = Path("/proc")
        self.sys_root = Path("/sys")

        # --- GhostNet config ---
        self.port = ghostnet_port
        self.node_id = node_id
        self.secret_key = secret_key.encode('utf-8')
        self.known_threats: Dict[str, Dict[str, Any]] = {} 
        self.peers: Dict[str, Dict[str, Any]] = {} 
        self.incidents: List[Dict[str, Any]] = [] 
        self.ghostnet_running = False
        
        try:
            self.sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
            self.sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
            if hasattr(socket, "SO_REUSEPORT"):
                self.sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEPORT, 1)
            self.sock.setsockopt(socket.SOL_SOCKET, socket.SO_BROADCAST, 1)
            self.sock.bind(('', self.port))
            self.sock.settimeout(1.0)
        except PermissionError as e:
            self.sock = None
            logger.warning(f"GhostNet: UDP socket unavailable: {e}")
        except Exception as e:
            self.sock = None
            logger.error(f"GhostNet: Failed to bind port {self.port}: {e}")

        # --- Immune System config ---
        self.immune_root_dir = os.path.abspath(immune_root_dir)
        self.signature_file = os.path.join(self.immune_root_dir, signature_file)
        self.critical_files = [
            "core/quadbrain_master.py",
            "core/conscious_state.py",
            "core/consciousness_integrator.py",
            "core/tools/security.py",
            "core/tools/baseliner.py",
            "core/tools/immune_system.py",
            "core/tools/ghost_net.py",
            "../projects/ghostkey_quadbrain/backend.py"
        ]
        self.baseline_hashes = self._load_signatures()
        
        # Start GhostNet listener and heartbeat
        self.start_ghostnet()

    # ==========================================
    #             TELEMETRY LOGIC
    # ==========================================
    def get_live_diagnostics(self) -> Dict[str, Any]:
        metrics: Dict[str, float] = {}
        
        # Memory Stats
        meminfo = self.proc_root / "meminfo"
        if meminfo.exists():
            parsed = {}
            for line in meminfo.read_text(encoding="utf-8", errors="ignore").splitlines():
                parts = line.split()
                if len(parts) >= 2:
                    try:
                        parsed[parts[0].rstrip(":")] = float(parts[1])
                    except ValueError:
                        pass
            total_kb = parsed.get("MemTotal")
            available_kb = parsed.get("MemAvailable", parsed.get("MemFree"))
            if total_kb:
                metrics["live_ram_total_gb"] = total_kb / 1024.0 / 1024.0
            if available_kb:
                metrics["live_ram_available_gb"] = available_kb / 1024.0 / 1024.0
            if total_kb and available_kb:
                metrics["live_ram_used_ratio"] = max(0.0, min(1.0, 1.0 - (available_kb / total_kb)))
                
        # CPU Stats
        cpuinfo = self.proc_root / "cpuinfo"
        metrics["live_cpu_count"] = float(os.cpu_count() or 0)
        if cpuinfo.exists():
            mhz_values = []
            for line in cpuinfo.read_text(encoding="utf-8", errors="ignore").splitlines():
                if line.startswith("cpu MHz"):
                    try:
                        mhz_values.append(float(line.split(":", 1)[1].strip()))
                    except (IndexError, ValueError):
                        pass
            if mhz_values:
                metrics["live_cpu_avg_mhz"] = sum(mhz_values) / len(mhz_values)
                metrics["live_cpu_max_mhz"] = max(mhz_values)
                
        # Disk Stats
        try:
            usage = shutil.disk_usage("/")
            metrics["live_disk_total_gb"] = usage.total / (1024**3)
            metrics["live_disk_used_gb"] = usage.used / (1024**3)
            metrics["live_disk_free_gb"] = usage.free / (1024**3)
        except Exception:
            pass
            
        metrics["captured_monotonic"] = time.monotonic()
        
        return {
            "source": "telemetry_threat_bridge",
            "metrics": metrics,
            "twin_stats": {"status": "Operational", "sync": True},
            "tags": ["hardware", "runtime", "live", "disk", "twin"]
        }

    # ==========================================
    #             GHOSTNET LOGIC
    # ==========================================
    def start_ghostnet(self):
        if self.ghostnet_running:
            return
        self.ghostnet_running = True
        threading.Thread(target=self._listen_loop, daemon=True).start()
        threading.Thread(target=self._heartbeat_loop, daemon=True).start()

    def stop_ghostnet(self):
        self.ghostnet_running = False
        if self.sock is not None:
            self.sock.close()

    def _sign_message(self, message: Dict[str, Any]) -> str:
        msg_str = json.dumps(message, sort_keys=True)
        return hmac.new(self.secret_key, msg_str.encode('utf-8'), hashlib.sha256).hexdigest()

    def _verify_signature(self, message: Dict[str, Any], signature: str) -> bool:
        expected = self._sign_message(message)
        return hmac.compare_digest(expected, signature)

    def _broadcast(self, data: Dict[str, Any], msg_type: str):
        if not self.ghostnet_running or self.sock is None:
            return
        body = {
            "version": "1.2",
            "sender_id": self.node_id,
            "type": msg_type,
            "data": data,
            "timestamp": time.time()
        }
        envelope = {
            "body": body,
            "signature": self._sign_message(body)
        }
        try:
            payload = json.dumps(envelope).encode('utf-8')
            self.sock.sendto(payload, ('<broadcast>', self.port))
        except Exception as e:
            logger.error(f"GhostNet broadcast failed: {e}")

    def _heartbeat_loop(self):
        while self.ghostnet_running:
            self._broadcast({"status": "active"}, "peer_alive")
            now = time.time()
            self.peers = {k: v for k, v in self.peers.items() if now - v.get('last_seen', 0) < 30}
            time.sleep(10)

    def _listen_loop(self):
        while self.ghostnet_running:
            if self.sock is None:
                time.sleep(1)
                continue
            try:
                data, addr = self.sock.recvfrom(16384)
                envelope = json.loads(data.decode('utf-8'))
                body = envelope.get("body")
                signature = envelope.get("signature")
                
                if not body or not signature:
                    continue
                if not self._verify_signature(body, signature):
                    continue
                if body.get("sender_id") == self.node_id:
                    continue
                
                msg_type = body.get("type")
                sender_id = body.get("sender_id")
                
                if msg_type == "peer_alive":
                    self.peers[sender_id] = {
                        "last_seen": time.time(),
                        "addr": addr[0],
                        "status": "authenticated"
                    }
                elif msg_type == "threat_alert":
                    threat_data = body.get("data", {})
                    threat_key = f"{threat_data.get('threat_type')}:{threat_data.get('threat_value')}"
                    self.known_threats[threat_key] = threat_data
                elif msg_type == "incident_sync":
                    incident = body.get("data", {})
                    self.incidents.append(incident)
            except socket.timeout:
                continue
            except Exception:
                pass

    def get_recent_external_threats(self) -> List[str]:
        return list(self.known_threats.keys())

    # ==========================================
    #           IMMUNE SYSTEM LOGIC
    # ==========================================
    def _hash_file(self, filepath: str) -> Optional[str]:
        hasher = hashlib.sha256()
        try:
            with open(filepath, 'rb') as f:
                for chunk in iter(lambda: f.read(4096), b""):
                    hasher.update(chunk)
            return hasher.hexdigest()
        except FileNotFoundError:
            return None
        except Exception:
            return None

    def _load_signatures(self) -> Dict[str, str]:
        if os.path.exists(self.signature_file):
            try:
                with open(self.signature_file, "r") as f:
                    return json.load(f)
            except Exception:
                return {}
        return {}

    def save_signatures(self) -> None:
        new_hashes = {}
        for rel_path in self.critical_files:
            abs_path = os.path.join(self.immune_root_dir, rel_path)
            file_hash = self._hash_file(abs_path)
            if file_hash:
                new_hashes[rel_path] = file_hash
        
        os.makedirs(os.path.dirname(self.signature_file), exist_ok=True)
        with open(self.signature_file, "w") as f:
            json.dump(new_hashes, f, indent=2)
        self.baseline_hashes = new_hashes

    def check_integrity(self) -> List[str]:
        if not self.baseline_hashes:
            self.save_signatures()
            return []
            
        anomalies = []
        for rel_path in self.critical_files:
            abs_path = os.path.join(self.immune_root_dir, rel_path)
            current_hash = self._hash_file(abs_path)
            baseline_hash = self.baseline_hashes.get(rel_path)
            
            if baseline_hash is None and current_hash is not None:
                anomalies.append(f"Untracked critical file detected: {rel_path}")
            elif baseline_hash is not None and current_hash is None:
                anomalies.append(f"Critical file missing/deleted: {rel_path}")
            elif baseline_hash != current_hash:
                anomalies.append(f"INTEGRITY COMPROMISED: {rel_path} has been modified!")
        return anomalies

    # ==========================================
    #         COMBINED BRIDGE INTERFACE
    # ==========================================
    def get_threat_anomalies(self) -> Dict[str, Any]:
        """Returns active GhostNet P2P threats and Immune System anomalies."""
        return {
            "active_p2p_threats": self.get_recent_external_threats(),
            "immune_system_anomalies": self.check_integrity()
        }
