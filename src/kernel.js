// Process states
export const ProcessState = {
  READY: 'ready',
  RUNNING: 'running',
  BLOCKED: 'blocked',
  TERMINATED: 'terminated'
};

// Process Control Block (PCB)
class ProcessControlBlock {
  constructor(pid, program, priority = 1) {
    this.pid = pid;
    this.program = program;
    this.state = ProcessState.READY;
    this.priority = priority;
    this.registers = {
      pc: 0,  // Program Counter
      sp: 0,  // Stack Pointer
    };
    this.created = Date.now();
    this.cpuTime = 0;
    this.parentPid = null;
    this.children = [];
  }
}

class Kernel {
  constructor() {
    this.processes = new Map();
    this.currentPid = 0;
    this.runningProcess = null;
    
    // Initialize system processes
    this.createProcess('init', 0); // PID 1 - init process
  }

  // Create a new process
  createProcess(program, priority = 1, parentPid = null) {
    const pid = ++this.currentPid;
    const pcb = new ProcessControlBlock(pid, program, priority);
    
    if (parentPid) {
      pcb.parentPid = parentPid;
      const parentProcess = this.processes.get(parentPid);
      if (parentProcess) {
        parentProcess.children.push(pid);
      }
    }

    this.processes.set(pid, pcb);
    return pid;
  }

  // Simple round-robin scheduler
  schedule() {
    const readyProcesses = Array.from(this.processes.values())
      .filter(p => p.state === ProcessState.READY)
      .sort((a, b) => b.priority - a.priority);

    if (readyProcesses.length > 0) {
      if (this.runningProcess) {
        this.runningProcess.state = ProcessState.READY;
      }
      this.runningProcess = readyProcesses[0];
      this.runningProcess.state = ProcessState.RUNNING;
      return this.runningProcess;
    }
    return null;
  }

  // System calls
  syscall(type, ...args) {
    switch (type) {
      case 'fork':
        return this.fork();
      case 'exit':
        return this.exit(args[0]);
      case 'kill':
        return this.kill(args[0]);
      case 'getpid':
        return this.runningProcess?.pid;
      default:
        throw new Error(`Unknown system call: ${type}`);
    }
  }

  // Fork the current process
  fork() {
    if (!this.runningProcess) return null;
    return this.createProcess(
      this.runningProcess.program,
      this.runningProcess.priority,
      this.runningProcess.pid
    );
  }

  // Exit the current process
  exit(status = 0) {
    if (!this.runningProcess) return;
    const process = this.runningProcess;
    process.state = ProcessState.TERMINATED;
    process.exitStatus = status;
    
    // Orphan any child processes to init (PID 1)
    process.children.forEach(childPid => {
      const child = this.processes.get(childPid);
      if (child) {
        child.parentPid = 1;
        const init = this.processes.get(1);
        init.children.push(childPid);
      }
    });

    this.runningProcess = null;
    this.schedule();
  }

  // Kill a specific process
  kill(pid) {
    const process = this.processes.get(pid);
    if (!process) {
      throw new Error(`Process ${pid} not found`);
    }
    process.state = ProcessState.TERMINATED;
    if (this.runningProcess?.pid === pid) {
      this.runningProcess = null;
      this.schedule();
    }
  }

  // Get process information
  ps() {
    return Array.from(this.processes.entries()).map(([pid, process]) => ({
      pid,
      program: process.program,
      state: process.state,
      priority: process.priority,
      cpuTime: process.cpuTime,
      parentPid: process.parentPid
    }));
  }
}

// Export a singleton instance
export const kernel = new Kernel(); 