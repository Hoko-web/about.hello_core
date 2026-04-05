// ============================================
// pilatesroom はろこあ - メインスクリプト
// ============================================
//
// 使用ライブラリ:
//   - AOS v2.3.1（Animate On Scroll）… スクロール連動フェードインアニメーション
//
// それ以外はすべてバニラJS（Vanilla JavaScript）で実装
//
// 機能一覧:
//   1. AOS 初期化
//   2. 固定CTAバーの表示制御（Intersection Observer）
//   3. FAQ アコーディオン
// ============================================

document.addEventListener("DOMContentLoaded", () => {
  // ============================================
  // 1. AOS（スクロールアニメーション）の初期化
  // ============================================
  // HTML側の data-aos 属性を読み取り、要素が画面内に入ったタイミングで
  // フェードイン等のアニメーションを実行するライブラリ
  // 公式: https://michalsnik.github.io/aos/
  if (typeof AOS !== "undefined") {
    AOS.init({
      duration: 800, // アニメーション時間（ms）
      easing: "ease-out", // イージング関数
      once: true, // true = 一度だけ実行（スクロール戻りで再実行しない）
      offset: 60, // ビューポート下端からのオフセット（px）
    });
  }

  // ============================================
  // 2. 固定CTAバーの表示制御
  // ============================================
  // Intersection Observer API を使い、ヒーローセクションが
  // 画面外に出たタイミングで固定バーを表示する
  const fixedBar = document.getElementById("fixedBar");
  const hero = document.querySelector(".hero");

  if (fixedBar && hero) {
    const barObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            // ヒーローが見えなくなった → バーを表示
            fixedBar.classList.add("is-visible");
          } else {
            // ヒーローが見えている → バーを非表示
            fixedBar.classList.remove("is-visible");
          }
        });
      },
      { threshold: 0 }, // 少しでも画面外に出たら発火
    );

    barObserver.observe(hero);
  }

  // ============================================
  // 3. FAQ アコーディオン
  // ============================================
  // 質問（dt）をクリックすると回答（dd）の表示/非表示をトグル
  // CSSの .is-closed クラスで max-height と opacity を制御
  // ※ JS無効時は全ての回答が表示される（プログレッシブエンハンスメント）
  const faqItems = document.querySelectorAll(".faq__item");

  faqItems.forEach((item, index) => {
    // 最初の1つ以外は閉じた状態にする
    if (index !== 0) {
      item.classList.add("is-closed");
    }

    const question = item.querySelector(".faq__question");

    if (question) {
      question.addEventListener("click", () => {
        item.classList.toggle("is-closed");
      });
    }
  });

  // ============================================
  // 4. ハンバーガーメニュー
  // ============================================
  // 動作の流れ:
  //   1. ハンバーガーボタンをクリック
  //   2. ボタンに .is-open → CSSで線が × にトランスフォーム
  //   3. sp-nav に .is-open → CSSで右からスライドイン
  //   4. body に .is-nav-open → 背景スクロールを無効化

  const hamburger = document.getElementById("jsHamburger");
  const spNav = document.getElementById("jsSpNav");
  const spNavOverlay = document.getElementById("jsSpNavOverlay");

  // メニューの開閉をトグルする関数
  function toggleMenu() {
    const isOpen = hamburger.classList.contains("is-open");

    if (isOpen) {
      // メニューが開いている → 閉じる
      hamburger.classList.remove("is-open");
      spNav.classList.remove("is-open");
      document.body.classList.remove("is-nav-open");
    } else {
      // メニューが閉じている → 開く
      hamburger.classList.add("is-open");
      spNav.classList.add("is-open");
      document.body.classList.add("is-nav-open");
      hamburger.setAttribute("aria-label", "メニューを閉じる");
    }
  }

  if (hamburger && spNav) {
    // ハンバーガーとオーバーレイの両方にクリックイベントを設定
    hamburger.addEventListener("click", toggleMenu);
    if (spNavOverlay) {
      spNavOverlay.addEventListener("click", toggleMenu);
    }
    // ナビゲーション内のリンクをクリックしたときもメニューを閉じる
    const spNavLinks = spNav.querySelectorAll(".sp-nav__link");
    spNavLinks.forEach((link) => {
      link.addEventListener("click", () => {
        // メニューが開いていれば閉じる
        if (hamburger.classList.contains("is-open")) {
          toggleMenu();
        }
      });
    });
  }
  // ============================================
  // 5. Hero 写真スライドショー
  // ４秒ごとにクロスフェードで切り替え
  // ============================================
  const photos = document.querySelectorAll(".hero__photo");
  if (photos.length > 0) {
    let current = 0;

    setInterval(() => {
      photos[current].classList.remove("is-active");
      current = (current + 1) % photos.length;
      photos[current].classList.add("is-active");
    }, 4000);
  }
});
