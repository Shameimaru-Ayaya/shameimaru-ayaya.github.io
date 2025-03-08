from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.primitives import padding
from cryptography.hazmat.backends import default_backend
import os
import argparse

def decrypt_file(encrypted_path, output_dir, password):
    """解密AES-CBC加密文件并恢复原始文件名"""
    # 读取加密文件
    with open(encrypted_path, 'rb') as f:
        encrypted_data = f.read()

    # 生成密钥（与加密逻辑严格一致）
    key = password.encode('utf-8')[:32].ljust(32, b'\0')
    iv = b'\0' * 16  # 固定IV

    # 创建解密器
    cipher = Cipher(algorithms.AES(key), modes.CBC(iv), backend=default_backend())
    decryptor = cipher.decryptor()

    # 解密数据
    padded_data = decryptor.update(encrypted_data) + decryptor.finalize()

    # 移除PKCS7填充
    unpadder = padding.PKCS7(128).unpadder()
    try:
        full_data = unpadder.update(padded_data) + unpadder.finalize()
    except ValueError:
        raise ValueError("无效填充，可能密码错误或文件损坏")

    # 解析文件名元数据
    if len(full_data) < 2:
        raise ValueError("文件元数据不完整")
    
    # 读取文件名长度（大端2字节）
    filename_len = int.from_bytes(full_data[:2], byteorder='big')
    
    # 验证文件名长度有效性
    if filename_len < 0 or (2 + filename_len) > len(full_data):
        raise ValueError(f"无效的文件名长度: {filename_len}")
    
    # 提取文件名和内容
    filename_bytes = full_data[2: 2 + filename_len]
    original_filename = filename_bytes.decode('utf-8')
    file_content = full_data[2 + filename_len:]

    # 构建输出路径
    os.makedirs(output_dir, exist_ok=True)
    output_path = os.path.join(output_dir, original_filename)

    # 保存解密文件
    with open(output_path, 'wb') as f:
        f.write(file_content)

    print(f"解密成功: {original_filename} -> {output_path}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='AES-CBC文件解密工具')
    parser.add_argument('input', help='加密文件路径')
    parser.add_argument('-o', '--output', default='./decrypted', 
                       help='输出目录（默认: ./decrypted）')
    parser.add_argument('-p', '--password', required=True,
                       help='解密密码（与加密时相同）')

    args = parser.parse_args()
    
    try:
        decrypt_file(args.input, args.output, args.password)
    except Exception as e:
        print(f"解密失败: {str(e)}")
        exit(1)