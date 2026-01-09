// Simple test script for content generation API
// Run with: node test-api.js

const testContentGeneration = async () => {
  const testCases = [
    {
      name: 'Product Title',
      payload: {
        contentType: 'product-title',
        productName: 'Email Validation Tool',
        tone: 'professional',
        language: 'en',
      },
    },
    {
      name: 'Meta Description',
      payload: {
        contentType: 'meta-description',
        productName: 'Email Validation Tool',
        productFeatures: 'Real-time validation, bulk checking, API access',
        tone: 'professional',
        language: 'en',
      },
    },
    {
      name: 'Instagram Post',
      payload: {
        contentType: 'instagram-post',
        productName: 'Email Validation Tool',
        productFeatures: 'Verify emails instantly, protect your sender reputation',
        targetAudience: 'Digital marketers and developers',
        tone: 'enthusiastic',
        language: 'en',
      },
    },
  ];

  console.log('🧪 Testing Content Generation API...\n');

  for (const testCase of testCases) {
    console.log(`📝 Testing: ${testCase.name}`);
    console.log(`Payload:`, JSON.stringify(testCase.payload, null, 2));

    try {
      const response = await fetch('http://localhost:3000/api/generate-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testCase.payload),
      });

      const data = await response.json();

      if (data.success) {
        console.log('✅ Success!');
        console.log(`Generated content (${data.metadata.characterCount} chars):`);
        console.log(data.content);
        console.log(`Model used: ${data.model}`);
      } else {
        console.log('❌ Failed!');
        console.log('Error:', data.error);
      }
    } catch (error) {
      console.log('❌ Request failed!');
      console.log('Error:', error.message);
    }

    console.log('\n' + '='.repeat(80) + '\n');
  }
};

// Check if server is running
const checkServer = async () => {
  try {
    await fetch('http://localhost:3000');
    return true;
  } catch {
    return false;
  }
};

// Main execution
(async () => {
  const serverRunning = await checkServer();

  if (!serverRunning) {
    console.log('❌ Server not running on http://localhost:3000');
    console.log('Please start the development server with: npm run dev');
    process.exit(1);
  }

  await testContentGeneration();
})();
