.PHONY: $(MAKECMDGOALS)

build:
	./scripts/build-docker.sh

run:
	docker run -p 3443:443 user-service
