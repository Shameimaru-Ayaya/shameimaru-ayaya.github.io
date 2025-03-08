from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.backends import default_backend
import os

def encrypt_file(input_path, output_path):
    """使用简单的AES-CBC加密文件"""
    # 使用固定密钥
    PASSWORD = "あなた、ご自分の事ばかりですのね"
    key = PASSWORD.encode('utf-8')[:32].ljust(32, b'\0')
    iv = b'\0' * 16  # 使用固定的全零IV
    
    # 获取原始文件扩展名
    _, ext = os.path.splitext(input_path)
    
    # 创建加密器
    cipher = Cipher(algorithms.AES(key), modes.CBC(iv), backend=default_backend())
    encryptor = cipher.encryptor()
    
    # 读取文件
    with open(input_path, 'rb') as f:
        data = f.read()
    
    # 添加PKCS7填充
    padding_length = 16 - (len(data) % 16)
    data += bytes([padding_length] * padding_length)
    
    # 加密数据
    encrypted_data = encryptor.update(data) + encryptor.finalize()
    
    # 在加密数据前添加原始扩展名信息（使用固定长度）
    ext_bytes = ext.encode('utf-8').ljust(16, b'\0')
    final_data = ext_bytes + encrypted_data
    
    # 确保输出目录存在
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    
    # 保存加密文件
    with open(output_path, 'wb') as f:
        f.write(final_data)

if __name__ == "__main__":
    # 创建一个测试文本文件
    test_content = "这是一个测试文件。如果你能看到这段文字，说明解密成功了！"
    with open("test.txt", "w", encoding='utf-8') as f:
        f.write(test_content)
    
    # 加密测试文件
    encrypt_file("test.txt", "./static/resources/test.bin")
    print("测试文件加密完成")
    
    # 加密PDF文件
    encrypt_file("../../pdf.pdf", "./static/resources/document.bin")
    print("PDF文件加密完成") 