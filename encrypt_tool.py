from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.backends import default_backend
from cryptography.hazmat.primitives import padding
import os

def encrypt_file(input_path, output_path, password):
    """使用简单的AES-CBC加密文件"""
    # 准备32字节的密钥
    key = password.encode('utf-8')[:32].ljust(32, b'\0')
    # 生成16字节的IV
    iv = b'\0' * 16  # 使用固定的全零IV以简化实现
    
    # 创建加密器
    cipher = Cipher(algorithms.AES(key), modes.CBC(iv), backend=default_backend())
    encryptor = cipher.encryptor()
    
    # 获取原始文件名（含后缀）
    original_filename = os.path.basename(input_path)
    filename_bytes = original_filename.encode('utf-8')
    
    # 用2个字节存储文件名长度（大端序）
    filename_len = len(filename_bytes).to_bytes(2, 'big')
    
    # 读取文件内容
    with open(input_path, 'rb') as f:
        file_data = f.read()
    
    # 构造完整数据包
    full_data = filename_len + filename_bytes + file_data
    
    # 添加PKCS7填充（整个数据包统一填充）
    padder = padding.PKCS7(128).padder()
    padded_data = padder.update(full_data) + padder.finalize()
    
    # 加密并写入文件
    encrypted_data = encryptor.update(padded_data) + encryptor.finalize()
    
    # 确保输出目录存在
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    
    # 保存加密文件
    with open(output_path, 'wb') as f:
        f.write(encrypted_data)

if __name__ == "__main__":
    # 使用固定密钥
    PASSWORD = "password"
    
    # 创建一个测试文本文件
    test_content = "这是一个测试文件。如果你能看到这段文字，说明解密成功了！"
    with open("test.txt", "w", encoding='utf-8') as f:
        f.write(test_content)
    
    # 加密测试文件
    encrypt_file("test.txt", "./static/resources/test_encrypted.bin", PASSWORD)
    print("测试文件加密完成")
    
    # 加密其他文件
    input_file = "../../pdf.pdf"  # 你要加密的文件
    output_file = "./static/resources/encrypted_file_001.bin"  # 加密后的文件位置
    
    encrypt_file(input_file, output_file, PASSWORD)
    print("文件加密完成")