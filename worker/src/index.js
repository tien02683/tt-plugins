function html(body, status = 200) {
  return new Response(body, {
    status,
    headers: {
      "content-type": "text/html; charset=UTF-8",
      "cache-control": "no-store",
      "x-content-type-options": "nosniff",
      "content-security-policy": "default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; base-uri 'none'; frame-ancestors 'none'"
    }
  });
}

function randomState() {
  const bytes = new Uint8Array(24);
  crypto.getRandomValues(bytes);
  return [...bytes].map((b) => b.toString(16).padStart(2, "0")).join("");
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (!env.CLIENT_ID || !env.CLIENT_SECRET || !env.ALLOWED_ORIGIN) {
      return new Response("Missing CLIENT_ID, CLIENT_SECRET or ALLOWED_ORIGIN", { status: 500 });
    }

    if (url.pathname === "/auth") {
      if (request.method !== "GET") return new Response("Method not allowed", { status: 405 });
      const state = randomState();
      const redirect = new URL("https://github.com/login/oauth/authorize");
      redirect.searchParams.set("client_id", env.CLIENT_ID);
      redirect.searchParams.set("scope", "repo,user");
      redirect.searchParams.set("state", state);
      const headers = new Headers({ location: redirect.toString(), "cache-control": "no-store" });
      headers.append("set-cookie", `tt_oauth_state=${state}; HttpOnly; Secure; SameSite=Lax; Path=/callback; Max-Age=600`);
      return new Response(null, { status: 302, headers });
    }

    if (url.pathname === "/callback") {
      if (request.method !== "GET") return new Response("Method not allowed", { status: 405 });
      const code = url.searchParams.get("code");
      const returnedState = url.searchParams.get("state");
      const cookie = request.headers.get("Cookie") || "";
      const expectedState = cookie.split(";").map(x => x.trim()).find(x => x.startsWith("tt_oauth_state="))?.split("=")[1];

      if (!code || !returnedState || !expectedState || returnedState !== expectedState) {
        return html("<h2>Đăng nhập không hợp lệ</h2><p>OAuth state không khớp. Hãy đóng cửa sổ và thử lại.</p>", 400);
      }

      const tokenResponse = await fetch("https://github.com/login/oauth/access_token", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "accept": "application/json",
          "user-agent": "TT-Plugins-Decap-CMS"
        },
        body: JSON.stringify({
          client_id: env.CLIENT_ID,
          client_secret: env.CLIENT_SECRET,
          code
        })
      });
      const tokenData = await tokenResponse.json();
      if (!tokenResponse.ok || !tokenData.access_token) {
        return html("<h2>Không thể xác thực GitHub</h2><p>Hãy kiểm tra OAuth App và thử lại.</p>", 502);
      }

      const safeOrigin = JSON.stringify(env.ALLOWED_ORIGIN);
      const token = JSON.stringify(tokenData.access_token);
      const page = `<!doctype html><html><head><meta charset="utf-8"><title>GitHub login</title></head><body><p>Đã xác thực. Đang kết nối CMS...</p><script>
        (function () {
          var allowedOrigin = ${safeOrigin};
          var token = ${token};
          function receiveMessage(event) {
            if (event.origin !== allowedOrigin) return;
            if (!event.data || event.data !== "authorizing:github") return;
            window.opener.postMessage("authorization:github:success:" + JSON.stringify({
              provider: "github",
              token: token
            }), allowedOrigin);
            window.removeEventListener("message", receiveMessage);
            window.close();
          }
          window.addEventListener("message", receiveMessage, false);
          if (window.opener) window.opener.postMessage("authorizing:github", allowedOrigin);
        })();
      </script></body></html>`;
      const headers = new Headers({
        "content-type": "text/html; charset=UTF-8",
        "cache-control": "no-store",
        "content-security-policy": "default-src 'none'; script-src 'unsafe-inline'; base-uri 'none'; frame-ancestors 'none'"
      });
      headers.append("set-cookie", "tt_oauth_state=; HttpOnly; Secure; SameSite=Lax; Path=/callback; Max-Age=0");
      return new Response(page, { status: 200, headers });
    }

    return new Response("Not found", { status: 404 });
  }
};
