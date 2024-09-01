document.addEventListener('DOMContentLoaded', () => {
    const projectNameInput = document.getElementById('project-name');
    const createProjectButton = document.getElementById('create-project');
    const projectList = document.getElementById('project-list');
    const popup = document.getElementById('popup');
    const openProjectButton = document.getElementById('open-project');
    const deleteProjectButton = document.getElementById('delete-project');
    const closePopupButton = document.getElementById('close-popup');
  
    let currentProjectId = null;
  
    // Initialize IndexedDB
    let db;
    const request = indexedDB.open('projects', 1);
  
    request.onupgradeneeded = (event) => {
      db = event.target.result;
      const objectStore = db.createObjectStore('projects', { keyPath: 'id' });
      objectStore.createIndex('name', 'name', { unique: false });
    };
  
    request.onsuccess = (event) => {
      db = event.target.result;
      loadProjects();
    };
  
    request.onerror = (event) => {
      console.error('Database error:', event.target.errorCode);
    };
  
    function loadProjects() {
      const transaction = db.transaction('projects', 'readonly');
      const store = transaction.objectStore('projects');
      const request = store.openCursor();
  
      projectList.innerHTML = ''; // Clear existing list
  
      request.onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor) {
          const project = cursor.value;
          addProjectToList(project);
          cursor.continue();
        }
      };
  
      request.onerror = (event) => {
        console.error('Error loading projects:', event.target.errorCode);
      };
    }
  
    function addProjectToList(project) {
      const projectItem = document.createElement('div');
      projectItem.className = 'project-item';
      projectItem.dataset.id = project.id;
  
      const thumbnail = document.createElement('div');
      thumbnail.className = 'project-thumbnail';
      thumbnail.style.backgroundImage = `url(${project.thumbnail || ''})`;
  
      const projectInfo = document.createElement('div');
      projectInfo.className = 'project-info';
  
      const projectName = document.createElement('div');
      projectName.className = 'project-name';
      projectName.innerText = project.name;
  
      const projectActions = document.createElement('div');
      projectActions.className = 'project-actions';
      projectActions.innerHTML = '...';
  
      projectActions.addEventListener('click', () => {
        currentProjectId = project.id;
        popup.style.display = 'block';
      });
  
      projectInfo.appendChild(projectName);
      projectItem.appendChild(thumbnail);
      projectItem.appendChild(projectInfo);
      projectItem.appendChild(projectActions);
  
      projectList.appendChild(projectItem);
    }
  
    createProjectButton.addEventListener('click', () => {
      const name = projectNameInput.value.trim();
      if (name) {
        const id = generateUniqueId();
        const transaction = db.transaction('projects', 'readwrite');
        const store = transaction.objectStore('projects');
        
        const project = {
          id,
          name,
          thumbnail: '' // Default empty thumbnail
        };
  
        store.add(project);
        transaction.oncomplete = () => {
          addProjectToList(project);
          projectNameInput.value = '';
          projectNameInput.classList.add('hidden'); // Hide input after creation
          console.log('Project created:', project);
        };
  
        transaction.onerror = (event) => {
          console.error('Error creating project:', event.target.errorCode);
        };
      } else {
        alert('Project name cannot be empty.');
      }
    });
  
    function generateUniqueId() {
      return '_' + Math.random().toString(36).substr(2, 9);
    }
  
    openProjectButton.addEventListener('click', () => {
      if (currentProjectId) {
        window.location.href = `project.html?id=${currentProjectId}`;
      }
    });
  
    deleteProjectButton.addEventListener('click', () => {
      if (currentProjectId) {
        const transaction = db.transaction('projects', 'readwrite');
        const store = transaction.objectStore('projects');
        
        store.delete(currentProjectId);
        transaction.oncomplete = () => {
          loadProjects();
          popup.style.display = 'none';
          console.log('Project deleted:', currentProjectId);
        };
  
        transaction.onerror = (event) => {
          console.error('Error deleting project:', event.target.errorCode);
        };
      }
    });
  
    closePopupButton.addEventListener('click', () => {
      popup.style.display = 'none';
    });
  
    // Handle "Create Project" button click to show input field
    createProjectButton.addEventListener('click', () => {
      projectNameInput.classList.remove('hidden');
    });
  });
  