document.addEventListener('DOMContentLoaded', function() {
    // 动态文案循环显示 - 打字机效果
    const dynamicText = document.getElementById('dynamic-text');
    if (dynamicText) {
        const texts = ['"丑"', '"不高级"', '"再试试"'];
        let currentIndex = 0;
        let isDeleting = false;
        let charIndex = 0;
        let typingSpeed = 150; // 打字速度
        let pauseTime = 2000; // 完成后暂停时间，调整为2秒
        
        function typeEffect() {
            const currentText = texts[currentIndex];
            
            if (!isDeleting) {
                // 打字阶段
                if (charIndex < currentText.length) {
                    dynamicText.textContent = currentText.substring(0, charIndex + 1);
                    charIndex++;
                    setTimeout(typeEffect, typingSpeed);
                } else {
                    // 完成打字，等待删除
                    setTimeout(() => {
                        isDeleting = true;
                        typeEffect();
                    }, pauseTime);
                }
            } else {
                // 删除阶段
                if (charIndex > 0) {
                    dynamicText.textContent = currentText.substring(0, charIndex);
                    charIndex--;
                    setTimeout(typeEffect, typingSpeed / 2);
                } else {
                    // 完成删除，切换到下一个文案
                    isDeleting = false;
                    currentIndex = (currentIndex + 1) % texts.length;
                    setTimeout(typeEffect, 500);
                }
            }
        }
        
        // 开始打字机效果
        typeEffect();
    }
    
    // 添加花朵的微小浮动动画
    const flowerImg = document.querySelector('.flower-img');
    if (flowerImg) {
        flowerImg.style.animation = 'floatFlower 4s ease-in-out infinite alternate';
    }
    
    // 添加浮动动画的CSS
    const style = document.createElement('style');
    style.textContent = `
        @keyframes floatFlower {
            0% {
                transform: translateY(0) rotate(0);
            }
            100% {
                transform: translateY(-15px) rotate(2deg);
            }
        }
    `;
    document.head.appendChild(style);
    
    // 图片上传处理
    const imageUploadArea = document.getElementById('image-upload');
    const imageInput = document.getElementById('image-input');
    
    if (imageUploadArea && imageInput) {
        imageUploadArea.addEventListener('click', function() {
            imageInput.click();
        });
        
        imageInput.addEventListener('change', function() {
            if (this.files && this.files[0]) {
                const reader = new FileReader();
                
                reader.onload = function(e) {
                    // 移除上传按钮
                    while (imageUploadArea.firstChild) {
                        imageUploadArea.removeChild(imageUploadArea.firstChild);
                    }
                    
                    // 添加预览图片
                    const img = document.createElement('img');
                    img.src = e.target.result;
                    imageUploadArea.appendChild(img);
                    imageUploadArea.classList.add('with-image');
                    
                    // 存储图片数据到 sessionStorage 以便在反馈页面使用
                    sessionStorage.setItem('uploadedImage', e.target.result);
                };
                
                reader.readAsDataURL(this.files[0]);
            }
        });
        
        // 拖放上传功能
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            imageUploadArea.addEventListener(eventName, preventDefaults, false);
        });
        
        function preventDefaults(e) {
            e.preventDefault();
            e.stopPropagation();
        }
        
        ['dragenter', 'dragover'].forEach(eventName => {
            imageUploadArea.addEventListener(eventName, function() {
                imageUploadArea.classList.add('highlight');
            }, false);
        });
        
        ['dragleave', 'drop'].forEach(eventName => {
            imageUploadArea.addEventListener(eventName, function() {
                imageUploadArea.classList.remove('highlight');
            }, false);
        });
        
        imageUploadArea.addEventListener('drop', function(e) {
            const dt = e.dataTransfer;
            const files = dt.files;
            
            if (files && files[0]) {
                imageInput.files = files;
                
                const reader = new FileReader();
                
                reader.onload = function(e) {
                    // 移除上传按钮
                    while (imageUploadArea.firstChild) {
                        imageUploadArea.removeChild(imageUploadArea.firstChild);
                    }
                    
                    // 添加预览图片
                    const img = document.createElement('img');
                    img.src = e.target.result;
                    imageUploadArea.appendChild(img);
                    imageUploadArea.classList.add('with-image');
                    
                    sessionStorage.setItem('uploadedImage', e.target.result);
                    console.log("image uploaded")
                };
                
                reader.readAsDataURL(files[0]);
            }
        }, false);
    }
    
    // 解析按钮处理
    const resolveButton = document.getElementById('resolve-button');
    const textInput = document.getElementById('text-input');

    
    if (resolveButton && textInput) {
        resolveButton.addEventListener('click', function() {
            const text = textInput.value.trim();
            // 检查是否有文本输入
            if (text === '') {
                alert('请输入老板反馈内容');
                return;
            }
            
            // 显示加载状态
            resolveButton.disabled = true;
            
            // 有趣的加载文案
            const loadingTexts = [
                "检测到甲方第8版需求残留怨气...正在召唤阴阳师修改图层结界",
                "监控到大象对话框散发红光！自动生成24K纯杠精防护罩..."
            ];
            
            // 随机选择一个文案作为起点
            let currentTextIndex = Math.floor(Math.random() * loadingTexts.length);
            let currentText = loadingTexts[currentTextIndex];
            let charIndex = 0;
            let typingSpeed = 100; // 打字速度，从50ms增加到100ms
            
            // 添加弹跳动画的CSS
            if (!document.getElementById('bounce-animation-style')) {
                const bounceStyle = document.createElement('style');
                bounceStyle.id = 'bounce-animation-style';
                bounceStyle.textContent = `
                    .wave-container {
                        position: relative;
                        white-space: nowrap;
                    }
                    .bounce-text {
                        display: inline-block;
                        position: relative;
                        transition: transform 0.3s ease-out;
                    }
                `;
                document.head.appendChild(bounceStyle);
            }
            
            // 创建一个容器来包含所有字符
            const waveContainer = document.createElement('div');
            waveContainer.className = 'wave-container';
            resolveButton.innerHTML = '';
            resolveButton.appendChild(waveContainer);
            
            // 跟踪波峰位置
            let peakPosition = -1;
            let waveInterval;
            
            // 打字机效果函数
            function typeLoadingText() {
                if (charIndex < currentText.length) {
                    // 创建一个span元素包装字符
                    const charSpan = document.createElement('span');
                    charSpan.className = 'bounce-text';
                    charSpan.textContent = currentText.charAt(charIndex);
                    
                    // 添加到容器
                    waveContainer.appendChild(charSpan);
                    
                    charIndex++;
                    setTimeout(typeLoadingText, typingSpeed);
                    
                    // 如果这是第一个字符，开始波动动画
                    if (charIndex === 1) {
                        startWaveAnimation();
                    }
                } else {
                    // 当前文案打完，等待一段时间后切换到下一个文案
                    setTimeout(() => {
                        // 清除波动动画
                        if (waveInterval) {
                            clearInterval(waveInterval);
                            waveInterval = null;
                        }
                        
                        // 切换到下一个文案
                        charIndex = 0;
                        currentTextIndex = (currentTextIndex + 1) % loadingTexts.length;
                        currentText = loadingTexts[currentTextIndex];
                        
                        // 清空容器，准备下一个文案
                        waveContainer.innerHTML = '';
                        
                        typeLoadingText();
                    }, 4000); // 完整显示时间
                }
            }
            
            // 波动动画函数
            function startWaveAnimation() {
                // 清除之前的间隔
                if (waveInterval) clearInterval(waveInterval);
                
                // 启动波动动画
                waveInterval = setInterval(() => {
                    // 获取所有字符
                    const chars = waveContainer.querySelectorAll('.bounce-text');
                    if (chars.length === 0) return;
                    
                    // 移动波峰位置
                    peakPosition = (peakPosition + 1) % chars.length;
                    
                    // 应用变换
                    chars.forEach((char, index) => {
                        if (index === peakPosition) {
                            // 波峰位置
                            char.style.transform = 'translateY(-8px)';
                        } else if (Math.abs(index - peakPosition) === 1) {
                            // 波峰旁边的字符稍微上移
                            char.style.transform = 'translateY(-4px)';
                        } else {
                            // 其他字符回到原位
                            char.style.transform = 'translateY(0)';
                        }
                    });
                }, 100); // 每100ms更新一次波峰位置
            }
            
            // 开始打字机效果
            typeLoadingText();
            
            // 存储文本到 sessionStorage
            sessionStorage.setItem('uploadedText', text);
            console.log(text)
            
            // 获取上传的图片数据
            const uploadedImage = sessionStorage.getItem('uploadedImage');
            // 分析反馈内容，生成解读结果
            analyzeUserInput(text, uploadedImage).then(() => {
                // 解读完成后跳转到反馈页面
                window.location.href = 'feedback.html';
            }).catch(error => {
                console.error('解读失败:', error);
                alert('解读失败，请重试');
                resolveButton.disabled = false;
                resolveButton.textContent = '一键解读';
            });
        });
    }


    // 分析用户输入和图片的函数
    async function analyzeUserInput(text, imageData) {
        try {
            const OPENAI_API_KEY=''
            let context = "以下是老板对设计的反馈内容：\n" + text;
            
            if (imageData) {
                context += "\n\n用户还上传了设计图片作为参考：";
            }
            console.log(`input text: ${context}`)

            // 提取base64数据 - 如果imageData已经是base64格式，则直接使用，否则去除前缀
            let base64Image = imageData;
            if (imageData && imageData.includes('base64,')) {
                base64Image = imageData.split('base64,')[1];
            }

            const response = await fetch('https://api.openai.com/v1/responses', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${OPENAI_API_KEY}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: 'gpt-4.1-nano',
                    input: [
                        {
                            role: 'system',
                            content: [{
                                type: 'input_text',
                                text: '你是一位专业的设计顾问，擅长分析客户反馈，提取关键信息，并提供专业建议。请根据老板的反馈分析情绪值（用emoji表示），并结合给出的设计稿，给出三个具体的修改建议。每个建议应该包含一个标题和详细描述。首先你需要对老板的情绪进行解读，使用"情绪值："开头并分为五类：1. 非常满意-😊😊😊 2. 比较满意-🙂🙂🙂 3. 一般般-😐😐😐 4. 不太满意-🙁🙁🙁 5. 非常不满意-😠😠😠，然后在下一行用一句话分析老板的情绪，以"情绪分析："开头。随后，请以"修改建议：\n"开头，并以有序列表分行说明三个具体建议，比如："1. 提高对比度：xxx"。记得结合图片进行分析和提出修改建议。最后，你需要使用网页搜索来获取合适的参考UI设计案例。请在新的一行以"搜索内容："开头，给出合适的搜索内容，以获取合适的参考设计案例，注意，你只能搜索UI设计案例。'
                            }]
                        },
                        {
                            role: "user",
                            content: [
                                { type: "input_text", text: context },
                                ...(imageData ? [{
                                    type: "input_image",
                                    image_url: `data:image/jpeg;base64,${base64Image}`,
                                }] : []),
                            ],
                        }
                    ],
                })
            });
           
            const data = await response.json();
            // console.log(data)

            const rep = data['output'][0]['content'][0]['text'];
            sessionStorage.setItem('analysisResult', rep)
        } catch (error) {
            alert(error)
            console.log('分析失败:', error);
            // 使用默认的分析结果
            const defaultAnalysis = `情绪值：😠😠😠\n\n
修改建议：
1. 色彩调整：在保持整体色调的基础上，加入一些明亮的点缀色，如淡黄色、淡紫蓝、淡红蓝微粉等。用于按钮、图标或重要文本，以增加吸引力。
2. 增加层级感：利用饱和度（Glassmorphism）效果，为卡片/重要框添加模糊背景和阴影，营造出浮起感，引入3D元素或深浅变化，增加页面的深度和空间感。
3. 增加互动性：为按钮和图标添加悬停动画或点击动画，提供用户及时反馈。引入微动画（Micro-interactions），如加载动画、切换动画等等，使页面更具活力。`;
            
            sessionStorage.setItem('analysisResult', defaultAnalysis);
            return true;
        }
    }
    
    // 示例图片添加到参考案例
    const exampleCards = document.querySelectorAll('.example-card');
    if (exampleCards.length > 0) {
        // 为示例卡片添加示例图片背景
        const exampleBgs = [
            'linear-gradient(45deg, #2d2d4e, #1e1e30)',
            'linear-gradient(45deg, #2e2e2e, #1a1a1a)',
            'linear-gradient(45deg, #332e42, #1f1b30)'
        ];
        
        exampleCards.forEach((card, index) => {
            card.style.background = exampleBgs[index % exampleBgs.length];
        });
    }
    
    // 加载并显示反馈页面的分析结果
    function loadAnalysisResult() {
        const analysisResult = sessionStorage.getItem('analysisResult');
        console.log(analysisResult)
        if (!analysisResult) return;
        
        try {
            // 设置情绪值
            if (analysisResult) {
                const emotionIcons = document.querySelector('.emotion-icons');
                const emotionText = document.querySelector('.emotion-text');
                
                if (emotionIcons && emotionText) {
                    // 清空图标区域
                    emotionIcons.innerHTML = '';
                    
                    // 提取情绪值部分
                    const emojiText = analysisResult.split('情绪值：')[1].split('\n')[0];
                    
                    const emotionAnalyse = analysisResult.split('情绪分析：')[1].split('\n')[0];

                    // 提取emoji
                    const emojis = [emojiText.codePointAt(0), emojiText.codePointAt(2), emojiText.codePointAt(4)];
                    console.log(emojis)
                    emojis.forEach(emoji => {
                        console.log(emoji)
                    })
                    
                    if (emojis) {
                        // 只显示3个emoji，确保一致性
                        const displayEmojis = emojis.slice(0, 3);
                        displayEmojis.forEach(emoji => {
                            const span = document.createElement('span');
                            span.className = 'emoji';
                            span.textContent = String.fromCodePoint(emoji);
                            emotionIcons.appendChild(span);
                        });
                    } else {
                        // 默认情绪
                        for (let i = 0; i < 3; i++) {
                            const span = document.createElement('span');
                            span.className = 'emoji';
                            span.textContent = '😠';
                            emotionIcons.appendChild(span);
                        }
                    }
                    
                    // 设置文字描述
                    // 查找"情绪分析："部分
                    let textDescription = '';
                    if (emotionAnalyse) {
                        textDescription = emotionAnalyse.trim();
                    } else {
                        // 如果没有情绪分析部分，根据emoji生成默认文本
                        if (emojis && emojis[0] === '😠') {
                            textDescription = '老板对设计非常不满意，建议全面改进';
                        } else if (emojis && emojis[0] === '🙁') {
                            textDescription = '老板对设计不太满意，需要较多改进';
                        } else if (emojis && emojis[0] === '😐') {
                            textDescription = '老板对设计感觉一般，有改进空间';
                        } else if (emojis && emojis[0] === '🙂') {
                            textDescription = '老板对设计比较满意，小幅改进即可';
                        } else if (emojis && emojis[0] === '😊') {
                            textDescription = '老板对设计非常满意，细节优化即可';
                        } else {
                            textDescription = '需要基于反馈进行改进';
                        }
                    }
                    
                    emotionText.textContent = textDescription;
                }
            }
            
            // 提取修改建议
            const suggestionsContainer = document.querySelector('.suggestions-container');
            if (suggestionsContainer) {
                try {
                    // 使用split提取修改建议部分
                    const suggestionsText = analysisResult.split('修改建议：')[1].split('搜索内容：')[0];
                    
                    if (suggestionsText) {
                        // 提取三个建议
                        const suggestionLines = suggestionsText.trim().split('\n');
                        const suggestions = [];
                        
                        // 处理每一行建议
                        for (let i = 0; i < suggestionLines.length; i++) {
                            const line = suggestionLines[i].trim();
                            if (line.match(/^\d+\.\s/)) {
                                // 找到了序号开头的行，这是建议的标题和内容
                                const suggestionText = line.replace(/^\d+\.\s/, '');
                                
                                // 拆分标题和内容（假设冒号或：分隔）
                                let title = suggestionText;
                                let content = '';
                                
                                if (suggestionText.includes('：')) {
                                    [title, content] = suggestionText.split('：', 2);
                                } else if (suggestionText.includes(':')) {
                                    [title, content] = suggestionText.split(':', 2);
                                }
                                
                                suggestions.push({
                                    title: title.trim(),
                                    content: content.trim()
                                });
                                
                                // 最多收集三个建议
                                if (suggestions.length >= 3) break;
                            }
                        }
                        
                        // 更新建议卡片
                        if (suggestions.length > 0) {
                            const cardStyles = ['yellow-top', 'cyan-top', 'purple-top'];
                            suggestionsContainer.innerHTML = '';
                            
                            suggestions.forEach((suggestion, index) => {
                                const cardStyle = cardStyles[index % cardStyles.length];
                                const card = document.createElement('div');
                                card.className = `suggestion-card ${cardStyle}`;
                                
                                const titleElement = document.createElement('h3');
                                titleElement.className = 'suggestion-title';
                                titleElement.textContent = suggestion.title;
                                
                                const textElement = document.createElement('p');
                                textElement.className = 'suggestion-text';
                                textElement.textContent = suggestion.content;
                                
                                card.appendChild(titleElement);
                                card.appendChild(textElement);
                                suggestionsContainer.appendChild(card);
                            });
                            
                            // 加载参考案例
                            loadReferenceExamples(suggestions);
                        }
                    }
                } catch (error) {
                    console.error('解析建议失败:', error);
                }
            }
        } catch (error) {
            console.error('解析分析结果失败:', error);
        }
    }
    
    // 根据建议加载参考案例
    async function loadReferenceExamples(suggestions) {
        const analysisResult = sessionStorage.getItem('analysisResult');
        const searchContent = analysisResult.split('搜索内容：')[1].trim();
        const examplesContainer = document.querySelector('.examples-container');
        if (!examplesContainer) return;
        
        // 获取现有的示例卡片元素
        const exampleCards = examplesContainer.querySelectorAll('.example-card');
        if (exampleCards.length !== 2) {
            console.error('未找到预期的两个示例卡片元素');
            return;
        }
        
        try {
            // 显示加载状态
            exampleCards.forEach(card => {
                const img = card.querySelector('.example-image');
                const desc = card.querySelector('.example-desc');
                const sourceLink = card.querySelector('.example-source a');
                
                if (img) img.src = '';
                if (desc) desc.textContent = '正在从花瓣、Pinterest搜索设计参考案例...';
                if (sourceLink) {
                    sourceLink.href = '#';
                    sourceLink.textContent = '加载中...';
                }
            });
            
            // 获取原始反馈文本和上传的图片
            const uploadedText = sessionStorage.getItem('uploadedText') || '';
            const uploadedImage = sessionStorage.getItem('uploadedImage');
            
            // 根据建议和原始反馈生成搜索关键词
            const keywords = suggestions.map(suggestion => suggestion.title).join('、');
            
            // 调用搜索API获取合适的参考案例
            const examples = [];
            
            // 搜索来源网站列表
            const searchSources = ['huaban.com', 'pinterest.com'];
            
            // 按顺序从不同来源搜索参考案例
            for (let i = 0; i < searchSources.length; i++) {
                try {
                    const source = searchSources[i];
                    const searchQuery = `${source} ${searchContent}`;
                    
                    // 调用搜索API
                    const searchResponse = await fetch('https://aigc.sankuai.com/v1/friday/api/search', {
                        method: 'POST',
                        headers: {
                            'Authorization': 'Bearer 21915325773247148111',
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            "query": searchQuery,
                            "top_k": 1,
                            "api": "bing-search",
                            "is_fast": true
                        })
                    });
                    
                    const searchData = await searchResponse.json();
                    console.log(`Search results for ${source}:`, searchData);
                    
                    if (searchData.code === "200" && searchData.results && searchData.results.length > 0) {
                        const result = searchData.results[0];
                        
                        // 构建示例对象
                        const example = {
                            title: result.title.replace(/<\/?b>/g, ''), // 删除HTML标签
                            sourceUrl: result.link,
                            description: '' // 稍后使用GPT生成描述
                        };
                        
                        try {
                            // 调用截图服务API
                            const screenshotServiceUrl = `http://0.0.0.0:3000/capture`;
                            const response = await fetch(screenshotServiceUrl, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({
                                    url: example.sourceUrl,
                                    width: 1024,
                                    height: 768,
                                    format: 'png'
                                })
                            });
                            
                            if (response.ok) {
                                const data = await response.json();
                                if (data.imageUrl) {
                                    example.image = data.imageUrl;
                                } else {
                                    throw new Error('截图服务未返回图片URL');
                                }
                            } else {
                                throw new Error(`截图服务错误: ${response.status}`);
                            }
                        } catch (thumbErr) {
                            console.error('获取网页截图失败:', thumbErr);
                            // 使用备用图片
                            example.image = source.includes('pinterest') ? 
                                'https://i.pinimg.com/originals/13/c1/35/13c135f443fd5c31625dcc9dfad87c69.jpg' : 
                                'https://gw.alicdn.com/imgextra/i3/O1CN01ZBiAKX1jrj66Y2BAg_!!6000000004603-2-tps-800-600.png';
                        }
                        
                        // 使用GPT-4.1-nano生成描述 - 解读为什么这个示例可以解决设计问题
                        try {
                            OPENAI_API_KEY='';
                            const gptResponse = await fetch('https://api.openai.com/v1/responses', {
                                method: 'POST',
                                headers: {
                                    'Authorization': `Bearer ${OPENAI_API_KEY}`,
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({
                                    model: 'gpt-4.1-mini',
                                    input: [
                                        {
                                            role: 'system',
                                            content: [{
                                                type: 'input_text',
                                                text: '你是一位专业的设计顾问，擅长分析UI设计案例并解释其优点。请基于原始设计反馈和修改建议，详细分析为什么提供的设计案例可以解决用户面临的设计问题。描述要专业、具体，并关注设计细节。'
                                            }]
                                        },
                                        {
                                            role: "user",
                                            content: [
                                                { 
                                                    type: "input_text", 
                                                    text: `原始设计反馈：${uploadedText}\n\n设计建议：${suggestions.map((s, i) => `${i+1}. ${s.title}：${s.content}`).join('\n')}\n\n设计案例来源：${result.title}\n设计案例描述：${result.snippet || '无详细描述'}\n\n请详细分析这个案例如何解决以上设计问题。回答应该是一段连贯的文字，不要使用项目符号或编号，字数控制在150字以内。`
                                                },
                                                {
                                                    type: "input_image",
                                                    image_url: await convertImageToBase64(example.image)
                                                }
                                            ]
                                        }
                                    ]
                                })
                            });
                            
                            const gptData = await gptResponse.json();
                            if (gptData.output && gptData.output[0].content[0].text) {
                                example.description = gptData.output[0].content[0].text.trim();
                            } else {
                                throw new Error('GPT描述生成失败');
                            }
                        } catch (gptError) {
                            console.error('生成案例描述失败:', gptError);
                            // 使用默认描述
                            example.description = source.includes('pinterest') ?
                                '这个案例展示了清晰的视觉层次结构和吸引人的色彩搭配，能有效解决原设计中的平面感问题。通过对比度增强和微妙的动效，它能提高用户体验和互动性，同时保持整体设计的专业性。' :
                                '该设计运用了精细的色彩渐变和现代化的UI元素，完美解决了原始设计中的视觉单调问题。透过精心安排的布局和适当的留白，创造出流畅的用户浏览体验，同时增加了设计的精致感和专业度。';
                        }
                        
                        // 添加到示例列表
                        examples.push(example);
                    }
                } catch (searchError) {
                    console.error(`搜索${searchSources[i]}参考案例失败:`, searchError);
                }
            }
            
            // 如果没有找到足够的例子，使用默认例子
            const defaultExamples = [
                {
                    title: '花瓣网参考案例',
                    image: 'https://gw.alicdn.com/imgextra/i3/O1CN01ZBiAKX1jrj66Y2BAg_!!6000000004603-2-tps-800-600.png',
                    description: '这个花瓣网案例展示了如何通过清晰的层级设计和色彩搭配提升用户体验。磨砂玻璃效果（Glassmorphism）为界面增添了深度感，而明亮的色彩点缀则增强了视觉吸引力。',
                    sourceUrl: 'https://huaban.com/search?q=%E8%AE%BE%E8%AE%A1%E7%81%B5%E6%84%9F'
                },
                {
                    title: 'Pinterest参考案例',
                    image: 'https://i.pinimg.com/originals/13/c1/35/13c135f443fd5c31625dcc9dfad87c69.jpg',
                    description: '这个Pinterest案例展示了现代UI设计中的微交互元素和动效设计。通过精心设计的悬停效果和过渡动画，大大提升了用户的交互体验和页面活力。',
                    sourceUrl: 'https://www.pinterest.com/search/pins/?q=UI%20design'
                }
            ];
            
            if (examples.length === 0) {
                examples.push(defaultExamples[0], defaultExamples[1]);
            } else if (examples.length === 1) {
                examples.push(defaultExamples[1]);
            }
            
            // 确保只有两个例子
            examples.splice(2);
            
            // 更新已有的HTML元素，而不是创建新元素
            examples.forEach((example, index) => {
                const card = exampleCards[index];
                if (!card) return;
                
                // 更新图片
                const img = card.querySelector('.example-image');
                if (img) {
                    img.src = example.image;
                    img.alt = example.title;
                }
                
                // 更新描述
                const desc = card.querySelector('.example-desc');
                if (desc) {
                    desc.textContent = example.description;
                }
                
                // 更新来源链接
                const source = card.querySelector('.example-source');
                if (source) {
                    const sourceLink = source.querySelector('a');
                    if (sourceLink) {
                        sourceLink.href = example.sourceUrl;
                        sourceLink.textContent = example.title;
                    }
                }
            });
            
        } catch (error) {
            console.error('加载参考案例失败:', error);
            
            // 在错误情况下更新UI
            exampleCards.forEach(card => {  
                const desc = card.querySelector('.example-desc');
                if (desc) {
                    desc.textContent = '加载参考案例失败，请刷新重试';
                    desc.style.color = '#ff6b6b';
                }
            });
        }
    }
    
    // 当在反馈页面时，加载分析结果
    if (window.location.pathname.includes('feedback.html')) {
        loadAnalysisResult();
        
        // 优化方案功能
        setupOptimizationButtons();
    }
    
    // 设置优化方案按钮功能
    function setupOptimizationButtons() {
        const gpt4Button = document.getElementById('gpt4-btn');
        const mjButton = document.getElementById('mj-btn');
        
        if (gpt4Button) {
            gpt4Button.addEventListener('click', function() {
                generateGPT4Optimization();
            });
        }
        
        if (mjButton) {
            mjButton.addEventListener('click', function() {
                generateMJOptimization();
            });
        }
    }
    
    // 使用GPT-4o生成优化方案
    async function generateGPT4Optimization() {
        const gpt4Button = document.getElementById('gpt4-btn');
        const gpt4Content = document.getElementById('gpt4-content');
        
        if (!gpt4Button || !gpt4Content) return;
        
        try {
            // 禁用按钮
            gpt4Button.disabled = true;
            gpt4Button.textContent = '生成中...';
            
            // 显示加载动画
            showLoadingState(gpt4Content, '正在生成优化方案，请稍候...');
            
            // 获取原始反馈和图片
            const uploadedText = sessionStorage.getItem('uploadedText') || '';
            const uploadedImage = sessionStorage.getItem('uploadedImage');
            const analysisResult = sessionStorage.getItem('analysisResult') || '';
            
            if (!uploadedImage) {
                throw new Error('未找到原始设计图片');
            }
            
            // 提取修改建议
            let suggestions = '';
            if (analysisResult.includes('修改建议：')) {
                suggestions = analysisResult.split('修改建议：')[1].split('搜索内容：')[0];
            }
            
            // 生成优化提示文本
            const suggestionPoints = suggestions
                .split('\n')
                .filter(line => line.match(/^\d+\./))
                .map(line => line.replace(/^\d+\.\s+/, '').trim())
                .join('; ');
            
            // 构建图像生成提示词
            const imageEditPrompt = `基于以下设计反馈优化UI设计: ${suggestionPoints}. 创建一个专业、现代的用户界面，高质量设计，清晰布局，视觉吸引力强`;
            
            // 从base64字符串中提取纯base64数据
            let base64Image = uploadedImage;
            if (uploadedImage && uploadedImage.includes('base64,')) {
                base64Image = uploadedImage.split('base64,')[1];
            }
            
            // 创建临时图片文件
            const imageBlob = await fetch(uploadedImage).then(res => res.blob());
            
            // 创建FormData对象
            const formData = new FormData();
            formData.append('model', 'gpt-image-1');
            formData.append('image[]', imageBlob, 'original-design.png');
            formData.append('prompt', imageEditPrompt);
            
            // 调用OpenAI图像编辑API
            const OPENAI_API_KEY='';
            
            try {
                const response = await fetch('https://api.openai.com/v1/images/edits', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${OPENAI_API_KEY}`
                    },
                    body: formData
                });
                
                const data = await response.json();
                console.log('Image Edit API response:', data);
                
                // 获取生成的图片URL或base64数据
                const generatedImageUrl = data.data && data.data[0] ? (data.data[0].url || `data:image/png;base64,${data.data[0].b64_json}`) : null;
                
                if (generatedImageUrl) {
                    // 展示生成的图片
                    showOptimizationResult(gpt4Content, generatedImageUrl);
                    
                    // 重置按钮
                    gpt4Button.disabled = false;
                    gpt4Button.textContent = '重新生成';
                } else {
                    throw new Error('API未返回图片数据');
                }
                
            } catch (apiError) {
                console.error('API调用失败:', apiError);
                
                // 如果API调用失败，显示随机默认图片
                setTimeout(() => {
                    const defaultImages = [
                        'https://img.freepik.com/free-vector/gradient-glassmorphism-horizontal-banner_23-2149440323.jpg',
                        'https://img.freepik.com/free-vector/realistic-3d-geometric-shapes-floating_23-2148938914.jpg',
                        'https://img.freepik.com/free-vector/gradient-ui-ux-background_23-2149052117.jpg',
                    ];
                    
                    // 随机选择一张图片
                    const randomImage = defaultImages[Math.floor(Math.random() * defaultImages.length)];
                    
                    // 展示结果
                    showOptimizationResult(gpt4Content, randomImage);
                    
                    // 重置按钮
                    gpt4Button.disabled = false;
                    gpt4Button.textContent = '重新生成';
                }, 2000);
            }
            
        } catch (error) {
            console.error('生成GPT优化方案失败:', error);
            
            // 显示错误信息
            gpt4Content.innerHTML = `
                <div class="optimization-placeholder">
                    <p style="color: #ff6b6b;">生成失败: ${error.message || '请稍后重试'}</p>
                </div>
            `;
            
            // 重置按钮
            gpt4Button.disabled = false;
            gpt4Button.textContent = '重试';
        }
    }
    
    async function generateMJOptimization() {
        const mjButton = document.getElementById('mj-btn');
        const mjContent = document.getElementById('mj-content');
        if (!mjButton || !mjContent) return;
    
        try {
            mjButton.disabled = true;
            mjButton.textContent = '生成中...';
            showLoadingState(mjContent, '正在创意重绘，请稍候...');
    
            // 获取原始反馈和建议
            const analysisResult = sessionStorage.getItem('analysisResult') || '';
            let suggestions = '';
            if (analysisResult.includes('修改建议：')) {
                suggestions = analysisResult.split('修改建议：')[1].split('搜索内容：')[0];
            }
            const promptKeywords = suggestions
                .split('\n')
                .filter(line => line.match(/^\d+\./))
                .map(line => {
                    const text = line.replace(/^\d+\.\s+/, '');
                    if (text.includes('：')) {
                        return text.split('：')[0].trim();
                    } else if (text.includes(':')) {
                        return text.split(':')[0].trim();
                    } else {
                        return text.trim();
                    }
                })
                .join(', ');
            const mjPrompt = `创意UI设计：${promptKeywords}，现代化界面，高端质感，创新布局，视觉冲击强，艺术感`;
    
            // 调用美团MJ接口
            const MJ_API_URL = 'https://aigc.sankuai.com/v1/midjourney/imageOperation';
            const APP_ID = '';
    
            const mjResponse = await fetch(MJ_API_URL, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${APP_ID}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    text: mjPrompt,
                    action: 'diffusion'
                })
            });
            const mjData = await mjResponse.json();
            if (!mjData.id) throw new Error('未获取到任务ID');
            // 轮询获取图片
            pollMJResult(mjData.id, mjContent, mjButton);
    
        } catch (error) {
            console.error('生成MJ优化方案失败:', error);
            mjContent.innerHTML = `
                <div class="optimization-placeholder">
                    <p style="color: #ff6b6b;">生成失败: ${error.message || '请稍后重试'}</p>
                </div>
            `;
            mjButton.disabled = false;
            mjButton.textContent = '重试';
        }
    }
    
    // 轮询Midjourney结果
    async function pollMJResult(jobId, contentElement, buttonElement, attempt = 1) {
        if (attempt > 80) { // 最多轮询80次
            contentElement.innerHTML = `
                <div class="optimization-placeholder">
                    <p style="color: #ff6b6b;">生成超时，请重试</p>
                </div>
            `;
            buttonElement.disabled = false;
            buttonElement.textContent = '重试';
            return;
        }
        try {
            const MJ_API_URL = 'https://aigc.sankuai.com/v1/midjourney/imageOperation';
            const APP_ID = '';
            const response = await fetch(MJ_API_URL, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${APP_ID}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    action: 'getJobInfo',
                    jobId: jobId
                })
            });
            const data = await response.json();
            if (data.status == "2" && data.urls && data.urls[0]) {
                // 审核通过
                showOptimizationResult(contentElement, data.urls[0]);
                buttonElement.disabled = false;
                buttonElement.textContent = '重新生成';
            } else if (data.status == "3") {
                // 失败
                throw new Error(data.comment || 'Midjourney任务处理失败');
            } else {
                console.log(data.status)
                // 继续轮询
                setTimeout(() => {
                    pollMJResult(jobId, contentElement, buttonElement, attempt + 1);
                }, 3000);
            }
        } catch (error) {
            console.error('轮询MJ结果失败:', error);
            contentElement.innerHTML = `
                <div class="optimization-placeholder">
                    <p style="color: #ff6b6b;">生成失败: ${error.message || '请稍后重试'}</p>
                </div>
            `;
            buttonElement.disabled = false;
            buttonElement.textContent = '重试';
        }
    }
    
    // 显示加载状态
    function showLoadingState(container, message) {
        container.innerHTML = `
            <div class="optimization-loading">
                <div class="loading-spinner"></div>
                <div class="loading-text">${message}</div>
            </div>
            <div class="optimization-placeholder">
                <p>生成中，请稍候...</p>
            </div>
        `;
    }
    
    // 显示优化结果
    function showOptimizationResult(container, imageUrl) {
        container.innerHTML = `
            <div class="optimization-result">
                <img src="${imageUrl}" alt="优化方案" />
            </div>
        `;
    }
    
    // 润色功能
    const generateBtn = document.getElementById('generateBtn');
    if (generateBtn) {
        generateBtn.addEventListener('click', function() {
            const userInput = document.getElementById('userInput').value.trim();
            if (!userInput) {
                alert('请输入需要润色的内容');
                return;
            }
            
            // 显示Toast提示
            const toast = document.getElementById('toast');
            toast.style.display = 'block';
            
            // 调用OpenAI API
            callOpenAI(userInput);
        });
    }
    
    // OpenAI API调用函数
    async function callOpenAI(inputText) {
        
        try {
            // 获取原始反馈文本
            const originalFeedback = sessionStorage.getItem('uploadedText') || '';
            console.log(originalFeedback)

            OPENAI_API_KEY=''
            const response = await fetch('https://api.openai.com/v1/responses', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${OPENAI_API_KEY}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: 'gpt-4.1-nano',
                    input: [
                        {
                            role: 'system',
                            content: [{
                                type: 'input_text',
                                text: '你是一个专业的文案优化助手，擅长将简单直接的反馈转换为礼貌、专业且保持原意的表达方式。'
                            }]
                        },
                        {
                            role: "user",
                            content: [
                                { type: "input_text", text: `原始反馈内容：${originalFeedback}\n\n我想回复：${inputText}\n\n请优化我的回复内容，使其更加礼貌、专业，同时保持原始意思，增加一些共情和专业术语。` }
                            ]
                        }
                    ]
                })
            });
            
            const data = await response.json();
            
            // 隐藏Toast
            const toast = document.getElementById('toast');
            toast.style.display = 'none';
            
            if (data.output && data.output[0].content[0].text.length > 0) {
                // 显示API返回的结果
                const optimizedText = data['output'][0]['content'][0]['text'];
                const resultContent = document.getElementById('resultContent');
                const resultCard = document.getElementById('resultCard');
                
                resultContent.innerText = optimizedText;
                resultCard.style.display = 'block';
                
                // 平滑滚动到结果区域
                resultCard.scrollIntoView({ behavior: 'smooth' });
            } else {
                handleAPIError('未获取到有效响应');
            }
        } catch (error) {
            handleAPIError(error);
        }
    }
    
    // 处理API错误
    function handleAPIError(error) {
        console.error('API调用失败:', error);
        
        // 隐藏Toast
        const toast = document.getElementById('toast');
        toast.style.display = 'none';
        
        // 显示错误信息，同时提供备选方案
        const resultContent = document.getElementById('resultContent');
        const resultCard = document.getElementById('resultCard');
        
        // 备选文案，当API调用失败时使用
        const userInput = document.getElementById('userInput').value.trim();
        let fallbackText = '';
        if (userInput.includes('不行') || userInput.includes('不能')) {
            fallbackText = '感谢您的建议，我们团队已经考虑过这个方案，但受到一些技术限制，暂时无法实现。我们已经记录下您的想法，并会在后续版本中尝试优化解决。';
        } else if (userInput.includes('丑') || userInput.includes('难看')) {
            fallbackText = '非常感谢您的审美建议！我们设计团队正在不断优化视觉体验，您提出的这些意见非常有价值，我们会在下一版本中优先考虑调整。';
        } else {
            fallbackText = '您的意见我们已经记录，团队会认真研究并在后续迭代中考虑采纳。感谢您的宝贵反馈，这对我们产品的完善非常重要！';
        }
        
        resultContent.innerText = fallbackText;
        resultCard.style.display = 'block';
        
        // 平滑滚动到结果区域
        resultCard.scrollIntoView({ behavior: 'smooth' });
    }

    // 添加图片转base64函数
    async function convertImageToBase64(imageUrl) {
        try {
            const response = await fetch(imageUrl);
            const blob = await response.blob();
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    // 返回完整的Data URL
                    resolve(reader.result);
                };
                reader.onerror = reject;
                reader.readAsDataURL(blob);
            });
        } catch (error) {
            console.error('转换图片为base64失败:', error);
            return imageUrl; // 如果失败，返回原始URL
        }
    }
}); 