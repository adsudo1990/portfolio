"""
Dev server para el portfolio.

Igual que `python -m http.server`, pero manda cabeceras anti-caché.
Sin esto el navegador se queda con el CSS/JS viejo y los cambios "no aparecen"
aunque el archivo en disco ya esté actualizado.

Uso:  python dev-server.py [puerto]
"""
import sys
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path


class NoCacheHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()

    def log_message(self, fmt, *args):  # menos ruido en consola
        sys.stderr.write("%s - %s\n" % (self.address_string(), fmt % args))


def main():
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8731
    root = Path(__file__).resolve().parent
    handler = partial(NoCacheHandler, directory=str(root))
    with ThreadingHTTPServer(("127.0.0.1", port), handler) as httpd:
        print(f"Portfolio en http://localhost:{port}/  (sin caché)  raíz: {root}")
        httpd.serve_forever()


if __name__ == "__main__":
    main()
