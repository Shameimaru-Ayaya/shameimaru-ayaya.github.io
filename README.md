## 射命丸文的个人主页（Shameimaru-Ayaya.github.io）

静态博客 / 个人主页项目，基于 GitHub Pages 与纯前端实现。  
仓库地址即站点源码，`main` 分支直接部署到 `https://shameimaru-ayaya.github.io/`。

---

## 目录结构概览

仓库根目录关键结构：

- `index.html`：主页，包含本地 BGM 播放器、个人信息展示等。
- `about-us/index.html`：关于页面。
- `contact-us/index.html`：联系页面。
- `download/index.html`：下载与受保护内容入口页面。
- `privacy-policy/index.html`：隐私政策页面。
- `_config.yml`：GitHub Pages / Jekyll 配置。
- `static/`：站点静态资源根目录。
  - `static/css/`：站点样式文件（`style.css`、`root.css`、`APlayer.min.css`）。
  - `static/js/`：公共脚本（`script.js`、`APlayer.min.js`、`Meting.min.js`）。
  - `static/img/`：图片资源（角色立绘、logo 等）。
  - `static/fonts/`：字体资源。
  - `static/svg/`：SVG 图标及主题相关资源。
  - `static/bgm/`：本地 BGM 文件与歌词目录（详见“本地 BGM 播放器”）。
- `generate_playlist.py`：扫描 `static/bgm` 自动生成播放器列表的脚本。
- `README.md`：本说明文档。

---

## 本地预览与开发

项目为纯静态站点，不依赖 Node.js 或后端服务，任何支持静态文件的 HTTP 服务器都可以使用。  
推荐使用 Python 自带的 `http.server` 快速预览。

### 1. 启动本地服务器

在仓库根目录执行：

```bash
cd /Users/page/Documents/GitHub/KirisameMarisa-DAZE.github.io
python3 -m http.server 8080
```

然后在浏览器中打开：

- 主页：`http://localhost:8080/`
- 关于：`http://localhost:8080/about-us/`
- 联系：`http://localhost:8080/contact-us/`
- 下载：`http://localhost:8080/download/`

如使用其他静态服务器（如 nginx、serve 等），确保站点根目录指向仓库根目录即可。

### 2. 主题与公共组件

公共组件与主题逻辑主要集中在：

- `static/js/script.js`：`/static/js/script.js:90` 起
  - 深浅色主题切换（`changeTheme`、`initThemeSwitch`）。
  - 左侧信息栏渲染（`renderSidebar`）。
  - 顶部导航栏渲染（`renderNavbar`）。
  - 标签云布局（`initWordCloud`）。
  - 页脚更新记录与页尾年份自动更新。

只要在各页面引入统一的脚本和样式，即可自动套用相同的导航栏与侧边栏布局。

---

## 本地 BGM 播放器与自动歌单

主页 `index.html` 集成了 APlayer 播放器，并支持本地 BGM 自动识别。

### 1. 目录结构与命名规则

所有本地 BGM 均放在：

- 目录：`static/bgm/`

约定一首歌对应一个文件夹：

- 文件夹命名格式：`歌曲名【艺术家】`
  - 示例：
    - `天狗舞踏会【Foxtail-Grass Studio】`
    - `风神少女【上海アリス幻樂団】`

每个歌曲文件夹中：

- 音频文件：任意命名，后缀为以下之一：
  - `.mp3`、`.flac`、`.ogg`、`.wav`、`.m4a`、`.aac`、`.webm`
- 封面图：任意命名，后缀为以下之一：
  - `.jpg`、`.jpeg`、`.png`、`.gif`、`.webp`、`.bmp`
- 歌词文件：
  - 必须为 `.lrc` 后缀，任意文件名。

每个歌曲文件夹应当满足：

- “至少且只期望有 1 个音频 + 1 张图片 + 1 个 `.lrc` 文件”。

### 2. 自动生成歌单 `playlist.json`

脚本位置：

- `generate_playlist.py`：`/generate_playlist.py:1`

核心行为：

- 扫描 `static/bgm/` 下所有子文件夹。
- 使用正则 `(.+?)【(.+?)】$` 从文件夹名中解析：
  - `name`：`【】` 之前的部分。
  - `artist`：`【】` 中的部分。
- 在每个子文件夹中：
  - 选择第一个匹配音频后缀的文件作为 `url`。
  - 选择第一个匹配图片后缀的文件作为 `cover`。
  - 选择第一个 `.lrc` 文件作为 `lrc`。
- 生成数组并写入：
  - `static/bgm/playlist.json`。

生成示例（实际内容由目录结构决定）：

```json
[
  {
    "name": "天狗舞踏会",
    "artist": "Foxtail-Grass Studio",
    "url": "./static/bgm/天狗舞踏会【Foxtail-Grass Studio】/天狗舞踏会.mp3",
    "cover": "./static/bgm/天狗舞踏会【Foxtail-Grass Studio】/天狗舞踏会.jpg",
    "lrc": "./static/bgm/天狗舞踏会【Foxtail-Grass Studio】/天狗舞踏会.lrc"
  }
]
```

使用方式（每次变更 BGM 文件夹后执行）：

```bash
cd /Users/page/Documents/GitHub/KirisameMarisa-DAZE.github.io
python3 generate_playlist.py
```

GitHub Pages 不支持在运行时列目录，因此通过此脚本预先生成静态 `playlist.json`，播放器即可在前端正常读取。

### 3. 播放器初始化与歌词同步

播放器主要代码位置：

- `index.html` 中的内联脚本：`/index.html:54` 起。

关键点：

