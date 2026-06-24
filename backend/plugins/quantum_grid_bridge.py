import subprocess
import random

class HardwareGridBridge:
    def __init__(self):
        pass

    def get_quantum_state(self):
        """Returns simulated or real qubit coherence metrics."""
        return {
            "qubit_coherence": round(random.uniform(0.85, 0.99), 4),
            "entanglement_fidelity": round(random.uniform(0.80, 0.98), 4),
            "status": "stable"
        }

    def get_grid_nodes(self):
        """Returns active Grid nodes."""
        return [
            {"node_id": "grid_node_alpha", "status": "active"},
            {"node_id": "grid_node_beta", "status": "active"},
            {"node_id": "grid_node_gamma", "status": "standby"}
        ]

    def get_android_devices(self):
        """Runs adb devices and parses output to return connected Android endpoints."""
        devices = []
        try:
            # Run the adb devices command
            result = subprocess.run(
                ["adb", "devices"],
                capture_output=True,
                text=True,
                check=True
            )
            
            # Parse the output
            lines = result.stdout.strip().split('\n')
            # The first line is usually "List of devices attached"
            for line in lines[1:]:
                parts = line.split()
                # A device line typically looks like "emulator-5554    device"
                if len(parts) >= 2:
                    devices.append({
                        "device_id": parts[0],
                        "status": parts[1]
                    })
        except Exception as e:
            print(f"Error getting android devices: {e}")
            
        return devices
