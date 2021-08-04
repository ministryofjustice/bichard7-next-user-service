.PHONY: $(MAKECMDGOALS)

build:
	./scripts/build-docker.sh

run:
	docker run -p 3443:443 -e DB_HOST=172.17.0.1 user-service
