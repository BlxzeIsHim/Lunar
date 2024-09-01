document.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const projectId = urlParams.get('id');
  if (!projectId) {
    document.getElementById('status').innerText = 'No project ID specified.';
    return;
  }

  // Initialize IndexedDB
  let db;
  const request = indexedDB.open('projects', 1);

  request.onsuccess = (event) => {
    db = event.target.result;
    loadProject(projectId);
  };

  request.onerror = (event) => {
    console.error('Database error:', event.target.errorCode);
  };

  // Load the specific project
  function loadProject(id) {
    const transaction = db.transaction('projects', 'readonly');
    const store = transaction.objectStore('projects');
    const request = store.get(id);

    request.onsuccess = (event) => {
      const project = event.target.result;
      if (project) {
        document.getElementById('status').innerText = `Project Loaded: ${project.name}`;
        // Load the 3D model or content
        // Example: Initialize Three.js with project data
      } else {
        document.getElementById('status').innerText = 'Project not found.';
      }
    };

    request.onerror = (event) => {
      console.error('Error loading project:', event.target.errorCode);
    };
  }
});
