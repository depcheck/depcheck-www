# Depcheck Tutorial

## Introduction

Depcheck is a tool to figure out the usage statistics of your node project dependencies - which dependencies are declared in `package.json` but actually not used in the project.

Depcheck service is a web service providing the dependency report and depcheck badge for your project.

This tutorial walks through the steps to run the depcheck tool for your project locally and post dependency report to web service in a continuous integration service (a.k.a., CI).

## Install

In your project folder, run the following command:

```
npm install depcheck-es6 --save-dev
```

## Usage

### Depcheck locally

It is very simple to check project dependencies. Run in your project folder:

```
depcheck
```

Depcheck looks the `package.json` file in current working folder, and compares with the dependencies used in your source files, to generate the result.

For more details about the `depcheck` arguments, please read on [its GitHub page](https://github.com/lijunle/depcheck-es6#usage).

### Depcheck in CI build

It is recommended to enable depcheck in CI build. Depcheck will exit with `-1` to break the build once it finds useless dependencies.

If you are using Travis CI service, add the following command to the `script` section of configuration file `.travis.yml`.

```yaml
script:
  - depcheck
```

### Post result to depcheck service

First, go to [depcheck home page](https://depcheck.tk), login with your GitHub account. Navigate to the repository page.

Click on the enable button to generate a depcheck token for your repository. Add the generated token as `DEPCHECK_TOKEN` environment variable. If you run on CI, add it in your CI setting page. Please keep the depcheck token private.

After the `DEPCHECK_TOKEN` environment variable is set, run the `depcheck` command with `--web-report` argument.

After `depcheck --web-report` command completes, refresh the repository page to check the dependency report. You can copy the depcheck badge shown in the page to your README file to enjoy it.

## Known issues

- Some packages are reported as false alerts in depcheck tool. You can add them to `--ignores` argument as a temporary solution. Please check the [issues page](https://github.com/lijunle/depcheck-es6/issues) for more details.
- The organization repositories are not supported in depcheck service yet.
- The private repositories are not supported in depcheck service yet.
- The deleted branches keep shown in the repository page, and have no way to hide them.
