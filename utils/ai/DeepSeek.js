import axios from 'axios';

// https://platform.deepseek.com/usage
// https://platform.deepseek.com/api_keys
class DeepSeek {
    constructor({apiKey, baseURL}) {
        if (!apiKey) {
            throw new Error('Missing required configuration parameters.');
        }
        this.apiKey = apiKey;
        this.baseURL = baseURL || 'https://api.deepseek.com';
    }

    async ask(prompt, options = {}) {
        const payload = {
            model: 'deepseek-chat', // 使用的模型名称
            user: "道长",
            messages: [
                {role: "system", content: "你是一名优秀的AI助手，知道最新的互联网内容，善用搜索引擎和github并总结最贴切的结论来回答我提出的每一个问题"},
                {
                    role: 'user',
                    content: prompt
                }],
            ...options, // 其他选项，如 temperature、max_tokens 等
        };

        try {
            const response = await axios.post(`${this.baseURL}/chat/completions`, payload, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${this.apiKey}`, // 使用鉴权信息
                },
            });

            if (response.data && response.data.choices) {
                return response.data.choices[0].message.content;
            } else {
                throw new Error(
                    `Error from DeepSeek AI: ${response.data.error || 'Unknown error'}`
                );
            }
        } catch (error) {
            console.error('Error while communicating with DeepSeek AI:', error.message);
            throw error;
        }
    }
}

export default DeepSeek;