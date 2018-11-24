DOCKER_REGISTRY = https://registry-back.wojciechdudek.pl
DOCKER_TAG = wdc-web-personal/wdc-web-personal:$(DOCKER_REVISION)

clean:
	@echo "Clean"
	
build-image:
	docker build -t $(DOCKER_FULL_PATH) .
		
push-image:
	docker push $(DOCKER_FULL_PATH)
	
test:
	@echo "Test"