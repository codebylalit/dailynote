const fs = require("fs");
const path = require("path");

class CodingSimulator {
  constructor() {
    this.targetFile = path.join(__dirname, "time.tsx");
    this.duration = 10 * 60 * 60 * 1000; // 10 hours in milliseconds
    this.interval = 60 * 1000; // 1 minute in milliseconds
    this.startTime = Date.now();
    this.updateCount = 0;
    this.isRunning = false;

    // Coding activity patterns
    this.codingActivities = [
      "// Optimizing component performance",
      "// Adding error handling",
      "// Implementing new feature",
      "// Refactoring code structure",
      "// Adding unit tests",
      "// Fixing responsive layout",
      "// Updating documentation",
      "// Improving accessibility",
      "// Adding animation effects",
      "// Implementing state management",
      "// Adding validation logic",
      "// Optimizing bundle size",
      "// Adding loading states",
      "// Implementing caching",
      "// Adding analytics tracking",
      "// Improving user experience",
      "// Adding keyboard shortcuts",
      "// Implementing dark mode",
      "// Adding search functionality",
      "// Optimizing images",
      "// Adding progressive loading",
      "// Implementing lazy loading",
      "// Adding error boundaries",
      "// Improving form validation",
      "// Adding data persistence",
      "// Implementing real-time updates",
      "// Adding notification system",
      "// Improving mobile responsiveness",
      "// Adding offline support",
      "// Implementing data synchronization",
    ];

    this.codingInsights = [
      "// Performance optimization insight",
      "// Code quality improvement",
      "// User experience enhancement",
      "// Security consideration added",
      "// Accessibility improvement",
      "// Testing strategy update",
      "// Documentation enhancement",
      "// Architecture refinement",
      "// Error handling strategy",
      "// State management optimization",
      "// Component reusability",
      "// Data flow optimization",
      "// Memory usage optimization",
      "// Network request optimization",
      "// UI/UX consistency",
      "// Code maintainability",
      "// Scalability consideration",
      "// Cross-browser compatibility",
      "// Mobile-first approach",
      "// Progressive enhancement",
    ];

    this.codingMetrics = [
      "// Lines of code: +15",
      "// Components created: +2",
      "// Functions optimized: +3",
      "// Tests added: +5",
      "// Bugs fixed: +1",
      "// Performance improved: +10%",
      "// Bundle size reduced: -5%",
      "// Load time optimized: -20%",
      "// Memory usage reduced: -15%",
      "// Code coverage: +8%",
      "// Accessibility score: +12%",
      "// Lighthouse score: +15%",
      "// User satisfaction: +25%",
      "// Error rate reduced: -30%",
      "// Response time: -40%",
    ];
  }

  log(message) {
    const timestamp = new Date().toISOString();
    const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
    const hours = Math.floor(elapsed / 3600);
    const minutes = Math.floor((elapsed % 3600) / 60);
    const seconds = elapsed % 60;

    console.log(
      `[${timestamp}] [${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}] ${message}`
    );
  }

  getRandomActivity() {
    const activities = [
      ...this.codingActivities,
      ...this.codingInsights,
      ...this.codingMetrics,
    ];
    return activities[Math.floor(Math.random() * activities.length)];
  }

  updateFile() {
    try {
      // Read the current file
      let content = fs.readFileSync(this.targetFile, "utf8");

      // Find a good place to add a comment (after imports or in the component)
      const lines = content.split("\n");

      // Find a random line in the component to add a comment
      // Ensure we have valid bounds for small files
      const minLines = Math.min(50, Math.floor(lines.length / 2));
      const maxLines = Math.max(minLines + 1, lines.length - 1);
      let insertIndex =
        Math.floor(Math.random() * (maxLines - minLines)) + minLines;

      // Make sure we're not inserting in the middle of a string or comment
      while (
        insertIndex < lines.length &&
        lines[insertIndex] &&
        (lines[insertIndex].includes("//") ||
          lines[insertIndex].includes("/*") ||
          lines[insertIndex].includes("*/") ||
          lines[insertIndex].includes("'") ||
          lines[insertIndex].includes('"'))
      ) {
        insertIndex++;
      }

      if (insertIndex >= lines.length) {
        insertIndex = Math.floor(lines.length / 2);
      }

      // Add a timestamp and random coding activity
      const timestamp = new Date().toISOString();
      const activity = this.getRandomActivity();
      const updateComment = `  // [${timestamp}] ${activity}`;

      // Insert the comment
      lines.splice(insertIndex, 0, updateComment);

      // Also update the test iterations counter to show activity
      const testIterationsMatch = content.match(
        /setTestIterations\(\(prev\) => prev \+ 1\);/
      );
      if (testIterationsMatch) {
        content = content.replace(
          /setTestIterations\(\(prev\) => prev \+ 1\);/,
          `setTestIterations((prev) => prev + ${
            Math.floor(Math.random() * 3) + 1
          });`
        );
      }

      // Update the file with new content
      fs.writeFileSync(this.targetFile, lines.join("\n"));

      this.updateCount++;
      this.log(`✅ Updated file (update #${this.updateCount}) - ${activity}`);
    } catch (error) {
      this.log(`❌ Error updating file: ${error.message}`);
    }
  }

  start() {
    this.log("🚀 Starting coding simulation for 10 hours...");
    this.log(`📁 Target file: ${this.targetFile}`);
    this.log(`⏰ Update interval: ${this.interval / 1000} seconds`);
    this.log(`⏱️  Total duration: ${this.duration / (1000 * 60 * 60)} hours`);

    this.isRunning = true;

    // Initial update
    this.updateFile();

    // Set up the interval
    this.intervalId = setInterval(() => {
      if (!this.isRunning) {
        return;
      }

      const elapsed = Date.now() - this.startTime;

      if (elapsed >= this.duration) {
        this.stop();
        return;
      }

      this.updateFile();

      // Log progress every 10 minutes
      if (this.updateCount % 10 === 0) {
        const progress = (elapsed / this.duration) * 100;
        this.log(
          `📊 Progress: ${progress.toFixed(1)}% (${
            this.updateCount
          } updates completed)`
        );
      }
    }, this.interval);
  }

  stop() {
    this.isRunning = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }

    const totalTime = Date.now() - this.startTime;
    const hours = Math.floor(totalTime / (1000 * 60 * 60));
    const minutes = Math.floor((totalTime % (1000 * 60 * 60)) / (1000 * 60));

    this.log("🎉 Coding simulation completed!");
    this.log(`📈 Total updates: ${this.updateCount}`);
    this.log(`⏱️  Total time: ${hours}h ${minutes}m`);
    this.log("💻 File has been continuously updated to simulate active coding");

    process.exit(0);
  }

  // Handle graceful shutdown
  setupGracefulShutdown() {
    process.on("SIGINT", () => {
      this.log("🛑 Received SIGINT, stopping simulation...");
      this.stop();
    });

    process.on("SIGTERM", () => {
      this.log("🛑 Received SIGTERM, stopping simulation...");
      this.stop();
    });
  }
}

// Start the simulation
const simulator = new CodingSimulator();
simulator.setupGracefulShutdown();
simulator.start();