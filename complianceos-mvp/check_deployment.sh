#!/bin/bash

echo "🔍 VerifyFlow Deployment Status Check"
echo "======================================"

# Check Vercel deployment
echo ""
echo "1. Vercel Deployment:"
if curl -s -I "https://complianceos-mvp.vercel.app" | head -1 | grep -q "200"; then
    echo "   ✅ LIVE: https://complianceos-mvp.vercel.app"
else
    echo "   ❌ OFFLINE"
fi

# Check Supabase connection
echo ""
echo "2. Supabase Connection:"
if node -e "
import('node-fetch').then(async ({default: fetch}) => {
  try {
    const response = await fetch('https://jyixgalqejdandnrmnqe.supabase.co/rest/v1/', {
      headers: { 'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp5aXhnYWxxZWpkYW5kbnJtbnFlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc0MTE4OTIsImV4cCI6MjA4Mjk4Nzg5Mn0.utdsBX6V5et1O0dHwfUrV4WTfUC2pY4lxw3tjqqRDE8' }
    });
    console.log('   ✅ Connected to Supabase');
  } catch (e) {
    console.log('   ❌ Cannot connect to Supabase');
  }
}).catch(() => {
  console.log('   ⚠️  Could not test Supabase (node-fetch not available)');
});
" 2>/dev/null; then
    echo ""
else
    echo "   ⚠️  Could not test Supabase connection"
fi

# Check local build
echo ""
echo "3. Local Build:"
if npm run build 2>&1 | grep -q "built in"; then
    echo "   ✅ Build successful"
else
    echo "   ❌ Build failed"
fi

# Check git status
echo ""
echo "4. Git Status:"
if git status --porcelain | grep -q "^[ MADRC]"; then
    echo "   ⚠️  Uncommitted changes"
    git status --porcelain | head -5
else
    echo "   ✅ All changes committed"
fi

# Check if database tables exist
echo ""
echo "5. Database Status:"
echo "   ⚠️  Need to manually set up database schema"
echo "   Run: node test_supabase.js (will fail until schema is created)"

echo ""
echo "======================================"
echo "📋 Next Steps:"
echo "1. Set up Supabase database schema (manual step)"
echo "2. Test with: node test_supabase.js"
echo "3. Visit: https://complianceos-mvp.vercel.app/app"
echo "======================================"
