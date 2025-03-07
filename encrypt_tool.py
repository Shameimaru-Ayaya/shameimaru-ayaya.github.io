from cryptography.fernet import Fernet
import base64
import requests
import os

def download_file(url):
    """从URL下载文件并返回文件内容"""
    response = requests.get(url)
    response.raise_for_status()  # 如果请求失败则抛出异常
    return response.content

def encrypt_file(input_path, output_path):
    # 使用固定密钥
    fixed_key = "あなた、ご自分の事ばかりですのね".encode('utf-8')
    # 确保密钥长度为32字节
    key = base64.urlsafe_b64encode(fixed_key[:32].ljust(32, b'\0'))
    
    f = Fernet(key)
    
    # 判断输入是URL还是本地文件路径
    if input_path.startswith(('http://', 'https://')):
        file_data = download_file(input_path)
    else:
        # 如果是本地文件，按原来的方式读取
        with open(input_path, 'rb') as file:
            file_data = file.read()
    
    encrypted_data = f.encrypt(file_data)
    
    # 确保输出目录存在
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    
    # 保存加密文件
    with open(output_path, 'wb') as file:
        file.write(encrypted_data)

if __name__ == "__main__":
    input_file = "pdf.pdf"  # 你要加密的文件
    output_file = "./static/resources/encrypted_file_001.bin"  # 加密后的文件位置
    
    try:
        encrypt_file(input_file, output_file)
        print("文件加密完成")
    except Exception as e:
        print(f"加密过程中出现错误: {str(e)}")