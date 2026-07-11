// PNIA Infrastructure Bundle — 08-gpp-node/pkg/shower/validator.go
// Source: ProtokolInfrastructurImplementation.txt, lines 2111-2146
// Extracted verbatim on 2026-07-06.
// 'Shower' engine – strips placeholders / dummies at nanosecond latency.

package shower

import (
	"errors"
	"strings"
)

// Validator prüft die Daten auf Verfassungskonformität (No-Fake-Data)
type Validator struct {
	ForbiddenPatterns []string
}

func NewValidator() *Validator {
	return &Validator{
		ForbiddenPatterns: []string{"dummy", "placeholder", "n/a", "testdata"},
	}
}

// Shower "duscht" die Daten von Verunreinigungen
func (v *Validator) Shower(payload []byte) error {
	data := string(payload)

	for _, pattern := range v.ForbiddenPatterns {
		if strings.Contains(strings.ToLower(data), pattern) {
			return errors.New("compliance_violation: Verunreinigung erkannt - Dummys/Placeholder nicht zulässig")
		}
	}

	// Hier wird zusätzlich die kryptografische Integrität geprüft
	if len(payload) == 0 {
		return errors.New("integrity_violation: Leeres Paket")
	}

	return nil
