// 这个文件会被混淆和编译
(function(){
    let decryptorInstance = null;
    let isDebuggerAttached = false;

    // 检测调试器
    const debugCheck = function() {
        const start = performance.now();
        debugger;
        const end = performance.now();
        if (end - start > 100) {
            isDebuggerAttached = true;
            if (decryptorInstance) {
                decryptorInstance.selfDestruct();
                decryptorInstance = null;
            }
            return true;
        }
        return false;
    };

    // 初始化WebAssembly模块
    const initDecryptor = async function(timestamp, hmac) {
        if (isDebuggerAttached) return null;
        
        try {
            if (!decryptorInstance) {
                const module = await WebAssembly.instantiateStreaming(
                    fetch('/static/wasm/decryptor.wasm'),
                    { env: { } }
                );
                decryptorInstance = new module.instance.exports.Decryptor();
            }
            
            return decryptorInstance.initialize(timestamp, hmac) ? decryptorInstance : null;
        } catch (e) {
            console.error('Failed to initialize decryptor');
            return null;
        }
    };

    // 解密函数
    window._dc = async function(fileId, timestamp) {
        if (debugCheck()) return null;

        try {
            // 获取文件元数据
            const metadataResponse = await fetch(`/static/img/metadata/${fileId}.json`);
            const metadata = await metadataResponse.json();

            // 验证时间戳
            const currentTime = Math.floor(Date.now() / 1000);
            if (currentTime - parseInt(timestamp) > 300) { // 5分钟有效期
                throw new Error('Token expired');
            }

            // 初始化解密器
            const hmac = generateHMAC(fileId, timestamp);
            const decryptor = await initDecryptor(timestamp, hmac);
            if (!decryptor) return null;

            // 获取并解密所有分片
            const chunks = [];
            for (const chunkName of metadata.chunks) {
                const chunkResponse = await fetch(`/static/img/encrypted-files/${chunkName}.bin`);
                const chunkData = new Uint8Array(await chunkResponse.arrayBuffer());
                
                const decrypted = decryptor.decrypt(chunkData);
                if (!decrypted || decrypted.length === 0) {
                    decryptor.selfDestruct();
                    return null;
                }
                
                chunks.push(decrypted);
            }

            // 合并分片
            const result = new Uint8Array(metadata.total_size);
            let offset = 0;
            for (const chunk of chunks) {
                result.set(chunk, offset);
                offset += chunk.length;
            }

            // 清理
            decryptor.selfDestruct();
            return result;
        } catch (e) {
            if (decryptorInstance) {
                decryptorInstance.selfDestruct();
                decryptorInstance = null;
            }
            return null;
        }
    };

    // 启动持续的调试检测
    setInterval(debugCheck, 1000);
})(); 