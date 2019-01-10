class Process {
  constructor(settings, options) {
    this.settings = settings;
    this.options = options;
  }

  async start() {
    throw new Error('start is not yet implemented');
  }

  kill() {
    throw new Error('kill is not yet implemented');
  }
}

module.exports = Process;
