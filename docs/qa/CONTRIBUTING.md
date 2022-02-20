# 为 FFCreator 做出贡献

欢迎您 [提出问题](https://github.com/tnfe/FFCreator/issues) 或 [merge requests](https://github.com/tnfe/FFCreator/pulls)， 建议您在为 FFCreator 做出贡献前先阅读以下 FFCreator 贡献指南。

## issues

我们通过 [issues](https://github.com/tnfe/FFCreator/issues) 来收集问题和功能相关的需求。

### 首先查看已知的问题

在您准备提出问题以前，请先查看现有的 [issues](https://github.com/tnfe/FFCreator/issues) 是否已有其他人提出过相似的功能或问题，以确保您提出的问题是有效的。

### 提交问题

问题的表述应当尽可能的详细，可以包含相关的代码块。

## Merge Requests

我们十分期待您通过 [Merge Requests](https://github.com/tnfe/FFCreator/pulls) 让 FFCreator 变的更加完善。

### 分支管理

FFCreator 主仓库只包含 master 分支，其将作为稳定的开发分支，经过测试后会打 Tag 进行发布。

### Commit Message

我们希望您能使用`npm run commit`来提交代码，保持项目的一致性。  
这样可以方便生成每个版本的 Changelog，很容易地追溯历史。

### MR 流程

TNFE 团队会查看所有的 MR，我们会运行一些代码检查和测试，一经测试通过，我们会接受这次 MR，但不会立即发布外网，会有一些延迟。

当您准备 MR 时，请确保已经完成以下几个步骤:

1. 将主仓库代码 Fork 到自己名下。
2. 基于 `master` 分支创建您的开发分支。
3. 如果您更改了 API(s) 请更新代码及文档。
4. 检查您的代码语法及格式。
5. 提一个 MR 到主仓库的 `master` 分支上。

### 本地开发

首先安装相关依赖

```bash
npm i
```

运行 examples 下相关demo

```bash
npm run examples
```

使用 [npm link](https://docs.npmjs.com/cli/link.html) 进行测试

```bash
npm link
```

## 许可证

通过为 FFCreator 做出贡献，代表您同意将其版权归为 FFCreator 所有，开源协议为 [MIT LICENSE](https://opensource.org/licenses/MIT)
