from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.backends import default_backend
import sys

def decrypt_file(input_path, output_path, password):
    """使用简单的AES-CBC解密文件"""
    # 准备32字节的密钥
    key = password.encode('utf-8')[:32].ljust(32, b'\0')
    # 使用固定的全零IV
    iv = b'\0' * 16
    
    # 创建解密器
    cipher = Cipher(algorithms.AES(key), modes.CBC(iv), backend=default_backend())
    decryptor = cipher.decryptor()
    
    # 读取加密文件
    with open(input_path, 'rb') as f:
        encrypted_data = f.read()
    
    # 解密数据
    decrypted_data = decryptor.update(encrypted_data) + decryptor.finalize()
    
    # 移除PKCS7填充
    padding_length = decrypted_data[-1]
    decrypted_data = decrypted_data[:-padding_length]
    
    # 保存解密后的文件
    with open(output_path, 'wb') as f:
        f.write(decrypted_data)

if __name__ == "__main__":
    PASSWORD = "password"
    
    if len(sys.argv) != 3:
        print("使用方法: python decrypt_tool.py <加密文件路径> <输出文件路径>")
        sys.exit(1)
        
    try:
        decrypt_file(sys.argv[1], sys.argv[2], PASSWORD)
        print(f"解密成功！解密后的文件已保存为: {sys.argv[2]}")
    except Exception as e:
        print(f"解密失败: {str(e)}") 