/ PNIA Infrastructure Bundle — 06-orchestrator/self_report.q
/ Source: ProtokolInfrastructurImplementation.txt, lines 670-699
/ Extracted verbatim on 2026-07-06.
/ Self-identifying database bootstrap in KDB+/Q (broadcasts hardware via MCP).

/ --- Autonome Bootstrap-Logik (Innerhalb der Datenbank-Instanz ausgeführt) ---

/ 1. Selbst-Identifikation (Query gegen systemeigene Hardware-Registry)
identify_self:{[]
    / Datenbank fragt das Betriebssystem/Hardware-Layer nach Ressourcen
    resources:exec gpu_count, ram_gb, cpu_cores from .os.get_hardware_specs[];

    / Datenbank generiert ihre ID basierend auf Hardware-Hash (Deterministisch)
    id: `$"PNIA-", 8#string md5 string resources;

    / Datenbank verknüpft Ressourcen mit ID
    update id:id from resources;
    }

/ 2. Broadcast an das Netzwerk via MCP
broadcast_requirements:{[data]
    / Die Datenbank sendet ihr wissenschaftliches Profil via MCP
    .mcp.send[`provisioning_bus; .j.j data];
    }

/ 3. Execution (Bootstrap bei Initialisierung)
/ Dies ist der einzige Code, der laufen muss. Die DB organisiert sich selbst.
bootstrap:{[]
    data:identify_self[];
    broadcast_requirements[data];
    }

.z.init:bootstrap[]; / Automatischer Start beim DB-Hochfahren
