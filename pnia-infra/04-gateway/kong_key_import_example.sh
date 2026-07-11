# PNIA Infrastructure Bundle — 04-gateway/kong_key_import_example.sh
# Source: ProtokolInfrastructurImplementation.txt, lines 380-384
# Extracted verbatim on 2026-07-06.
# Curl example to push a single generated key into Kong for one consumer.

# Beispiel-Befehl für den Import eines Keys in Kong für ID PNIA-0001
curl -X POST http://kong-admin-api:8001/consumers/PNIA-0001/key-auth \
  --data key="DEIN_GENERIERTER_API_KEY_HIER"
