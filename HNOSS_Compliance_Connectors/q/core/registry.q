/ Connector-Registry + Health-Table
/ Zentrale Verwaltung aller Connector-Module

\p 0

/ Registry: name -> (endpoint; auth_type; validator; enabled)
registry:(`eidas_lotl`bsi_tr03107`xoev_xrepo`bafin_mvp)!
  (`$("https://ec.europa.eu/tools/lotl/eu-lotl.xml";"none";"xsd";1b);
   `$("offline:bsi_tr03107";"none";"xsd";1b);
   `$("https://www.xrepository.de/api/xrepository";"none";"schema_registry";1b);
   `$("https://portal.mvp.bafin.de";"mtls";"envelope";1b));

/ Health-Table (in-memory)
health:([] connector:`symbol$(); status:`symbol$(); checked_at:`char$());

registerHealth:{[name;st]
  health upsert (`$name;`$st; .z.p)
  }

getRegistry:{[] registry}
getHealth:{[] health}

\p 1

.qr:`.registry`getRegistry`getHealth`registerHealth!
  (registry;getRegistry;getHealth;registerHealth)