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
        // 获取加密文件
        const response = await fetch(currentFilePath);
        const encryptedData = await response.arrayBuffer();

        // ===== 新增：哈希验证阶段 =====
        // 获取存储的哈希值
        const hashPath = currentFilePath.replace('/resources/', '/resources/hash/') + '.hash';
        const hashResponse = await fetch(hashPath);
        if (!hashResponse.ok) throw new Error("哈希文件缺失");
        
        const storedHash = await hashResponse.text();
        const [algo, expectedHash] = storedHash.split('|');
        
        // 计算实际哈希
        const hashBuffer = await crypto.subtle.digest('SHA-256', encryptedData);
        const actualHash = Array.from(new Uint8Array(hashBuffer))
            .map(b => b.toString(16).padStart(2, '0')).join('');

        if (actualHash !== expectedHash.toLowerCase()) {
            throw new Error(`文件校验失败\n存储哈希: ${expectedHash}\n实际哈希: ${actualHash}`);
        }

        const password = document.getElementById('password').value;
        if (!password) {
            showError('请输入密码');
            return;
        }

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

        let decryptedArray = new Uint8Array(decrypted);

        // 先处理整个数据块的PKCS7填充
        const paddingLength = decryptedArray[decryptedArray.length - 1];
        decryptedArray = decryptedArray.slice(0, -paddingLength); // 移除填充后的完整数据

        // 解析文件名长度（前2字节）
        const filenameLen = (decryptedArray[0] << 8) + decryptedArray[1];

        // 验证文件名长度有效性（新增完整校验）
        if (
            filenameLen < 0 || 
            filenameLen > (decryptedArray.length - 2) || 
            filenameLen > 65535  // 最大支持65535字节文件名
        ) {
            throw new Error("文件名长度无效");
        }

        // 提取文件名（UTF-8解码）
        const filenameBytes = decryptedArray.slice(2, 2 + filenameLen);
        const originalFileName = new TextDecoder().decode(filenameBytes);
        
        // 提取文件内容（剩余部分）
        const fileData = decryptedArray.slice(2 + filenameLen);

        // 创建下载文件
        const blob = new Blob([fileData]);
        const url = URL.createObjectURL(blob);
        
        showContent(`
            <div style="text-align: center; padding: 20px;">
                <p>文件已解密</p>
                <a href="${url}" download="${originalFileName}" 
                   class="download-btn">
                    下载文件 (${originalFileName})
                </a>
            </div>
        `);

        // 隐藏密码输入框
        document.getElementById('password-form').style.display = 'none';
        document.getElementById('error-message').style.display = 'none';
    } catch (error) {
        console.error('解密失败:', error);
        showError(error.message.includes("填充") ? "文件格式错误" : "密码错误或文件损坏");
        showError(error.message.includes("哈希") ? `文件被篡改: ${error.message}` : error.message);
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