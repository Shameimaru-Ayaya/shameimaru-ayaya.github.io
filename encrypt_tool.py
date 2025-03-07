import os
import hashlib
import hmac
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.backends import default_backend
import random
import json

class FileEncryptor:
    def __init__(self, secret_key):
        self.secret_key = secret_key.encode('utf-8')
        self.chunk_size = 1024 * 1024  # 1MB per chunk

    def generate_file_id(self):
        return hashlib.sha256(os.urandom(32)).hexdigest()[:16]

    def split_and_encrypt_file(self, input_path, output_dir):
        # 读取原文件
        with open(input_path, 'rb') as f:
            data = f.read()

        # 生成文件ID
        file_id = self.generate_file_id()
        
        # 分片加密
        chunks = []
        for i in range(0, len(data), self.chunk_size):
            chunk = data[i:i + self.chunk_size]
            
            # 为每个分片生成随机IV
            iv = os.urandom(16)
            
            # 加密分片
            cipher = Cipher(algorithms.AES(self.secret_key), modes.CBC(iv), 
                          backend=default_backend())
            encryptor = cipher.encryptor()
            encrypted_chunk = encryptor.update(chunk) + encryptor.finalize()
            
            # 生成随机文件名
            chunk_name = hashlib.sha256(os.urandom(32)).hexdigest()[:16]
            
            # 保存加密分片
            chunk_path = os.path.join(output_dir, chunk_name + '.bin')
            with open(chunk_path, 'wb') as f:
                f.write(iv + encrypted_chunk)
            
            chunks.append(chunk_name)

        # 生成元数据
        metadata = {
            'id': file_id,
            'chunks': chunks,
            'total_size': len(data)
        }

        return metadata

    def generate_access_token(self, file_id, timestamp):
        # 生成HMAC签名
        message = f"{file_id}:{timestamp}".encode('utf-8')
        signature = hmac.new(self.secret_key, message, hashlib.sha256).hexdigest()
        return signature

if __name__ == "__main__":
    # 配置
    SECRET_KEY = "your-secret-key-here"  # 更改为你的密钥
    INPUT_FILE = "example.pdf"
    OUTPUT_DIR = "../static/img/encrypted-files"
    METADATA_DIR = "../static/img/metadata"

    # 创建输出目录
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    os.makedirs(METADATA_DIR, exist_ok=True)

    # 加密文件
    encryptor = FileEncryptor(SECRET_KEY)
    metadata = encryptor.split_and_encrypt_file(INPUT_FILE, OUTPUT_DIR)

    # 保存元数据
    metadata_path = os.path.join(METADATA_DIR, f"{metadata['id']}.json")
    with open(metadata_path, 'w') as f:
        json.dump(metadata, f)

    print(f"File encrypted successfully. File ID: {metadata['id']}")