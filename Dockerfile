FROM node:18-alpine AS build

# Install build dependencies for native packages (if needed)
RUN apk add --no-cache python3 make g++

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM nginx:alpine

# Copy the build files from the previous stage
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80 (default Nginx)
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
