import assert from "node:assert/strict";
import test from "node:test";
import { scanText } from "../../tools/qa-privacy-gate.mjs";

const decoded = (value) => Buffer.from(value, "base64").toString("utf8");
const positives = [
  ["GERMAN_PRIVATE_ADDRESS", decoded("TXVzdGVyc3RyYcOfZSAxLCAxMDEwMSBCZXJsaW4=")],
  ["PRIVATE_TAX_IDENTIFIER", decoded("U3RldWVybnVtbWVyOiAxMjMvNDU2Lzc4OTAx")],
  ["PERSONAL_EMAIL", decoded("cHJpdmF0ZS5maXh0dXJlQGdtYWlsLmNvbQ==")]
];

for (const [expected, fixture] of positives) {
  test(`G-01 positive fixture triggers ${expected}`, () => {
    assert.ok(scanText(fixture).some((finding) => finding.id === expected));
  });
}

for (const [name, fixture] of [
  ["public service address", "Ludwig-Erhard-Str. 18, 20459 Hamburg"],
  ["public VAT identifier", "DE461105535"],
  ["public contact mailbox", "contact@iocode-solutions.com"]
]) {
  test(`G-01 negative fixture allows ${name}`, () => {
    assert.deepEqual(scanText(fixture), []);
  });
}

test("G-01 classifies network and version false positives", () => {
  const allowed = [
    "bind 0.0.0.0",
    "loopback 127.0.0.1",
    "documentation 192.0.2.10 198.51.100.20 203.0.113.30",
    "three dependency version 0.184.0.0"
  ].join("\n");
  assert.deepEqual(scanText(allowed), []);
  const serverEndpoint = decoded("cHJvZHVjdGlvbiBlbmRwb2ludCA4LjguOC44");
  assert.ok(scanText(serverEndpoint).some((finding) => finding.id === "SERVER_IPV4"));
});
