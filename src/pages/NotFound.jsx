import { Link } from "react-router-dom";
export default function NotFound({ what = "We couldn't find that page" }) {
  return (
    <div className="wrap section"><div className="empty"><h3>{what}</h3><p className="muted">It may have sold, moved or been withdrawn.</p><Link className="btn" to="/buy">See homes for sale</Link></div></div>
  );
}
