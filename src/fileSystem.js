// Utility constants for file types
export const FileTypes = {
  DIRECTORY: "directory",
  FILE: "file",
  SYMLINK: "symlink",
  BLOCK_DEVICE: "block",
  CHAR_DEVICE: "char",
  PIPE: "pipe",
  SOCKET: "socket"
};

// Standard file modes
export const Modes = {
  DIRECTORY: 0o755,  // drwxr-xr-x
  FILE: 0o644,       // -rw-r--r--
  EXECUTABLE: 0o755, // -rwxr-xr-x
  SYMLINK: 0o777,    // lrwxrwxrwx
  DEVICE: 0o660      // -rw-rw----
};

export const inodes = {
  1: {
    type: FileTypes.DIRECTORY,
    name: "/",
    children: [2, 3, 4, 11, 12, 13, 14], // Added more standard directories
    mode: Modes.DIRECTORY,
    uid: 0,       // root
    gid: 0,       // root
    size: 4096,
    nlink: 2,     // . and ..
    created: Date.now(),
    modified: Date.now(),
    accessed: Date.now(),
  },
  // Add missing basic directories
  2: {
    type: FileTypes.DIRECTORY,
    name: "home",
    children: [],
    mode: Modes.DIRECTORY,
    uid: 0,
    gid: 0,
    size: 4096,
    nlink: 2,
    created: Date.now(),
    modified: Date.now(),
    accessed: Date.now(),
  },
  3: {
    type: FileTypes.DIRECTORY,
    name: "bin",
    children: [],
    mode: Modes.DIRECTORY,
    uid: 0,
    gid: 0,
    size: 4096,
    nlink: 2,
    created: Date.now(),
    modified: Date.now(),
    accessed: Date.now(),
  },
  4: {
    type: FileTypes.DIRECTORY,
    name: "etc",
    children: [],
    mode: Modes.DIRECTORY,
    uid: 0,
    gid: 0,
    size: 4096,
    nlink: 2,
    created: Date.now(),
    modified: Date.now(),
    accessed: Date.now(),
  },
  // ... rest of the existing inodes ...
  // Adding standard Linux directories
  11: {
    type: FileTypes.DIRECTORY,
    name: "usr",
    children: [16, 17],
    mode: Modes.DIRECTORY,
    uid: 0,
    gid: 0,
    size: 4096,
    nlink: 2,
    created: Date.now(),
    modified: Date.now(),
    accessed: Date.now(),
  },
  12: {
    type: FileTypes.DIRECTORY,
    name: "var",
    children: [18],
    mode: Modes.DIRECTORY,
    uid: 0,
    gid: 0,
    size: 4096,
    nlink: 2,
    created: Date.now(),
    modified: Date.now(),
    accessed: Date.now(),
  },
  13: {
    type: FileTypes.DIRECTORY,
    name: "tmp",
    children: [],
    mode: 0o1777, // drwxrwxrwt
    uid: 0,
    gid: 0,
    size: 4096,
    nlink: 2,
    created: Date.now(),
    modified: Date.now(),
    accessed: Date.now(),
  },
  14: {
    type: FileTypes.DIRECTORY,
    name: "dev",
    children: [19, 20],
    mode: Modes.DIRECTORY,
    uid: 0,
    gid: 0,
    size: 4096,
    nlink: 2,
    created: Date.now(),
    modified: Date.now(),
    accessed: Date.now(),
  },

  // Example device files
  19: {
    type: FileTypes.BLOCK_DEVICE,
    name: "sda",
    mode: Modes.DEVICE,
    uid: 0,
    gid: 6, // disk group
    size: 0,
    nlink: 1,
    major: 8,    // device major number
    minor: 0,    // device minor number
    created: Date.now(),
    modified: Date.now(),
    accessed: Date.now(),
  },
  20: {
    type: FileTypes.CHAR_DEVICE,
    name: "null",
    mode: Modes.DEVICE,
    uid: 0,
    gid: 0,
    size: 0,
    nlink: 1,
    major: 1,
    minor: 3,
    created: Date.now(),
    modified: Date.now(),
    accessed: Date.now(),
  },

  // Example symbolic link
  21: {
    type: FileTypes.SYMLINK,
    name: "lib",
    target: "usr/lib", // Path the symlink points to
    mode: Modes.SYMLINK,
    uid: 0,
    gid: 0,
    size: 7, // Size is the length of the target path
    nlink: 1,
    created: Date.now(),
    modified: Date.now(),
    accessed: Date.now(),
  },

  // Example socket file
  22: {
    type: FileTypes.SOCKET,
    name: "mysocket",
    mode: 0o777,
    uid: 1000, // Regular user
    gid: 1000,
    size: 0,
    nlink: 1,
    created: Date.now(),
    modified: Date.now(),
    accessed: Date.now(),
  },
};

