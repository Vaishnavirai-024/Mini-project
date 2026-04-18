const testAnalyze = async () => {
  try {
    const res = await fetch('http://localhost:5000/api/analyze/text', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        resumeText: 'Experienced full stack developer with 5 years of React, Node.js, and MongoDB.',
        jobDescription: 'Looking for a senior backend engineer proficient in Node.js, Express, and Database design.'
      })
    });
    
    const data = await res.json();
    console.log("Status:", res.status);
    console.log("Response:", JSON.stringify(data, null, 2));
  } catch (e) {
    console.error(e);
  }
};

testAnalyze();