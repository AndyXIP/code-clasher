// public/monaco-loader.js

self.MonacoEnvironment = {
    getWorkerUrl: function (workerId, label) {
      return `data:text/javascript;charset=utf-8,${encodeURIComponent(`
        self.MonacoEnvironment = {
          baseUrl: '${window.location.origin}/_next/static/monaco'
        };
        importScripts('${window.location.origin}/_next/static/monaco/monaco.worker.js');
      `)}`;
    },
  };
  