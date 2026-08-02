import { resolve4, resolve6, resolveCname } from "node:dns/promises";
import { connect } from "node:tls";

const apex = "iocode-solutions.com";
const www = `www.${apex}`;
const expectedIpv4 = process.env.EXPECTED_IPV4 || "";
const expectedIpv6 = process.env.EXPECTED_IPV6 || "";
const errors = [];

async function resolveOrEmpty(resolver, hostname) {
  try {
    return await Promise.race([
      resolver(hostname),
      new Promise((_, reject) => setTimeout(() => reject(new Error("timeout DNS")), 5000))
    ]);
  } catch (error) {
    errors.push(`${hostname}: DNS ${error.code || error.message}`);
    return [];
  }
}

const [ipv4, ipv6, cname] = await Promise.all([
  resolveOrEmpty(resolve4, apex),
  resolveOrEmpty(resolve6, apex),
  resolveOrEmpty(resolveCname, www)
]);

if (!expectedIpv4 || !ipv4.includes(expectedIpv4)) {
  errors.push(`A esperado ${expectedIpv4 || "<EXPECTED_IPV4 no definido>"}; recibido ${ipv4.join(", ") || "vacío"}.`);
}
if (!expectedIpv6 || !ipv6.includes(expectedIpv6)) {
  errors.push(`AAAA esperado ${expectedIpv6 || "<EXPECTED_IPV6 no definido>"}; recibido ${ipv6.join(", ") || "vacío"}.`);
}
if (!cname.map((value) => value.replace(/\.$/u, "")).includes(apex)) {
  errors.push(`www debe ser CNAME de ${apex}; recibido ${cname.join(", ") || "vacío"}.`);
}

try {
  const response = await fetch(`http://${apex}/es/`, {
    redirect: "manual",
    signal: AbortSignal.timeout(10000)
  });
  if (response.status !== 308 || response.headers.get("location") !== `https://${apex}/es/`) {
    errors.push(`HTTP no redirige con 308 al HTTPS canónico.`);
  }
} catch (error) {
  errors.push(`HTTP: ${error.message}`);
}

try {
  const response = await fetch(`https://${www}/es/`, {
    redirect: "manual",
    signal: AbortSignal.timeout(10000)
  });
  if (response.status !== 308 || response.headers.get("location") !== `https://${apex}/es/`) {
    errors.push(`www HTTPS no redirige con 308 al dominio canónico.`);
  }
} catch (error) {
  errors.push(`HTTPS www: ${error.message}`);
}

await new Promise((resolve) => {
  const socket = connect({ host: apex, port: 443, servername: apex, rejectUnauthorized: true }, () => {
    const certificate = socket.getPeerCertificate();
    const validTo = Date.parse(certificate.valid_to);
    if (!certificate.subjectaltname?.includes(`DNS:${apex}`)) errors.push("El certificado no cubre el apex.");
    if (!certificate.subjectaltname?.includes(`DNS:${www}`)) errors.push("El certificado no cubre www.");
    if (validTo - Date.now() < 14 * 24 * 60 * 60 * 1000) errors.push("El certificado vence en menos de 14 días.");
    socket.end();
    resolve();
  });
  socket.setTimeout(10000, () => {
    errors.push("TLS: timeout.");
    socket.destroy();
    resolve();
  });
  socket.on("error", (error) => {
    errors.push(`TLS: ${error.message}`);
    resolve();
  });
});

if (errors.length > 0) {
  console.error("Validación DNS/TLS: FAILED");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Validación DNS/TLS: PASSED; A=${ipv4.join(",")}; AAAA=${ipv6.join(",")}; CNAME=${cname.join(",")}.`);
