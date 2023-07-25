FROM --platform=$BUILDPLATFORM node:20-alpine as builder
WORKDIR /app
COPY package.json yarn.lock ./
ENV NODE_ENV=production
RUN yarn install --silent --frozen-lockfile
COPY . .
ARG API_URL
RUN VITE_API_URL="${API_URL}" VITE_BASE_PATH=/ yarn build

FROM --platform=$TARGETPLATFORM nginx:1.25-alpine as app
COPY --from=builder /app/dist /usr/share/nginx/html/
