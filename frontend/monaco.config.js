// monaco.config.js (Place this at the root of your project or inside a config/ folder)

if (typeof window !== 'undefined') {
    window.MonacoEnvironment = {
      getWorkerUrl: function (moduleId, label) {
        return '/vs/loader.js'; // Adjust based on your Monaco setup
      },
    };
  }
  