const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

// Serve static frontend files
app.use(express.static(__dirname));

// Mock Database: Simulating Telecommunication Network Devices
let networkDevices = [
    { id: "Router-Mum-01", name: "Mumbai Core Router", ip: "192.168.1.1", status: "Online", latency: 12, packetLoss: 0.1, bandwidth: 45 },
    { id: "Switch-Del-02", name: "Delhi Aggregation Switch", ip: "192.168.2.5", status: "Online", latency: 24, packetLoss: 0.4, bandwidth: 78 },
    { id: "Gateway-Blr-03", name: "Bangalore LTE Gateway", ip: "10.0.0.1", status: "Online", latency: 18, packetLoss: 0.0, bandwidth: 62 },
    { id: "Router-Nashik-04", name: "Nashik Edge Router", ip: "192.168.10.12", status: "Offline", latency: 0, packetLoss: 100.0, bandwidth: 0 }
];

// Helper function to simulate fluctuating network telemetry data
function updateNetworkMetrics() {
    networkDevices.forEach(device => {
        if (device.status === "Online") {
            // Simulate changing latency (RTT) and bandwidth typical in telecom networks
            device.latency = Math.max(5, Math.floor(device.latency + (Math.random() * 6 - 3)));
            device.packetLoss = Math.max(0, parseFloat((device.packetLoss + (Math.random() * 0.4 - 0.2)).toFixed(2)));
            device.bandwidth = Math.min(100, Math.max(10, Math.floor(device.bandwidth + (Math.random() * 10 - 5))));
            
            // Randomly trigger a temporary network glitch
            if (Math.random() > 0.95) device.status = "Warning";
        } else if (device.status === "Warning") {
            device.latency = Math.floor(Math.random() * 50 + 80); // High latency
            device.packetLoss = parseFloat((Math.random() * 5 + 4).toFixed(2)); // High packet loss
            if (Math.random() > 0.7) device.status = "Online"; // Recovers
        }
    });
}

// REST API Endpoint to fetch network health
app.get('/api/network-status', (req, res) => {
    updateNetworkMetrics(); // Dynamic data updates on every refresh/poll
    res.json(networkDevices);
});

// Route to serve the main frontend dashboard
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running successfully at http://localhost:${PORT}`);
});
