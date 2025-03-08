let currentFilePath = null;
let currentFileType = null;

// 初始化事件监听器
document.addEventListener('DOMContentLoaded', function() {
    // 为所有打开按钮添加事件监听器
    document.querySelectorAll('.open-btn').forEach(button => {
        button.addEventListener('click', function() {
            const fileItem = this.parentElement;
            openFile(fileItem);
        });
    });

    // 解密按钮
    document.getElementById('decrypt-btn').addEventListener('click', decryptFile);

    // 取消按钮
    document.getElementById('cancel-btn').addEventListener('click', cancelDecrypt);

    // 关闭按钮
    document.getElementById('close-btn').addEventListener('click', closeContent);

    // 密码输入框回车事件
    document.getElementById('password').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            decryptFile();
        }
    });
});

function openFile(fileItem) {
    currentFilePath = fileItem.dataset.path;
    currentFileType = fileItem.dataset.type;
    
    if (currentFileType === 'encrypted') {
        // 显示密码输入框
        document.getElementById('password-form').style.display = 'block';
        document.getElementById('error-message').style.display = 'none';
        document.getElementById('password').value = '';
        document.getElementById('password').focus();
    } else if (currentFileType === 'image') {
        // 直接显示图片
        showContent(`<img src="${currentFilePath}" style="max-width: 100%;">`);
    }
}

async function decryptFile() {
    try {
        const password = document.getElementById('password').value;
        if (!password) {
            showError('请输入密码');
            return;
        }

        // 获取加密文件
        const response = await fetch(currentFilePath);
        const encryptedData = await response.arrayBuffer();
        
        // 准备32字节密钥
        const encoder = new TextEncoder();
        const keyBytes = encoder.encode(password).slice(0, 32);
        const paddedKey = new Uint8Array(32);
        paddedKey.set(keyBytes);  // 自动补0到32字节
        
        // 准备16字节IV（全零）
        const iv = new Uint8Array(16);
        
        // 导入密钥
        const key = await window.crypto.subtle.importKey(
            'raw',
            paddedKey.buffer,
            { name: 'AES-CBC', length: 256 },
            false,
            ['decrypt']
        );
        
        // 解密
        const decrypted = await window.crypto.subtle.decrypt(
            {
                name: 'AES-CBC',
                iv: iv
            },
            key,
            encryptedData
        );

        // 解析解密后的数据
        let decryptedArray = new Uint8Array(decrypted);
        
        // 验证并移除PKCS7填充
        const paddingLength = decryptedArray[decryptedArray.length - 1];
        // 验证填充有效性
        if (paddingLength < 1 || paddingLength > 16 || decryptedArray.length < paddingLength) {
            throw new Error("无效填充");
        }
        decryptedArray = decryptedArray.slice(0, -paddingLength); // 移除填充后的完整数据
        
        // 验证最小数据长度
        if (decryptedArray.length < 2) {
            throw new Error("数据损坏");
        }
        
        // 读取文件名长度（前2字节）
        const filenameLen = (decryptedArray[0] << 8) + decryptedArray[1];
        
        // 验证文件名长度有效性
        if (filenameLen < 0 || filenameLen > decryptedArray.length - 2) {
            throw new Error("文件名长度无效");
        }
        
        // 提取文件名
        const filenameBytes = decryptedArray.slice(2, 2 + filenameLen);
        const originalFileName = new TextDecoder().decode(filenameBytes);
        
        // 提取文件内容（剩余部分）
        const fileData = decryptedArray.slice(2 + filenameLen);
        
        // 创建blob并设置正确的文件名
        const blob = new Blob([fileData]);
        const url = URL.createObjectURL(blob);
        
        showContent(`
            <div style="text-align: center; padding: 20px;">
                <p>文件已解密</p>
                <a href="${url}" download="${originalFileName}" 
                   class="download-btn" 
                   style="display: inline-block; 
                          padding: 10px 20px; 
                          background: #4CAF50; 
                          color: white; 
                          text-decoration: none; 
                          border-radius: 4px;">
                    下载文件 (${originalFileName})
                </a>
            </div>
        `);

        // 隐藏密码输入框
        document.getElementById('password-form').style.display = 'none';
        document.getElementById('error-message').style.display = 'none';
    } catch (error) {
        console.error('解密失败:', error);
        showError(error.message || '密码错误或文件损坏');
    }
}

function showContent(html) {
    const contentBody = document.getElementById('content-body');
    contentBody.innerHTML = html;
    document.getElementById('content').style.display = 'block';
}

function closeContent() {
    const content = document.getElementById('content-body');
    // 找到所有的 blob URL 并释放
    const blobUrls = content.querySelectorAll('a[href^="blob:"]');
    blobUrls.forEach(element => {
        URL.revokeObjectURL(element.href);
    });
    
    document.getElementById('content').style.display = 'none';
    content.innerHTML = '';
}

function cancelDecrypt() {
    document.getElementById('password-form').style.display = 'none';
    document.getElementById('error-message').style.display = 'none';
    currentFilePath = null;
    currentFileType = null;
}

function showError(message) {
    const errorDiv = document.getElementById('error-message');
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
} 