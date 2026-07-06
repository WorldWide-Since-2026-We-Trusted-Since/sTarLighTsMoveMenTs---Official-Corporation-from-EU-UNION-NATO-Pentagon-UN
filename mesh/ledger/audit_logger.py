#!/usr/bin/env python3
"""
GAI Universal Mesh - Audit Logger
Revisionssichere Compliance-Protokollierung für UN/VN-Audits
"""

import csv
import os
from datetime import datetime
import json

class AuditLogger:
    """Audit-System für Compliance-Verstöße"""
    
    def __init__(self, log_file: str = "compliance_audit.csv", ledger_dir: str = "./ledger"):
        self.log_file = log_file
        self.ledger_dir = ledger_dir
        self._init_log_file()
    
    def _init_log_file(self):
        """Initialisiert die CSV-Log-Datei mit Header"""
        if not os.path.exists(self.log_file):
            with open(self.log_file, mode='w', newline='') as file:
                writer = csv.writer(file)
                writer.writerow([
                    "Timestamp", "Expert_ID", "Status", "Violation_Type", 
                    "Layer_Ref", "Integrity_Hash", "Remediation_Status"
                ])
    
    def log_violation(self, expert_id: str, violation_type: str, layer_ref: str, 
                      integrity_hash: str = "", remediation_status: str = "PENDING"):
        """
        Schreibt einen Compliance-Verstoß in das Audit-Log
        """
        timestamp = datetime.utcnow().isoformat()
        with open(self.log_file, mode='a', newline='') as file:
            writer = csv.writer(file)
            writer.writerow([
                timestamp, expert_id, "VIOLATION", violation_type, 
                layer_ref, integrity_hash, remediation_status
            ])
        
        # Optional: JSON-Ledger für maschinelle Auswertung
        ledger_file = os.path.join(self.ledger_dir, f"audit_{datetime.utcnow().strftime('%Y%m%d')}.json")
        self._append_to_ledger(ledger_file, {
            "timestamp": timestamp,
            "expert_id": expert_id,
            "violation_type": violation_type,
            "layer_ref": layer_ref,
            "integrity_hash": integrity_hash,
            "remediation_status": remediation_status
        })
        
        print(f"AUDIT-WARNUNG: Compliance-Verstoß in Log {self.log_file} geschrieben.")
    
    def _append_to_ledger(self, ledger_file: str, entry: dict):
        """Fügt Einträge zum JSON-Ledger hinzu"""
        os.makedirs(self.ledger_dir, exist_ok=True)
        
        if os.path.exists(ledger_file):
            with open(ledger_file, 'r') as f:
                data = json.load(f)
        else:
            data = {"entries": []}
        
        data["entries"].append(entry)
        
        with open(ledger_file, 'w') as f:
            json.dump(data, f, indent=2)
    
    def generate_monthly_report(self) -> dict:
        """Generiert monatlichen Compliance-Report für Foundation"""
        report = {
            "report_month": datetime.utcnow().strftime("%Y-%m"),
            "total_violations": 0,
            "by_layer": {},
            "by_type": {}
        }
        
        if os.path.exists(self.log_file):
            with open(self.log_file, 'r') as f:
                reader = csv.DictReader(f)
                for row in reader:
                    report["total_violations"] += 1
                    layer = row.get("Layer_Ref", "UNKNOWN")
                    vtype = row.get("Violation_Type", "UNKNOWN")
                    report["by_layer"][layer] = report["by_layer"].get(layer, 0) + 1
                    report["by_type"][vtype] = report["by_type"].get(vtype, 0) + 1
        
        return report


if __name__ == "__main__":
    # Test-Audit-Logger
    logger = AuditLogger()
    logger.log_violation("EX2025D1218310", "IDENTITY_MISMATCH", "Layer_01")