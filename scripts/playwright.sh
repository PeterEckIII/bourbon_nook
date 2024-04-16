#!/bin/bash

# Start up the app so Playwright can visit it
echo "Preparing to start the app..."
npm run dev & disown;

sleep 6;
echo "Preparing to curl the app in order to trigger MSW mock server activation"
curl --silent --output /dev/null http://localhost:3000;
