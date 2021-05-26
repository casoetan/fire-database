# 2 Stage dockerfile

# Stage 0
FROM node:14

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./

# Copy application
COPY . .

# Install application packages
RUN npm install

# Build js from ts
RUN npm run build


# Stage 1
FROM node:14

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./

# Install application packages for production only
RUN npm install --only=production

# Copy build from stage 0
COPY --from=0 /usr/src/app/dist ./dist

EXPOSE 3000
CMD [ "npm", "start" ]
