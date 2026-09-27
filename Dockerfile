FROM node:24-alpine AS dependencies

WORKDIR /app
COPY package.json package-lock.json ./
# The existing lockfile was created on macOS and omits a few Linux-only optional
# WASM dependencies. `npm install` resolves those inside the image; `npm ci`
# rejects that cross-platform lockfile before it can build.
RUN npm install --include=optional --no-audit

FROM dependencies AS build

WORKDIR /app
COPY . .
ARG NEXT_PUBLIC_OUTREACH_API_URL=http://localhost:8001
ENV NEXT_PUBLIC_OUTREACH_API_URL=$NEXT_PUBLIC_OUTREACH_API_URL
RUN npm run build

FROM node:24-alpine AS runtime

WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/package.json /app/package-lock.json ./
COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist

EXPOSE 3000
CMD ["npm", "run", "start", "--", "--hostname", "0.0.0.0", "--port", "3000"]
