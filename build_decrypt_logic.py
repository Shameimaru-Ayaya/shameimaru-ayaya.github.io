import javascript_obfuscator
import json

def generate_obfuscated_js():
    # 读取原始的 decrypt-logic.js
    with open('decrypt-logic.js', 'r') as f:
        js_code = f.read()
    
    # 配置混淆选项
    options = {
        'compact': True,
        'controlFlowFlattening': True,
        'controlFlowFlatteningThreshold': 1,
        'numbersToExpressions': True,
        'simplify': True,
        'stringArrayShuffle': True,
        'splitStrings': True,
        'stringArrayThreshold': 1
    }
    
    # 混淆代码
    obfuscated = javascript_obfuscator.obfuscate(js_code, options)
    
    # 保存混淆后的代码
    with open('decrypt-logic.min.js', 'w') as f:
        f.write(str(obfuscated))

if __name__ == '__main__':
    generate_obfuscated_js() 