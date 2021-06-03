.PHONY: build
build:
	docker build -t user-service .

.PHONY: build-from-ecr
build-from-ecr:
	./scripts/build-docker.sh

.PHONY: run
run:
	docker run -p 3443:3000 user-service
