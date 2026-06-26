#include <iostream>
#include <string>
#include <sstream>
#include <vector>
#include <thread>
#include <chrono>
#include <cstring>
#include <unistd.h>
#include <sys/socket.h>
#include <netinet/in.h>
#include <arpa/inet.h>

// AIVM Port Configuration
const int PORT = 7878;

int main() {
    // 1. Initialize UDP Socket
    int sock = socket(AF_INET, SOCK_DGRAM, 0);
    int reuse = 1;
    setsockopt(sock, SOL_SOCKET, SO_REUSEADDR, &reuse, sizeof(reuse));
#ifdef SO_REUSEPORT
    setsockopt(sock, SOL_SOCKET, SO_REUSEPORT, &reuse, sizeof(reuse));
#endif

    sockaddr_in addr{};
    addr.sin_family = AF_INET;
    addr.sin_port = htons(PORT);
    addr.sin_addr.s_addr = INADDR_ANY;

    // 2. Bind Socket to Port 7878
    if (bind(sock, (sockaddr*)&addr, sizeof(addr)) < 0) {
        std::cerr << "[ERR] Failed to bind worker network interface handle: " << strerror(errno) << std::endl;
        return 1;
    }

    std::cout << "[NET] Neural Mesh node online. Awaiting Swarm Pulse on port " << PORT << "..." << std::endl;

    char buffer[16384];
    while (true) {
        sockaddr_in client_addr{};
        socklen_t addr_len = sizeof(client_addr);
        int bytes_received = recvfrom(sock, buffer, sizeof(buffer), 0, (sockaddr*)&client_addr, &addr_len);
        
        if (bytes_received > 0) {
            std::string packet(buffer, bytes_received);
            
            // 3. Peripheral Sync Handler (AIVM Native KVM)
            if (packet.find("MOUSE_SYNC") != std::string::npos ||
                packet.find("KEY_SYNC") != std::string::npos ||
                packet.find("MOUSE_CLICK") != std::string::npos) {
                
                // Open a persistent pipe to xdotool to execute commands with sub-millisecond latency
                static FILE* xdotool_pipe = nullptr;
                if (!xdotool_pipe) {
                    xdotool_pipe = popen("xdotool -", "w");
                }
                if (!xdotool_pipe) continue;
                
                // Handle Mouse Movement: MOUSE_SYNC|X:10|Y:-5
                if (packet.find("MOUSE_SYNC") != std::string::npos) {
                    int x = 0, y = 0;
                    std::stringstream ss(packet);
                    std::string item;
                    while (std::getline(ss, item, '|')) {
                        if (item.find("X:") == 0) x = std::stoi(item.substr(2));
                        else if (item.find("Y:") == 0) y = std::stoi(item.substr(2));
                    }
                    if (x != 0 || y != 0) {
                        fprintf(xdotool_pipe, "mousemove_relative -- %d %d\n", x, y);
                        fflush(xdotool_pipe);
                    }
                }
                // Handle Keyboard Input: KEY_SYNC|KEY:space
                else if (packet.find("KEY_SYNC") != std::string::npos) {
                    std::string key = "";
                    std::stringstream ss(packet);
                    std::string item;
                    while (std::getline(ss, item, '|')) {
                        if (item.find("KEY:") == 0) key = item.substr(4);
                    }
                    if (!key.empty()) {
                        std::cout << "[KVM] Received Key: " << key << std::endl;
                        fprintf(xdotool_pipe, "key %s\n", key.c_str());
                        fflush(xdotool_pipe);
                    }
                }
                // Handle Mouse Click: MOUSE_CLICK|BUTTON:1
                else if (packet.find("MOUSE_CLICK") != std::string::npos) {
                    int btn = 1;
                    std::stringstream ss(packet);
                    std::string item;
                    while (std::getline(ss, item, '|')) {
                        if (item.find("BUTTON:") == 0) btn = std::stoi(item.substr(7));
                    }
                    std::cout << "[KVM] Received Mouse Click: " << btn << std::endl;
                    fprintf(xdotool_pipe, "click %d\n", btn);
                    fflush(xdotool_pipe);
                }
            }
        }
    }
    close(sock);
    return 0;
}
