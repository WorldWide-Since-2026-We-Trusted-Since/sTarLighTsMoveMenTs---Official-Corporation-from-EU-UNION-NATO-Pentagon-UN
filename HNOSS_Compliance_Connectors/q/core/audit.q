/ Append-only Audit-Log (kdb+ splayed table)
/ Unveränderliche Historie — Hash-Chain-Prinzip

\p 0

auditDir:getenv[`HNOSS_AUDIT_DIR];
if[null auditDir; auditDir:"./audit"];
auditFile:`$auditDir,"/audit_log";

if[not 11h~type auditFile;
  auditFile set ([] audit_id:`symbol$(); tenant_id:`symbol$(); connector:`symbol$();
    status:`symbol$(); details:`char$(); source_url:`char$(); fetched_at:`char$();
    sha256:`char$(); prev_hash:`char$(); hash:`char$())
  ];

writeAudit:{[tenantId;connector;status;details;sourceUrl;fetchedAt;sha]
  t:auditFile;
  prev:?[t;();0b;{enlist last hash}];
  prevHash:$[count prev;first prev;"GENESIS"];
  payload:tenantId,"|",connector,"|",status,"|",details,"|",sourceUrl,"|",fetchedAt,"|",sha;
  h:.qh.sha256FromStr[prevHash,"|",payload];
  rec:(`$".",sv[`;$".",string tenantId]; `$connector; `$status; details; sourceUrl; fetchedAt; sha; prevHash; h);
  `auditFile insert rec;
  h
  }

readAuditChain:{[] auditFile}

exportAuditJSON:{[]
  t:auditFile;
  c:cols t;
  `json`sv flip (c!t@\:/:c)
  }

\p 1

.qa:`.writeAudit`readAuditChain`exportAuditJSON!
  (writeAudit;readAuditChain;exportAuditJSON)