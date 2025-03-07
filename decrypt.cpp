// decrypt.cpp - 将被编译为 WebAssembly
#include <emscripten/bind.h>
#include <vector>
#include <string>

using namespace emscripten;

class Decryptor {
private:
    std::vector<uint8_t> key;
    bool isValid;

    void clearKey() {
        for(size_t i = 0; i < key.size(); i++) {
            key[i] = 0;
        }
        isValid = false;
    }

public:
    Decryptor() : isValid(false) {}

    bool initialize(const std::string& timestamp, const std::string& hmac) {
        // 验证时间戳和HMAC
        if (!validateRequest(timestamp, hmac)) {
            return false;
        }
        
        // 初始化密钥（这里使用混淆后的方式生成密钥）
        key = generateKey();
        isValid = true;
        return true;
    }

    std::vector<uint8_t> decrypt(const std::vector<uint8_t>& data) {
        if (!isValid) {
            return std::vector<uint8_t>();
        }

        std::vector<uint8_t> result;
        // 实现AES解密逻辑
        // ...

        // 使用完立即清除密钥
        clearKey();
        return result;
    }

    void selfDestruct() {
        clearKey();
    }
};

EMSCRIPTEN_BINDINGS(decryptor) {
    class_<Decryptor>("Decryptor")
        .constructor()
        .function("initialize", &Decryptor::initialize)
        .function("decrypt", &Decryptor::decrypt)
        .function("selfDestruct", &Decryptor::selfDestruct);
} 