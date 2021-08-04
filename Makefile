.PHONY: $(MAKECMDGOALS)

build:
	./scripts/build-docker.sh

run:
	docker run -p 3443:443 -e DB_HOST=host.docker.internal user-service
