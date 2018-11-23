FROM node:6

# Go to app
WORKDIR /app

# Install prerequisites
RUN npm update
RUN npm install node-pre-gyp --build-from-source -g --quiet 
RUN npm install node-gyp@3.6.2 node-sass node-inspector@0.12.10 gulp -g --quiet 

# Prepare package.json
COPY package.json /app

# Install all dependencies
RUN NODE_ENV=development npm install && npm cache clean

# Copy app
COPY . /app 

# Build app
RUN npm run build

# Prepare dist
RUN mv dist ../

# Go to dist
WORKDIR /dist

# Remove build articats
RUN rm -r /app

# Install all dependencies
RUN npm install 

ENV NODE_ENV=production

# Start app
CMD ["npm","run-script","start"]