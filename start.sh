#!/bin/bash

# M9 Terminal - Start Script
# Starts both frontend and backend servers

echo "╔════════════════════════════════════════════════════════════╗"
echo "║                                                            ║"
echo "║           🎯 M9 TERMINAL — STARTUP SCRIPT                 ║"
echo "║                                                            ║"
echo "║  Sports Market Intelligence Platform                       ║"
echo "║  Built by Oddsify Labs                                     ║"
echo "║                                                            ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Kill any existing processes
echo "🧹 Cleaning up existing processes..."
pkill -f "npm run dev" 2>/dev/null || true
pkill -f "PORT=3009" 2>/dev/null || true
sleep 2

# Clear ports
echo "🔌 Clearing ports 3002 and 3009..."
lsof -i :3002 :3009 2>/dev/null | tail -n +2 | awk '{print $2}' | sort -u | xargs -r kill -9 2>/dev/null || true
sleep 2

# Start frontend in background
echo "📦 Starting Frontend (Vite)..."
cd /home/pil_coder1/projects/m9terminal/frontend
npm run dev > /tmp/m9-frontend.log 2>&1 &
FRONTEND_PID=$!
echo "   PID: $FRONTEND_PID"
echo "   URL: http://localhost:3002"

sleep 4

# Start backend in background
echo "🚀 Starting Backend (Express)..."
cd /home/pil_coder1/projects/m9terminal/backend
PORT=3009 npm start > /tmp/m9-backend.log 2>&1 &
BACKEND_PID=$!
echo "   PID: $BACKEND_PID"
echo "   URL: http://localhost:3009"

sleep 4

# Verify both servers
echo ""
echo "✅ Testing connections..."

FRONTEND_TEST=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3002)
if [ "$FRONTEND_TEST" = "200" ]; then
  echo "   ✓ Frontend: OK ($FRONTEND_TEST)"
else
  echo "   ✗ Frontend: FAILED ($FRONTEND_TEST)"
fi

BACKEND_TEST=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3009/api/health)
if [ "$BACKEND_TEST" = "200" ]; then
  echo "   ✓ Backend: OK ($BACKEND_TEST)"
else
  echo "   ✗ Backend: FAILED ($BACKEND_TEST)"
fi

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║                  🎉 READY TO USE                           ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo "📱 Frontend:  http://localhost:3002"
echo "🔌 Backend:   http://localhost:3009"
echo ""
echo "📊 Test the health endpoint:"
echo "   curl http://localhost:3009/api/health"
echo ""
echo "📈 Monitor API credits:"
echo "   curl http://localhost:3009/api/markets/health"
echo ""
echo "Press Ctrl+C to stop both servers"
echo ""

# Keep script running
wait
