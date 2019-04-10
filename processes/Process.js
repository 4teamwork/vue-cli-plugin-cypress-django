class Process {
  constructor(config = {}) {
    this.config = config;
  }

  async start() {
    throw new Error('start is not yet implemented');
  }

  kill() {
    throw new Error('kill is not yet implemented');
  }
}

module.exports = Process;