- APlayer 初始化时 `audio` 为空数组，由前端在页面加载后通过 `fetch('./static/bgm/playlist.json')` 获取列表，并逐条 `ap.list.add(item)`。
- 歌词相关：
  - `lrc` 字段为每首歌对应的 `.lrc` 文件地址。
  - `parseLrc` 将 `.lrc` 文本解析为时间戳 + 行文本。
  - `loadCustomLrc` 在切歌时加载相应歌词。
  - `updateCurrentLrc` 在 `timeupdate` 事件中同步当前高亮行。

添加新歌时，只需：

1. 按上述规则增加 `static/bgm/` 下的歌曲文件夹。
2. 执行 `python3 generate_playlist.py` 重新生成 `playlist.json`。
3. 推送到 GitHub 之后，APlayer 会自动展示新歌并显示对应歌词。

---

## HTML 纯前端加密（Staticrypt）

下载页面等敏感内容使用 [Staticrypt](https://github.com/robinmoisson/staticrypt) 进行纯前端加密。  
核心思路是：对原始 HTML 进行加密，生成一个包含解密逻辑的 HTML，用户在前端输入密码后解密并展示原页面内容。

### 1. 环境准备与密钥传递

推荐通过环境变量传递密码，避免在命令历史中留下明文：

```bash
export STATICRYPT_PASSWORD=********
```

之后运行 `staticrypt` 时，如果未显式指定 `-p` 参数，会自动读取该环境变量作为密码。

### 2. 基本加密命令

通用形式：

```bash
staticrypt A.html \
  -t my_template.html \
  --template-title "Protected Page" \
  --template-instructions "To unlock this file, you should enter the author's mail address." \
  --remember 1
```

参数说明：

- `A.html`：要加密的源 HTML 文件。
- `-t my_template.html`：自定义模板文件路径。
- `--template-title`：密码输入页面标题（默认为 `"Protected Page"`）。
- `--template-instructions`：密码提示语。
- `--remember`：记住密码的天数（设置为 `1` 表示 1 天内不再要求输入密码）。

更多用法参考：

- 官方仓库：https://github.com/robinmoisson/staticrypt  
- 在线快速加密：https://robinmoisson.github.io/staticrypt/

### 3. 实际使用示例

#### 3.1 下载页加密

```bash
staticrypt \
  /Users/page/Documents/GitHub/KirisameMarisa-DAZE.github.io/download/download.html \
  -t /Users/page/Documents/GitHub/KirisameMarisa-DAZE.github.io/template/my_template.html \
  --template-title "Protected Page" \
  --template-instructions "To unlock this file, you should enter the author's mail address." \
  --remember 1 \
  -d /Users/page/Documents
```

#### 3.2 关于页加密

```bash
staticrypt \
  /Users/page/Documents/GitHub/KirisameMarisa-DAZE.github.io/about-us/about-us.html \
  -t /Users/page/Documents/GitHub/KirisameMarisa-DAZE.github.io/template/my_template.html \
  --template-title "Protected Page" \
  --template-instructions "To unlock this file, you should enter the author's mail address." \
  --remember 1 \
  -d /Users/page/Documents
```

#### 3.3 生成带分享链接的加密页

如果需要同时生成一个带分享信息的 HTML，可以添加 `--share` 参数：

```bash
staticrypt \
  /Users/page/Documents/GitHub/KirisameMarisa-DAZE.github.io/download/download.html \
  -t /Users/page/Documents/GitHub/KirisameMarisa-DAZE.github.io/template/my_template.html \
  --template-title "Protected Page" \
  --template-instructions "To unlock this file, you should enter the author's mail address." \
  --remember 1 \
  -d /Users/page/Documents \
  --share https://shameimaru-ayaya.github.io/download/index.html
```

注意：

- 若命令未如期输出文件，可尝试先去掉 `--share` 参数排查问题。

### 4. 自定义模板 `my_template.html`

模板文件中通常会包含背景图像等静态资源引用。  
需要根据“生成后文件的实际目录”而不是 `my_template.html` 所在位置，调整背景图像的相对路径。

建议做法：

1. 打开 `my_template.html`。
2. 使用编辑器搜索：
   - `background: url('./static/img/`
3. 根据加密文件的输出位置，合理修改路径前缀中的 `.` 个数（如 `./`、`../`、`../../` 等），确保浏览器实际能访问到对应图片。

---

## 部署到 GitHub Pages

仓库已配置为 GitHub Pages 站点，典型步骤：

1. 提交本地修改：

   ```bash
   git add .
   git commit -m "update site"
   git push origin main
   ```

2. 在 GitHub 仓库设置中确认：
   - Pages 来源为 `main` 分支。

3. 等待数十秒到数分钟，访问：
   - `https://shameimaru-ayaya.github.io/`

如修改了 `static/bgm/` 下的内容，记得先执行 `python3 generate_playlist.py`，再提交推送。

---

## 注意事项与小贴士

- BGM 目录：
  - 任何新歌均通过“新增文件夹 + 运行 `generate_playlist.py`”完成，无需修改前端代码。
  - 文件夹命名中的 `【】` 为解析 `name` / `artist` 的唯一依据，请保持格式。
- Staticrypt：
  - 密码尽量通过环境变量传递，避免直接写入命令行历史。
  - 修改模板路径时，重点关注相对路径的起点目录。
- 本地预览：
  - 尽量通过 `http://localhost:PORT/` 访问，避免直接打开 `file://` 协议导致资源路径和脚本行为异常。

如需补充更多页面功能说明或运维细节，可在本 README 中继续扩展对应章节。  
