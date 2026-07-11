/ hnoss.q — Bootstrapper
/ Lädt Module, öffnet Port 5000 für HTTP-Interaktion

\p 0

system["sleep"]:0;

/ Module laden
\l q/core/hash.q
\l q/core/audit.q
\l q/core/registry.q
\l q/connectors/eidas_lotl.q
\l q/connectors/bsi_tr03107.q
\l q/connectors/xoev_xrepo.q
\l q/connectors/bafin_mvp.q
\l q/authark/bridge.q
\l q/validate.q

/ HTTP-Endpoint via .z.ph (q native HTTP handler)
.z.ph:{[x]
  if[x like "/validate*";
    / Minimaler Parser für ?tenant_id=...&meta=...
    params:.j.k (("{" , (ssr[x;"&";"," ])));
    tid:$[null params`tenant_id;"anonymous";params`tenant_id];
    mt:$[null params`meta;"";params`meta];
    res:.qval.runValidation[tid;mt];
    :.h.json res
  ];
  if[x like "/health*";
    :.h.json .qr.getHealth[]
  ];
  :.h.json (`.status`"ok";`.service`"hnoss-compliance-connectors")
  }

show "HNOSS Compliance Connectors loaded. HTTP on :5000";

\p 1