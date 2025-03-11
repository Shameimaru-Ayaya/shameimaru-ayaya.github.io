# Shameimaru-Ayaya.github.io
Shameimaru Aya's Website

## 1 HTML纯前端加密
### 1.1 通过系统变量传递密钥
```bash
export STATICRYPT_PASSWORD=********
```

### 1.2 加密
```bash
staticrypt A.html -t my_template.html --template-title "Protected Page" --template-instructions "To unlock this file, you should enter the author's mail address." --remember 1
```

A.html：要加密的文件  
my_template.html：模版文件  
--template-title：密码页面标题，默认"Protected Page"  
--template-instructions：密码提示语  
--remember：记住密码，单位为天  
详见：https://github.com/robinmoisson/staticrypt  
快速加密：https://robinmoisson.github.io/staticrypt/

#### 1.2.1 使用例
```bash
staticrypt /Users/page/Documents/GitHub/KirisameMarisa-DAZE.github.io/download/download.html -t /Users/page/Documents/GitHub/KirisameMarisa-DAZE.github.io/template/my_template.html --template-title "Protected Page" --template-instructions "To unlock this file, you should enter the author's mail address." --remember 1 --share https://shameimaru-ayaya.github.io/download/index.html

staticrypt /Users/page/Documents/GitHub/KirisameMarisa-DAZE.github.io/about-us/about-us.html -t /Users/page/Documents/GitHub/KirisameMarisa-DAZE.github.io/template/my_template.html --template-title "Protected Page" --template-instructions "To unlock this file, you should enter the author's mail address." --remember 1 
```

### 1.3 模板`my_template.html`
根据生成的文件希望所在位置，而不是`my_template.html`所在的位置，合理调整背景图像的相对路径  
`command+F`搜索`background: url('./static/img/`进行调整  
重点注意最开头`.`的个数  