# Contribute to FFCreator

You are welcome to [ask questions](https://github.com/tnfe/FFCreator/issues) or [merge requests](https://github.com/tnfe/FFCreator/pulls), I suggest you contribute to FFCreator First read the following FFCreator contribution guide.

## issues

We use [issues](https://github.com/tnfe/FFCreator/issues) to collect issues and feature-related requirements.

### First check the known issues

Before you are ready to raise an issue, please check the existing [issues](https://github.com/tnfe/FFCreator/issues) to see if anyone else has raised similar features or issues to ensure that you raise the issue It is effective.

### Submit a question

The statement of the problem should be as detailed as possible and can include relevant code blocks.

## Merge Requests

We look forward to your [Merge Requests](https://github.com/tnfe/FFCreator/pulls) to make FFCreator more perfect.

### Branch Management

The FFCreator main warehouse only contains the master branch, which will serve as a stable development branch and will be tagged for release after testing.

### Commit Message

We hope that you can use `npm run commit` to submit code and maintain project consistency.
This makes it easy to generate the Changelog for each version and easily trace the history.

### MR process

The TNFE team will look at all MRs, and we will run some code checks and tests. Once the tests pass, we will accept this MR, but will not be released to the Internet immediately, and there will be some delays.

When you prepare for MR, make sure you have completed the following steps:

1. Fork the main warehouse code under your own name.
2. Create your development branch based on the `master` branch.
3. If you change the API(s), please update the code and documentation.
4. Check your code syntax and format.
5. Bring an MR to the `master` branch of the main repository.

### Local development

Install related dependencies first

```bash
npm i
```

Run related demo under examples

```bash
npm run examples
```

Use [npm link](https://docs.npmjs.com/cli/link.html) to test

```bash
npm link
```

## License

By contributing to FFCreator, you agree to assign its copyright to FFCreator. The open source agreement is [MIT LICENSE](https://opensource.org/licenses/MIT)