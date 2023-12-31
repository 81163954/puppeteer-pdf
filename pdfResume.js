const puppeteer = require('puppeteer')
const { API } = require('./api')

const pdfResume = async (req, res) => {
    const resumeId = req.params.id
    const body = req.body

    const browser = await puppeteer.launch({
        args: ['--disable-setuid-sandbox', '--no-sandbox'],
        headless: 'new',
    });
    try {
        // 创建一个新页面
        const page = await browser.newPage();

        // await page.goto(`https://app.pyroxcv.cn/login`);
        const cookies = [
            {
                ...body.csrfToken,
                domain: 'localhost:80'
            },
            {
                ...body.sessionToken,
                domain: 'localhost:80'
            }
        ]

        // const cookie1 = body.csrfToken
        // const cookie2 = body.sessionToken

        console.log(cookies);
        console.log(resumeId);

        // const client = await page.target().createCDPSession();
        // await client.send('Network.clearBrowserCookies'); // 清除所有浏览器 cookie
        // await client.send('Network.setCookie', { cookie1 });
        // await client.send('Network.setCookie', { cookie2 });

        for (const cookie of cookies) {
            await page.setCookie(cookie);
        }
        
        // 访问您要生成PDF的页面或元素
        // await page.goto(API.resumeApp + `/editor/${resumeId}/view`);

        // await page.goto(`http://localhost:3000/editor/${resumeId}/view`);

        await page.goto(`http://localhost:80/editor/${resumeId}/view`);

        // 等待页面加载完全
        await page.waitForSelector('#print-page');

        let printContentHTML = await page.evaluate(() => {
            const printElement = document.getElementById('print-page');
            if (printElement) {
                return printElement.innerHTML;
            } else {
                return "未找到此页面";
            }
        });

        if (printContentHTML)
            await page.evaluate((content) => {
                document.body.innerHTML = content;
            }, printContentHTML);

        //[.page-br elements] display none
        await page.evaluate(() => {
            const brTags = document.querySelectorAll('.page-br'); // 获取所有的 <br> 标签
            brTags.forEach((br) => {
                br.style.display = 'none'; // 设置样式为 display: none
            });
        });

        // 将元素保存为PDF
        const pdfData = await page.pdf({
            format: 'letter',
            scale: 1.062,
            printBackground: true,
        });

        // 发送生成的PDF作为响应
        return res.send(pdfData)
    } catch (error) {
        console.error(error);
        return res.send('print error')
    } finally {
        // 关闭浏览器
        await browser.close();
    }
}

module.exports = { pdfResume }