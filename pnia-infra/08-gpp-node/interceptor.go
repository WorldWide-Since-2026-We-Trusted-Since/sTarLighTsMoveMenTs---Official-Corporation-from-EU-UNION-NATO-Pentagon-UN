// PNIA Infrastructure Bundle — 08-gpp-node/interceptor.go
// Source: ProtokolInfrastructurImplementation.txt, lines 1599-1623
// Extracted verbatim on 2026-07-06.
// gRPC interceptor performing OPA-based compliance validation.

package bridge

import (
	"context"
	"google.golang.org/grpc"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

// ComplianceInterceptor fungiert als dein "Gate-Policy-Basis" Filter
func ComplianceInterceptor(ctx context.Context, req interface{}, info *grpc.UnaryServerInfo, handler grpc.UnaryHandler) (interface{}, error) {
	// 1. Validierung: Ist der Provenance-Hash vorhanden?
	// 2. Prüfung: Enthält die Payload "Fake-Daten" oder Placeholders? (Gate-Policy)
	if isDirty(req) {
		return nil, status.Error(codes.Unauthenticated, "Data tainted - Compliance Check failed")
	}

	// 3. Nur wenn sauber: Weiterleitung an das System
	return handler(ctx, req)
}

func isDirty(req interface{}) bool {
    // Hier sitzt dein OPA (Open Policy Agent) Check
