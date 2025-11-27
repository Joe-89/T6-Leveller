import { writeFileSync } from "fs";
import { generateKeyPairSync } from "crypto";
import selfsigned from "selfsigned";

const attrs = [{ name: "commonName", value: "localhost" }];
const pems = selfsigned.generate(attrs, { days: 365 });

writeFileSync("./cert/cert.pem", pems.cert, { encoding: "utf8" });
writeFileSync("./cert/key.pem", pems.private, { encoding: "utf8" });

console.log("✔ Self-signed certificate created in /cert");
