module.exports = {
  'extends': ['react-app'],
  'rules': {},
  'plugins': ['react-hooks'],
  'overrides': [
    {
      'files': ['**/*.ts?(x)'],
      'rules': {
        'react-hooks/exhaustive-deps': 'off'
      }
    }
  ]
}
