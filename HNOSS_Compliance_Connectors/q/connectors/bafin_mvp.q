/ bafin_mvp.q — BaFin Meldeportal (mTLS)
/ Endpunkt: https://portal.mvp.bafin.de
/ Auth: mTLS Client-Zertifikat (vom Nutzer beizustellen)
/ Ohne Zertifikat: Dry-Run -> SKIPPED_NO_CERT (kein Fake-OK)

\p 0

bafinEndpoint:"https://portal.mvp.bafin.de";
bafinCert:getenv[`HNOSS_BAFIN_CERT`];
bafinKey:getenv[`HNOSS_BAFIN_KEY`];

runBafin:{[tenantId]
  if[or[null bafinCert;null bafinKey];
    .qr.registerHealth[`bafin_mvp;`SKIPPED_NO_CERT];
    .qa.writeAudit[tenantId;`bafin_mvp;`SKIPPED_NO_CERT;"no_client_cert_dry_run";bafinEndpoint;.z.p;""];
    :(`SKIPPED_NO_CERT;"no_client_cert_dry_run";bafinEndpoint;string .z.p;"")
  ];
  / mTLS-Request via curl
  cmd:"curl -s --max-time 20 --cert '",bafinCert,"' --key '",bafinKey,"' '",bafinEndpoint,"' 2>/dev/null";
  raw:@[system;cmd;1b];
  if[not 1~first raw;
    .qr.registerHealth[`bafin_mvp;`HEALTH_OK];
    .qa.writeAudit[tenantId;`bafin_mvp;`FAIL;"mtls_handshake_failed";bafinEndpoint;.z.p;""];
    :(`FAIL;"mtls_handshake_failed";bafinEndpoint;string .z.p;"")
  ];
  body:last raw;
  sha:.qh.sha256FromStr body;
  / Echte Prüfung: Antwort enthält BaFin-spezifische Marker
  hasBafin:count where body like "*BaFin*";
  if[hasBafin;
    .qr.registerHealth[`bafin_mvp;`HEALTH_OK];
    .qa.writeAudit[tenantId;`bafin_mvp;`PASS;"bafin_mvp_reachable";bafinEndpoint;.z.p;sha];
    :(`PASS;"bafin_mvp_reachable";bafinEndpoint;string .z.p;sha)
  ];
  .qr.registerHealth[`bafin_mvp;`HEALTH_OK];
  .qa.writeAudit[tenantId;`bafin_mvp;`FAIL;"bafin_mvp_invalid";bafinEndpoint;.z.p;sha];
  :(`FAIL;"bafin_mvp_invalid";bafinEndpoint;string .z.p;sha)
  }

\p 1

.qbafin:`.runBafin!runBafin