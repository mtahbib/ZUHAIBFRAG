const LINKS = [
  { label: "Maison", id: "home" },
  { label: "The story", id: "about" },
  { label: "Collections", id: "collection" },
  { label: "All scents", id: "catalog" },
];

export default function Footer() {
  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  return (
    <footer id="contact" className="yb-footer">
      <div className="yb-footer-top">
        <div className="yb-footer-brand"><img src="/zlogo.png" alt="" aria-hidden="true" /><div><strong>ZUHAIB</strong><small>FRAGRANCE</small></div></div>
        <p>Dubai’s finest fragrance stories,<br />now closer to home.</p>
        <a href="https://wa.me/8801790221253" target="_blank" rel="noreferrer">LET’S FIND YOUR SIGNATURE <span>↗</span></a>
      </div>
      <div className="yb-footer-main">
        <div><p className="yb-footer-label">EXPLORE</p>{LINKS.map((link) => <button key={link.id} onClick={() => scrollTo(link.id)}>{link.label}</button>)}</div>
        <div><p className="yb-footer-label">VISIT US</p><address>Dhaka, Bangladesh<br />Delivery nationwide</address></div>
        <div><p className="yb-footer-label">CONTACT</p><a href="https://wa.me/8801790221253" target="_blank" rel="noreferrer">+880 1790 221253</a><a href="mailto:mtahbib@gmail.com">mtahbib@gmail.com</a></div>
        <div><p className="yb-footer-label">FOLLOW</p><a href="https://www.facebook.com/profile.php?id=61590815666004" target="_blank" rel="noreferrer">Facebook ↗</a></div>
      </div>
      <div className="yb-footer-wordmark" aria-hidden="true">ZUHAIB</div>
      <div className="yb-footer-bottom"><span>© {new Date().getFullYear()} ZUHAIB FRAGRANCE</span><span>AUTHENTIC YUSUF BHAI · BANGLADESH</span><button onClick={() => scrollTo("home")}>BACK TO TOP ↑</button></div>
    </footer>
  );
}
