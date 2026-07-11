SHELL := /usr/bin/env bash
INFRA := $(abspath $(dir $(lastword $(MAKEFILE_LIST))))
REGISTRY := $(INFRA)/00-core/registry.csv

.PHONY: help lint validate validate-dag deploy deploy-all orchestrate test clean

help:
	@echo "PNIA infra targets:"
	@echo "  make lint                 - shellcheck all *.sh"
	@echo "  make validate             - validate registry"
	@echo "  make validate-dag         - check DEPENDS_ON is a valid DAG"
	@echo "  make deploy ID=PNIA-001   - deploy a single ID"
	@echo "  make deploy-all           - dependency-aware parallel deploy"
	@echo "  make orchestrate          - run the Python asyncio orchestrator"
	@echo "  make test                 - end-to-end orchestrator integration test"

lint:
	find $(INFRA) -name '*.sh' -print0 | xargs -0 shellcheck -x || true

validate:
	bash -c 'source $(INFRA)/00-core/lib/validate.sh && validate_registry'

validate-dag:
	python3 $(INFRA)/00-core/lib/validate_dag.py $(INFRA)/00-core/registry.csv

deploy:
	@test -n "$(ID)" || (echo "ID=<PNIA-...> required" && exit 2)
	bash $(INFRA)/01-registry/deploy_service.v2.sh $(ID)

deploy-all: validate-dag
	bash $(INFRA)/01-registry/deploy_service.v2.sh --all

orchestrate:
	python3 $(INFRA)/06-orchestrator/pnia_orchestrator.v2.py

test:
	bash $(INFRA)/tests/run_e2e.sh

clean:
	docker ps -aq --filter "name=pnia-" | xargs -r docker rm -f