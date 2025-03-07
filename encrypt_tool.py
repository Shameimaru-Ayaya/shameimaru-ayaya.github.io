from cryptography.fernet import Fernet
import base64
import os

def generate_key(password):
    """从密码生成Fernet密钥"""
    # 确保密钥长度为32字节
    password_bytes = password.encode('utf-8')
    key = password_bytes[:32].ljust(32, b'\0')
    # 转换为Fernet可用的base64格式
    return base64.urlsafe_b64encode(key)

def encrypt_file(input_path, output_path, password):
    # 生成密钥
    key = generate_key(password)
    f = Fernet(key)
    
    # 读取并加密文件
    with open(input_path, 'rb') as file:
        file_data = file.read()
    
    encrypted_data = f.encrypt(file_data)
    
    # 确保输出目录存在
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    
    # 保存加密文件
    with open(output_path, 'wb') as file:
        file.write(encrypted_data)

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
    input_file = "pdf.pdf"  # 你要加密的文件
    output_file = "./static/resources/encrypted_file_001.bin"  # 加密后的文件位置
    
    encrypt_file(input_file, output_file, PASSWORD)
    print("文件加密完成")