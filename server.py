import socket
import http.server
import socketserver
import os

PORT = 7777
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

def get_network_ips():
    ips = []
    try:
        hostname = socket.gethostname()
        for ip in socket.gethostbyname_ex(hostname)[2]:
            if not ip.startswith('127.'):
                ips.append(ip)
    except Exception:
        pass
    return ips

class SignageHTTPHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def end_headers(self):
        # Enable CORS and disable restrictive caching for kiosk usage
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Cache-Control', 'no-cache, must-revalidate')
        super().end_headers()

if __name__ == '__main__':
    # Allow socket address reuse so restarting doesn't hit TIME_WAIT
    socketserver.TCPServer.allow_reuse_address = True
    
    ips = get_network_ips()
    print("=" * 68)
    print("     PT SUMATERA KEMASINDO - DIGITAL SIGNAGE WEB SERVER")
    print("=" * 68)
    print(f"\n[OK] Server aktif di Port {PORT}:")
    print(f"  * Akses Lokal (Komputer ini) : http://localhost:{PORT}")
    for ip in ips:
        print(f"  * Akses Jaringan (Ethernet/LAN): http://{ip}:{PORT}")
    print("\n[INFO] Server mendengarkan di '0.0.0.0' (semua interface jaringan).")
    print("       Artinya, jika IP Ethernet berubah, server otomatis menyesuaikan.")
    print("\nTekan Ctrl+C untuk menghentikan server.")
    print("=" * 68 + "\n")

    with socketserver.TCPServer(("0.0.0.0", PORT), SignageHTTPHandler) as httpd:
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nServer dihentikan.")