// Helper function to resolve paths
export function resolvePath(path) {
  if (path === '/') return [1];
  
  const parts = path.split('/').filter(Boolean);
  let current = 1; // Start at root
  const visited = [current];
  
  for (const part of parts) {
    const node = inodes[current];
    if (!node || node.type !== FileTypes.DIRECTORY) {
      throw new Error('Path resolution failed');
    }
    
    // Handle . and ..
    if (part === '.') continue;
    if (part === '..') {
      visited.pop();
      current = visited[visited.length - 1] || 1;
      continue;
    }
    
    // Find child with matching name
    const child = node.children.find(id => inodes[id].name === part);
    if (!child) {
      throw new Error('Path not found');
    }
    
    current = child;
    visited.push(current);
  }
  
  return visited;
}


// ... existing code ...

// Helper to generate a new unique inode number
function getNextInodeId() {
  return Math.max(...Object.keys(inodes).map(Number)) + 1;
}

// Create a new file or directory
export function create(path, type = FileTypes.FILE, mode = null) {
  const parts = path.split('/').filter(Boolean);
  const name = parts.pop(); // Get the new file/dir name
  const parentPath = '/' + parts.join('/');
  
  // Get parent directory's inode path
  const parentInodes = resolvePath(parentPath);
  const parentId = parentInodes[parentInodes.length - 1];
  const parent = inodes[parentId];
  
  // Check if name already exists
  if (parent.children.some(id => inodes[id].name === name)) {
    throw new Error('File already exists');
  }

  // Create new inode
  const newId = getNextInodeId();
  const newInode = {
    type,
    name,
    mode: mode || (type === FileTypes.DIRECTORY ? Modes.DIRECTORY : Modes.FILE),
    // uid: process.getuid?.() || 0,
    // gid: process.getgid?.() || 0,
    size: type === FileTypes.DIRECTORY ? 4096 : 0,
    nlink: type === FileTypes.DIRECTORY ? 2 : 1,
    children: type === FileTypes.DIRECTORY ? [] : undefined,
    created: Date.now(),
    modified: Date.now(),
    accessed: Date.now(),
  };

  // Update parent
  parent.children.push(newId);
  parent.modified = Date.now();
  
  inodes[newId] = newInode;
  return newId;
}

// Remove a file or directory
export function remove(path) {
  const inodePath = resolvePath(path);
  const id = inodePath[inodePath.length - 1];
  const node = inodes[id];
  
  // Check if trying to remove a non-empty directory
  if (node.type === FileTypes.DIRECTORY && node.children.length > 0) {
    throw new Error('Cannot remove non-empty directory');
  }
  
  // Remove from parent's children
  const parentId = inodePath[inodePath.length - 2];
  const parent = inodes[parentId];
  parent.children = parent.children.filter(childId => childId !== id);
  parent.modified = Date.now();
  
  // Delete the inode
  delete inodes[id];
}

// Change file/directory permissions
export function chmod(path, mode) {
  const inodePath = resolvePath(path);
  const id = inodePath[inodePath.length - 1];
  const node = inodes[id];
  
  node.mode = mode;
  node.modified = Date.now();
}

// Read directory contents
export function readdir(path) {
  const inodePath = resolvePath(path);
  const id = inodePath[inodePath.length - 1];
  const node = inodes[id];
  
  if (node.type !== FileTypes.DIRECTORY) {
    throw new Error('Not a directory');
  }
  
  return node.children.map(childId => ({
    name: inodes[childId]?.name,
    type: inodes[childId]?.type,
    mode: inodes[childId]?.mode
  }));
}

// Get file/directory stats
export function stat(path) {
  const inodePath = resolvePath(path);
  const id = inodePath[inodePath.length - 1];
  const node = inodes[id];
  
  return { ...node };
}
