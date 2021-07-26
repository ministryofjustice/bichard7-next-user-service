.PHONY: $(MAKECMDGOALS)

build:
	./scripts/build-docker.sh

run:
	docker run -p 3443:443 user-service

local-run-db:
	./scripts/local-run-db.sh

run-db:
	./scripts/run-db.sh
	
