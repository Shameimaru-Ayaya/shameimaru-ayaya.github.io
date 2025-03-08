from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.primitives import padding
from cryptography.hazmat.backends import default_backend
from hashlib import sha256
import os

def encrypt_file(input_path, output_path, password):
    """使用AES-CBC加密文件，并在加密数据中嵌入原始文件名"""
    try:
        # 检查输入文件是否存在
        if not os.path.exists(input_path):
            raise FileNotFoundError(f"输入文件不存在: {input_path}")
            
        # 转换为绝对路径
        input_path = os.path.abspath(input_path)
        output_path = os.path.abspath(output_path)
        
        # 网站特定的盐值（可以是一个复杂的字符串）
        SITE_SALT = b"Yk9x#mP2$L8n&vR4@jW7"
        
        # 将密码和网站盐值组合生成最终密钥
        combined = password.encode('utf-8') + SITE_SALT
        key_material = sha256(combined).digest()  # 使用SHA256生成固定长度的密钥材料
        key = key_material[:32]  # 取前32字节作为AES密钥
        
        # 生成随机IV
        iv = os.urandom(16)
        
        # 获取原始文件名
        original_filename = os.path.basename(input_path)
        filename_bytes = original_filename.encode('utf-8')
        if len(filename_bytes) > 65535:
            raise ValueError("文件名过长（最大支持65535字节）")
        
        # 用2个字节存储文件名长度
        filename_len = len(filename_bytes).to_bytes(2, 'big')
        
        # 读取文件内容
        with open(input_path, 'rb') as f:
            file_data = f.read()
        if input_path.endswith('.txt'):
            # 确保文本内容被正确处理为二进制
            file_data = file_data.decode('utf-8').encode('utf-8')
        
        # 在构建数据包之前添加调试信息
        print(f"[调试] 文件名长度: {len(filename_bytes)} 字节")
        print(f"[调试] 文件名: {original_filename}")
        print(f"[调试] 文件内容长度: {len(file_data)} 字节")
        
        # 构建完整数据包：文件名长度 + 文件名 + 文件内容
        full_data = filename_len + filename_bytes + file_data
        
        print(f"[调试] 完整数据包长度: {len(full_data)} 字节")
        print(f"[调试] 文件名长度字节: {filename_len.hex()}")
        print(f"[调试] 数据包前32字节: {full_data[:32].hex()}")
        
        # 使用PKCS7填充（确保16字节对齐）
        padder = padding.PKCS7(128).padder()
        padded_data = padder.update(full_data) + padder.finalize()
        
        # 创建加密器
        cipher = Cipher(algorithms.AES(key), modes.CBC(iv), backend=default_backend())
        encryptor = cipher.encryptor()
        
        # 加密数据
        encrypted_data = encryptor.update(padded_data) + encryptor.finalize()
        
        # 确保输出目录存在
        os.makedirs(os.path.dirname(output_path), exist_ok=True)
        
        # 保存加密文件
        with open(output_path, 'wb') as f:
            f.write(encrypted_data)

        # 验证填充结果（调试用）
        print(f"[调试] 原始数据长度: {len(full_data)}")
        print(f"[调试] 填充后长度: {len(padded_data)}")
        print(f"[调试] 填充字节: {padded_data[-16:]}")
        print(f"[调试] 填充前最后16字节: {full_data[-16:].hex()}")
        print(f"[调试] 填充后最后16字节: {padded_data[-16:].hex()}")

        # ===== 新增：计算加密后文件哈希 =====
        encrypted_hash = sha256(encrypted_data).hexdigest()
        
        # 存储哈希值到独立文件
        hash_dir = os.path.join(os.path.dirname(output_path), "hash")
        os.makedirs(hash_dir, exist_ok=True)
        hash_filename = os.path.basename(output_path) + ".hash"
        hash_path = os.path.join(hash_dir, hash_filename)
        
        with open(hash_path, 'w') as f:
            f.write(f"SHA256|{encrypted_hash}")

        # 调试输出
        print(f"[哈希] 加密文件哈希: {encrypted_hash}")

        # 存储IV（公钥）到独立文件
        key_dir = os.path.join(os.path.dirname(output_path), "keys")
        os.makedirs(key_dir, exist_ok=True)
        key_filename = os.path.basename(output_path) + ".iv"
        key_path = os.path.join(key_dir, key_filename)
        
        with open(key_path, 'wb') as f:
            f.write(iv)  # 只存储IV

        # 调试输出
        print(f"[公钥] 随机IV: {iv.hex()}")

    except Exception as e:
        print(f"加密过程中出现错误: {str(e)}")
        raise

if __name__ == "__main__":
    try:
        # 使用固定密码（使用Unicode字符串）
        PASSWORD = u"あなた、ご自分の事ばかりですのね"
        
        # 使用绝对路径
        input_file = "/Users/page/Documents/由荷叶表面的超疏水自洁性展开的思考.pdf"
        
        # 获取当前工作目录（网站根目录）
        current_dir = os.getcwd()
        output_file = os.path.join(current_dir, "static", "resources", "encrypted_001.bin")
        
        # 检查输入文件是否存在
        if not os.path.exists(input_file):
            print(f"错误：输入文件不存在: {input_file}")
            print(f"当前工作目录: {os.getcwd()}")
            exit(1)
            
        encrypt_file(input_file, output_file, PASSWORD)
        print("文件加密完成")
        
    except Exception as e:
        print(f"程序执行出错: {str(e)}")
        exit(1)