# Depcheck Web Service

Integrate with [depcheck](https://github.com/lijunle/depcheck-es6) to show the result in web and generate a depcheck badge.

*Warn:* this service is in very early stage, not even reach alpha release. Use it at your risk.

## Build Status

[![Build Status](https://travis-ci.org/lijunle/depcheck-web.svg?branch=master)](https://travis-ci.org/lijunle/depcheck-web)
[![codecov.io](https://codecov.io/github/lijunle/depcheck-web/coverage.svg?branch=master)](https://codecov.io/github/lijunle/depcheck-web?branch=master)
[![Depcheck](https://depcheck.tk/github/lijunle/depcheck-web/master.svg)](https://github.com/lijunle/depcheck-web)

## Usage

Currently, this service only support Travis CI with GitHub.

1. Add `--web-report` to your `depcheck` command in the `.travis.yml` file.
2. Commit the changes and push to GitHub. A Travis build will be trigger to run `depcheck` command.
3. After finish, view your depcheck report on http://depcheck.tk/github/user-name/repo-name.

## License

MIT License.
