# CI/CD 配置指南：GitHub Actions 自动部署到 GitHub Pages

## 工作流配置详解

本项目使用 GitHub Actions 实现自动化部署 Vue 项目到 GitHub Pages。以下是工作流配置的详细解释：

### 工作流触发条件

```yaml
name: deploy
on:
  push:
    branches: [main] # 当 main 分支有推送时触发
    paths-ignore: # 忽略以下文件的变更，不触发部署
      - README.md
```

- 仅在 `main` 分支推送代码时触发部署
- 忽略 `README.md` 文件的变更，不会触发部署流程

### 构建步骤

```yaml
jobs:
  deploy:
    runs-on: ubuntu-latest # 在最新版本的 Ubuntu 上运行
    steps:
      # 检出代码
      - name: Checkout
        uses: actions/checkout@v2

      # 构建项目
      - name: Build
        uses: actions/setup-node@master
        with:
          node-version: "20.x" # 使用 Node.js 20.x 版本
      - run: npm install # 安装依赖
      - run: npm run build # 构建项目
```

- 使用 `actions/checkout@v2` 检出仓库代码
- 设置 Node.js 20.x 环境
- 安装项目依赖
- 构建项目

### 部署步骤

```yaml
- name: Deploy
  uses: peaceiris/actions-gh-pages@v3
  with:
    branch: gh-pages # 部署到 gh-pages 分支
    publish_dir: ./dist # 部署 dist 目录的内容
    github_token: ${{ secrets.CICD }} # GitHub 令牌
    user_name: ${{ secrets.MY_USER_NAME }} # 提交者用户名
    user_email: ${{ secrets.MY_USER_EMAIL }} # 提交者邮箱
    commit_message: 自动部署 # 提交信息
```

- 使用 `peaceiris/actions-gh-pages@v3` Action 部署到 GitHub Pages
- 将 `dist` 目录内容部署到 `gh-pages` 分支
- 使用 GitHub Secrets 中配置的令牌、用户名和邮箱

## GitHub Pages 配置指南

### 1. 启用 GitHub Pages

1. 进入仓库 "Settings" 页面
2. 找到 "Pages" 选项卡
3. 在 "Build and deployment" 部分：
   - Source: 选择 "Deploy from a branch"
   - Branch: 选择 `gh-pages`
   - 文件夹: 选择 `/ (root)`
4. 保存设置

### 2. GitHub Actions Secrets 配置

在仓库 "Settings" -> "Secrets and variables" -> "Actions" 中配置以下 Secrets：

1. `CICD`：

   - 创建一个 GitHub Personal Access Token
   - 权限：`repo` 和 `workflow`
   - 复制 Token 值到 Secrets

2. `MY_USER_NAME`：

   - 你的 GitHub 用户名

3. `MY_USER_EMAIL`：
   - 与 GitHub 账户关联的邮箱地址

## GitHub Personal Access Token 生成指南

### 详细步骤

1. **登录 GitHub**

   - 打开 [GitHub](https://github.com) 并登录你的账号

2. **进入 Token 生成页面**

   - 点击右上角头像
   - 选择 "Settings"
   - 在左侧边栏最下方，点击 "Developer settings"
   - 选择 "Personal access tokens"
   - 点击 "Tokens (classic)"
   - 点击 "Generate new token" 按钮
   - 选择 "Generate new token (classic)"

3. **配置 Token 权限**

   - Token 名称：输入有意义的名称，如 "CICD-Deploy-Token"
   - 选择过期时间：
     - 推荐：`No expiration`（永不过期）
     - 或设置较长的有效期（如 90 天）
   - 权限选择：
     - 勾选 `repo`（完全控制私有仓库）
     - 勾选 `workflow`（允许工作流操作）

4. **生成并保存 Token**
   - 点击 "Generate token"
   - **重要：立即复制生成的 Token**
   - **注意：Token 只会显示一次，请妥善保存**

### 安全注意事项

- 🚨 **绝不** 与任何人分享你的 Token
- 如果 Token 被泄露：
  1. 立即在 GitHub 设置中删除
  2. 重新生成新的 Token
- 建议定期更新 Token
- 尽可能设置较短的过期时间

### Token 使用建议

- 为不同项目创建不同的 Token
- 仅授予必要的最小权限
- 使用 GitHub 仓库 Secrets 安全存储 Token
- 监控 Token 的使用情况

### 常见问题

1. **Token 丢失怎么办？**

   - 重新生成新的 Token
   - 更新所有相关的 Secrets 配置

2. **如何检查 Token 权限？**

   - 在 GitHub 设置中可以随时查看和修改 Token 权限

3. **Token 有效期到期怎么办？**
   - 生成新 Token
   - 更新所有使用该 Token 的地方

## 注意事项

- 确保 `npm run build`
