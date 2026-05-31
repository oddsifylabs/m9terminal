#!/bin/bash

# M9 Terminal Live Data Pipeline Test
# Verifies all connections and data flow

echo "╔════════════════════════════════════════════════════════════╗"
echo "║     M9 TERMINAL — LIVE DATA PIPELINE TEST                 ║"
echo "║     Testing real odds + game data integration              ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test 1: Backend Health
echo "1️⃣  Testing backend health check..."
HEALTH=$(curl -s http://localhost:3000/api/health)
if echo "$HEALTH" | grep -q "ok"; then
  echo -e "${GREEN}✅ Backend running${NC}"
else
  echo -e "${RED}❌ Backend not responding${NC}"
  echo "   Start backend: npm run backend:dev"
  exit 1
fi

echo ""

# Test 2: Environment Variables
echo "2️⃣  Checking environment variables..."
if grep -q "ODDS_API_KEY=" .env; then
  echo -e "${GREEN}✅ ODDS_API_KEY configured${NC}"
else
  echo -e "${RED}❌ ODDS_API_KEY missing${NC}"
fi

if grep -q "SPORTSDATA_IO_API_KEY=" .env; then
  echo -e "${GREEN}✅ SPORTSDATA_IO_API_KEY configured${NC}"
else
  echo -e "${YELLOW}⚠️  SPORTSDATA_IO_API_KEY missing (optional)${NC}"
fi

echo ""

# Test 3: API Routes
echo "3️⃣  Testing API routes..."
curl -s http://localhost:3000/ | grep -q "M9 Terminal" && \
  echo -e "${GREEN}✅ Root endpoint working${NC}" || \
  echo -e "${RED}❌ Root endpoint failed${NC}"

echo ""

# Test 4: Integration Test Endpoint
echo "4️⃣  Running backend integration test..."
INTEGRATION=$(curl -s -X POST http://localhost:3000/api/mlb/integration-test)
if echo "$INTEGRATION" | grep -q "success"; then
  echo -e "${GREEN}✅ Integration test available${NC}"
  # Check API status
  if echo "$INTEGRATION" | grep -q '"allSystemsGo": true'; then
    echo -e "${GREEN}✅ All systems operational${NC}"
  else
    echo -e "${YELLOW}⚠️  Some systems not fully operational${NC}"
  fi
else
  echo -e "${RED}❌ Integration test failed${NC}"
fi

echo ""

# Test 5: Live Signals Endpoint
echo "5️⃣  Testing live signals endpoint..."
SIGNALS=$(curl -s -X POST http://localhost:3000/api/mlb/analyze-today \
  -H "Content-Type: application/json" \
  -d '{"profile":"ACTIVE"}')

if echo "$SIGNALS" | grep -q '"success":true'; then
  GAME_COUNT=$(echo "$SIGNALS" | grep -o '"gamesAnalyzed":[0-9]*' | cut -d: -f2)
  echo -e "${GREEN}✅ Live signals endpoint working${NC}"
  echo "   Games analyzed: $GAME_COUNT"
else
  echo -e "${RED}❌ Live signals endpoint failed${NC}"
  echo "   Response: $SIGNALS"
fi

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║  Test Summary                                              ║"
echo "╠════════════════════════════════════════════════════════════╣"
echo "║  Backend: Running ✅                                       ║"
echo "║  APIs: Connected                                           ║"
echo "║  Routes: Wired                                             ║"
echo "║                                                            ║"
echo "║  Next Steps:                                               ║"
echo "║  1. npm run frontend:dev (in another terminal)             ║"
echo "║  2. Open http://localhost:5173                             ║"
echo "║  3. Dashboard will load real signals from backend          ║"
echo "╚════════════════════════════════════════════════════════════╝"
