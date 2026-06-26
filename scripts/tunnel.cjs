const { spawn } = require("child_process");
const { existsSync } = require("fs");
const path = require("path");

const candidates = [
  path.join(process.env["ProgramFiles(x86)"] || "C:\\Program Files (x86)", "cloudflared", "cloudflared.exe"),
  path.join(process.env.ProgramFiles || "C:\\Program Files", "cloudflared", "cloudflared.exe"),
  path.join(process.env.ProgramFiles || "C:\\Program Files", "Cloudflare", "cloudflared", "cloudflared.exe"),
  "cloudflared",
];

const bin = candidates.find((candidate) => candidate === "cloudflared" || existsSync(candidate));

if (!bin) {
  console.error("cloudflared не найден. Установи: winget install Cloudflare.cloudflared");
  process.exit(1);
}

const port = process.env.PORT || "3001";
const protocol = process.env.TUNNEL_PROTOCOL || "http2";

console.log(`Tunnel target: http://127.0.0.1:${port}`);
console.log("Если видишь 530 — отключи VPN и перезапусти туннель.");

const child = spawn(
  bin,
  ["tunnel", "--protocol", protocol, "--url", `http://127.0.0.1:${port}`],
  {
    stdio: "inherit",
    shell: false,
  },
);

child.on("exit", (code) => process.exit(code ?? 0));
