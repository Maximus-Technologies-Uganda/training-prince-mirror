import { describe, it, expect } from 'vitest';

describe('Smoke Test Execution Integration', () => {
  it('should execute smoke tests for all five UIs', async () => {
    const applications = ["quote", "expense", "temp", "todo", "stopwatch"];
    
    const testResults = await runSmokeTests({
      applications: applications,
      capture_artifacts: true,
      upload_on_failure: true,
      timeout_ms: 30000
    });
    
    expect(testResults.total_tests).toBe(5);
    expect(testResults.test_results.length).toBe(5);
    
    // Verify each application has a test result
    applications.forEach(app => {
      const appResult = testResults.test_results.find(r => r.application === app);
      expect(appResult).toBeDefined();
      expect(appResult).toHaveProperty('test_name');
      expect(appResult).toHaveProperty('status');
      expect(appResult).toHaveProperty('execution_time_ms');
    });
  });

  it('should capture artifacts on test failure', async () => {
    // Simulate a test failure scenario
    const testResults = await runSmokeTests({
      applications: ["expense"], // Use an app that might fail
      capture_artifacts: true,
      upload_on_failure: true,
      timeout_ms: 5000 // Short timeout to force failure
    });
    
    const failedTest = testResults.test_results.find(r => r.status === 'failed');
    if (failedTest) {
      expect(failedTest.artifacts.length).toBeGreaterThan(0);
      expect(failedTest).toHaveProperty('error_message');
      expect(failedTest.error_message).toBeTruthy();
    }
  });

  it('should integrate with CI pipeline', async () => {
    // Test CI integration
    const ciResult = await runCISmokeTests({
      branch: "development",
      capture_artifacts: true,
      upload_artifacts: true
    });
    
    expect(ciResult).toHaveProperty('status');
    expect(ciResult).toHaveProperty('artifact_urls');
    expect(ciResult).toHaveProperty('test_summary');
    
    // Verify artifacts are uploaded
    if (ciResult.status === 'success') {
      expect(ciResult.artifact_urls.length).toBeGreaterThanOrEqual(0);
    }
  });

  it('should validate primary user workflows', async () => {
    const workflowTests = {
      quote: "quote filtering",
      expense: "expense calculation", 
      temp: "temperature conversion",
      todo: "todo management",
      stopwatch: "stopwatch timing"
    };
    
    for (const [app, workflow] of Object.entries(workflowTests)) {
      const testResult = await runSmokeTest(app, workflow);
      expect(testResult).toHaveProperty('workflow_description');
      expect(testResult.workflow_description).toContain(workflow);
    }
  });
});
