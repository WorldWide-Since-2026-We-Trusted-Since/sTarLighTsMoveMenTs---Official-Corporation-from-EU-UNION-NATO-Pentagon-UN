/ authark/bridge.q — Hash-Token → Tenant-Mapping
/ access_governance (kdb+ Tabelle, kompatibel mit create_tenant.js)

\p 0

/ access_governance Tabelle (Standalone-Modus)
govDir:getenv[`HNOSS_GOV_DIR];
if[null govDir; govDir:"./gov"];
govFile:`$govDir,"/access_governance";

if[not 11h~type govFile;
  govFile set ([] id:`symbol$(); login_name:`symbol$(); password_hash:`char$();
    allowed_slot:`char$(); status:`char$(); is_active:`int$())
  ];

/ Tenant anlegen (für Standalone-Tests)
createTenant:{[id;login;pwHash;slot]
  `govFile insert (`$id;`$login;pwHash;slot;"ACTIVE";1)
  }

/ Hash-Token ableiten + Tenant verifizieren
verifyTenant:{[tenantId;meta]
  / Token-Ableitung via hash.q
  token:.qh.deriveAuthToken[tenantId;meta];
  / Lookup in access_governance
  rec:?[govFile;enlist (=;`login_name;`$tenantId);0b;()] ;
  if[0=count rec;
    :(`REJECTED;"tenant_not_found";token)
  ];
  row:first rec;
  if[not 1~row[`is_active];
    :(`REJECTED;"tenant_inactive";token)
  ];
  / Verified Data Stream Token
  :(`VERIFIED;row[`allowed_slot];token)
  }

/ Authark-Base-URL (optional, für Remote-Modus)
autharkBase:getenv[`AUTHARK_BASE_URL];

bridgeAuth:{[tenantId;meta]
  if[null autharkBase;
    :verifyTenant[tenantId;meta]  / Standalone
  ];
  / Remote-Modus: Delegation via curl
  url:autharkBase,"/api/bridge/verify";
  payload:"{\"tenant_id\":\"",tenantId,"\",\"meta\":\"",meta,"\"}";
  raw:@[system;"curl -s --max-time 15 -X POST -H 'Content-Type: application/json' -d '",payload,"' '",url,"' 2>/dev/null";1b];
  if[not 1~first raw;
    :(`REJECTED;"authark_unreachable";"")
  ];
  :(`VERIFIED;"remote";last raw)
  }

\p 1

.qark:`.verifyTenant`createTenant`bridgeAuth!
  (verifyTenant;createTenant;bridgeAuth)