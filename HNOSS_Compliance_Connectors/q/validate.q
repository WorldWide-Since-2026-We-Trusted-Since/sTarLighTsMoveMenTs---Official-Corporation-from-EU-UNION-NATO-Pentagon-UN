/ validate.q — Preflight-Validator
/ Ruft alle Connectoren parallel, schreibt Audit-Record

\p 0

/ Lädt alle Module (Bootstrapper-Include)
\l q/core/hash.q
\l q/core/audit.q
\l q/core/registry.q
\l q/connectors/eidas_lotl.q
\l q/connectors/bsi_tr03107.q
\l q/connectors/xoev_xrepo.q
\l q/connectors/bafin_mvp.q
\l q/authark/bridge.q

runValidation:{[tenantId;meta]
  / Authark-Bridge: Token ableiten + Tenant verifizieren
  auth:.qark.bridgeAuth[tenantId;meta];
  if[`VERIFIED <> first auth;
    .qa.writeAudit[tenantId;`authark;`REJECTED;auth[1];"authark:bridge";.z.p;""];
    :(`REJECTED;(`authark;auth[1];"";"";"");())
  ];

  / Parallel alle Connectoren
  res:(`.qeidas.runEidas;`qbsi.runBsi;`qxoev.runXoev;`qbafin.runBafin) @\: tenantId;

  / Status-Aggregation
  statuses:res[;0];
  overall:$[all statuses=`PASS;`PASS;
    $[any statuses=`FAIL;`FAIL;`SKIPPED]];

  auditId:.qh.sha256FromStr[tenantId,"|",meta,"|",string .z.p];
  .qa.writeAudit[tenantId;`validate;`$overall;"aggregated";"validate.q";.z.p;auditId];

  :(overall;res;auditId)
  }

/ Einmal-Lauf für Preflight
once:{[]
  tenantId:"preflight";
  meta:"preflight-run";
  .qark.createTenant["preflight";`preflight;.qh.sha256FromStr["preflight"];"ALL"];
  runValidation[tenantId;meta]
  }

\p 1

.qval:`.runValidation`once!
  (runValidation;once)