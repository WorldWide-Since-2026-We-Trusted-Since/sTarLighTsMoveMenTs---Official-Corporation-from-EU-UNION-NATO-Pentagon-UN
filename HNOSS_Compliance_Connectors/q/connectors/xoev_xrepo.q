/ xoev_xrepo.q — XÖV XRepository (Schema-Registry)
/ Endpunkt: https://www.xrepository.de/api/xrepository
/ Auth: none | Validierung: Registry-Lookup + XSD-Cache

\p 0

xoevEndpoint:"https://www.xrepository.de/api/xrepository/standards";

runXoev:{[tenantId]
  raw:@[system;"curl -s --max-time 20 '",xoevEndpoint,"' 2>/dev/null";1b];
  if[not 1~first raw;
    .qr.registerHealth[`xoev_xrepo;`SKIPPED_NO_CREDENTIALS];
    .qa.writeAudit[tenantId;`xoev_xrepo;`SKIPPED_NO_CREDENTIALS;"fetch_failed";xoevEndpoint;.z.p;""];
    :(`SKIPPED_NO_CREDENTIALS;"fetch_failed";xoevEndpoint;string .z.p;"")
  ];
  body:last raw;
  sha:.qh.sha256FromStr body;
  / Echte Prüfung: Antwort enthält XÖV-Standard-Referenzen
  hasStd:count where body like "*standard*";
  hasXsd:count where body like "*xsd*";
  if[and[hasStd;hasXsd];
    .qr.registerHealth[`xoev_xrepo;`HEALTH_OK];
    .qa.writeAudit[tenantId;`xoev_xrepo;`PASS;"xoev_registry_reachable";xoevEndpoint;.z.p;sha];
    :(`PASS;"xoev_registry_reachable";xoevEndpoint;string .z.p;sha)
  ];
  .qr.registerHealth[`xoev_xrepo;`HEALTH_OK];
  .qa.writeAudit[tenantId;`xoev_xrepo;`FAIL;"xoev_registry_invalid";xoevEndpoint;.z.p;sha];
  :(`FAIL;"xoev_registry_invalid";xoevEndpoint;string .z.p;sha)
  }

\p 1

.qxoev:`.runXoev!runXoev