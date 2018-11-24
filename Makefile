DOCKER_REVISION = latest
DOCKER_REGISTRY = https://registry-back.wojciechdudek.pl
DOCKER_TAG = wdc-web-personal/wdc-web-personal
DOCKER_FULL_PATH = $(DOCKER_REGISTRY)/$(DOCKER_TAG):$(DOCKER_REVISION)

clean:
	@echo "Clean"
	
build-image:
	docker build -t $(DOCKER_TAG) .
		
push-image:
	docker push $(DOCKER_TAG)
	
test:
	@echo "Test"