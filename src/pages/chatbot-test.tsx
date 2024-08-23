import React from 'react';
import Head from 'next/head';

const ChatbotTest: React.FC = () => {
  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>The Future Of AI - 未来を創造する</title>
        <style>{`
          :root {
            --primary-color: #007bff;
            --secondary-color: #0056b3;
            --background-color: #f8f9fa;
            --text-color: #333;
          }

          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }

          body {
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            color: var(--text-color);
            background-color: var(--background-color);
          }

          header {
            background-color: var(--primary-color);
            color: white;
            padding: 1rem;
            position: fixed;
            width: 100%;
            z-index: 1000;
          }

          nav {
            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          nav ul {
            display: flex;
            list-style: none;
          }

          nav ul li {
            margin-left: 1rem;
          }

          nav ul li a {
            color: white;
            text-decoration: none;
            font-weight: bold;
          }

          main {
            padding-top: 80px;
          }

          section {
            padding: 4rem 2rem;
          }

          h1, h2 {
            margin-bottom: 1rem;
          }

          .hero {
            background: linear-gradient(rgba(0, 123, 255, 0.7), rgba(0, 86, 179, 0.7)), url('data:image/svg+xml;charset=UTF-8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect width="200" height="200" fill="%23007bff"/><path d="M100 30 L30 170 L170 170 Z" fill="white"/></svg>');
            background-size: cover;
            color: white;
            text-align: center;
            padding: 8rem 2rem;
          }

          .hero h1 {
            font-size: 3rem;
            margin-bottom: 1rem;
          }

          .hero p {
            font-size: 1.2rem;
            max-width: 600px;
            margin: 0 auto;
          }

          .features {
            display: flex;
            flex-wrap: wrap;
            justify-content: space-around;
          }

          .feature {
            flex-basis: calc(33.333% - 2rem);
            margin: 1rem;
            padding: 2rem;
            background-color: white;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            transition: transform 0.3s ease;
          }

          .feature:hover {
            transform: translateY(-5px);
          }

          .feature h3 {
            color: var(--primary-color);
          }

          .cta {
            background-color: var(--secondary-color);
            color: white;
            text-align: center;
          }

          .cta h2 {
            font-size: 2.5rem;
          }

          button {
            background-color: var(--primary-color);
            color: white;
            border: none;
            padding: 0.8rem 1.5rem;
            font-size: 1rem;
            border-radius: 5px;
            cursor: pointer;
            transition: background-color 0.3s ease;
          }

          button:hover {
            background-color: var(--secondary-color);
          }

          footer {
            background-color: var(--primary-color);
            color: white;
            text-align: center;
            padding: 1rem;
          }

          @media (max-width: 768px) {
            .feature {
              flex-basis: 100%;
            }

            nav ul {
              display: none;
            }

            .menu-icon {
              display: block;
              font-size: 1.5rem;
              cursor: pointer;
            }

            .menu-icon:after {
              content: '☰';
            }

            nav.open ul {
              display: flex;
              flex-direction: column;
              position: absolute;
              top: 100%;
              left: 0;
              width: 100%;
              background-color: var(--primary-color);
            }

            nav.open ul li {
              margin: 0;
              text-align: center;
            }

            nav.open ul li a {
              display: block;
              padding: 0.5rem;
            }
          }
        `}</style>
      </Head>
      <header>
        <nav>
          <h1>The Future Of AI</h1>
          <ul>
            <li><a href="#home">ホーム</a></li>
            <li><a href="#about">AIについて</a></li>
            <li><a href="#features">特徴</a></li>
            <li><a href="#contact">お問い合わせ</a></li>
          </ul>
          <div className="menu-icon" />
        </nav>
      </header>

      <main>
        <section id="home" className="hero">
          <h1>The Future Of AI：未来を創造する</h1>
          <p>人工知能がもたらす無限の可能性を探求し、私たちの生活をより豊かにします。</p>
        </section>

        <section id="about">
          <h2>AIについて</h2>
          <p>人工知能（AI）は、人間の知能を模倣し、学習、問題解決、パターン認識などのタスクを実行するコンピューターシステムです。AIは私たちの生活のあらゆる面に革命をもたらし、産業、医療、教育など多くの分野で活用されています。</p>
        </section>

        <section id="features">
          <h2>AIの主な特徴</h2>
          <div className="features">
            <div className="feature">
              <h3>機械学習</h3>
              <p>データから学習し、パターンを認識して予測を行います。</p>
            </div>
            <div className="feature">
              <h3>自然言語処理</h3>
              <p>人間の言語を理解し、テキストや音声とやり取りします。</p>
            </div>
            <div className="feature">
              <h3>コンピュータービジョン</h3>
              <p>画像や動画を分析し、物体や場面を認識します。</p>
            </div>
            <div className="feature">
              <h3>ロボティクス</h3>
              <p>物理的なタスクを実行する知能ロボットを制御します。</p>
            </div>
            <div className="feature">
              <h3>エキスパートシステム</h3>
              <p>特定の分野で人間の専門家のように意思決定を行います。</p>
            </div>
            <div className="feature">
              <h3>予測分析</h3>
              <p>過去のデータを基に将来の傾向を予測します。</p>
            </div>
          </div>
        </section>

        <section id="contact" className="cta">
          <h2>AIの未来を一緒に築きましょう</h2>
          <p>最新のAI技術について詳しく知りたい方は、お気軽にお問い合わせください。</p>
          <button type="button">お問い合わせ</button>
        </section>
      </main>

      <footer>
        <p>&copy; 2023 The Future Of AI. All rights reserved.</p>
      </footer>
      {/* biome-ignore lint/security/noDangerouslySetInnerHtml: */}
      <script dangerouslySetInnerHTML={{__html: `
        document.querySelector('.menu-icon').addEventListener('click', function() {
          document.querySelector('nav').classList.toggle('open');
        });
      `}} />
      <script src="https://pr-398.dgbd75q6z11eq.amplifyapp.com/api/chatbot?bid=M2E4ZGZhYTctYWNiYi01ZWI5LThiMGUtYTRiYTU1OTU0NTE5OkJvdDo5ODc=" />
    </>
  );
};

export default ChatbotTest;
