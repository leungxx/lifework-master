# LifeWork Master - 一键部署指南

## 方案：部署到 GitHub Pages（免费、永久、全球CDN）

### 第一步：创建 GitHub 账号（如果还没有）
1. 打开 https://github.com
2. 点击 Sign up，用邮箱注册（免费）
3. 验证邮箱后登录

### 第二步：创建仓库
1. 登录后点击右上角 `+` → `New repository`
2. Repository name 填：`lifework-master`
3. 选择 **Public**（公开）
4. 不要勾选任何初始化选项
5. 点击 `Create repository`

### 第三步：上传代码
在仓库页面你会看到 "…or push an existing repository from the command line"。
但更简单的方式是：

1. 点击 `uploading an existing file` 链接
2. 把整个 lifework-master 文件夹拖进去
3. 或者用下面的命令行方式

### 第四步：启用 GitHub Pages
1. 进入仓库 → Settings → Pages
2. Source 选择 `Deploy from a branch`
3. Branch 选择 `main`，文件夹选择 `/ (root)`
4. 点击 Save
5. 等待1-2分钟，页面会显示你的网址：
   `https://你的用户名.github.io/lifework-master`

### 第五步：添加到手机桌面
1. 用手机浏览器打开你的 GitHub Pages 地址
2. Safari(苹果) 或 Chrome(安卓) → 添加到主屏幕
3. 完成！以后从桌面图标直接打开

---

## 如果你会用命令行（更快）

```bash
# 1. 在 lifework-master 目录下
cd lifework-master
git init
git add .
git commit -m "LifeWork Master v1.0"

# 2. 创建 GitHub 仓库后
git remote add origin https://github.com/你的用户名/lifework-master.git
git branch -M main
git push -u origin main

# 3. 去 Settings → Pages 启用 GitHub Pages
```

---

## 部署后记得更新 PWA 配置
部署后打开 `manifest.json`，把 `start_url` 改成你的实际地址。
