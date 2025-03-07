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
        
        // 准备密钥（与Python端使用相同的密钥生成方式）
        const encoder = new TextEncoder();
        const keyBytes = encoder.encode(password).slice(0, 32);
        const paddedKey = new Uint8Array(32);
        paddedKey.set(keyBytes);  // 自动补0到32字节
        
        // 转换为base64url格式（与Fernet兼容）
        const base64Key = btoa(String.fromCharCode.apply(null, paddedKey))
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=+$/, '');
        
        // 解析Fernet令牌
        const data = new Uint8Array(encryptedData);
        
        // 版本（1字节）
        if (data[0] !== 128) {
            throw new Error('无效的加密文件格式');
        }
        
        // 时间戳（8字节）
        // const timestamp = new DataView(data.buffer, 1, 8).getBigUint64(0);
        
        // IV（16字节）
        const iv = data.slice(9, 25);
        
        // 密文
        const ciphertext = data.slice(25, -32);
        
        // HMAC（32字节）
        // const hmac = data.slice(-32);
        
        // 导入密钥
        const key = await window.crypto.subtle.importKey(
            'raw',
            paddedKey,
            { name: 'AES-CBC' },
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
            ciphertext
        );

        // 检测文件类型并显示
        const decryptedArray = new Uint8Array(decrypted);
        if (decryptedArray.slice(0, 4).every((b, i) => b === [0x25, 0x50, 0x44, 0x46][i])) {
            // 是 PDF 文件
            const blob = new Blob([decrypted], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            showContent(`<embed src="${url}" width="100%" height="600px" type="application/pdf">`);
        } else {
            // 尝试作为文本显示
            const decoder = new TextDecoder();
            const text = decoder.decode(decrypted);
            showContent(`<pre>${text}</pre>`);
        }

        // 隐藏密码输入框
        document.getElementById('password-form').style.display = 'none';
        document.getElementById('error-message').style.display = 'none';
    } catch (error) {
        console.error('解密失败:', error);
        showError('密码错误或文件损坏');
    }
}

function showContent(html) {
    const contentBody = document.getElementById('content-body');
    contentBody.innerHTML = html;
    document.getElementById('content').style.display = 'block';
}

function closeContent() {
    document.getElementById('content').style.display = 'none';
    document.getElementById('content-body').innerHTML = '';
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