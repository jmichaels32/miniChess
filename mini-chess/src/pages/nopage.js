// Import CSS files
import '../styles/nopage.css';
import '../styles/global.css';

// 404 Page
function NoPage() {
  return (
    <div id="noPage">
      <strong className="text" id="title-nopage"> 404 Error </strong>
      <p className="text" id="description-nopage"> There is no page here, check your URL! </p>
    </div>
  )
}

export default NoPage;