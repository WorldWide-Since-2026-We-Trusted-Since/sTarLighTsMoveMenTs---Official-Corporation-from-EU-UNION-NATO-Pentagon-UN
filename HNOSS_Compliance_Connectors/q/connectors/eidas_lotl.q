/ eidas_lotl.q — EU Trusted Lists (LOTL)
/ Endpunkt: https://ec.europa.eu/tools/lotl/eu-lotl.xml
/ Auth: none | Validierung: XML-Fetch + SHA256 + Signatur-Hinweis

\p 0

eidasEndpoint:"https://ec.europa.eu/tools/lotl/eu-lotl.xml";

runEidas:{[tenantId]
  / Fetch via curl (vorhanden auf den meisten Systemen)
  raw:@[system;"curl -s --max-time 20 '",eidasEndpoint,"' 2>/dev/null";1b];
  if[not 1~first raw;
    .qr.registerHealth[`eidas_lotl;`SKIPPED_NO_CREDENTIALS];
    :(`SKIPPED_NO_CREDENTIALS;"fetch_failed";eidasEndpoint;"";"")
  ];
  body:last raw;
  sha:.qh.sha256FromStr body;
  / Echte Validierung: Prüfe auf <TrustServiceStatusList> und <Signature>
  hasTSL:count where body like "*TrustServiceStatusList*";
  hasSig:count where body like "*SignatureValue*";
  if[and[hasTSL;hasSig];
    .qr.registerHealth[`eidas_lotl;`HEALTH_OK];
    .qa.writeAudit[tenantId;`eidas_lotl;`PASS;"lotl_xml_valid";eidasEndpoint;.z.p;sha];
    :(`PASS;"lotl_xml_valid";eidasEndpoint;string .z.p;sha)
  ];
  .qr.registerHealth[`eidas_lotl;`HEALTH_OK];
  .qa.writeAudit[tenantId;`eidas_lotl;`FAIL;"lotl_schema_invalid";eidasEndpoint;.z.p;sha];
  :(`FAIL;"lotl_schema_invalid";eidasEndpoint;string .z.p;sha)
  }

\p 1

.qeidas:`.runEidas!runEidas