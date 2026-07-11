# PNIA Infrastructure Bundle — 10-genesis/certbot.sh
# Source: ProtokolInfrastructurImplementation.txt, lines 2942-2950
# Extracted verbatim on 2026-07-06.
# Certbot HTTPS provisioning for the node domain.

# Installation des Certbot-Managers
sudo pacman -S certbot certbot-nginx

# Beantragung des Zertifikats für deinen Node-Domainnamen
# Ersetze 'deine-domain.de' durch deine offizielle Registrierung
sudo certbot --nginx -d deine-domain.de

