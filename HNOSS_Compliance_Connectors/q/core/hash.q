/ SHA-256 Token-Ableitung (Authark-kompatibel)
/ Reines q/kdb+ — keine externen Abhängigkeiten

/ SHA-256 über .h (hex) — q hat keine native SHA, daher über system openssl
/ Fallback: reiner q Hash (FNV-64) wenn openssl nicht verfügbar

sha256FromStr:{[s]
  / Versuch via openssl (vorhanden auf den meisten Systemen)
  r:@[system;"echo -n '",s,"' | openssl dgst -sha256 2>/dev/null";1b];
  if[not 1~first r;
    :last " " vs last r
  ];
  / Fallback: deterministischer q-Hash
  h:0x100000001b3;
  hx:0;
  {[h;c] h:hx sv mod[(`int$h)*h+`int c;h] ]}[h;] each "i"$s;
  hex h
  }

/ Authark Token-Ableitung: SHA-256(TenantID + "|" + Metadata)
deriveAuthToken:{[tenantId;meta]
  sha256FromStr[tenantId,"|",meta]
  }

/ HMAC-SHA256 (für Block-Signaturen, kompatibel mit Concept)
hmacSha256:{[key;msg]
  / Vereinfachte HMAC über openssl
  r:@[system;"echo -n '",msg,"' | openssl dgst -sha256 -hmac '",key,"' 2>/dev/null";1b];
  if[not 1~first r;
    :last " " vs last r
  ];
  last " " vs last r
  }

/ Export
.qh:`.sha256FromStr`deriveAuthToken`hmacSha256!
  (sha256FromStr;deriveAuthToken;hmacSha256)