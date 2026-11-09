import http.server
import socketserver
import os
import socket

PORT = 7777
DIRECTORY = os.path.dirname(os.path.abspath(__file__))
os.chdir(DIRECTORY)

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

# Configure standard handler with explicit UTF-8 and correct MIME types for digital signage
Handler = http.server.SimpleHTTPRequestHandler
Handler.extensions_map.update({
    '.css': 'text/css; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.svg': 'image/svg+xml',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.html': 'text/html; charset=utf-8',
})

if __name__ == '__main__':
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

    with socketserver.TCPServer(("0.0.0.0", PORT), Handler) as httpd:
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nServer dihentikan.")
