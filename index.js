     addEventListener('fetch', (event) => {
      return event.respondWith(handleRequest(event.request));
    })
 
    const handleRequest = async (request) => {
      const render = (body) => {
        return new Response(`
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>T.CN 短网址</title>
 
    <style media="screen">
      body { background: #ECEFF1; color: rgba(0,0,0,0.87); font-family: Roboto, Helvetica, Arial, sans-serif; margin: 0; padding: 0; }
      #message { background: white; max-width: 360px; margin: 100px auto 16px; padding: 32px 24px; border-radius: 3px; }
      #message h2 {  color: rgba(0,0,0,0.6); font-weight: bold; font-size: 14px; margin: 0 0 8px; }
      #message h1 { color: #ffa100;  font-size: 30px; font-weight: 300;  margin: 0 0 16px;}
      #message p { line-height: 140%; margin: 16px 0 24px; font-size: 14px; }
      #message a { display: block; text-align: center; background: #039be5; text-decoration: none; color: white; padding: 16px; border-radius: 4px; }
      #message, #message a { box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24); }
      #load { color: rgba(0,0,0,0.4); text-align: center; font-size: 13px; }
      @media (max-width: 600px) {
        body, #message { margin-top: 0; background: white; box-shadow: none; }
        body { border-top: 16px solid #ffa100; }
      }
    </style>
  </head>
  <body>
${body}
 
</body>
</html>`.trim(), {
          status: 200,
          headers: {
            'Content-Type': 'text/html; charset=utf-8'
          }
        });
      }
      request = new URL(request.url);
      if (request.pathname !== '/') return new Response(null, { status: 404 });
      if (request.searchParams.has('url')) {
        const url = request.searchParams.get('url');
        const response = await fetch(`http://service.weibo.com/share/share.php?url=${encodeURIComponent(url)}&title=1`);
        const html = await response.text();
        const short = html.match(/http:\/\/t.cn\/\w+/i);
        const refer = html.match(/\$refer\s+: "(.+?)"/i);
        if (short && refer) {
          return render(`
          <div id="message" align="center">
          
            <center><h1>缩短结果：</h1><a href="${short[0]}">${short[0]}</a></center>
            <p></p>
            <center><h1>原始网址：</h1><a href="${refer[1]}">${refer[1]}</a></center>
            <p></p>
            <a href="/">返回</a>
            </div>
          `);
        }
        return render(`
        <div id="message" align="center">
        <center><h1>请求失败</h1></center>
        </div>
        `);
      }
      return render(`
      <div id="message" align="center">
      <center><h1>T.CN 短网址</h1></center>
   <p></p>
        <form method="GET">
        <input name="url" placeholder="URL" />
        <button type="submit">压缩</button>
        </form>
        </div>
      `);
    }
