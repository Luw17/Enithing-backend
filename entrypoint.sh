#!/bin/sh
if [ "$NODE_ENV" = "production" ]; then
  echo "Enithing-Backend: Running in production mode"
  exec node dist/main.js
else
  echo "Enithing-Backend: Running in development mode"
  npm install
  exec npm run start:dev
fi