FROM node:6

# Install prerequisites
RUN npm update
RUN npm install node-pre-gyp --build-from-source -g --quiet 
RUN npm install node-gyp@3.6.2 node-sass node-inspector@0.12.10 gulp -g --quiet 

# Go to app
WORKDIR /app

# Prepare package.json
COPY app/package.json /app

# Install all dependencies
RUN NODE_ENV=development npm install && npm cache clean

# Copy app
COPY ./app /app 

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

# Set production environment
ENV NODE_ENV=production

# Start app
CMD ["npm", "run-script", "start"]