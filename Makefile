REVISION = $(DOCKER_REVISION)
TAG = $(DOCKER_REGISTRY)/$(DOCKER_IMAGE):$(DOCKER_REVISION)

init:
	@if docker images $(TAG) | awk '{ print $$2 }' | grep -q -F $(REVISION); then docker rmi $(TAG); fi
	
build-image:
	docker build --rm -t $(TAG) .
		
push-image:
	docker push $(TAG)
	
run-image:
	@echo "Run"
	
test:
	@echo "Test"
	
clean:
	docker rmi $(TAG)