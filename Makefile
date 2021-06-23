.PHONY: $(MAKECMDGOALS)

build:
	./scripts/build-docker.sh

run:
	docker run -p 3443:443 user-service

run-db:
	docker run -p 3443:443 -e DB_AUTH=true -e DB_AUTH_HOST=host.docker.internal user-service
