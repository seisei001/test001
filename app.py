"""標準ライブラリのみで動く、超シンプルなWebアプリ。

外部フレームワーク(Flask/FastAPIなど)は一切使わず、http.serverだけで
HTTPリクエストを処理する。RenderなどのPaaSは環境変数PORTでリッスンすべき
ポート番号を渡してくるので、それを読み取って起動する。
"""

import json
import os
import platform
import socket
from datetime import datetime, timezone
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

START_TIME = datetime.now(timezone.utc)
visit_count = 0


def render_page(request_count: int) -> str:
    now = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S UTC")
    uptime = datetime.now(timezone.utc) - START_TIME
    return f"""<!doctype html>
<html lang="ja">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>シンプルWebアプリ</title>
<style>
  body {{
    margin: 0;
    background: #f5f6fa;
    color: #1c1f2b;
    font-family: -apple-system, "Hiragino Sans", "Yu Gothic", sans-serif;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
  }}
  main {{
    background: #ffffff;
    border: 1px solid #e0e2ec;
    border-radius: 12px;
    padding: 32px;
    max-width: 480px;
    width: 90%;
  }}
  h1 {{ margin: 0 0 12px; font-size: 1.4rem; }}
  dl {{ display: grid; grid-template-columns: auto 1fr; gap: 6px 16px; font-size: 0.9rem; }}
  dt {{ color: #676c85; }}
  dd {{ margin: 0; font-family: ui-monospace, monospace; }}
  a {{ color: #3f4fd6; }}
</style>
</head>
<body>
<main>
  <h1>Pythonの標準ライブラリだけで動いています</h1>
  <p>外部フレームワークなし(http.serverのみ)で起動しているWebアプリです。</p>
  <dl>
    <dt>現在時刻</dt><dd>{now}</dd>
    <dt>起動からの経過</dt><dd>{str(uptime).split('.')[0]}</dd>
    <dt>アクセス回数(再起動でリセット)</dt><dd>{request_count}</dd>
    <dt>Pythonバージョン</dt><dd>{platform.python_version()}</dd>
    <dt>ホスト名</dt><dd>{socket.gethostname()}</dd>
  </dl>
  <p style="margin-top:20px; font-size:0.85rem; color:#676c85;">
    JSON API: <a href="/api/time">/api/time</a> ・
    <a href="/api/hello?name=World">/api/hello?name=World</a> ・
    <a href="/health">/health</a>
  </p>
</main>
</body>
</html>
"""


class Handler(BaseHTTPRequestHandler):
    server_version = "SimpleStdlibApp/1.0"

    def _send_json(self, status: int, payload: dict) -> None:
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def _send_html(self, status: int, html: str) -> None:
        body = html.encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "text/html; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self) -> None:
        global visit_count

        path = self.path.split("?", 1)[0]

        if path == "/":
            visit_count += 1
            self._send_html(200, render_page(visit_count))
            return

        if path == "/health":
            self._send_json(200, {"status": "ok"})
            return

        if path == "/api/time":
            self._send_json(200, {"utc_time": datetime.now(timezone.utc).isoformat()})
            return

        if path == "/api/hello":
            query = self.path.split("?", 1)[1] if "?" in self.path else ""
            params = dict(p.split("=", 1) for p in query.split("&") if "=" in p)
            name = params.get("name", "World")
            self._send_json(200, {"message": f"Hello, {name}!"})
            return

        self._send_json(404, {"error": "not found", "path": path})

    def log_message(self, format: str, *args) -> None:  # noqa: A002 - BaseHTTPRequestHandlerのシグネチャに合わせる
        # Render等のログに出すため標準出力にそのまま流す
        print("%s - %s" % (self.address_string(), format % args))


def main() -> None:
    port = int(os.environ.get("PORT", "8000"))
    server = ThreadingHTTPServer(("0.0.0.0", port), Handler)
    print(f"listening on 0.0.0.0:{port}")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        server.shutdown()


if __name__ == "__main__":
    main()
