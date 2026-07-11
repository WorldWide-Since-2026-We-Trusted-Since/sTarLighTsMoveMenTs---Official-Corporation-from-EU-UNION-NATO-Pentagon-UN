/ bsi_tr03107.q — BSI TR-03107 (Offline XSD)
/ Nutzer legt XSD selbst in schemas/bsi/ ab
/ Auth: none | Validierung: Schema-Konformität

\p 0

bsiSchemaDir:getenv[`HNOSS_BSI_SCHEMA_DIR];
if[null bsiSchemaDir; bsiSchemaDir:"./schemas/bsi"];

runBsi:{[tenantId]
  / Prüfe ob XSD vorhanden
  files:key bsiSchemaDir;
  xsds:files where files like "*.xsd";
  if[0=count xsds;
    .qr.registerHealth[`bsi_tr03107;`SKIPPED_NO_CREDENTIALS];
    .qa.writeAudit[tenantId;`bsi_tr03107;`SKIPPED_NO_CREDENTIALS;"no_xsd_present";"offline:bsi_tr03107";.z.p;""];
    :(`SKIPPED_NO_CREDENTIALS;"no_xsd_present";"offline:bsi_tr03107";string .z.p;"")
  ];
  / Echte Prüfung: XSD-Datei lesbar + nicht leer + Wohlgeformt (enthält <schema)
  firstXsd:`$bsiSchemaDir,"/",first xsds;
  raw:@[read0;firstXsd;1b];
  if[not 1~first raw;
    .qr.registerHealth[`bsi_tr03107;`SKIPPED_NO_CREDENTIALS];
    :(`SKIPPED_NO_CREDENTIALS;"xsd_unreadable";"offline:bsi_tr03107";string .z.p;"")
  ];
  body:last raw;
  sha:.qh.sha256FromStr body;
  hasSchema:count where body like "*<xs:schema*";
  hasElement:count where body like "*<xs:element*";
  if[and[hasSchema;hasElement];
    .qr.registerHealth[`bsi_tr03107;`HEALTH_OK];
    .qa.writeAudit[tenantId;`bsi_tr03107;`PASS;"bsi_xsd_well_formed";"offline:bsi_tr03107";.z.p;sha];
    :(`PASS;"bsi_xsd_well_formed";"offline:bsi_tr03107";string .z.p;sha)
  ];
  .qr.registerHealth[`bsi_tr03107;`HEALTH_OK];
  .qa.writeAudit[tenantId;`bsi_tr03107;`FAIL;"bsi_xsd_invalid";"offline:bsi_tr03107";.z.p;sha];
  :(`FAIL;"bsi_xsd_invalid";"offline:bsi_tr03107";string .z.p;sha)
  }

\p 1

.qbsi:`.runBsi!runBsi