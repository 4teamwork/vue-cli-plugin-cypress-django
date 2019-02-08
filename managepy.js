const { execa } = require('@vue/cli-shared-utils');
const path = require('path');
const fs = require('fs');

module.exports = function managePy(djangopath, params = [], options = {}) {
  const env = Object.assign(
    options.env || {},
    { DJANGO_CONFIGURATION: 'TestingE2E' },
  );

  const pythonPathCandidates = [
    process.env.DJANGO_PYTHON_PATH,
    'bin/python',
    '.tox/py36/bin/python',
  ];
  const pythonPath = pythonPathCandidates
    .find(c => c && fs.existsSync(path.resolve(djangopath, c))) || 'python';

  return execa(
    pythonPath,
    ['manage.py', ...params],
    Object.assign({ cwd: djangopath, env }, options),
  );
};
