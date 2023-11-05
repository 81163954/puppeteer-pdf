# 使用 Node.js 官方镜像作为基础镜像
FROM node:16.14.0

WORKDIR /usr/share/fonts/
COPY fonts/* .

# 设置工作目录
WORKDIR /app

# 在 /app 目录下复制文件
COPY package*.json .
COPY index.js .
COPY .puppeteerrc.cjs .
COPY pdfResume.js .
COPY api.js .

# 安装应用程序依赖
RUN npm install
RUN apt-get update \
    && apt-get install libnss3 libnspr4 libatk1.0-0 libatk-bridge2.0-0 libcups2 libdrm2 libdbus-1-3 -y \
    && apt-get install libxkbcommon0 libxcomposite1 libxdamage1 libxfixes3 libxrandr2 libgbm1 libasound2 -y

# 暴露应用程序运行的端口
EXPOSE 9999

# 启动应用程序
CMD ["node", "index.js"] 

